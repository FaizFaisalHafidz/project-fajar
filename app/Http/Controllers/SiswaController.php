<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\NilaiSiswa;
use App\Models\NilaiSikap;
use App\Models\NilaiEkstrakurikuler;
use App\Models\Absensi;
use App\Models\PrestasiSiswa;
use App\Models\TahunAjaran;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SiswaController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa) {
            return redirect()->back()->with('error', 'Data siswa tidak ditemukan');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Nilai Pengetahuan - ambil berdasarkan nama komponen yang mengandung kata "pengetahuan"
        $nilaiPengetahuan = NilaiSiswa::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->whereHas('komponenNilai', function($q) {
                $q->where('nama_komponen', 'LIKE', '%pengetahuan%')
                  ->orWhere('nama_komponen', 'LIKE', '%kognitif%')
                  ->orWhere('nama_komponen', 'LIKE', '%tulis%')
                  ->orWhere('nama_komponen', 'LIKE', '%ujian%');
            })
            ->with(['mataPelajaran', 'komponenNilai'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Nilai Keterampilan - ambil berdasarkan nama komponen yang mengandung kata "keterampilan"
        $nilaiKeterampilan = NilaiSiswa::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->whereHas('komponenNilai', function($q) {
                $q->where('nama_komponen', 'LIKE', '%keterampilan%')
                  ->orWhere('nama_komponen', 'LIKE', '%praktik%')
                  ->orWhere('nama_komponen', 'LIKE', '%psikomotor%')
                  ->orWhere('nama_komponen', 'LIKE', '%project%');
            })
            ->with(['mataPelajaran', 'komponenNilai'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Nilai Sikap
        $nilaiSikap = NilaiSikap::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->with(['guru.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Nilai Ekstrakurikuler
        $nilaiEkstrakurikuler = NilaiEkstrakurikuler::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->with('ekstrakurikuler')
            ->orderBy('created_at', 'desc')
            ->get();

        // Absensi
        $absensi = Absensi::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->with(['semester.tahunAjaran'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Prestasi
        $prestasi = PrestasiSiswa::where('siswa_id', $siswa->id)
            ->orderBy('tanggal_prestasi', 'desc')
            ->get();

        // Statistik
        $rataRataPengetahuan = $nilaiPengetahuan->avg('nilai') ?? 0;
        $rataRataKeterampilan = $nilaiKeterampilan->avg('nilai') ?? 0;
        
        // Hitung statistik absensi dari model yang ada
        $totalSakit = $absensi->sum('jumlah_sakit');
        $totalIzin = $absensi->sum('jumlah_izin');
        $totalTanpaKeterangan = $absensi->sum('jumlah_tanpa_keterangan');
        $totalAbsensi = $totalSakit + $totalIzin + $totalTanpaKeterangan;
        
        // Asumsi total hari sekolah dalam semester (bisa disesuaikan)
        $totalHariSekolah = 120; // Contoh: 120 hari dalam satu semester
        $totalHadir = $totalHariSekolah - $totalAbsensi;
        $persentaseKehadiran = $totalHariSekolah > 0 ? ($totalHadir / $totalHariSekolah) * 100 : 100;

        $statistik = [
            'rata_rata_pengetahuan' => $rataRataPengetahuan,
            'rata_rata_keterampilan' => $rataRataKeterampilan,
            'total_absensi' => $totalAbsensi,
            'persentase_kehadiran' => max(0, $persentaseKehadiran), // Pastikan tidak negatif
            'total_prestasi' => $prestasi->count(),
        ];

        return Inertia::render('Siswa/Index', [
            'nilaiPengetahuan' => $nilaiPengetahuan,
            'nilaiKeterampilan' => $nilaiKeterampilan,
            'nilaiSikap' => $nilaiSikap,
            'nilaiEkstrakurikuler' => $nilaiEkstrakurikuler,
            'absensi' => $absensi,
            'prestasi' => $prestasi,
            'statistik' => $statistik,
            'siswa' => $siswa,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function profil()
    {
        $user = Auth::user();
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa) {
            return redirect()->back()->with('error', 'Data siswa tidak ditemukan');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Data untuk profil akademik
        $performanceMataPelajaran = NilaiSiswa::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->with(['mataPelajaran', 'komponenNilai'])
            ->get()
            ->groupBy('mata_pelajaran_id')
            ->map(function ($nilai, $mapelId) {
                $mataPelajaran = $nilai->first()->mataPelajaran;
                $rataRata = $nilai->average('nilai');
                
                return [
                    'mata_pelajaran' => [
                        'id' => $mataPelajaran->id,
                        'nama_mapel' => $mataPelajaran->nama_mapel,
                        'kode_mapel' => $mataPelajaran->kode_mapel,
                    ],
                    'rata_rata' => round($rataRata, 2),
                    'total_nilai' => $nilai->count(),
                    'nilai_tertinggi' => $nilai->max('nilai'),
                    'nilai_terendah' => $nilai->min('nilai'),
                    'kategori_pencapaian' => $this->getKategoriPencapaian($rataRata),
                    'trend' => 'stabil', // Bisa dikembangkan lebih lanjut
                ];
            })
            ->values();

        $prestasi = PrestasiSiswa::where('siswa_id', $siswa->id)
            ->orderBy('tanggal_prestasi', 'desc')
            ->take(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_prestasi' => $item->nama_prestasi,
                    'jenis_prestasi' => $item->jenis_prestasi,
                    'tingkat' => $item->tingkat,
                    'peringkat' => $item->peringkat,
                    'tanggal_prestasi' => $item->tanggal_prestasi,
                    'penyelenggara' => $item->penyelenggara,
                    'keterangan' => $item->keterangan,
                ];
            });

        // Statistik keseluruhan
        $statistikKeseluruhan = [
            'total_mata_pelajaran' => $performanceMataPelajaran->count(),
            'rata_rata_keseluruhan' => $performanceMataPelajaran->avg('rata_rata'),
            'mata_pelajaran_terbaik' => $performanceMataPelajaran->sortByDesc('rata_rata')->first(),
            'mata_pelajaran_perlu_perbaikan' => $performanceMataPelajaran->sortBy('rata_rata')->first(),
            'total_prestasi' => $prestasi->count(),
            'prestasi_nasional' => $prestasi->where('tingkat', 'Nasional')->count(),
            'prestasi_internasional' => $prestasi->where('tingkat', 'Internasional')->count(),
        ];

        // Cluster info (dummy data - nanti integrate dengan K-Means)
        $clusterInfo = [
            'cluster_id' => 1,
            'nama_cluster' => 'Siswa Berprestasi Tinggi',
            'karakteristik' => [
                'Konsisten dalam semua mata pelajaran',
                'Aktif dalam kegiatan ekstrakurikuler',
                'Memiliki prestasi yang beragam'
            ],
            'jumlah_anggota' => 15,
            'persentil' => 85,
        ];

        return Inertia::render('Siswa/Profil', [
            'siswa' => $siswa,
            'performanceMataPelajaran' => $performanceMataPelajaran,
            'prestasi' => $prestasi,
            'statistikKeseluruhan' => $statistikKeseluruhan,
            'clusterInfo' => $clusterInfo,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function analisis()
    {
        $user = Auth::user();
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa) {
            return redirect()->back()->with('error', 'Data siswa tidak ditemukan');
        }

        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Analisis per mata pelajaran
        $analisisMataPelajaran = NilaiSiswa::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->with(['mataPelajaran', 'komponenNilai'])
            ->get()
            ->groupBy('mata_pelajaran_id')
            ->map(function ($nilai, $mapelId) {
                $mataPelajaran = $nilai->first()->mataPelajaran;
                $rataRata = $nilai->average('nilai');
                
                // Pisahkan nilai berdasarkan jenis komponen
                $nilaiPengetahuan = $nilai->filter(function($n) {
                    return stripos($n->komponenNilai->nama_komponen, 'pengetahuan') !== false ||
                           stripos($n->komponenNilai->nama_komponen, 'kognitif') !== false ||
                           stripos($n->komponenNilai->nama_komponen, 'ujian') !== false;
                });
                
                $nilaiKeterampilan = $nilai->filter(function($n) {
                    return stripos($n->komponenNilai->nama_komponen, 'keterampilan') !== false ||
                           stripos($n->komponenNilai->nama_komponen, 'praktik') !== false ||
                           stripos($n->komponenNilai->nama_komponen, 'psikomotor') !== false;
                });
                
                $rataRataPengetahuan = $nilaiPengetahuan->avg('nilai') ?? 0;
                $rataRataKeterampilan = $nilaiKeterampilan->avg('nilai') ?? 0;
                $nilaiKkm = 75; // Default KKM
                
                return [
                    'mata_pelajaran' => [
                        'id' => $mataPelajaran->id,
                        'nama_mapel' => $mataPelajaran->nama_mapel,
                        'kode_mapel' => $mataPelajaran->kode_mapel,
                    ],
                    'rata_rata_pengetahuan' => round($rataRataPengetahuan, 2),
                    'rata_rata_keterampilan' => round($rataRataKeterampilan, 2),
                    'rata_rata_keseluruhan' => round($rataRata, 2),
                    'nilai_tertinggi' => $nilai->max('nilai'),
                    'nilai_terendah' => $nilai->min('nilai'),
                    'jumlah_nilai' => $nilai->count(),
                    'trend' => $rataRata >= 80 ? 'naik' : ($rataRata >= 70 ? 'stabil' : 'turun'),
                    'persentase_perubahan' => rand(-10, 15), // Dummy data untuk perubahan
                    'status_kkm' => $rataRata >= $nilaiKkm ? 'tuntas' : 'belum_tuntas',
                    'nilai_kkm' => $nilaiKkm,
                    'gap_kkm' => $rataRata - $nilaiKkm,
                    'kategori_performa' => $this->getKategoriPerforma($rataRata),
                ];
            })
            ->values();

        // Analisis periode
        $analisisPeriode = [
            [
                'periode' => 'Semester Ini',
                'rata_rata' => $analisisMataPelajaran->avg('rata_rata_keseluruhan') ?? 0,
                'jumlah_nilai' => $analisisMataPelajaran->sum('jumlah_nilai'),
                'mata_pelajaran_tuntas' => $analisisMataPelajaran->where('status_kkm', 'tuntas')->count(),
                'mata_pelajaran_total' => $analisisMataPelajaran->count(),
                'persentase_ketuntasan' => $analisisMataPelajaran->count() > 0 
                    ? ($analisisMataPelajaran->where('status_kkm', 'tuntas')->count() / $analisisMataPelajaran->count()) * 100 
                    : 0,
            ]
        ];

        // Statistik keseluruhan untuk analisis
        $statistikKeseluruhan = [
            'rata_rata_semester' => $analisisMataPelajaran->avg('rata_rata_keseluruhan') ?? 0,
            'peringkat_kelas' => 1, // Dummy data
            'total_siswa_kelas' => 30, // Dummy data
            'mata_pelajaran_unggul' => $analisisMataPelajaran->where('rata_rata_keseluruhan', '>=', 85)->count(),
            'mata_pelajaran_perlu_perbaikan' => $analisisMataPelajaran->where('rata_rata_keseluruhan', '<', 75)->count(),
            'konsistensi_nilai' => 85, // Dummy data
            'potensi_peningkatan' => 15, // Dummy data
        ];

        // Rekomendasi analisis
        $rekomendasiAnalisis = $analisisMataPelajaran
            ->where('rata_rata_keseluruhan', '<', 80)
            ->map(function ($item) {
                $rekomendasi = $this->getRekomendasi($item['rata_rata_keseluruhan']);
                $prioritas = $this->getPrioritas($item['rata_rata_keseluruhan']);
                
                return [
                    'mata_pelajaran_id' => $item['mata_pelajaran']['id'],
                    'mata_pelajaran' => $item['mata_pelajaran']['nama_mapel'],
                    'jenis_rekomendasi' => 'Perbaikan Nilai',
                    'rekomendasi' => is_array($rekomendasi) ? implode(', ', $rekomendasi) : $rekomendasi,
                    'prioritas' => strtolower($prioritas),
                    'target_perbaikan' => 85 - $item['rata_rata_keseluruhan'],
                ];
            })
            ->values();

        return Inertia::render('Siswa/Analisis', [
            'siswa' => $siswa,
            'analisisMataPelajaran' => $analisisMataPelajaran,
            'analisisPeriode' => $analisisPeriode,
            'rekomendasiAnalisis' => $rekomendasiAnalisis,
            'statistikKeseluruhan' => $statistikKeseluruhan,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function rekomendasi()
    {
        $user = Auth::user();
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa) {
            return redirect()->back()->with('error', 'Data siswa tidak ditemukan');
        }

        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Dummy data untuk K-Means clustering
        $clusterData = [
            'siswa_cluster' => [
                'cluster_id' => 1,
                'nama_cluster' => 'Siswa Berprestasi Tinggi',
                'deskripsi' => 'Kelompok siswa dengan performa akademik yang sangat baik',
                'rata_rata_cluster' => 87.5,
                'jumlah_anggota' => 15,
                'karakteristik' => [
                    'Nilai rata-rata di atas 85',
                    'Konsisten dalam semua mata pelajaran',
                    'Aktif dalam kegiatan ekstrakurikuler'
                ]
            ],
            'perbandingan_cluster' => [
                [
                    'cluster_id' => 1,
                    'nama' => 'Berprestasi Tinggi',
                    'rata_rata' => 87.5,
                    'jumlah' => 15,
                    'warna' => '#10B981'
                ],
                [
                    'cluster_id' => 2,
                    'nama' => 'Performa Sedang',
                    'rata_rata' => 75.2,
                    'jumlah' => 25,
                    'warna' => '#F59E0B'
                ],
                [
                    'cluster_id' => 3,
                    'nama' => 'Perlu Bimbingan',
                    'rata_rata' => 65.8,
                    'jumlah' => 18,
                    'warna' => '#EF4444'
                ]
            ]
        ];

        $rekomendasi = [
            [
                'kategori' => 'Akademik',
                'judul' => 'Pertahankan Performa Excellent',
                'deskripsi' => 'Anda berada di cluster siswa berprestasi tinggi. Pertahankan konsistensi belajar.',
                'prioritas' => 'tinggi',
                'aksi' => [
                    'Ikuti olimpiade mata pelajaran',
                    'Bantu teman yang kesulitan belajar',
                    'Eksplorasi materi advanced'
                ]
            ],
            [
                'kategori' => 'Ekstrakurikuler',
                'judul' => 'Diversifikasi Kegiatan',
                'deskripsi' => 'Perluas partisipasi dalam kegiatan ekstrakurikuler untuk pengembangan soft skills.',
                'prioritas' => 'sedang',
                'aksi' => [
                    'Ikuti kompetisi debat',
                    'Bergabung dengan klub sains',
                    'Aktif di organisasi siswa'
                ]
            ]
        ];

        $temanCluster = [
            [
                'nama' => 'Ahmad Rizki',
                'kelas' => 'XI IPA 1',
                'rata_rata' => 88.2,
                'prestasi_utama' => 'Juara 1 Olimpiade Matematika'
            ],
            [
                'nama' => 'Sari Indah',
                'kelas' => 'XI IPA 2',
                'rata_rata' => 87.8,
                'prestasi_utama' => 'Juara 2 Olimpiade Fisika'
            ]
        ];

        $strategiPembelajaran = [
            [
                'nama_strategi' => 'Peer Learning',
                'deskripsi' => 'Belajar bersama dengan teman secluster untuk saling bertukar pengetahuan',
                'target' => 'Meningkatkan pemahaman konsep',
                'timeline' => '2-3 bulan',
                'metrik_sukses' => 'Rata-rata nilai stabil di atas 85'
            ],
            [
                'nama_strategi' => 'Advanced Learning',
                'deskripsi' => 'Eksplorasi materi tingkat lanjut untuk persiapan kompetisi',
                'target' => 'Meraih prestasi di tingkat nasional',
                'timeline' => '6 bulan',
                'metrik_sukses' => 'Lolos seleksi olimpiade nasional'
            ]
        ];

        return Inertia::render('Siswa/Rekomendasi', [
            'siswa' => $siswa,
            'clusterData' => $clusterData,
            'rekomendasi' => $rekomendasi,
            'temanCluster' => $temanCluster,
            'strategiPembelajaran' => $strategiPembelajaran,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function progress()
    {
        $user = Auth::user();
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa) {
            return redirect()->back()->with('error', 'Data siswa tidak ditemukan');
        }

        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Progress per mata pelajaran
        $progressMataPelajaran = NilaiSiswa::where('siswa_id', $siswa->id)
            ->where('semester_id', $semesterAktif?->id)
            ->with(['mataPelajaran'])
            ->get()
            ->groupBy('mata_pelajaran_id')
            ->map(function ($nilai, $mapelId) {
                $mataPelajaran = $nilai->first()->mataPelajaran;
                $nilaiTertua = $nilai->sortBy('created_at')->first()->nilai ?? 0;
                $nilaiTerbaru = $nilai->sortByDesc('created_at')->first()->nilai ?? 0;
                $rataRata = $nilai->average('nilai') ?? 0;
                
                return [
                    'mata_pelajaran' => [
                        'id' => $mataPelajaran->id,
                        'nama_mapel' => $mataPelajaran->nama_mapel,
                        'kode_mapel' => $mataPelajaran->kode_mapel,
                    ],
                    'progress_bulanan' => [
                        ['bulan' => 'Jan', 'rata_rata' => $nilaiTertua ?? 0, 'jumlah_nilai' => 2, 'trend' => 'stabil', 'persentase_perubahan' => 0],
                        ['bulan' => 'Feb', 'rata_rata' => (($nilaiTertua ?? 0) + ($nilaiTerbaru ?? 0)) / 2, 'jumlah_nilai' => 3, 'trend' => 'naik', 'persentase_perubahan' => 5],
                        ['bulan' => 'Mar', 'rata_rata' => $nilaiTerbaru ?? 0, 'jumlah_nilai' => 4, 'trend' => 'naik', 'persentase_perubahan' => 8],
                    ],
                    'nilai_awal' => $nilaiTertua ?? 0,
                    'nilai_terkini' => $nilaiTerbaru ?? 0,
                    'peningkatan_total' => ($nilaiTerbaru ?? 0) - ($nilaiTertua ?? 0),
                    'target_semester' => 85, // Default target
                    'persentase_pencapaian' => $rataRata > 0 ? ($rataRata / 85) * 100 : 0,
                    'prediksi_akhir_semester' => ($nilaiTerbaru ?? 0) + 2, // Simple prediction
                    'status_target' => $rataRata >= 85 ? 'tercapai' : ($rataRata >= 75 ? 'on_track' : 'perlu_usaha'),
                ];
            })
            ->values();

        // Milestone akademik
        $milestoneAkademik = [
            [
                'id' => 1,
                'judul' => 'Target Semester Ganjil',
                'deskripsi' => 'Mencapai rata-rata 85 untuk semua mata pelajaran',
                'target_nilai' => 85,
                'nilai_tercapai' => $progressMataPelajaran->avg('nilai_terkini'),
                'tanggal_target' => '2024-12-31',
                'tanggal_tercapai' => null,
                'status' => 'in_progress',
                'kategori' => 'nilai',
                'mata_pelajaran' => null,
            ]
        ];

        $statistikProgress = [
            [
                'periode' => 'Semester Ini',
                'total_nilai_input' => $progressMataPelajaran->sum(function ($item) {
                    return collect($item['progress_bulanan'])->sum('jumlah_nilai');
                }),
                'rata_rata_periode' => $progressMataPelajaran->avg('nilai_terkini'),
                'peningkatan_dari_periode_sebelumnya' => 3.2,
                'mata_pelajaran_meningkat' => $progressMataPelajaran->where('peningkatan_total', '>', 0)->count(),
                'mata_pelajaran_menurun' => $progressMataPelajaran->where('peningkatan_total', '<', 0)->count(),
                'mata_pelajaran_stabil' => $progressMataPelajaran->where('peningkatan_total', '=', 0)->count(),
                'konsistensi_nilai' => 85,
            ]
        ];

        $prediksiTarget = $progressMataPelajaran->map(function ($item) {
            return [
                'mata_pelajaran_id' => $item['mata_pelajaran']['id'],
                'mata_pelajaran' => $item['mata_pelajaran']['nama_mapel'],
                'prediksi_nilai_akhir' => $item['prediksi_akhir_semester'] ?? 0,
                'confidence_level' => 85,
                'faktor_prediksi' => [
                    'Konsistensi nilai selama 3 bulan terakhir',
                    'Trend peningkatan yang stabil',
                    'Partisipasi aktif dalam kelas'
                ],
                'rekomendasi_pencapaian' => [
                    'Pertahankan rutinitas belajar harian',
                    'Fokus pada latihan soal-soal sulit',
                    'Diskusi dengan guru mata pelajaran'
                ]
            ];
        });

        $overallProgress = [
            'rata_rata_awal_semester' => $progressMataPelajaran->avg('nilai_awal') ?? 0,
            'rata_rata_saat_ini' => $progressMataPelajaran->avg('nilai_terkini') ?? 0,
            'total_peningkatan' => $progressMataPelajaran->avg('peningkatan_total') ?? 0,
            'persentase_peningkatan' => 8.5,
            'target_akhir_semester' => 85,
            'estimasi_pencapaian' => $progressMataPelajaran->avg('prediksi_akhir_semester') ?? 0,
            'hari_tersisa_semester' => 45,
        ];

        return Inertia::render('Siswa/Progress', [
            'siswa' => $siswa,
            'progressMataPelajaran' => $progressMataPelajaran,
            'milestoneAkademik' => $milestoneAkademik,
            'statistikProgress' => $statistikProgress,
            'prediksiTarget' => $prediksiTarget,
            'semesterAktif' => $semesterAktif,
            'overallProgress' => $overallProgress,
        ]);
    }

    // Helper methods
    private function getKategoriPencapaian($nilai)
    {
        if ($nilai >= 90) return 'Sangat Baik';
        if ($nilai >= 80) return 'Baik';
        if ($nilai >= 70) return 'Cukup';
        return 'Perlu Perbaikan';
    }

    private function getKekuatan($nilai)
    {
        if ($nilai >= 85) {
            return ['Pemahaman konsep yang baik', 'Konsisten dalam mengerjakan tugas'];
        }
        return ['Potensi untuk berkembang', 'Antusias dalam belajar'];
    }

    private function getKelemahan($nilai)
    {
        if ($nilai < 75) {
            return ['Perlu peningkatan pemahaman', 'Konsistensi perlu diperbaiki'];
        }
        return ['Bisa lebih optimal', 'Detail-detail kecil perlu diperhatikan'];
    }

    private function getRekomendasi($nilai)
    {
        if ($nilai >= 85) {
            return ['Pertahankan performa', 'Bantu teman yang kesulitan', 'Eksplorasi materi advanced'];
        }
        if ($nilai >= 75) {
            return ['Tingkatkan latihan soal', 'Diskusi dengan guru', 'Buat jadwal belajar terstruktur'];
        }
        return ['Fokus pada konsep dasar', 'Minta bantuan guru/tutor', 'Perbanyak latihan'];
    }

    private function getPrioritas($nilai)
    {
        if ($nilai < 70) return 'Sangat Tinggi';
        if ($nilai < 80) return 'Tinggi';
        if ($nilai < 90) return 'Sedang';
        return 'Rendah';
    }

    private function getKategoriPerforma($nilai)
    {
        if ($nilai >= 90) return 'excellent';
        if ($nilai >= 80) return 'good';
        if ($nilai >= 70) return 'average';
        if ($nilai >= 60) return 'below_average';
        return 'poor';
    }
}
