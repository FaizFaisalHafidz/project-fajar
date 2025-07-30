<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\PenugasanMengajar;
use App\Models\Siswa;
use App\Models\NilaiSiswa;
use App\Models\NilaiSikap;
use App\Models\NilaiEkstrakurikuler;
use App\Models\Absensi;
use App\Models\PrestasiSiswa;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\KomponenNilai;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PenilaianController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Mendapatkan penugasan mengajar guru
        $penugasanMengajar = PenugasanMengajar::with([
            'kelas.jurusan',
            'mataPelajaran',
            'semester.tahunAjaran',
            'semester'
        ])
        ->where('guru_id', $guru->id)
        ->when($semesterAktif, function ($query) use ($semesterAktif) {
            return $query->where('semester_id', $semesterAktif->id);
        })
        ->when($tahunAjaranAktif, function ($query) use ($tahunAjaranAktif) {
            return $query->whereHas('semester', function ($q) use ($tahunAjaranAktif) {
                $q->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            });
        })
        ->get();

        // Mendapatkan komponen nilai
        $komponenNilai = KomponenNilai::where('semester_id', $semesterAktif?->id)->get();

        // Data untuk setiap tab
        $data = [
            'pengetahuan' => $this->getNilaiPengetahuan($penugasanMengajar, $komponenNilai),
            'keterampilan' => $this->getNilaiKeterampilan($penugasanMengajar, $komponenNilai),
            'absensi' => $this->getNilaiAbsensi($penugasanMengajar),
            'sosial' => $this->getNilaiSosial($penugasanMengajar),
            'spiritual' => $this->getNilaiSpiritual($penugasanMengajar),
            'ekstrakurikuler' => $this->getNilaiEkstrakurikuler($penugasanMengajar),
            'prestasi' => $this->getPrestasiSiswa($penugasanMengajar),
        ];

        return Inertia::render('Penilaian/Index', [
            'guru' => $guru,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'penugasanMengajar' => $penugasanMengajar,
            'komponenNilai' => $komponenNilai,
            'data' => $data,
        ]);
    }

    private function getNilaiPengetahuan($penugasanMengajar, $komponenNilai)
    {
        $data = [];
        
        foreach ($penugasanMengajar as $penugasan) {
            $siswaList = Siswa::with('user')
                ->where('kelas_id', $penugasan->kelas_id)
                ->get()
                ->sortBy('user.name');

            // Filter komponen nilai untuk mata pelajaran ini saja
            $komponenPengetahuan = $komponenNilai->where('mata_pelajaran_id', $penugasan->mata_pelajaran_id);
            
            $nilaiSiswa = [];
            foreach ($siswaList as $siswa) {
                // Get nilai berdasarkan komponen_nilai_id dari komponen pengetahuan
                $komponenIds = $komponenPengetahuan->pluck('id');
                $nilai = NilaiSiswa::where('siswa_id', $siswa->id)
                    ->where('mata_pelajaran_id', $penugasan->mata_pelajaran_id)
                    ->where('semester_id', $penugasan->semester_id)
                    ->whereIn('komponen_nilai_id', $komponenIds)
                    ->get()
                    ->keyBy('komponen_nilai_id');

                $rataRata = $nilai->count() > 0 ? $nilai->avg('nilai') : 0;

                $nilaiSiswa[] = [
                    'siswa' => $siswa,
                    'nilai' => $nilai,
                    'rata_rata' => $rataRata,
                ];
            }

            $data[] = [
                'penugasan' => $penugasan,
                'komponen' => $komponenPengetahuan->values()->toArray(),
                'siswa_nilai' => $nilaiSiswa,
            ];
        }

        return $data;
    }

    private function getNilaiKeterampilan($penugasanMengajar, $komponenNilai)
    {
        $data = [];
        
        foreach ($penugasanMengajar as $penugasan) {
            $siswaList = Siswa::with('user')
                ->where('kelas_id', $penugasan->kelas_id)
                ->get()
                ->sortBy('user.name');

            // Filter komponen nilai untuk mata pelajaran ini saja
            $komponenKeterampilan = $komponenNilai->where('mata_pelajaran_id', $penugasan->mata_pelajaran_id);
            
            $nilaiSiswa = [];
            foreach ($siswaList as $siswa) {
                // Get nilai berdasarkan komponen_nilai_id dari komponen keterampilan
                $komponenIds = $komponenKeterampilan->pluck('id');
                $nilai = NilaiSiswa::where('siswa_id', $siswa->id)
                    ->where('mata_pelajaran_id', $penugasan->mata_pelajaran_id)
                    ->where('semester_id', $penugasan->semester_id)
                    ->whereIn('komponen_nilai_id', $komponenIds)
                    ->get()
                    ->keyBy('komponen_nilai_id');

                $rataRata = $nilai->count() > 0 ? $nilai->avg('nilai') : 0;

                $nilaiSiswa[] = [
                    'siswa' => $siswa,
                    'nilai' => $nilai,
                    'rata_rata' => $rataRata,
                ];
            }

            $data[] = [
                'penugasan' => $penugasan,
                'komponen' => $komponenKeterampilan->values()->toArray(),
                'siswa_nilai' => $nilaiSiswa,
            ];
        }

        return $data;
    }

    private function getNilaiAbsensi($penugasanMengajar)
    {
        $data = [];
        
        foreach ($penugasanMengajar as $penugasan) {
            $siswaList = Siswa::with('user')
                ->where('kelas_id', $penugasan->kelas_id)
                ->get()
                ->sortBy('user.name');
            
            $absensiSiswa = [];
            foreach ($siswaList as $siswa) {
                // Sesuaikan dengan struktur model Absensi yang sebenarnya
                $absensi = Absensi::where('siswa_id', $siswa->id)
                    ->where('semester_id', $penugasan->semester_id)
                    ->first();

                $absensiSiswa[] = [
                    'siswa' => $siswa,
                    'jumlah_sakit' => $absensi ? $absensi->jumlah_sakit : 0,
                    'jumlah_izin' => $absensi ? $absensi->jumlah_izin : 0,
                    'jumlah_tanpa_keterangan' => $absensi ? $absensi->jumlah_tanpa_keterangan : 0,
                ];
            }

            $data[] = [
                'penugasan' => $penugasan,
                'siswa_absensi' => $absensiSiswa,
            ];
        }

        return $data;
    }

    private function getNilaiSosial($penugasanMengajar)
    {
        $data = [];
        
        foreach ($penugasanMengajar as $penugasan) {
            $siswaList = Siswa::with('user')
                ->where('kelas_id', $penugasan->kelas_id)
                ->get()
                ->sortBy('user.name');
            
            $nilaiSiswa = [];
            foreach ($siswaList as $siswa) {
                // Sesuaikan dengan struktur model NilaiSikap yang sebenarnya
                $nilaiSikap = NilaiSikap::where('siswa_id', $siswa->id)
                    ->where('semester_id', $penugasan->semester_id)
                    ->first();

                $nilaiSiswa[] = [
                    'siswa' => $siswa,
                    'nilai_sosial' => $nilaiSikap ? $nilaiSikap->nilai_sosial : null,
                    'deskripsi_sosial' => $nilaiSikap ? $nilaiSikap->deskripsi_sosial : null,
                ];
            }

            $data[] = [
                'penugasan' => $penugasan,
                'siswa_nilai' => $nilaiSiswa,
            ];
        }

        return $data;
    }

    private function getNilaiSpiritual($penugasanMengajar)
    {
        $data = [];
        
        foreach ($penugasanMengajar as $penugasan) {
            $siswaList = Siswa::with('user')
                ->where('kelas_id', $penugasan->kelas_id)
                ->get()
                ->sortBy('user.name');
            
            $nilaiSiswa = [];
            foreach ($siswaList as $siswa) {
                // Sesuaikan dengan struktur model NilaiSikap yang sebenarnya
                $nilaiSikap = NilaiSikap::where('siswa_id', $siswa->id)
                    ->where('semester_id', $penugasan->semester_id)
                    ->first();

                $nilaiSiswa[] = [
                    'siswa' => $siswa,
                    'nilai_spiritual' => $nilaiSikap ? $nilaiSikap->nilai_spiritual : null,
                    'deskripsi_spiritual' => $nilaiSikap ? $nilaiSikap->deskripsi_spiritual : null,
                ];
            }

            $data[] = [
                'penugasan' => $penugasan,
                'siswa_nilai' => $nilaiSiswa,
            ];
        }

        return $data;
    }

    private function getNilaiEkstrakurikuler($penugasanMengajar)
    {
        $data = [];
        
        // Untuk nilai ekstrakurikuler, kita ambil berdasarkan kelas siswa
        $kelasIds = $penugasanMengajar->pluck('kelas_id')->unique();
        
        foreach ($kelasIds as $kelasId) {
            $kelas = Kelas::with('jurusan')->find($kelasId);
            $siswaList = Siswa::with('user')
                ->where('kelas_id', $kelasId)
                ->get()
                ->sortBy('user.name');
            
            $nilaiSiswa = [];
            foreach ($siswaList as $siswa) {
                // Sesuaikan dengan struktur model NilaiEkstrakurikuler yang sebenarnya
                $semesterIds = $penugasanMengajar->pluck('semester_id')->unique();
                $nilaiEkstrakurikuler = NilaiEkstrakurikuler::with('ekstrakurikuler')
                    ->where('siswa_id', $siswa->id)
                    ->whereIn('semester_id', $semesterIds)
                    ->get();

                $nilaiSiswa[] = [
                    'siswa' => $siswa,
                    'nilai_ekstrakurikuler' => $nilaiEkstrakurikuler,
                ];
            }

            $data[] = [
                'kelas' => $kelas,
                'siswa_nilai' => $nilaiSiswa,
            ];
        }

        return $data;
    }

    private function getPrestasiSiswa($penugasanMengajar)
    {
        $data = [];
        
        // Untuk prestasi, kita ambil berdasarkan kelas siswa
        $kelasIds = $penugasanMengajar->pluck('kelas_id')->unique();
        
        foreach ($kelasIds as $kelasId) {
            $kelas = Kelas::with('jurusan')->find($kelasId);
            $siswaList = Siswa::with('user')
                ->where('kelas_id', $kelasId)
                ->get()
                ->sortBy('user.name');
            
            $prestasiSiswa = [];
            foreach ($siswaList as $siswa) {
                // Sesuaikan dengan strukture model PrestasiSiswa yang sebenarnya
                $semesterIds = $penugasanMengajar->pluck('semester_id')->unique();
                $prestasi = PrestasiSiswa::where('siswa_id', $siswa->id)
                    ->whereIn('semester_id', $semesterIds)
                    ->orderBy('tanggal_prestasi', 'desc')
                    ->get();

                $prestasiSiswa[] = [
                    'siswa' => $siswa,
                    'prestasi' => $prestasi,
                    'total_prestasi' => $prestasi->count(),
                ];
            }

            $data[] = [
                'kelas' => $kelas,
                'siswa_prestasi' => $prestasiSiswa,
            ];
        }

        return $data;
    }
}
