<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\MataPelajaran;
use App\Models\NilaiSiswa;
use App\Models\Absensi;
use App\Models\PrestasiSiswa;
use App\Models\NilaiSikap;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatistikController extends Controller
{
    public function overview(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        // Statistik Umum
        $statistikUmum = [
            'total_siswa' => Siswa::where('status_siswa', 'aktif')->count(),
            'total_guru' => Guru::count(),
            'total_kelas' => Kelas::count(),
            'total_mata_pelajaran' => MataPelajaran::count(),
        ];
        
        // Statistik Siswa per Jurusan
        $siswaPerJurusan = Kelas::with(['jurusan', 'siswa' => function($query) {
            $query->where('status_siswa', 'aktif');
        }])
        ->get()
        ->groupBy('jurusan.nama_jurusan')
        ->map(function($kelasGroup) {
            return $kelasGroup->sum(function($kelas) {
                return $kelas->siswa->count();
            });
        });
        
        // Rata-rata Nilai per Mata Pelajaran
        $rataRataNilai = NilaiSiswa::with('mataPelajaran')
            ->where('semester_id', $semesterAktif->id)
            ->select('mata_pelajaran_id', DB::raw('AVG(nilai) as rata_rata'))
            ->groupBy('mata_pelajaran_id')
            ->get()
            ->map(function($item) {
                return [
                    'mata_pelajaran' => $item->mataPelajaran->nama_mapel,
                    'rata_rata' => round($item->rata_rata, 2)
                ];
            });
        
        // Distribusi Nilai (A, B, C, D, E)
        $distribusiNilai = [
            'A' => NilaiSiswa::where('semester_id', $semesterAktif->id)
                ->where('nilai', '>=', 90)->count(),
            'B' => NilaiSiswa::where('semester_id', $semesterAktif->id)
                ->where('nilai', '>=', 80)->where('nilai', '<', 90)->count(),
            'C' => NilaiSiswa::where('semester_id', $semesterAktif->id)
                ->where('nilai', '>=', 70)->where('nilai', '<', 80)->count(),
            'D' => NilaiSiswa::where('semester_id', $semesterAktif->id)
                ->where('nilai', '>=', 60)->where('nilai', '<', 70)->count(),
            'E' => NilaiSiswa::where('semester_id', $semesterAktif->id)
                ->where('nilai', '<', 60)->count(),
        ];
        
        // Statistik Absensi
        $statistikAbsensi = [
            'total_sakit' => Absensi::where('semester_id', $semesterAktif->id)->sum('jumlah_sakit'),
            'total_izin' => Absensi::where('semester_id', $semesterAktif->id)->sum('jumlah_izin'),
            'total_alpha' => Absensi::where('semester_id', $semesterAktif->id)->sum('jumlah_tanpa_keterangan'),
        ];
        
        // Prestasi per Tingkat
        $prestasiPerTingkat = PrestasiSiswa::where('semester_id', $semesterAktif->id)
            ->select('tingkat', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('tingkat')
            ->get()
            ->pluck('jumlah', 'tingkat');
        
        // Top 10 Siswa Berprestasi
        $topSiswa = NilaiSiswa::with(['siswa.user', 'siswa.kelas.jurusan'])
            ->where('semester_id', $semesterAktif->id)
            ->select('siswa_id', DB::raw('AVG(nilai) as rata_rata'))
            ->groupBy('siswa_id')
            ->orderBy('rata_rata', 'desc')
            ->limit(10)
            ->get();
        
        return Inertia::render('Statistik/Overview', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'statistikUmum' => $statistikUmum,
            'siswaPerJurusan' => $siswaPerJurusan,
            'rataRataNilai' => $rataRataNilai,
            'distribusiNilai' => $distribusiNilai,
            'statistikAbsensi' => $statistikAbsensi,
            'prestasiPerTingkat' => $prestasiPerTingkat,
            'topSiswa' => $topSiswa,
        ]);
    }
    
    public function trend(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $allSemesters = Semester::where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->orderBy('tanggal_mulai')
            ->get();
        
        // Trend Rata-rata Nilai per Semester
        $trendNilai = [];
        foreach ($allSemesters as $semester) {
            $avgNilai = NilaiSiswa::where('semester_id', $semester->id)->avg('nilai');
            $trendNilai[] = [
                'semester' => $semester->nama_semester,
                'rata_rata' => round($avgNilai ?? 0, 2)
            ];
        }
        
        // Trend Jumlah Siswa per Semester
        $trendSiswa = [];
        foreach ($allSemesters as $semester) {
            $jumlahSiswa = Siswa::where('status_siswa', 'aktif')->count(); // Bisa disesuaikan per semester
            $trendSiswa[] = [
                'semester' => $semester->nama_semester,
                'jumlah' => $jumlahSiswa
            ];
        }
        
        // Trend Prestasi per Semester
        $trendPrestasi = [];
        foreach ($allSemesters as $semester) {
            $jumlahPrestasi = PrestasiSiswa::where('semester_id', $semester->id)->count();
            $trendPrestasi[] = [
                'semester' => $semester->nama_semester,
                'jumlah' => $jumlahPrestasi
            ];
        }
        
        // Trend Absensi per Semester
        $trendAbsensi = [];
        foreach ($allSemesters as $semester) {
            $totalAbsen = Absensi::where('semester_id', $semester->id)
                ->selectRaw('SUM(jumlah_sakit + jumlah_izin + jumlah_tanpa_keterangan) as total')
                ->value('total') ?? 0;
            $trendAbsensi[] = [
                'semester' => $semester->nama_semester,
                'total' => $totalAbsen
            ];
        }
        
        // Comparison dengan semester sebelumnya
        $currentSemester = Semester::where('status_aktif', true)->first();
        $previousSemester = Semester::where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->where('id', '!=', $currentSemester->id)
            ->orderBy('tanggal_mulai', 'desc')
            ->first();
        
        $comparison = [];
        if ($previousSemester) {
            $currentAvg = NilaiSiswa::where('semester_id', $currentSemester->id)->avg('nilai') ?? 0;
            $previousAvg = NilaiSiswa::where('semester_id', $previousSemester->id)->avg('nilai') ?? 0;
            
            $comparison = [
                'nilai_sekarang' => round($currentAvg, 2),
                'nilai_sebelumnya' => round($previousAvg, 2),
                'perubahan' => round($currentAvg - $previousAvg, 2),
                'persentase_perubahan' => $previousAvg > 0 ? round((($currentAvg - $previousAvg) / $previousAvg) * 100, 2) : 0,
            ];
        }
        
        return Inertia::render('Statistik/Trend', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'allSemesters' => $allSemesters,
            'trendNilai' => $trendNilai,
            'trendSiswa' => $trendSiswa,
            'trendPrestasi' => $trendPrestasi,
            'trendAbsensi' => $trendAbsensi,
            'comparison' => $comparison,
        ]);
    }
    
    public function performa(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        // Performa per Kelas
        $performaKelas = Kelas::with(['jurusan', 'siswa'])
            ->get()
            ->map(function($kelas) use ($semesterAktif) {
                $avgNilai = NilaiSiswa::whereHas('siswa', function($query) use ($kelas) {
                    $query->where('kelas_id', $kelas->id);
                })->where('semester_id', $semesterAktif->id)->avg('nilai');
                
                $jumlahSiswa = $kelas->siswa->where('status_siswa', 'aktif')->count();
                $jumlahPrestasi = PrestasiSiswa::whereHas('siswa', function($query) use ($kelas) {
                    $query->where('kelas_id', $kelas->id);
                })->where('semester_id', $semesterAktif->id)->count();
                
                return [
                    'kelas' => $kelas->nama_kelas,
                    'jurusan' => $kelas->jurusan->nama_jurusan,
                    'rata_rata_nilai' => round($avgNilai ?? 0, 2),
                    'jumlah_siswa' => $jumlahSiswa,
                    'jumlah_prestasi' => $jumlahPrestasi,
                ];
            });
        
        // Performa per Mata Pelajaran
        $performaMapel = MataPelajaran::all()->map(function($mapel) use ($semesterAktif) {
            $avgNilai = NilaiSiswa::where('mata_pelajaran_id', $mapel->id)
                ->where('semester_id', $semesterAktif->id)
                ->avg('nilai');
            
            $jumlahSiswa = NilaiSiswa::where('mata_pelajaran_id', $mapel->id)
                ->where('semester_id', $semesterAktif->id)
                ->distinct('siswa_id')
                ->count();
            
            $nilaiTertinggi = NilaiSiswa::where('mata_pelajaran_id', $mapel->id)
                ->where('semester_id', $semesterAktif->id)
                ->max('nilai');
            
            $nilaiTerendah = NilaiSiswa::where('mata_pelajaran_id', $mapel->id)
                ->where('semester_id', $semesterAktif->id)
                ->min('nilai');
            
            return [
                'mata_pelajaran' => $mapel->nama_mapel,
                'kode_mapel' => $mapel->kode_mapel,
                'rata_rata' => round($avgNilai ?? 0, 2),
                'jumlah_siswa' => $jumlahSiswa,
                'nilai_tertinggi' => $nilaiTertinggi ?? 0,
                'nilai_terendah' => $nilaiTerendah ?? 0,
            ];
        });
        
        // Analisis Ketuntasan per Mata Pelajaran
        $ketuntasan = MataPelajaran::all()->map(function($mapel) use ($semesterAktif) {
            $totalSiswa = NilaiSiswa::where('mata_pelajaran_id', $mapel->id)
                ->where('semester_id', $semesterAktif->id)
                ->distinct('siswa_id')
                ->count();
            
            $siswaTuntas = NilaiSiswa::where('mata_pelajaran_id', $mapel->id)
                ->where('semester_id', $semesterAktif->id)
                ->where('nilai', '>=', 75) // Asumsi KKM 75
                ->distinct('siswa_id')
                ->count();
            
            $persentaseTuntas = $totalSiswa > 0 ? round(($siswaTuntas / $totalSiswa) * 100, 2) : 0;
            
            return [
                'mata_pelajaran' => $mapel->nama_mapel,
                'total_siswa' => $totalSiswa,
                'siswa_tuntas' => $siswaTuntas,
                'siswa_belum_tuntas' => $totalSiswa - $siswaTuntas,
                'persentase_tuntas' => $persentaseTuntas,
            ];
        });
        
        // Ranking Siswa Terbaik
        $rankingSiswa = NilaiSiswa::with(['siswa.user', 'siswa.kelas.jurusan'])
            ->where('semester_id', $semesterAktif->id)
            ->select('siswa_id', DB::raw('AVG(nilai) as rata_rata'))
            ->groupBy('siswa_id')
            ->orderBy('rata_rata', 'desc')
            ->limit(20)
            ->get()
            ->map(function($item, $index) {
                return [
                    'ranking' => $index + 1,
                    'nama' => $item->siswa->user->name,
                    'kelas' => $item->siswa->kelas->nama_kelas,
                    'jurusan' => $item->siswa->kelas->jurusan->nama_jurusan,
                    'rata_rata' => round($item->rata_rata, 2),
                ];
            });
        
        return Inertia::render('Statistik/Performa', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'performaKelas' => $performaKelas,
            'performaMapel' => $performaMapel,
            'ketuntasan' => $ketuntasan,
            'rankingSiswa' => $rankingSiswa,
        ]);
    }
    
    public function monitoring(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        // Data real-time (last 30 days)
        $startDate = Carbon::now()->subDays(30);
        
        // Aktivitas input nilai harian (30 hari terakhir)
        $aktivitasNilai = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $jumlah = NilaiSiswa::whereDate('created_at', $date)->count();
            $aktivitasNilai[] = [
                'tanggal' => $date->format('Y-m-d'),
                'jumlah' => $jumlah
            ];
        }
        
        // Siswa dengan nilai terbaru (today)
        $nilaiTerbaru = NilaiSiswa::with(['siswa.user', 'siswa.kelas', 'mataPelajaran', 'komponenNilai'])
            ->whereDate('created_at', Carbon::today())
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Prestasi terbaru (last 7 days)
        $prestasiTerbaru = PrestasiSiswa::with(['siswa.user', 'siswa.kelas'])
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Alert & Notifikasi
        $alerts = [];
        
        // Alert siswa dengan nilai rendah
        $siswaRendah = NilaiSiswa::with(['siswa.user', 'siswa.kelas'])
            ->where('semester_id', $semesterAktif->id)
            ->where('nilai', '<', 60)
            ->whereDate('created_at', '>=', Carbon::now()->subDays(7))
            ->get()
            ->groupBy('siswa_id')
            ->map(function($nilai) {
                $siswa = $nilai->first()->siswa;
                return [
                    'type' => 'warning',
                    'message' => "Siswa {$siswa->user->name} dari kelas {$siswa->kelas->nama_kelas} memiliki nilai rendah",
                    'count' => $nilai->count(),
                    'siswa' => $siswa
                ];
            });
        
        $alerts = array_merge($alerts, $siswaRendah->take(5)->values()->toArray());
        
        // Alert absensi tinggi
        $absensiTinggi = Absensi::with(['siswa.user', 'siswa.kelas'])
            ->where('semester_id', $semesterAktif->id)
            ->whereRaw('(jumlah_sakit + jumlah_izin + jumlah_tanpa_keterangan) > 10')
            ->get()
            ->map(function($absensi) {
                $total = $absensi->jumlah_sakit + $absensi->jumlah_izin + $absensi->jumlah_tanpa_keterangan;
                return [
                    'type' => 'danger',
                    'message' => "Siswa {$absensi->siswa->user->name} memiliki absensi tinggi ({$total} hari)",
                    'siswa' => $absensi->siswa,
                    'total_absen' => $total
                ];
            });
        
        $alerts = array_merge($alerts, $absensiTinggi->take(3)->toArray());
        
        // Statistik real-time
        $realtimeStats = [
            'nilai_hari_ini' => NilaiSiswa::whereDate('created_at', Carbon::today())->count(),
            'prestasi_minggu_ini' => PrestasiSiswa::where('created_at', '>=', Carbon::now()->startOfWeek())->count(),
            'siswa_aktif' => Siswa::where('status_siswa', 'aktif')->count(),
            'guru_aktif' => Guru::count(),
        ];
        
        // Progress input nilai per kelas
        $progressKelas = Kelas::with(['jurusan', 'siswa'])
            ->get()
            ->map(function($kelas) use ($semesterAktif) {
                $totalSiswa = $kelas->siswa->where('status_siswa', 'aktif')->count();
                $siswaWithNilai = NilaiSiswa::whereHas('siswa', function($query) use ($kelas) {
                    $query->where('kelas_id', $kelas->id);
                })->where('semester_id', $semesterAktif->id)
                  ->distinct('siswa_id')
                  ->count();
                
                $progress = $totalSiswa > 0 ? round(($siswaWithNilai / $totalSiswa) * 100, 2) : 0;
                
                return [
                    'kelas' => $kelas->nama_kelas,
                    'jurusan' => $kelas->jurusan->nama_jurusan,
                    'total_siswa' => $totalSiswa,
                    'siswa_with_nilai' => $siswaWithNilai,
                    'progress' => $progress,
                ];
            });
        
        return Inertia::render('Statistik/Monitoring', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'aktivitasNilai' => $aktivitasNilai,
            'nilaiTerbaru' => $nilaiTerbaru,
            'prestasiTerbaru' => $prestasiTerbaru,
            'alerts' => $alerts,
            'realtimeStats' => $realtimeStats,
            'progressKelas' => $progressKelas,
        ]);
    }
}
