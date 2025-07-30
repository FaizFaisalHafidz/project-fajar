<?php

namespace App\Http\Controllers\Clustering;

use App\Http\Controllers\Controller;
use App\Models\ConfigClustering;
use App\Models\HasilClustering;
use App\Models\ProfilCluster;
use App\Models\NilaiSiswa;
use App\Models\Siswa;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ClusteringController extends Controller
{
    /**
     * Display clustering analysis page
     */
    public function analisis(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get current clustering configuration
        $config = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get mata pelajaran for clustering
        $mataPelajaran = MataPelajaran::orderBy('nama_mapel')->get();

        // Get clustering results if exists
        $hasilClustering = null;
        $statistikClustering = null;
        
        if ($config) {
            $hasilClustering = HasilClustering::with(['siswa.user', 'semester'])
                ->where('config_clustering_id', $config->id)
                ->orderBy('cluster_id')
                ->get();

            if ($hasilClustering->count() > 0) {
                $statistikClustering = [
                    'total_siswa' => $hasilClustering->count(),
                    'jumlah_cluster' => $hasilClustering->pluck('cluster_id')->unique()->count(),
                    'distribusi_cluster' => $hasilClustering->groupBy('cluster_id')
                        ->map(function($group) {
                            return $group->count();
                        })
                        ->toArray(),
                    'akurasi_clustering' => $config->parameter_algoritma['akurasi'] ?? 0,
                ];
            }
        }

        // Get siswa data untuk clustering baru
        $siswaData = [];
        if ($semesterAktif) {
            $siswaData = Siswa::with(['kelas', 'user', 'nilaiSiswa' => function($query) use ($semesterAktif) {
                $query->where('semester_id', $semesterAktif->id)
                      ->with(['mataPelajaran']);
            }])
            ->whereHas('kelas', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif?->id);
            })
            ->get()
            ->map(function($siswa) {
                $rataRataNilai = $siswa->nilaiSiswa->avg('nilai_akhir') ?? 0;
                return [
                    'id' => $siswa->id,
                    'nama_siswa' => $siswa->user->name ?? 'Nama tidak tersedia',
                    'kelas' => $siswa->kelas->tingkat_kelas . ' ' . $siswa->kelas->nama_kelas,
                    'rata_rata_nilai' => round($rataRataNilai, 2),
                    'jumlah_mapel' => $siswa->nilaiSiswa->count(),
                ];
            });
        }

        return Inertia::render('Clustering/Analisis/Index', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'config' => $config,
            'mataPelajaran' => $mataPelajaran,
            'hasilClustering' => $hasilClustering,
            'statistikClustering' => $statistikClustering,
            'siswaData' => $siswaData,
        ]);
    }

    /**
     * Store clustering configuration
     */
    public function storeConfig(Request $request)
    {
        $request->validate([
            'jumlah_cluster' => 'required|integer|min:2|max:10',
            'mata_pelajaran_ids' => 'required|array|min:1',
            'mata_pelajaran_ids.*' => 'exists:tm_data_mata_pelajaran,id',
            'bobot_pengetahuan' => 'required|numeric|min:0|max:100',
            'bobot_keterampilan' => 'required|numeric|min:0|max:100',
            'bobot_sikap' => 'required|numeric|min:0|max:100',
        ]);

        // Validate total bobot = 100
        $totalBobot = $request->bobot_pengetahuan + $request->bobot_keterampilan + $request->bobot_sikap;
        if ($totalBobot != 100) {
            return redirect()->back()->with('error', 'Total bobot harus sama dengan 100%');
        }

        try {
            DB::beginTransaction();

            $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
            $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif->id)
                ->where('status_aktif', true)
                ->first();

            // Delete existing config
            ConfigClustering::where('semester_id', $semesterAktif->id)->delete();

            // Prepare parameter algoritma
            $parameterAlgoritma = [
                'bobot_pengetahuan' => $request->bobot_pengetahuan,
                'bobot_keterampilan' => $request->bobot_keterampilan,
                'bobot_sikap' => $request->bobot_sikap,
                'status' => 'draft',
                'tanggal_eksekusi' => null,
                'akurasi' => null,
            ];

            // Create new config
            $config = ConfigClustering::create([
                'semester_id' => $semesterAktif->id,
                'jumlah_cluster' => $request->jumlah_cluster,
                'fitur_yang_digunakan' => $request->mata_pelajaran_ids,
                'parameter_algoritma' => $parameterAlgoritma,
                'status_aktif' => true,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Konfigurasi clustering berhasil disimpan');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Execute K-Means clustering
     */
    public function executeClustering(Request $request)
    {
        $request->validate([
            'config_id' => 'required|exists:tm_data_config_clustering,id',
        ]);

        try {
            DB::beginTransaction();

            $config = ConfigClustering::findOrFail($request->config_id);
            $mataPelajaranIds = $config->fitur_yang_digunakan;
            $parameterAlgoritma = $config->parameter_algoritma;

            // Get siswa data for clustering
            $siswaData = $this->getSiswaDataForClustering($config, $mataPelajaranIds, $parameterAlgoritma);

            if ($siswaData->count() < $config->jumlah_cluster) {
                return redirect()->back()->with('error', 'Jumlah siswa tidak mencukupi untuk clustering');
            }

            // Execute K-Means algorithm
            $clusteringResults = $this->executeKMeans($siswaData, $config->jumlah_cluster);

            // Delete existing results
            HasilClustering::where('config_clustering_id', $config->id)->delete();

            // Save clustering results
            foreach ($clusteringResults as $result) {
                HasilClustering::create([
                    'config_clustering_id' => $config->id,
                    'siswa_id' => $result['siswa_id'],
                    'cluster_id' => $result['cluster_id'],
                    'nilai_rata_rata' => $result['nilai_rata_rata'],
                    'jarak_centroid' => $result['jarak_centroid'],
                    'tahun_ajaran_id' => $config->semester->tahun_ajaran_id,
                    'semester_id' => $config->semester_id,
                ]);
            }

            // Update config status
            $updatedParameter = $parameterAlgoritma;
            $updatedParameter['status'] = 'completed';
            $updatedParameter['tanggal_eksekusi'] = now()->toDateTimeString();
            $updatedParameter['akurasi'] = $this->calculateAccuracy($clusteringResults);

            $config->update([
                'parameter_algoritma' => $updatedParameter,
            ]);

            // Generate cluster profiles
            $this->generateClusterProfiles($config, $clusteringResults);

            DB::commit();

            return redirect()->back()->with('success', 'Clustering berhasil dijalankan');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Get siswa data for clustering
     */
    private function getSiswaDataForClustering($config, $mataPelajaranIds, $parameterAlgoritma)
    {
        $bobotPengetahuan = $parameterAlgoritma['bobot_pengetahuan'];
        $bobotKeterampilan = $parameterAlgoritma['bobot_keterampilan'];
        $bobotSikap = $parameterAlgoritma['bobot_sikap'];

        return Siswa::with(['nilaiSiswa' => function($query) use ($config, $mataPelajaranIds) {
            $query->where('semester_id', $config->semester_id)
                  ->whereIn('mata_pelajaran_id', $mataPelajaranIds);
        }])
        ->whereHas('kelas', function($query) use ($config) {
            $query->where('tahun_ajaran_id', $config->semester->tahun_ajaran_id);
        })
        ->whereHas('nilaiSiswa', function($query) use ($config, $mataPelajaranIds) {
            $query->where('semester_id', $config->semester_id)
                  ->whereIn('mata_pelajaran_id', $mataPelajaranIds);
        })
        ->get()
        ->map(function($siswa) use ($bobotPengetahuan, $bobotKeterampilan, $bobotSikap) {
            $nilaiPengetahuan = $siswa->nilaiSiswa->avg('nilai_pengetahuan') ?? 0;
            $nilaiKeterampilan = $siswa->nilaiSiswa->avg('nilai_keterampilan') ?? 0;
            $nilaiSikap = $siswa->nilaiSiswa->avg('nilai_sikap') ?? 0;

            $nilaiTerbobot = (
                ($nilaiPengetahuan * $bobotPengetahuan / 100) +
                ($nilaiKeterampilan * $bobotKeterampilan / 100) +
                ($nilaiSikap * $bobotSikap / 100)
            );

            return [
                'siswa_id' => $siswa->id,
                'nilai_pengetahuan' => $nilaiPengetahuan,
                'nilai_keterampilan' => $nilaiKeterampilan,
                'nilai_sikap' => $nilaiSikap,
                'nilai_terbobot' => $nilaiTerbobot,
            ];
        });
    }

    /**
     * Execute K-Means clustering algorithm
     */
    private function executeKMeans($data, $k)
    {
        // Simple K-Means implementation
        $centroids = [];
        $results = [];

        // Initialize centroids randomly
        $dataArray = $data->toArray();
        $shuffled = collect($dataArray)->shuffle();
        
        for ($i = 0; $i < $k; $i++) {
            $centroids[$i] = $shuffled[$i]['nilai_terbobot'];
        }

        $maxIterations = 100;
        $iteration = 0;

        do {
            $oldCentroids = $centroids;
            $clusters = array_fill(0, $k, []);

            // Assign each point to nearest centroid
            foreach ($dataArray as $point) {
                $minDistance = PHP_FLOAT_MAX;
                $assignedCluster = 0;

                for ($i = 0; $i < $k; $i++) {
                    $distance = abs($point['nilai_terbobot'] - $centroids[$i]);
                    if ($distance < $minDistance) {
                        $minDistance = $distance;
                        $assignedCluster = $i;
                    }
                }

                $clusters[$assignedCluster][] = $point;
                $point['cluster_id'] = $assignedCluster + 1;
                $point['jarak_centroid'] = $minDistance;
                $results[] = [
                    'siswa_id' => $point['siswa_id'],
                    'cluster_id' => $assignedCluster + 1,
                    'nilai_rata_rata' => $point['nilai_terbobot'],
                    'jarak_centroid' => $minDistance,
                ];
            }

            // Update centroids
            for ($i = 0; $i < $k; $i++) {
                if (!empty($clusters[$i])) {
                    $centroids[$i] = collect($clusters[$i])->avg('nilai_terbobot');
                }
            }

            $iteration++;
        } while ($iteration < $maxIterations && $oldCentroids !== $centroids);

        return $results;
    }

    /**
     * Calculate clustering accuracy
     */
    private function calculateAccuracy($results)
    {
        // Simple accuracy calculation based on cluster cohesion
        $totalVariance = 0;
        $clusters = collect($results)->groupBy('cluster_id');

        foreach ($clusters as $cluster) {
            if ($cluster->count() > 1) {
                $mean = $cluster->avg('nilai_rata_rata');
                $variance = $cluster->reduce(function($carry, $item) use ($mean) {
                    return $carry + pow($item['nilai_rata_rata'] - $mean, 2);
                }, 0) / $cluster->count();
                $totalVariance += $variance;
            }
        }

        // Convert variance to accuracy percentage (lower variance = higher accuracy)
        $accuracy = max(0, 100 - ($totalVariance / 10));
        return round($accuracy, 2);
    }

    /**
     * Generate cluster profiles
     */
    private function generateClusterProfiles($config, $results)
    {
        // Delete existing profiles
        ProfilCluster::where('config_clustering_id', $config->id)->delete();

        $clusters = collect($results)->groupBy('cluster_id');

        foreach ($clusters as $clusterId => $clusterData) {
            $nilaiRataRata = $clusterData->avg('nilai_rata_rata');
            $jumlahSiswa = $clusterData->count();

            // Determine cluster label based on average score
            $label = '';
            $deskripsi = '';
            
            if ($nilaiRataRata >= 85) {
                $label = 'Cluster Tinggi';
                $deskripsi = 'Siswa dengan performa akademik sangat baik';
            } elseif ($nilaiRataRata >= 75) {
                $label = 'Cluster Sedang-Tinggi';
                $deskripsi = 'Siswa dengan performa akademik baik';
            } elseif ($nilaiRataRata >= 65) {
                $label = 'Cluster Sedang';
                $deskripsi = 'Siswa dengan performa akademik cukup';
            } else {
                $label = 'Cluster Rendah';
                $deskripsi = 'Siswa yang memerlukan perhatian khusus';
            }

            ProfilCluster::create([
                'config_clustering_id' => $config->id,
                'cluster_id' => $clusterId,
                'label_cluster' => $label,
                'deskripsi' => $deskripsi,
                'jumlah_siswa' => $jumlahSiswa,
                'nilai_rata_rata' => round($nilaiRataRata, 2),
                'karakteristik' => json_encode([
                    'rentang_nilai' => [
                        'min' => $clusterData->min('nilai_rata_rata'),
                        'max' => $clusterData->max('nilai_rata_rata'),
                    ],
                    'standar_deviasi' => $this->calculateStandardDeviation($clusterData->pluck('nilai_rata_rata')->toArray()),
                ]),
                'tahun_ajaran_id' => $config->semester->tahun_ajaran_id,
                'semester_id' => $config->semester_id,
            ]);
        }
    }

    /**
     * Calculate standard deviation
     */
    private function calculateStandardDeviation($values)
    {
        $count = count($values);
        if ($count <= 1) return 0;

        $mean = array_sum($values) / $count;
        $variance = array_sum(array_map(function($value) use ($mean) {
            return pow($value - $mean, 2);
        }, $values)) / $count;

        return round(sqrt($variance), 2);
    }

    /**
     * Reset clustering results
     */
    public function resetClustering(Request $request)
    {
        $request->validate([
            'config_id' => 'required|exists:tm_config_clustering,id',
        ]);

        try {
            DB::beginTransaction();

            $config = ConfigClustering::findOrFail($request->config_id);

            // Delete results and profiles
            HasilClustering::where('config_clustering_id', $config->id)->delete();
            ProfilCluster::where('config_clustering_id', $config->id)->delete();

            // Reset config status
            $config->update([
                'status' => 'draft',
                'tanggal_eksekusi' => null,
                'akurasi' => null,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Hasil clustering berhasil direset');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
