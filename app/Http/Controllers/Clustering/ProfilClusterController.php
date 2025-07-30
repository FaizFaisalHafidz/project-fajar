<?php

namespace App\Http\Controllers\Clustering;

use App\Http\Controllers\Controller;
use App\Models\ConfigClustering;
use App\Models\HasilClustering;
use App\Models\ProfilCluster;
use App\Models\Siswa;
use App\Models\TahunAjaran;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilClusterController extends Controller
{
    /**
     * Display cluster profiles
     */
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get clustering configuration
        $config = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->where('status_aktif', true)
            ->orderBy('created_at', 'desc')
            ->first();

        $profilClusters = collect();
        $statistikGlobal = null;

        if ($config) {
            // Get cluster profiles
            $profilClusters = ProfilCluster::where('config_clustering_id', $config->id)
                ->orderBy('cluster_id')
                ->get()
                ->map(function($profil) {
                    $profil->karakteristik_parsed = json_decode($profil->karakteristik, true);
                    return $profil;
                });

            // Get detailed cluster data with students
            $hasilClustering = HasilClustering::with(['siswa.kelas', 'siswa.user'])
                ->where('config_clustering_id', $config->id)
                ->get();

            // Add student details to each cluster profile
            $profilClusters = $profilClusters->map(function($profil) use ($hasilClustering) {
                $siswaInCluster = $hasilClustering->where('cluster_id', $profil->cluster_id);
                
                $profil->siswa_details = $siswaInCluster->map(function($hasil) {
                    return [
                        'id' => $hasil->siswa->id,
                        'nama' => $hasil->siswa->user->name ?? 'Nama tidak tersedia',
                        'nisn' => $hasil->siswa->nisn,
                        'kelas' => $hasil->siswa->kelas->nama_kelas ?? 'N/A',
                        'nilai_rata_rata' => $hasil->nilai_rata_rata,
                        'jarak_ke_centroid' => $hasil->jarak_ke_centroid,
                    ];
                })->values();

                return $profil;
            });

            // Calculate global statistics
            $totalSiswa = $hasilClustering->count();
            $statistikGlobal = [
                'total_siswa' => $totalSiswa,
                'jumlah_cluster' => $profilClusters->count(),
                'distribusi_cluster' => $profilClusters->map(function($profil) use ($totalSiswa) {
                    return [
                        'cluster_id' => $profil->cluster_id,
                        'label' => $profil->label_cluster,
                        'jumlah_siswa' => $profil->jumlah_siswa,
                        'persentase' => round(($profil->jumlah_siswa / $totalSiswa) * 100, 2),
                    ];
                })->values(),
                'statistik_nilai' => [
                    'nilai_tertinggi' => $hasilClustering->max('nilai_rata_rata'),
                    'nilai_terendah' => $hasilClustering->min('nilai_rata_rata'),
                    'rata_rata_global' => round($hasilClustering->avg('nilai_rata_rata'), 2),
                ],
            ];
        }

        // Get available clustering history
        $riwayatClustering = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->where('status_aktif', true)
            ->with(['semester.tahunAjaran'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Clustering/Profil/Index', [
            'config' => $config,
            'profilClusters' => $profilClusters->values()->toArray(),
            'statistikGlobal' => $statistikGlobal,
            'riwayatClustering' => $riwayatClustering,
        ]);
    }

    /**
     * Show specific cluster detail
     */
    public function show($clusterId, Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        $config = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->where('status_aktif', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$config) {
            return redirect()->route('clustering.profil.index')
                ->with('error', 'Tidak ada hasil clustering yang tersedia');
        }

        // Get cluster profile
        $profilCluster = ProfilCluster::where('config_clustering_id', $config->id)
            ->where('cluster_id', $clusterId)
            ->first();

        if (!$profilCluster) {
            return redirect()->route('clustering.profil.index')
                ->with('error', 'Cluster tidak ditemukan');
        }

        $profilCluster->karakteristik_parsed = json_decode($profilCluster->karakteristik, true);

        // Get students in this cluster
        $siswaInCluster = HasilClustering::with(['siswa.kelas.jurusan', 'siswa.user', 'siswa.nilaiSiswa' => function($query) use ($semesterAktif) {
            $query->where('semester_id', $semesterAktif->id)
                  ->with(['mataPelajaran']);
        }])
        ->where('config_clustering_id', $config->id)
        ->where('cluster_id', $clusterId)
        ->get()
        ->map(function($hasil) {
            $siswa = $hasil->siswa;
            $nilaiDetail = $siswa->nilaiSiswa->map(function($nilai) {
                return [
                    'mata_pelajaran' => $nilai->mataPelajaran->nama_mapel,
                    'nilai_pengetahuan' => $nilai->nilai_pengetahuan,
                    'nilai_keterampilan' => $nilai->nilai_keterampilan,
                    'nilai_akhir' => $nilai->nilai_akhir,
                ];
            });

            return [
                'id' => $siswa->id,
                'nama_lengkap' => $siswa->user->name ?? 'Nama tidak tersedia',
                'nisn' => $siswa->nisn,
                'kelas' => $siswa->kelas->nama_kelas ?? 'N/A',
                'jurusan' => $siswa->kelas->jurusan->nama_jurusan ?? 'N/A',
                'nilai_rata_rata' => $hasil->nilai_rata_rata,
                'jarak_ke_centroid' => $hasil->jarak_ke_centroid,
                'nilai_detail' => $nilaiDetail,
            ];
        });

        // Calculate cluster statistics
        $statistikCluster = [
            'jumlah_siswa' => $siswaInCluster->count(),
            'nilai_tertinggi' => $siswaInCluster->max('nilai_rata_rata'),
            'nilai_terendah' => $siswaInCluster->min('nilai_rata_rata'),
            'rata_rata_cluster' => round($siswaInCluster->avg('nilai_rata_rata'), 2),
            'standar_deviasi' => $this->calculateStandardDeviation($siswaInCluster->pluck('nilai_rata_rata')->toArray()),
        ];

        return Inertia::render('Clustering/Profil/Show', [
            'config' => $config,
            'profilCluster' => $profilCluster,
            'siswaInCluster' => $siswaInCluster->values()->toArray(),
            'statistikCluster' => $statistikCluster,
        ]);
    }

    /**
     * Update cluster profile
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'label_cluster' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:1000',
        ]);

        try {
            $profilCluster = ProfilCluster::findOrFail($id);
            
            $profilCluster->update([
                'label_cluster' => $request->label_cluster,
                'deskripsi' => $request->deskripsi,
            ]);

            return redirect()->back()->with('success', 'Profil cluster berhasil diperbarui');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Export cluster profiles to Excel
     */
    public function export(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        $config = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->where('status_aktif', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$config) {
            return redirect()->back()->with('error', 'Tidak ada hasil clustering untuk diekspor');
        }

        // Get complete clustering data
        $profilClusters = ProfilCluster::where('config_clustering_id', $config->id)
            ->orderBy('cluster_id')
            ->get();

        $hasilClustering = HasilClustering::with(['siswa.kelas.jurusan', 'siswa.user'])
            ->where('config_clustering_id', $config->id)
            ->get();

        // Prepare export data
        $exportData = [
            'metadata' => [
                'tanggal_export' => now()->format('Y-m-d H:i:s'),
                'config_clustering' => [
                    'jumlah_cluster' => $config->jumlah_cluster,
                    'tanggal_clustering' => $config->created_at,
                    'fitur_yang_digunakan' => json_decode($config->fitur_yang_digunakan, true),
                    'parameter_algoritma' => json_decode($config->parameter_algoritma, true),
                ],
            ],
            'profil_clusters' => $profilClusters->map(function($profil) use ($hasilClustering) {
                $siswaInCluster = $hasilClustering->where('cluster_id', $profil->cluster_id);
                
                return [
                    'cluster_id' => $profil->cluster_id,
                    'label_cluster' => $profil->label_cluster,
                    'deskripsi' => $profil->deskripsi,
                    'jumlah_siswa' => $profil->jumlah_siswa,
                    'nilai_rata_rata' => $profil->nilai_rata_rata,
                    'karakteristik' => json_decode($profil->karakteristik, true),
                    'daftar_siswa' => $siswaInCluster->map(function($hasil) {
                        return [
                            'nama' => $hasil->siswa->user->name ?? 'Nama tidak tersedia',
                            'nisn' => $hasil->siswa->nisn,
                            'kelas' => $hasil->siswa->kelas->nama_kelas ?? 'N/A',
                            'jurusan' => $hasil->siswa->kelas->jurusan->nama_jurusan ?? 'N/A',
                            'nilai_rata_rata' => $hasil->nilai_rata_rata,
                            'jarak_ke_centroid' => $hasil->jarak_ke_centroid,
                        ];
                    })->values(),
                ];
            }),
            'tahun_ajaran' => $tahunAjaranAktif,
            'semester' => $semesterAktif,
        ];

        // For now, return as JSON download (can be replaced with actual Excel export)
        $filename = "clustering_profile_{$tahunAjaranAktif->nama_tahun_ajaran}_{$semesterAktif->nama_semester}.json";
        
        return response()->json($exportData)
            ->header('Content-Type', 'application/json')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }

    /**
     * Compare clusters
     */
    public function compare(Request $request)
    {
        $request->validate([
            'cluster_ids' => 'required|array|min:2',
            'cluster_ids.*' => 'integer',
        ]);

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        $config = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->where('status_aktif', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$config) {
            return redirect()->back()->with('error', 'Tidak ada hasil clustering yang tersedia');
        }

        $clusterIds = $request->cluster_ids;
        
        // Get profiles for comparison
        $profilClusters = ProfilCluster::where('config_clustering_id', $config->id)
            ->whereIn('cluster_id', $clusterIds)
            ->get()
            ->map(function($profil) {
                $profil->karakteristik_parsed = json_decode($profil->karakteristik, true);
                return $profil;
            });

        if ($profilClusters->count() < 2) {
            return redirect()->back()->with('error', 'Minimal 2 cluster harus dipilih untuk perbandingan');
        }

        // Get detailed comparison data
        $perbandinganData = [];
        foreach ($clusterIds as $clusterId) {
            $hasilClustering = HasilClustering::with(['siswa.kelas', 'siswa.user'])
                ->where('config_clustering_id', $config->id)
                ->where('cluster_id', $clusterId)
                ->get();

            $perbandinganData[$clusterId] = [
                'profil' => $profilClusters->where('cluster_id', $clusterId)->first(),
                'statistik' => [
                    'jumlah_siswa' => $hasilClustering->count(),
                    'nilai_tertinggi' => $hasilClustering->max('nilai_rata_rata'),
                    'nilai_terendah' => $hasilClustering->min('nilai_rata_rata'),
                    'rata_rata' => round($hasilClustering->avg('nilai_rata_rata'), 2),
                    'standar_deviasi' => $this->calculateStandardDeviation($hasilClustering->pluck('nilai_rata_rata')->toArray()),
                ],
                'distribusi_kelas' => $hasilClustering->groupBy('siswa.kelas.nama_kelas')
                    ->map(function($group, $kelas) {
                        return [
                            'kelas' => $kelas,
                            'jumlah' => $group->count(),
                        ];
                    })->values(),
            ];
        }

        return Inertia::render('Clustering/Profil/Compare', [
            'config' => $config,
            'perbandinganData' => $perbandinganData,
            'clusterIds' => $clusterIds,
        ]);
    }

    /**
     * Calculate standard deviation
     */
    private function calculateStandardDeviation($values)
    {
        if (count($values) === 0) return 0;
        
        $mean = array_sum($values) / count($values);
        $squaredDifferences = array_map(function($value) use ($mean) {
            return pow($value - $mean, 2);
        }, $values);
        
        $variance = array_sum($squaredDifferences) / count($values);
        return round(sqrt($variance), 2);
    }
}
