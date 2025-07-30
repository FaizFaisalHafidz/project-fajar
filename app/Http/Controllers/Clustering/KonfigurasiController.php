<?php

namespace App\Http\Controllers\Clustering;

use App\Http\Controllers\Controller;
use App\Models\ConfigClustering;
use App\Models\HasilClustering;
use App\Models\ProfilCluster;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KonfigurasiController extends Controller
{
    /**
     * Display clustering configurations
     */
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get all configurations for current semester
        $configurations = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->with(['semester.tahunAjaran'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($config) {
                $config->fitur_yang_digunakan_parsed = json_decode($config->fitur_yang_digunakan, true);
                $config->parameter_algoritma_parsed = json_decode($config->parameter_algoritma, true);
                
                // Count results
                $config->jumlah_hasil = HasilClustering::where('config_clustering_id', $config->id)->count();
                $config->jumlah_profil = ProfilCluster::where('config_clustering_id', $config->id)->count();
                
                return $config;
            });

        // Get mata pelajaran for configuration form
        $mataPelajaran = MataPelajaran::orderBy('nama_mapel')
            ->get();

        // Get current active configuration
        $activeConfig = $configurations->where('status_aktif', true)->first();

        return Inertia::render('Clustering/Konfigurasi/Index', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'configurations' => $configurations->values()->toArray(),
            'mataPelajaran' => $mataPelajaran,
            'activeConfig' => $activeConfig,
        ]);
    }

    /**
     * Store new configuration
     */
    public function store(Request $request)
    {
        $request->validate([
            'jumlah_cluster' => 'required|integer|min:2|max:8',
            'mata_pelajaran_ids' => 'required|array|min:1',
            'mata_pelajaran_ids.*' => 'exists:tm_data_mata_pelajaran,id',
            'max_iterations' => 'required|integer|min:10|max:1000',
            'tolerance' => 'required|numeric|min:0.001|max:1',
            'bobot_pengetahuan' => 'required|integer|min:0|max:100',
            'bobot_keterampilan' => 'required|integer|min:0|max:100',
            'bobot_sikap' => 'required|integer|min:0|max:100',
        ]);

        // Validate total bobot = 100%
        $totalBobot = $request->bobot_pengetahuan + $request->bobot_keterampilan + $request->bobot_sikap;
        if ($totalBobot !== 100) {
            return redirect()->back()
                ->withErrors(['bobot' => 'Total bobot harus 100%'])
                ->withInput();
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        if (!$semesterAktif) {
            return redirect()->back()->with('error', 'Tidak ada semester aktif');
        }

        try {
            DB::beginTransaction();

            // Deactivate existing configurations
            ConfigClustering::where('semester_id', $semesterAktif->id)
                ->update(['status_aktif' => false]);

            // Create new configuration
            $config = ConfigClustering::create([
                'semester_id' => $semesterAktif->id,
                'jumlah_cluster' => $request->jumlah_cluster,
                'fitur_yang_digunakan' => json_encode($request->mata_pelajaran_ids),
                'parameter_algoritma' => json_encode([
                    'max_iterations' => $request->max_iterations,
                    'tolerance' => $request->tolerance,
                    'bobot' => [
                        'pengetahuan' => $request->bobot_pengetahuan,
                        'keterampilan' => $request->bobot_keterampilan,
                        'sikap' => $request->bobot_sikap,
                    ],
                    'initialization_method' => $request->get('initialization_method', 'k-means++'),
                    'distance_metric' => $request->get('distance_metric', 'euclidean'),
                ]),
                'status_aktif' => true,
            ]);

            DB::commit();

            return redirect()->route('clustering.konfigurasi.index')
                ->with('success', 'Konfigurasi clustering berhasil disimpan');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Update configuration
     */
    public function update(Request $request, $id)
    {
        $config = ConfigClustering::findOrFail($id);

        $request->validate([
            'jumlah_cluster' => 'required|integer|min:2|max:8',
            'mata_pelajaran_ids' => 'required|array|min:1',
            'mata_pelajaran_ids.*' => 'exists:tm_data_mata_pelajaran,id',
            'max_iterations' => 'required|integer|min:10|max:1000',
            'tolerance' => 'required|numeric|min:0.001|max:1',
            'bobot_pengetahuan' => 'required|integer|min:0|max:100',
            'bobot_keterampilan' => 'required|integer|min:0|max:100',
            'bobot_sikap' => 'required|integer|min:0|max:100',
        ]);

        // Validate total bobot = 100%
        $totalBobot = $request->bobot_pengetahuan + $request->bobot_keterampilan + $request->bobot_sikap;
        if ($totalBobot !== 100) {
            return redirect()->back()
                ->withErrors(['bobot' => 'Total bobot harus 100%'])
                ->withInput();
        }

        try {
            DB::beginTransaction();

            // Delete existing results if configuration changes significantly
            $oldConfig = json_decode($config->parameter_algoritma, true);
            $newConfig = [
                'max_iterations' => $request->max_iterations,
                'tolerance' => $request->tolerance,
                'bobot' => [
                    'pengetahuan' => $request->bobot_pengetahuan,
                    'keterampilan' => $request->bobot_keterampilan,
                    'sikap' => $request->bobot_sikap,
                ],
                'initialization_method' => $request->get('initialization_method', 'k-means++'),
                'distance_metric' => $request->get('distance_metric', 'euclidean'),
            ];

            // Check if significant changes occurred
            $significantChange = (
                $config->jumlah_cluster != $request->jumlah_cluster ||
                json_decode($config->fitur_yang_digunakan, true) != $request->mata_pelajaran_ids ||
                $oldConfig['bobot'] != $newConfig['bobot']
            );

            if ($significantChange) {
                // Delete existing results
                HasilClustering::where('config_clustering_id', $config->id)->delete();
                ProfilCluster::where('config_clustering_id', $config->id)->delete();
            }

            // Update configuration
            $config->update([
                'jumlah_cluster' => $request->jumlah_cluster,
                'fitur_yang_digunakan' => json_encode($request->mata_pelajaran_ids),
                'parameter_algoritma' => json_encode($newConfig),
            ]);

            DB::commit();

            $message = $significantChange 
                ? 'Konfigurasi berhasil diperbarui. Hasil clustering sebelumnya telah dihapus.' 
                : 'Konfigurasi berhasil diperbarui';

            return redirect()->route('clustering.konfigurasi.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Delete configuration
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $config = ConfigClustering::findOrFail($id);

            // Delete related results
            HasilClustering::where('config_clustering_id', $id)->delete();
            ProfilCluster::where('config_clustering_id', $id)->delete();

            // Delete configuration
            $config->delete();

            DB::commit();

            return redirect()->route('clustering.konfigurasi.index')
                ->with('success', 'Konfigurasi dan data terkait berhasil dihapus');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Activate configuration
     */
    public function activate($id)
    {
        try {
            DB::beginTransaction();

            $config = ConfigClustering::findOrFail($id);
            
            // Deactivate all configurations in the same semester
            ConfigClustering::where('semester_id', $config->semester_id)
                ->update(['status_aktif' => false]);

            // Activate selected configuration
            $config->update(['status_aktif' => true]);

            DB::commit();

            return redirect()->route('clustering.konfigurasi.index')
                ->with('success', 'Konfigurasi berhasil diaktifkan');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Duplicate configuration
     */
    public function duplicate($id)
    {
        try {
            DB::beginTransaction();

            $originalConfig = ConfigClustering::findOrFail($id);

            // Deactivate existing configurations
            ConfigClustering::where('semester_id', $originalConfig->semester_id)
                ->update(['status_aktif' => false]);

            // Create duplicate
            $newConfig = ConfigClustering::create([
                'semester_id' => $originalConfig->semester_id,
                'jumlah_cluster' => $originalConfig->jumlah_cluster,
                'fitur_yang_digunakan' => $originalConfig->fitur_yang_digunakan,
                'parameter_algoritma' => $originalConfig->parameter_algoritma,
                'status_aktif' => true,
            ]);

            DB::commit();

            return redirect()->route('clustering.konfigurasi.index')
                ->with('success', 'Konfigurasi berhasil diduplikasi dan diaktifkan');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Get configuration details
     */
    public function show($id)
    {
        $configuration = ConfigClustering::findOrFail($id);
        
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        $mataPelajaran = MataPelajaran::orderBy('nama_mapel')
            ->get();
            
        $selectedMataPelajaran = $mataPelajaran
            ->whereIn('id', $configuration->fitur_yang_digunakan_parsed)
            ->values();

        return Inertia::render('Clustering/Konfigurasi/Show', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'configuration' => $configuration,
            'mataPelajaran' => $mataPelajaran,
            'selectedMataPelajaran' => $selectedMataPelajaran,
        ]);
    }
}
