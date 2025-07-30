<?php

namespace App\Http\Controllers\Pengaturan;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Siswa;
use App\Models\PenugasanMengajar;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaturanWaliKelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        $waliKelas = Guru::with(['user', 'kelasWali' => function($query) use ($tahunAjaranAktif) {
            $query->where('tahun_ajaran_id', $tahunAjaranAktif?->id)
                  ->with(['jurusan', 'siswa']);
        }])
        ->whereHas('kelasWali', function($query) use ($tahunAjaranAktif) {
            $query->where('tahun_ajaran_id', $tahunAjaranAktif?->id);
        })
        ->get()
        ->sortBy('user.name')
        ->values(); // Ensure it's a proper indexed array

        $kelasWithoutWali = Kelas::with(['jurusan'])
            ->where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->whereNull('wali_kelas_id')
            ->orderBy('tingkat_kelas', 'asc')
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $availableGurus = Guru::with('user')
            ->whereDoesntHave('kelasWali', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif?->id);
            })
            ->get()
            ->sortBy('user.name')
            ->values(); // Ensure it's a proper indexed array

        $stats = [
            'total_wali_kelas' => $waliKelas->count(),
            'kelas_tanpa_wali' => $kelasWithoutWali->count(),
            'guru_available' => $availableGurus->count(),
            'total_siswa_terbina' => $waliKelas->sum(fn($wali) => $wali->kelasWali->sum('siswa_count')),
        ];

        return Inertia::render('Pengaturan/WaliKelas/Index', [
            'waliKelas' => $waliKelas,
            'kelasWithoutWali' => $kelasWithoutWali,
            'availableGurus' => $availableGurus,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'stats' => $stats,
        ]);
    }

    /**
     * Assign guru sebagai wali kelas
     */
    public function assignWaliKelas(Request $request)
    {
        $request->validate([
            'guru_id' => 'required|exists:tm_data_guru,id',
            'kelas_id' => 'required|exists:tm_data_kelas,id',
        ]);

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        // Check if guru is already assigned as wali kelas for another class
        $existingAssignment = Kelas::where('wali_kelas_id', $request->guru_id)
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->first();

        if ($existingAssignment) {
            return redirect()->back()->with('error', 'Guru ini sudah menjadi wali kelas untuk kelas lain');
        }

        // Check if kelas already has wali kelas
        $kelas = Kelas::findOrFail($request->kelas_id);
        if ($kelas->wali_kelas_id) {
            return redirect()->back()->with('error', 'Kelas ini sudah memiliki wali kelas');
        }

        $kelas->update(['wali_kelas_id' => $request->guru_id]);

        return redirect()->back()->with('success', 'Wali kelas berhasil ditugaskan');
    }

    /**
     * Remove wali kelas assignment
     */
    public function removeWaliKelas($guruId)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        $kelas = Kelas::where('wali_kelas_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->first();

        if (!$kelas) {
            return redirect()->back()->with('error', 'Guru ini tidak sedang menjadi wali kelas');
        }

        $kelas->update(['wali_kelas_id' => null]);

        return redirect()->back()->with('success', 'Penugasan wali kelas berhasil dihapus');
    }

    /**
     * Get detail wali kelas dengan siswa yang dibina
     */
    public function show($guruId)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        $guru = Guru::with(['user'])->findOrFail($guruId);
        
        // Get kelas that this guru is wali for in current academic year
        $kelasWali = Kelas::with(['jurusan', 'siswa'])
            ->where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('wali_kelas_id', $guru->id)
            ->get()
            ->map(function($kelas) {
                $kelas->jumlah_siswa = $kelas->siswa->count();
                return $kelas;
            });

        // Get penugasan mengajar for this guru
        $penugasanMengajar = PenugasanMengajar::with(['mataPelajaran', 'kelas.jurusan'])
            ->whereHas('semester', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif?->id);
            })
            ->where('guru_id', $guru->id)
            ->get();

        // Calculate stats
        $totalSiswaWali = $kelasWali->sum('jumlah_siswa');
        $totalMataPelajaran = $penugasanMengajar->pluck('mata_pelajaran_id')->unique()->count();
        
        $stats = [
            'total_kelas_wali' => $kelasWali->count(),
            'total_siswa_wali' => $totalSiswaWali,
            'total_mata_pelajaran' => $totalMataPelajaran,
            'total_penugasan' => $penugasanMengajar->count(),
        ];

        return Inertia::render('Pengaturan/WaliKelas/Detail', [
            'guru' => $guru,
            'kelasWali' => $kelasWali,
            'penugasanMengajar' => $penugasanMengajar,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'stats' => $stats,
        ]);
    }

    /**
     * Generate laporan wali kelas
     */
    public function laporan(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        // Get filters
        $tingkatKelas = $request->get('tingkat_kelas');
        $jurusanId = $request->get('jurusan_id');
        
        // Build query for laporan data
        $query = Guru::with(['user', 'kelasWali' => function($q) use ($tahunAjaranAktif, $tingkatKelas, $jurusanId) {
            $q->where('tahun_ajaran_id', $tahunAjaranAktif?->id)
              ->with(['jurusan', 'siswa']);
            
            if ($tingkatKelas) {
                $q->where('tingkat_kelas', $tingkatKelas);
            }
            
            if ($jurusanId) {
                $q->where('jurusan_id', $jurusanId);
            }
        }])
        ->whereHas('kelasWali', function($q) use ($tahunAjaranAktif, $tingkatKelas, $jurusanId) {
            $q->where('tahun_ajaran_id', $tahunAjaranAktif?->id);
            
            if ($tingkatKelas) {
                $q->where('tingkat_kelas', $tingkatKelas);
            }
            
            if ($jurusanId) {
                $q->where('jurusan_id', $jurusanId);
            }
        });

        $laporanData = $query->get()->map(function($guru) {
            $totalSiswa = $guru->kelasWali->sum(function($kelas) {
                return $kelas->siswa->count();
            });
            
            // Calculate summary statistics
            $kelasByTingkat = $guru->kelasWali->groupBy('tingkat_kelas')
                ->map(function($group) {
                    return $group->count();
                })->toArray();
                
            $siswaByJurusan = $guru->kelasWali->groupBy('jurusan.nama_jurusan')
                ->map(function($group) {
                    return $group->sum(function($kelas) {
                        return $kelas->siswa->count();
                    });
                })->toArray();
                
            $rataRataSiswa = $guru->kelasWali->count() > 0 
                ? round($totalSiswa / $guru->kelasWali->count(), 1) 
                : 0;

            return [
                'guru' => $guru,
                'kelas_wali' => $guru->kelasWali->map(function($kelas) {
                    $kelas->jumlah_siswa = $kelas->siswa->count();
                    return $kelas;
                }),
                'total_siswa' => $totalSiswa,
                'summary' => [
                    'kelas_per_tingkat' => $kelasByTingkat,
                    'siswa_per_jurusan' => $siswaByJurusan,
                    'rata_rata_siswa_per_kelas' => $rataRataSiswa,
                ]
            ];
        });

        // Calculate total statistics
        $totalStats = [
            'total_guru_wali' => $laporanData->count(),
            'total_kelas' => $laporanData->sum(function($data) {
                return $data['kelas_wali']->count();
            }),
            'total_siswa' => $laporanData->sum('total_siswa'),
            'rata_rata_siswa' => $laporanData->count() > 0 
                ? round($laporanData->sum('total_siswa') / $laporanData->sum(function($data) {
                    return $data['kelas_wali']->count();
                }), 1) 
                : 0,
        ];

        // Get jurusan options for filter
        $jurusanOptions = Jurusan::orderBy('nama_jurusan')->get();

        return Inertia::render('Pengaturan/WaliKelas/Laporan', [
            'laporanData' => $laporanData->values()->toArray(),
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'totalStats' => $totalStats,
            'filters' => [
                'tingkat_kelas' => $tingkatKelas,
                'jurusan_id' => $jurusanId,
            ],
            'jurusanOptions' => $jurusanOptions,
        ]);
    }
}
