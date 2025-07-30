<?php

namespace App\Http\Controllers\Pengaturan;

use App\Http\Controllers\Controller;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\Kelas;
use App\Models\PenugasanMengajar;
use App\Models\NilaiSiswa;
use App\Models\Absensi;
use App\Models\PrestasiSiswa;
use App\Models\Siswa;
use App\Models\NilaiEkstrakurikuler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ResetTahunAkademikController extends Controller
{
    /**
     * Display reset tahun akademik page
     */
    public function index()
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $tahunAjaranSebelumnya = TahunAjaran::where('status_aktif', false)
            ->orderBy('tanggal_mulai', 'desc')
            ->get();
        
        // Get data counts for current academic year
        $dataCounts = [
            'siswa' => 0,
            'kelas' => 0,
            'penugasan_mengajar' => 0,
            'nilai_siswa' => 0,
            'absensi' => 0,
            'prestasi' => 0,
            'ekstrakurikuler_siswa' => 0,
        ];
        
        if ($tahunAjaranAktif) {
            $dataCounts = [
                'siswa' => Siswa::whereHas('kelas', function($query) use ($tahunAjaranAktif) {
                    $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                })->count(),
                'kelas' => Kelas::where('tahun_ajaran_id', $tahunAjaranAktif->id)->count(),
                'penugasan_mengajar' => PenugasanMengajar::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                    $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                })->count(),
                'nilai_siswa' => NilaiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                    $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                })->count(),
                'absensi' => Absensi::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                    $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                })->count(),
                'prestasi' => PrestasiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                    $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                })->count(),
                'ekstrakurikuler_siswa' => NilaiEkstrakurikuler::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                    $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                })->count(),
            ];
        }

        return Inertia::render('Pengaturan/ResetTahun/Index', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'tahunAjaranSebelumnya' => $tahunAjaranSebelumnya,
            'dataCounts' => $dataCounts,
        ]);
    }

    /**
     * Reset semua data tahun akademik (DANGER!)
     */
    public function resetAllData(Request $request)
    {
        $request->validate([
            'confirmation' => 'required|in:RESET_ALL_DATA',
        ]);

        try {
            DB::beginTransaction();

            $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
            
            if (!$tahunAjaranAktif) {
                throw new \Exception('Tidak ada tahun ajaran aktif');
            }

            // Delete all related data for the active academic year
            
            // 1. Delete Nilai Siswa
            NilaiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            })->delete();

            // 2. Delete Absensi
            Absensi::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            })->delete();

            // 3. Delete Prestasi Siswa
            PrestasiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            })->delete();

            // 4. Delete Nilai Ekstrakurikuler
            NilaiEkstrakurikuler::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            })->delete();

            // 5. Delete Penugasan Mengajar
            PenugasanMengajar::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            })->delete();

            // 6. Reset Wali Kelas
            Kelas::where('tahun_ajaran_id', $tahunAjaranAktif->id)
                ->update(['wali_kelas_id' => null]);

            // 7. Delete Siswa (after deleting related data)
            Siswa::whereHas('kelas', function($query) use ($tahunAjaranAktif) {
                $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            })->delete();

            // 8. Delete Kelas (last, after everything else)
            Kelas::where('tahun_ajaran_id', $tahunAjaranAktif->id)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Semua data tahun akademik berhasil direset');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Reset specific data types
     */
    public function resetSpecificData(Request $request)
    {
        $request->validate([
            'data_types' => 'required|array',
            'data_types.*' => 'in:siswa,kelas,penugasan_mengajar,nilai_siswa,absensi,prestasi,ekstrakurikuler_siswa',
        ]);

        try {
            DB::beginTransaction();

            $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
            
            if (!$tahunAjaranAktif) {
                throw new \Exception('Tidak ada tahun ajaran aktif');
            }

            $deletedCounts = [];

            foreach ($request->data_types as $dataType) {
                switch ($dataType) {
                    case 'siswa':
                        $count = Siswa::whereHas('kelas', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->count();
                        
                        Siswa::whereHas('kelas', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->delete();
                        
                        $deletedCounts[] = "{$count} data siswa";
                        break;

                    case 'kelas':
                        $count = Kelas::where('tahun_ajaran_id', $tahunAjaranAktif->id)->count();
                        Kelas::where('tahun_ajaran_id', $tahunAjaranAktif->id)->delete();
                        $deletedCounts[] = "{$count} data kelas";
                        break;

                    case 'penugasan_mengajar':
                        $count = PenugasanMengajar::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->count();
                        
                        PenugasanMengajar::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->delete();
                        
                        $deletedCounts[] = "{$count} penugasan mengajar";
                        break;

                    case 'nilai_siswa':
                        $count = NilaiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->count();
                        
                        NilaiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->delete();
                        
                        $deletedCounts[] = "{$count} data nilai siswa";
                        break;

                    case 'absensi':
                        $count = Absensi::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->count();
                        
                        Absensi::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->delete();
                        
                        $deletedCounts[] = "{$count} data absensi";
                        break;

                    case 'prestasi':
                        $count = PrestasiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->count();
                        
                        PrestasiSiswa::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->delete();
                        
                        $deletedCounts[] = "{$count} data prestasi";
                        break;

                    case 'ekstrakurikuler_siswa':
                        $count = NilaiEkstrakurikuler::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->count();
                        
                        NilaiEkstrakurikuler::whereHas('semester', function($query) use ($tahunAjaranAktif) {
                            $query->where('tahun_ajaran_id', $tahunAjaranAktif->id);
                        })->delete();
                        
                        $deletedCounts[] = "{$count} nilai ekstrakurikuler";
                        break;
                }
            }

            DB::commit();

            $message = 'Berhasil menghapus: ' . implode(', ', $deletedCounts);
            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Copy data from previous academic year
     */
    public function copyFromPreviousYear(Request $request)
    {
        $request->validate([
            'source_tahun_id' => 'required|exists:tm_data_tahun_ajaran,id',
            'data_types' => 'required|array',
            'data_types.*' => 'in:siswa,kelas,penugasan_mengajar',
        ]);

        try {
            DB::beginTransaction();

            $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
            $sourceTahunAjaran = TahunAjaran::findOrFail($request->source_tahun_id);
            
            if (!$tahunAjaranAktif) {
                throw new \Exception('Tidak ada tahun ajaran aktif');
            }

            $copiedCounts = [];

            foreach ($request->data_types as $dataType) {
                switch ($dataType) {
                    case 'siswa':
                        // Copy siswa from previous year
                        $sourceSiswa = Siswa::whereHas('kelas', function($query) use ($sourceTahunAjaran) {
                            $query->where('tahun_ajaran_id', $sourceTahunAjaran->id);
                        })->with('kelas')->get();
                        
                        $copied = 0;
                        foreach ($sourceSiswa as $siswa) {
                            // Find matching kelas in current year
                            $targetKelas = Kelas::where([
                                'tahun_ajaran_id' => $tahunAjaranAktif->id,
                                'tingkat_kelas' => $siswa->kelas->tingkat_kelas,
                                'nama_kelas' => $siswa->kelas->nama_kelas,
                                'jurusan_id' => $siswa->kelas->jurusan_id,
                            ])->first();

                            if ($targetKelas) {
                                $existingSiswa = Siswa::where([
                                    'nis' => $siswa->nis,
                                    'kelas_id' => $targetKelas->id,
                                ])->first();

                                if (!$existingSiswa) {
                                    Siswa::create([
                                        'nis' => $siswa->nis,
                                        'nama_siswa' => $siswa->nama_siswa,
                                        'jenis_kelamin' => $siswa->jenis_kelamin,
                                        'tempat_lahir' => $siswa->tempat_lahir,
                                        'tanggal_lahir' => $siswa->tanggal_lahir,
                                        'alamat' => $siswa->alamat,
                                        'kelas_id' => $targetKelas->id,
                                        'orang_tua_id' => $siswa->orang_tua_id,
                                        'status_aktif' => $siswa->status_aktif,
                                    ]);
                                    $copied++;
                                }
                            }
                        }
                        $copiedCounts[] = "{$copied} siswa";
                        break;

                    case 'kelas':
                        // Copy kelas structure (without wali kelas)
                        $sourceKelas = Kelas::where('tahun_ajaran_id', $sourceTahunAjaran->id)->get();
                        $copied = 0;
                        foreach ($sourceKelas as $kelas) {
                            $existingKelas = Kelas::where([
                                'tahun_ajaran_id' => $tahunAjaranAktif->id,
                                'tingkat_kelas' => $kelas->tingkat_kelas,
                                'nama_kelas' => $kelas->nama_kelas,
                                'jurusan_id' => $kelas->jurusan_id,
                            ])->first();

                            if (!$existingKelas) {
                                Kelas::create([
                                    'tahun_ajaran_id' => $tahunAjaranAktif->id,
                                    'tingkat_kelas' => $kelas->tingkat_kelas,
                                    'nama_kelas' => $kelas->nama_kelas,
                                    'jurusan_id' => $kelas->jurusan_id,
                                    'wali_kelas_id' => null, // Will be assigned separately
                                ]);
                                $copied++;
                            }
                        }
                        $copiedCounts[] = "{$copied} kelas";
                        break;

                    case 'penugasan_mengajar':
                        // Copy penugasan mengajar if both guru and kelas exist
                        $sourcePenugasan = PenugasanMengajar::whereHas('semester', function($query) use ($sourceTahunAjaran) {
                            $query->where('tahun_ajaran_id', $sourceTahunAjaran->id);
                        })->with(['kelas', 'semester'])->get();
                        
                        $targetSemester = Semester::where('tahun_ajaran_id', $tahunAjaranAktif->id)->first();
                        $copied = 0;
                        
                        if ($targetSemester) {
                            foreach ($sourcePenugasan as $penugasan) {
                                // Find matching kelas in current year
                                $targetKelas = Kelas::where([
                                    'tahun_ajaran_id' => $tahunAjaranAktif->id,
                                    'tingkat_kelas' => $penugasan->kelas->tingkat_kelas,
                                    'nama_kelas' => $penugasan->kelas->nama_kelas,
                                    'jurusan_id' => $penugasan->kelas->jurusan_id,
                                ])->first();

                                if ($targetKelas) {
                                    $existingPenugasan = PenugasanMengajar::where([
                                        'guru_id' => $penugasan->guru_id,
                                        'mata_pelajaran_id' => $penugasan->mata_pelajaran_id,
                                        'kelas_id' => $targetKelas->id,
                                        'semester_id' => $targetSemester->id,
                                    ])->first();

                                    if (!$existingPenugasan) {
                                        PenugasanMengajar::create([
                                            'guru_id' => $penugasan->guru_id,
                                            'mata_pelajaran_id' => $penugasan->mata_pelajaran_id,
                                            'kelas_id' => $targetKelas->id,
                                            'semester_id' => $targetSemester->id,
                                        ]);
                                        $copied++;
                                    }
                                }
                            }
                        }
                        $copiedCounts[] = "{$copied} penugasan mengajar";
                        break;
                }
            }

            DB::commit();

            $message = "Berhasil menyalin " . implode(', ', $copiedCounts) . " dari tahun ajaran {$sourceTahunAjaran->nama_tahun_ajaran}";
            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
