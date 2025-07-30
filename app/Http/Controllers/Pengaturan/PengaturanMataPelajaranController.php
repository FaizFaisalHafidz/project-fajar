<?php

namespace App\Http\Controllers\Pengaturan;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use App\Models\Guru;
use App\Models\PenugasanMengajar;
use App\Models\TahunAjaran;
use App\Models\Kelas;
use App\Models\NilaiSiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaturanMataPelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        $penugasanMengajar = PenugasanMengajar::with([
            'guru.user',
            'mataPelajaran',
            'kelas.jurusan',
            'semester.tahunAjaran'
        ])
        ->whereHas('semester', function($query) use ($tahunAjaranAktif) {
            $query->where('tahun_ajaran_id', $tahunAjaranAktif?->id);
        })
        ->orderBy('mata_pelajaran_id', 'asc')
        ->orderBy('kelas_id', 'asc')
        ->get();

        $mataPelajarans = MataPelajaran::orderBy('nama_mapel', 'asc')->get();
        $gurus = Guru::with('user')->get()->sortBy('user.name')->values();
        $kelas = Kelas::with('jurusan')
            ->where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->orderBy('tingkat_kelas', 'asc')
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $stats = [
            'total_penugasan' => $penugasanMengajar->count(),
            'total_guru_mengajar' => $penugasanMengajar->groupBy('guru_id')->count(),
            'total_mapel_aktif' => $penugasanMengajar->groupBy('mata_pelajaran_id')->count(),
        ];

        return Inertia::render('Pengaturan/MataPelajaran/Index', [
            'penugasanMengajar' => $penugasanMengajar,
            'mataPelajarans' => $mataPelajarans,
            'gurus' => $gurus,
            'kelas' => $kelas,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'stats' => $stats,
        ]);
    }

        /**
     * Store a newly created penugasan
     */
    public function store(Request $request)
    {
        $request->validate([
            'guru_id' => 'required|exists:tm_data_guru,id',
            'mata_pelajaran_id' => 'required|exists:tm_data_mata_pelajaran,id',
            'kelas_id' => 'required|exists:tm_data_kelas,id',
            'semester_id' => 'required|exists:tm_data_semester,id',
        ]);

        // Check for duplicate assignment
        $existing = PenugasanMengajar::where([
            'guru_id' => $request->guru_id,
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
        ])->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Penugasan untuk guru, mata pelajaran, kelas, dan semester ini sudah ada');
        }

        PenugasanMengajar::create([
            'guru_id' => $request->guru_id,
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
        ]);

        return redirect()->back()->with('success', 'Penugasan mengajar berhasil ditambahkan');
    }

    /**
     * Update penugasan mengajar
     */
    public function updatePenugasan(Request $request, $id)
    {
        $penugasan = PenugasanMengajar::findOrFail($id);

        $request->validate([
            'guru_id' => 'required|exists:tm_data_guru,id',
            'mata_pelajaran_id' => 'required|exists:tm_data_mata_pelajaran,id',
            'kelas_id' => 'required|exists:tm_data_kelas,id',
            'semester_id' => 'required|exists:tm_data_semester,id',
        ]);

        // Check for duplicate assignment (exclude current record)
        $existing = PenugasanMengajar::where([
            'guru_id' => $request->guru_id,
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
        ])->where('id', '!=', $id)->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Penugasan untuk guru, mata pelajaran, kelas, dan semester ini sudah ada');
        }

        $penugasan->update([
            'guru_id' => $request->guru_id,
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
        ]);

        return redirect()->back()->with('success', 'Penugasan mengajar berhasil diperbarui');
    }

    /**
     * Delete penugasan mengajar
     */
    public function destroy($id)
    {
        $penugasan = PenugasanMengajar::findOrFail($id);
        
        // Check if there are related records (nilai siswa, etc.)
        $hasNilaiSiswa = NilaiSiswa::where([
            'mata_pelajaran_id' => $penugasan->mata_pelajaran_id,
            'semester_id' => $penugasan->semester_id,
        ])->whereHas('siswa.kelas', function($query) use ($penugasan) {
            $query->where('id', $penugasan->kelas_id);
        })->exists();
        
        if ($hasNilaiSiswa) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus penugasan yang sudah memiliki data nilai siswa');
        }

        $penugasan->delete();

        return redirect()->back()->with('success', 'Penugasan mengajar berhasil dihapus');
    }

    /**
     * Bulk delete penugasan mengajar
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'penugasan_ids' => 'required|array',
            'penugasan_ids.*' => 'exists:tm_penugasan_mengajar,id',
        ]);

        $deleted = 0;
        $errors = [];

        foreach ($request->penugasan_ids as $id) {
            $penugasan = PenugasanMengajar::find($id);
            
            if ($penugasan) {
                // Check if there are related records (nilai siswa, etc.)
                $hasNilaiSiswa = NilaiSiswa::where([
                    'mata_pelajaran_id' => $penugasan->mata_pelajaran_id,
                    'semester_id' => $penugasan->semester_id,
                ])->whereHas('siswa.kelas', function($query) use ($penugasan) {
                    $query->where('id', $penugasan->kelas_id);
                })->exists();
                
                if ($hasNilaiSiswa) {
                    $errors[] = "Penugasan {$penugasan->guru->user->name} - {$penugasan->mataPelajaran->nama_mapel} tidak dapat dihapus karena sudah memiliki data nilai siswa";
                    continue;
                }

                $penugasan->delete();
                $deleted++;
            }
        }

        $message = "Berhasil menghapus {$deleted} penugasan";
        if (!empty($errors)) {
            $message .= ". " . implode(', ', $errors);
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Bulk assign penugasan mengajar
     */
    public function bulkAssignPenugasan(Request $request)
    {
        $request->validate([
            'assignments' => 'required|array',
            'assignments.*.guru_id' => 'required|exists:tm_data_guru,id',
            'assignments.*.mata_pelajaran_id' => 'required|exists:tm_data_mata_pelajaran,id',
            'assignments.*.kelas_id' => 'required|exists:tm_data_kelas,id',
            'assignments.*.semester_id' => 'required|exists:tm_data_semester,id',
        ]);

        $created = 0;
        $duplicates = 0;

        foreach ($request->assignments as $assignment) {
            $existing = PenugasanMengajar::where([
                'guru_id' => $assignment['guru_id'],
                'mata_pelajaran_id' => $assignment['mata_pelajaran_id'],
                'kelas_id' => $assignment['kelas_id'],
                'semester_id' => $assignment['semester_id'],
            ])->first();

            if (!$existing) {
                PenugasanMengajar::create($assignment);
                $created++;
            } else {
                $duplicates++;
            }
        }

        $message = "Berhasil menambahkan {$created} penugasan";
        if ($duplicates > 0) {
            $message .= ", {$duplicates} penugasan diabaikan karena sudah ada";
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Get penugasan by guru
     */
    public function getPenugasanByGuru($guruId)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        $penugasan = PenugasanMengajar::with([
            'mataPelajaran',
            'kelas.jurusan',
            'semester'
        ])
        ->where('guru_id', $guruId)
        ->whereHas('semester', function($query) use ($tahunAjaranAktif) {
            $query->where('tahun_ajaran_id', $tahunAjaranAktif?->id);
        })
        ->get();

        return response()->json($penugasan);
    }
}
