<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\NilaiSiswa;
use App\Models\Absensi;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\MataPelajaran;
use App\Models\PenugasanMengajar;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WaliKelasController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        // Ambil kelas yang diampu sebagai wali kelas
        $kelas = Kelas::where('wali_kelas_id', $guru->id)
            ->with(['jurusan', 'siswa.user'])
            ->first();

        if (!$kelas) {
            return redirect()->back()->with('error', 'Anda belum ditugaskan sebagai wali kelas');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Statistik dasar
        $totalSiswa = $kelas->siswa->count();
        $siswaLakiLaki = $kelas->siswa->whereHas('user', function($q) {
            $q->where('jenis_kelamin', 'L');
        })->count();
        $siswaPerempuan = $totalSiswa - $siswaLakiLaki;

        // Rata-rata nilai kelas
        $rataRataNilai = NilaiSiswa::whereHas('siswa', function($q) use ($kelas) {
                $q->where('kelas_id', $kelas->id);
            })
            ->where('semester_id', $semesterAktif?->id)
            ->avg('nilai') ?? 0;

        // Statistik kehadiran
        $totalPertemuan = 100; // Dummy data, bisa disesuaikan
        $rataRataKehadiran = 95; // Dummy data, bisa disesuaikan

        return Inertia::render('WaliKelas/Index', [
            'guru' => $guru,
            'kelas' => $kelas,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'statistik' => [
                'total_siswa' => $totalSiswa,
                'siswa_laki_laki' => $siswaLakiLaki,
                'siswa_perempuan' => $siswaPerempuan,
                'rata_rata_nilai' => round($rataRataNilai, 2),
                'rata_rata_kehadiran' => $rataRataKehadiran,
                'total_pertemuan' => $totalPertemuan,
            ]
        ]);
    }

    public function siswa()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $kelas = Kelas::where('wali_kelas_id', $guru->id)
            ->with(['jurusan', 'siswa.user', 'siswa.orangTua'])
            ->first();

        if (!$kelas) {
            return redirect()->back()->with('error', 'Anda belum ditugaskan sebagai wali kelas');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Ambil data siswa dengan statistik nilai
        $siswaList = $kelas->siswa->map(function($siswa) use ($semesterAktif, $tahunAjaranAktif) {
            $rataRataNilai = NilaiSiswa::where('siswa_id', $siswa->id)
                ->where('semester_id', $semesterAktif?->id)
                ->avg('nilai') ?? 0;

            return [
                'id' => $siswa->id,
                'user' => $siswa->user,
                'nis' => $siswa->nis,
                'nisn' => $siswa->nisn,
                'tempat_lahir' => $siswa->tempat_lahir,
                'tanggal_lahir' => $siswa->tanggal_lahir,
                'alamat' => $siswa->alamat,
                'orang_tua' => $siswa->orangTua,
                'rata_rata_nilai' => round($rataRataNilai, 2),
            ];
        });

        return Inertia::render('WaliKelas/Siswa', [
            'guru' => $guru,
            'kelas' => $kelas,
            'siswaList' => $siswaList,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function rekapNilai()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $kelas = Kelas::where('wali_kelas_id', $guru->id)
            ->with(['jurusan', 'siswa.user'])
            ->first();

        if (!$kelas) {
            return redirect()->back()->with('error', 'Anda belum ditugaskan sebagai wali kelas');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Ambil semua mata pelajaran yang diajarkan di kelas ini
        $mataPelajaranList = PenugasanMengajar::where('kelas_id', $kelas->id)
            ->where('semester_id', $semesterAktif?->id)
            ->with('mataPelajaran')
            ->get()
            ->pluck('mataPelajaran')
            ->unique('id');

        // Rekap nilai per mata pelajaran
        $rekapNilai = [];
        
        foreach ($kelas->siswa as $siswa) {
            $nilaiSiswa = [
                'siswa' => $siswa,
                'nilai_per_mapel' => [],
                'rata_rata_keseluruhan' => 0,
            ];

            $totalNilai = 0;
            $jumlahMapel = 0;

            foreach ($mataPelajaranList as $mapel) {
                $rataRataMapel = NilaiSiswa::where('siswa_id', $siswa->id)
                    ->where('mata_pelajaran_id', $mapel->id)
                    ->where('semester_id', $semesterAktif?->id)
                    ->avg('nilai') ?? 0;

                $nilaiSiswa['nilai_per_mapel'][$mapel->id] = [
                    'mata_pelajaran' => $mapel,
                    'rata_rata' => round($rataRataMapel, 2),
                ];

                if ($rataRataMapel > 0) {
                    $totalNilai += $rataRataMapel;
                    $jumlahMapel++;
                }
            }

            $nilaiSiswa['rata_rata_keseluruhan'] = $jumlahMapel > 0 ? round($totalNilai / $jumlahMapel, 2) : 0;
            $rekapNilai[] = $nilaiSiswa;
        }

        return Inertia::render('WaliKelas/RekapNilai', [
            'guru' => $guru,
            'kelas' => $kelas,
            'rekapNilai' => $rekapNilai,
            'mataPelajaranList' => $mataPelajaranList,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function monitoringAbsensi()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $kelas = Kelas::where('wali_kelas_id', $guru->id)
            ->with(['jurusan', 'siswa.user'])
            ->first();

        if (!$kelas) {
            return redirect()->back()->with('error', 'Anda belum ditugaskan sebagai wali kelas');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Rekap absensi per siswa
        $rekapAbsensi = [];
        
        foreach ($kelas->siswa as $siswa) {
            $absensiSiswa = Absensi::where('siswa_id', $siswa->id)
                ->where('semester_id', $semesterAktif?->id)
                ->get();

            $jumlahHadir = $absensiSiswa->where('status_kehadiran', 'hadir')->count();
            $jumlahSakit = $absensiSiswa->where('status_kehadiran', 'sakit')->count();
            $jumlahIzin = $absensiSiswa->where('status_kehadiran', 'izin')->count();
            $jumlahAlpa = $absensiSiswa->where('status_kehadiran', 'alpha')->count();
            $totalPertemuan = $absensiSiswa->count();

            $persentaseKehadiran = $totalPertemuan > 0 ? round(($jumlahHadir / $totalPertemuan) * 100, 2) : 0;

            $rekapAbsensi[] = [
                'siswa' => $siswa,
                'jumlah_hadir' => $jumlahHadir,
                'jumlah_sakit' => $jumlahSakit,
                'jumlah_izin' => $jumlahIzin,
                'jumlah_alpa' => $jumlahAlpa,
                'total_pertemuan' => $totalPertemuan,
                'persentase_kehadiran' => $persentaseKehadiran,
            ];
        }

        return Inertia::render('WaliKelas/MonitoringAbsensi', [
            'guru' => $guru,
            'kelas' => $kelas,
            'rekapAbsensi' => $rekapAbsensi,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function catatan(Request $request)
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $kelas = Kelas::where('wali_kelas_id', $guru->id)
            ->with(['jurusan', 'siswa.user'])
            ->first();

        if (!$kelas) {
            return redirect()->back()->with('error', 'Anda belum ditugaskan sebagai wali kelas');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Ambil catatan wali kelas dari log aktivitas
        $catatanList = LogAktivitas::where('user_id', $user->id)
            ->where('aktivitas', 'LIKE', '%catatan wali kelas%')
            ->whereJsonContains('data_baru->kelas_id', $kelas->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('WaliKelas/Catatan', [
            'guru' => $guru,
            'kelas' => $kelas,
            'catatanList' => $catatanList,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
        ]);
    }

    public function storeCatatan(Request $request)
    {
        $request->validate([
            'siswa_id' => 'nullable|exists:siswa,id',
            'judul' => 'required|string|max:255',
            'isi_catatan' => 'required|string',
            'kategori_catatan' => 'required|in:prestasi,peringatan,konseling,umum',
        ]);

        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        $kelas = Kelas::where('wali_kelas_id', $guru->id)->first();

        if (!$kelas) {
            return redirect()->back()->with('error', 'Anda belum ditugaskan sebagai wali kelas');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Simpan catatan sebagai log aktivitas
        LogAktivitas::create([
            'user_id' => $user->id,
            'aktivitas' => 'Membuat catatan wali kelas: ' . $request->judul,
            'deskripsi' => 'Catatan untuk kelas ' . $kelas->nama_kelas,
            'data_baru' => [
                'kelas_id' => $kelas->id,
                'siswa_id' => $request->siswa_id,
                'judul' => $request->judul,
                'isi_catatan' => $request->isi_catatan,
                'kategori_catatan' => $request->kategori_catatan,
                'semester_id' => $semesterAktif?->id,
                'tahun_ajaran_id' => $tahunAjaranAktif?->id,
            ],
        ]);

        return redirect()->back()->with('success', 'Catatan berhasil disimpan');
    }

    public function deleteCatatan($id)
    {
        $user = Auth::user();
        
        $catatan = LogAktivitas::where('id', $id)
            ->where('user_id', $user->id)
            ->where('aktivitas', 'LIKE', '%catatan wali kelas%')
            ->first();

        if (!$catatan) {
            return redirect()->back()->with('error', 'Catatan tidak ditemukan');
        }

        $catatan->delete();

        return redirect()->back()->with('success', 'Catatan berhasil dihapus');
    }
}
