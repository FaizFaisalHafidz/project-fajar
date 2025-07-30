<?php

namespace App\Http\Controllers\Clustering;

use App\Http\Controllers\Controller;
use App\Models\ConfigClustering;
use App\Models\HasilClustering;
use App\Models\ProfilCluster;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisualisasiController extends Controller
{
    /**
     * Display clustering visualizations
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

        $visualisasiData = null;

        if ($config) {
            // Get clustering results with students
            $hasilClustering = HasilClustering::with(['siswa.user', 'siswa.kelas'])
                ->where('config_clustering_id', $config->id)
                ->get();

            // Get cluster profiles
            $profilClusters = ProfilCluster::where('config_clustering_id', $config->id)
                ->orderBy('cluster_id')
                ->get();

            if ($hasilClustering->count() > 0) {
                // Prepare scatter plot data
                $scatterData = $hasilClustering->map(function($hasil) {
                    return [
                        'id' => $hasil->siswa->id,
                        'nama' => $hasil->siswa->user->name ?? 'Nama tidak tersedia',
                        'kelas' => $hasil->siswa->kelas->nama_kelas ?? 'N/A',
                        'cluster_id' => $hasil->cluster_id,
                        'nilai_rata_rata' => $hasil->nilai_rata_rata,
                        'jarak_centroid' => $hasil->jarak_centroid,
                        'x' => $hasil->nilai_rata_rata, // X-axis: Nilai rata-rata
                        'y' => $hasil->jarak_centroid, // Y-axis: Jarak ke centroid
                    ];
                });

                // Prepare bar chart data for cluster distribution
                $distribusiCluster = $hasilClustering->groupBy('cluster_id')
                    ->map(function($group, $clusterId) use ($profilClusters) {
                        $profil = $profilClusters->where('cluster_id', $clusterId)->first();
                        return [
                            'cluster_id' => $clusterId,
                            'label' => $profil ? $profil->label_cluster : "Cluster {$clusterId}",
                            'jumlah_siswa' => $group->count(),
                            'rata_rata_nilai' => round($group->avg('nilai_rata_rata'), 2),
                            'color' => $this->getClusterColor($clusterId),
                        ];
                    })->values();

                // Prepare pie chart data
                $pieChartData = $distribusiCluster->map(function($cluster) {
                    return [
                        'name' => $cluster['label'],
                        'value' => $cluster['jumlah_siswa'],
                        'color' => $cluster['color'],
                    ];
                });

                // Prepare histogram data for grade distribution
                $gradeRanges = [
                    '90-100' => ['min' => 90, 'max' => 100, 'count' => 0],
                    '80-89' => ['min' => 80, 'max' => 89, 'count' => 0],
                    '70-79' => ['min' => 70, 'max' => 79, 'count' => 0],
                    '60-69' => ['min' => 60, 'max' => 69, 'count' => 0],
                    '50-59' => ['min' => 50, 'max' => 59, 'count' => 0],
                    '0-49' => ['min' => 0, 'max' => 49, 'count' => 0],
                ];

                foreach ($hasilClustering as $hasil) {
                    $nilai = $hasil->nilai_rata_rata;
                    foreach ($gradeRanges as $range => &$data) {
                        if ($nilai >= $data['min'] && $nilai <= $data['max']) {
                            $data['count']++;
                            break;
                        }
                    }
                }

                $histogramData = collect($gradeRanges)->map(function($data, $range) {
                    return [
                        'range' => $range,
                        'count' => $data['count'],
                    ];
                })->values();

                // Calculate cluster centroids
                $centroids = $hasilClustering->groupBy('cluster_id')
                    ->map(function($group, $clusterId) use ($profilClusters) {
                        $profil = $profilClusters->where('cluster_id', $clusterId)->first();
                        return [
                            'cluster_id' => $clusterId,
                            'label' => $profil ? $profil->label_cluster : "Cluster {$clusterId}",
                            'centroid_x' => round($group->avg('nilai_rata_rata'), 2),
                            'centroid_y' => round($group->avg('jarak_centroid'), 4),
                            'jumlah_siswa' => $group->count(),
                            'color' => $this->getClusterColor($clusterId),
                        ];
                    })->values();

                // Prepare box plot data
                $boxPlotData = $hasilClustering->groupBy('cluster_id')
                    ->map(function($group, $clusterId) use ($profilClusters) {
                        $nilai = $group->pluck('nilai_rata_rata')->sort()->values();
                        $profil = $profilClusters->where('cluster_id', $clusterId)->first();
                        
                        $q1Index = intval(count($nilai) * 0.25);
                        $q3Index = intval(count($nilai) * 0.75);
                        $medianIndex = intval(count($nilai) * 0.5);

                        return [
                            'cluster_id' => $clusterId,
                            'label' => $profil ? $profil->label_cluster : "Cluster {$clusterId}",
                            'min' => $nilai->first(),
                            'q1' => $nilai->get($q1Index, $nilai->first()),
                            'median' => $nilai->get($medianIndex, $nilai->first()),
                            'q3' => $nilai->get($q3Index, $nilai->last()),
                            'max' => $nilai->last(),
                            'outliers' => [], // Could calculate outliers if needed
                        ];
                    })->values();

                $visualisasiData = [
                    'scatter_data' => $scatterData,
                    'distribusi_cluster' => $distribusiCluster,
                    'pie_chart_data' => $pieChartData,
                    'histogram_data' => $histogramData,
                    'centroids' => $centroids,
                    'box_plot_data' => $boxPlotData,
                    'summary_stats' => [
                        'total_siswa' => $hasilClustering->count(),
                        'jumlah_cluster' => $distribusiCluster->count(),
                        'nilai_tertinggi' => $hasilClustering->max('nilai_rata_rata'),
                        'nilai_terendah' => $hasilClustering->min('nilai_rata_rata'),
                        'rata_rata_global' => round($hasilClustering->avg('nilai_rata_rata'), 2),
                        'standar_deviasi' => $this->calculateStandardDeviation($hasilClustering->pluck('nilai_rata_rata')->toArray()),
                    ],
                ];
            }
        }

        return Inertia::render('Clustering/Visualisasi/Index', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'config' => $config,
            'visualisasiData' => $visualisasiData,
        ]);
    }

    /**
     * Export visualization data
     */
    public function export(Request $request)
    {
        $format = $request->get('format', 'json'); // json, csv, excel
        
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        $config = ConfigClustering::where('semester_id', $semesterAktif?->id)
            ->where('status_aktif', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$config) {
            return redirect()->back()->with('error', 'Tidak ada data clustering untuk diekspor');
        }

        $hasilClustering = HasilClustering::with(['siswa.user', 'siswa.kelas'])
            ->where('config_clustering_id', $config->id)
            ->get();

        $exportData = [
            'metadata' => [
                'tanggal_export' => now()->format('Y-m-d H:i:s'),
                'tahun_ajaran' => $tahunAjaranAktif->nama_tahun_ajaran,
                'semester' => $semesterAktif->nama_semester,
                'jumlah_cluster' => $config->jumlah_cluster,
            ],
            'clustering_results' => $hasilClustering->map(function($hasil) {
                return [
                    'siswa_id' => $hasil->siswa->id,
                    'nama_siswa' => $hasil->siswa->user->name ?? 'Nama tidak tersedia',
                    'kelas' => $hasil->siswa->kelas->nama_kelas ?? 'N/A',
                    'cluster_id' => $hasil->cluster_id,
                    'nilai_rata_rata' => $hasil->nilai_rata_rata,
                    'jarak_centroid' => $hasil->jarak_centroid,
                ];
            }),
        ];

        $filename = "clustering_visualization_{$tahunAjaranAktif->nama_tahun_ajaran}_{$semesterAktif->nama_semester}";

        switch ($format) {
            case 'csv':
                // Implementation for CSV export would go here
                return response()->json(['message' => 'CSV export not implemented yet']);
            
            case 'excel':
                // Implementation for Excel export would go here
                return response()->json(['message' => 'Excel export not implemented yet']);
            
            default:
                return response()->json($exportData)
                    ->header('Content-Type', 'application/json')
                    ->header('Content-Disposition', "attachment; filename=\"{$filename}.json\"");
        }
    }

    /**
     * Get cluster color based on cluster ID
     */
    private function getClusterColor($clusterId)
    {
        $colors = [
            1 => '#3B82F6', // Blue
            2 => '#10B981', // Green
            3 => '#F59E0B', // Yellow
            4 => '#EF4444', // Red
            5 => '#8B5CF6', // Purple
            6 => '#F97316', // Orange
            7 => '#06B6D4', // Cyan
            8 => '#84CC16', // Lime
        ];

        return $colors[$clusterId] ?? '#6B7280'; // Default gray
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
