<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\PenugasanMengajar;
use App\Models\Siswa;
use App\Models\TahunAjaran;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PengajaranController extends Controller
{
    public function kelasMengajar()
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
            'mata_pelajaran',
            'semester.tahunAjaran',
            'semester'
        ])
        ->where('guru_id', $guru->id)
        ->when($semesterAktif, function ($query) use ($semesterAktif) {
            return $query->where('semester_id', $semesterAktif->id);
        })
        // Filter by tahun ajaran through semester relationship
        ->when($tahunAjaranAktif, function ($query) use ($tahunAjaranAktif) {
            return $query->whereHas('semester', function ($q) use ($tahunAjaranAktif) {
                $q->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            });
        })
        ->get();

        // Mendapatkan detail setiap kelas
        $kelasDetails = [];
        foreach ($penugasanMengajar as $penugasan) {
            $totalSiswa = Siswa::where('kelas_id', $penugasan->kelas_id)->count();
            $siswaPutra = Siswa::where('kelas_id', $penugasan->kelas_id)
                ->whereHas('user', function ($query) {
                    $query->where('jenis_kelamin', 'L');
                })
                ->count();
            $siswaPutri = $totalSiswa - $siswaPutra;

            $kelasDetails[] = [
                'id' => $penugasan->id,
                'kelas_id' => $penugasan->kelas_id,
                'nama_kelas' => $penugasan->kelas->nama_kelas,
                'jurusan' => $penugasan->kelas->jurusan->nama_jurusan ?? '-',
                'mata_pelajaran' => $penugasan->mata_pelajaran->nama_mata_pelajaran,
                'total_siswa' => $totalSiswa,
                'siswa_putra' => $siswaPutra,
                'siswa_putri' => $siswaPutri,
                'tahun_ajaran' => $penugasan->semester->tahunAjaran->nama_tahun_ajaran ?? '-',
                'semester' => $penugasan->semester->nama_semester,
            ];
        }

        return Inertia::render('Pengajaran/KelasMengajar', [
            'guru' => $guru,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'kelasDetails' => $kelasDetails,
        ]);
    }

    public function jadwalMengajar()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Mendapatkan penugasan mengajar guru dengan jadwal
        $penugasanMengajar = PenugasanMengajar::with([
            'kelas.jurusan',
            'mata_pelajaran',
            'semester.tahunAjaran',
            'semester'
        ])
        ->where('guru_id', $guru->id)
        ->when($semesterAktif, function ($query) use ($semesterAktif) {
            return $query->where('semester_id', $semesterAktif->id);
        })
        // Filter by tahun ajaran through semester relationship
        ->when($tahunAjaranAktif, function ($query) use ($tahunAjaranAktif) {
            return $query->whereHas('semester', function ($q) use ($tahunAjaranAktif) {
                $q->where('tahun_ajaran_id', $tahunAjaranAktif->id);
            });
        })
        ->get();

        // Membuat jadwal per hari (contoh struktur jadwal)
        $jadwalMinggu = [
            'Senin' => [],
            'Selasa' => [],
            'Rabu' => [],
            'Kamis' => [],
            'Jumat' => [],
            'Sabtu' => [],
        ];

        // Simulasi jadwal (dalam implementasi nyata, ini akan dari tabel jadwal)
        $jamPelajaran = [
            '07:00-07:45', '07:45-08:30', '08:30-09:15', '09:30-10:15',
            '10:15-11:00', '11:00-11:45', '13:00-13:45', '13:45-14:30'
        ];

        foreach ($penugasanMengajar as $index => $penugasan) {
            $hari = array_keys($jadwalMinggu)[$index % 6]; // Distribusi ke hari-hari
            $jam = $jamPelajaran[$index % count($jamPelajaran)];
            
            $jadwalMinggu[$hari][] = [
                'jam' => $jam,
                'mata_pelajaran' => $penugasan->mata_pelajaran->nama_mata_pelajaran,
                'kelas' => $penugasan->kelas->nama_kelas,
                'jurusan' => $penugasan->kelas->jurusan->nama_jurusan ?? '-',
                'ruang' => 'Ruang ' . ($index + 1), // Simulasi ruang
            ];
        }

        // Statistik jadwal
        $totalJamMengajar = array_sum(array_map('count', $jadwalMinggu));
        $totalKelas = count($penugasanMengajar);
        $totalMataPelajaran = $penugasanMengajar->unique('mata_pelajaran_id')->count();

        return Inertia::render('Pengajaran/JadwalMengajar', [
            'guru' => $guru,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'jadwalMinggu' => $jadwalMinggu,
            'statistikJadwal' => [
                'total_jam_mengajar' => $totalJamMengajar,
                'total_kelas' => $totalKelas,
                'total_mata_pelajaran' => $totalMataPelajaran,
            ],
        ]);
    }

    public function penugasan()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();
        
        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();

        // Mendapatkan semua penugasan mengajar guru
        $penugasanMengajar = PenugasanMengajar::with([
            'kelas.jurusan',
            'mata_pelajaran',
            'semester.tahunAjaran',
            'semester'
        ])
        ->where('guru_id', $guru->id)
        ->orderBy('semester_id', 'desc')
        ->get();

        // Grouping penugasan berdasarkan tahun ajaran dan semester
        $penugasanGrouped = $penugasanMengajar->groupBy(function ($item) {
            return ($item->semester->tahunAjaran->nama_tahun_ajaran ?? 'Unknown') . ' - ' . $item->semester->nama_semester;
        });

        // Statistik penugasan
        $totalPenugasan = $penugasanMengajar->count();
        $totalKelasUnik = $penugasanMengajar->unique('kelas_id')->count();
        $totalMataPelajaranUnik = $penugasanMengajar->unique('mata_pelajaran_id')->count();
        $penugasanAktif = $penugasanMengajar->filter(function ($item) use ($tahunAjaranAktif, $semesterAktif) {
            return $item->semester_id == $semesterAktif?->id && 
                   $item->semester?->tahun_ajaran_id == $tahunAjaranAktif?->id;
        })->count();

        // Detail penugasan untuk tabel
        $detailPenugasan = $penugasanMengajar->map(function ($item) {
            $totalSiswa = Siswa::where('kelas_id', $item->kelas_id)->count();
            
            return [
                'id' => $item->id,
                'tahun_ajaran' => $item->semester->tahunAjaran->nama_tahun_ajaran ?? 'Unknown',
                'semester' => $item->semester->nama_semester,
                'kelas' => $item->kelas->nama_kelas,
                'jurusan' => $item->kelas->jurusan->nama_jurusan ?? '-',
                'mata_pelajaran' => $item->mata_pelajaran->nama_mata_pelajaran,
                'total_siswa' => $totalSiswa,
                'status' => $item->semester->tahunAjaran->status_aktif && $item->semester->status_aktif ? 'Aktif' : 'Non-Aktif',
                'created_at' => $item->created_at?->format('d/m/Y'),
            ];
        });

        return Inertia::render('Pengajaran/Penugasan', [
            'guru' => $guru,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'penugasanGrouped' => $penugasanGrouped,
            'detailPenugasan' => $detailPenugasan,
            'statistikPenugasan' => [
                'total_penugasan' => $totalPenugasan,
                'total_kelas_unik' => $totalKelasUnik,
                'total_mata_pelajaran_unik' => $totalMataPelajaranUnik,
                'penugasan_aktif' => $penugasanAktif,
            ],
        ]);
    }
}
