<?php

namespace App\Http\Controllers;

use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\NilaiSiswa;
use App\Models\NilaiSikap;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapNilaiController extends Controller
{
    /**
     * Display the rekap nilai page with tabs
     */
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get all kelas for filtering
        $kelasList = Kelas::with(['jurusan'])
            ->orderBy('nama_kelas')
            ->get();

        // Get all mata pelajaran for filtering
        $mataPelajaranList = MataPelajaran::orderBy('nama_mapel')->get();

        return Inertia::render('Laporan/RekapNilai', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'kelasList' => $kelasList,
            'mataPelajaranList' => $mataPelajaranList,
        ]);
    }

    /**
     * Get rekap nilai pengetahuan
     */
    public function rekapPengetahuan(Request $request)
    {
        $request->validate([
            'kelas_id' => 'nullable|exists:tm_data_kelas,id',
            'mata_pelajaran_id' => 'nullable|exists:tm_data_mata_pelajaran,id',
        ]);

        $semester = Semester::where('status_aktif', true)->first();
        
        $query = NilaiSiswa::with(['siswa.user', 'siswa.kelas', 'mataPelajaran'])
            ->where('semester_id', $semester->id);

        if ($request->kelas_id) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }

        if ($request->mata_pelajaran_id) {
            $query->where('mata_pelajaran_id', $request->mata_pelajaran_id);
        }

        $nilaiPengetahuan = $query->get()
            ->groupBy('siswa_id')
            ->map(function ($nilai, $siswaId) {
                $siswa = $nilai->first()->siswa;
                $nilaiPerMapel = $nilai->groupBy('mata_pelajaran_id')->map(function ($nilaiMapel) {
                    return [
                        'mata_pelajaran' => $nilaiMapel->first()->mataPelajaran->nama_mapel,
                        'rata_rata' => $nilaiMapel->avg('nilai'),
                        'jumlah_nilai' => $nilaiMapel->count()
                    ];
                });

                return [
                    'siswa' => [
                        'id' => $siswa->id,
                        'nama' => $siswa->user->name,
                        'nis' => $siswa->nis,
                        'kelas' => $siswa->kelas->nama_kelas ?? 'N/A',
                    ],
                    'nilai_per_mapel' => $nilaiPerMapel->values(),
                    'rata_rata_keseluruhan' => $nilai->avg('nilai')
                ];
            });

        return response()->json([
            'data' => $nilaiPengetahuan->values(),
            'summary' => [
                'total_siswa' => $nilaiPengetahuan->count(),
                'rata_rata_kelas' => $nilaiPengetahuan->avg('rata_rata_keseluruhan'),
                'nilai_tertinggi' => $nilaiPengetahuan->max('rata_rata_keseluruhan'),
                'nilai_terendah' => $nilaiPengetahuan->min('rata_rata_keseluruhan'),
            ]
        ]);
    }

    /**
     * Get rekap nilai keterampilan
     */
    public function rekapKeterampilan(Request $request)
    {
        // Untuk contoh ini, kita akan menggunakan data yang sama dengan pengetahuan
        // Dalam implementasi nyata, ini akan mengambil data dari komponen nilai keterampilan
        return $this->rekapPengetahuan($request);
    }

    /**
     * Get rekap nilai sikap
     */
    public function rekapSikap(Request $request)
    {
        $request->validate([
            'kelas_id' => 'nullable|exists:tm_data_kelas,id',
        ]);

        $semester = Semester::where('status_aktif', true)->first();
        
        $query = NilaiSikap::with(['siswa.user', 'siswa.kelas'])
            ->where('semester_id', $semester->id);

        if ($request->kelas_id) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }

        $nilaiSikap = $query->get()->map(function ($nilai) {
            return [
                'siswa' => [
                    'id' => $nilai->siswa->id,
                    'nama' => $nilai->siswa->user->name,
                    'nis' => $nilai->siswa->nis,
                    'kelas' => $nilai->siswa->kelas->nama_kelas ?? 'N/A',
                ],
                'nilai_sosial' => $nilai->nilai_sosial,
                'deskripsi_sosial' => $nilai->deskripsi_sosial,
                'nilai_spiritual' => $nilai->nilai_spiritual,
                'deskripsi_spiritual' => $nilai->deskripsi_spiritual,
            ];
        });

        return response()->json([
            'data' => $nilaiSikap,
            'summary' => [
                'total_siswa' => $nilaiSikap->count(),
                'distribusi_sosial' => $nilaiSikap->groupBy('nilai_sosial')->map->count(),
                'distribusi_spiritual' => $nilaiSikap->groupBy('nilai_spiritual')->map->count(),
            ]
        ]);
    }

    /**
     * Export rekap nilai to Excel
     */
    public function exportRekap(Request $request)
    {
        $request->validate([
            'type' => 'required|in:pengetahuan,keterampilan,sikap',
            'format' => 'required|in:excel,pdf',
            'kelas_id' => 'nullable|exists:tm_data_kelas,id',
            'mata_pelajaran_id' => 'nullable|exists:tm_data_mata_pelajaran,id',
        ]);

        // TODO: Implement export functionality
        return response()->json([
            'message' => 'Export ' . $request->type . ' dalam format ' . $request->format . ' akan segera tersedia',
            'type' => $request->type,
            'format' => $request->format,
            'filters' => [
                'kelas_id' => $request->kelas_id,
                'mata_pelajaran_id' => $request->mata_pelajaran_id,
            ]
        ]);
    }
}
