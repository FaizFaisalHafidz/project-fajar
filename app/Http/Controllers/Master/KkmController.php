<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Kkm;
use App\Models\MataPelajaran;
use App\Models\Kelas;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KkmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kkms = Kkm::with(['mataPelajaran', 'kelas.jurusan', 'semester.tahunAjaran'])
            ->orderBy('semester_id', 'desc')
            ->orderBy('kelas_id', 'asc')
            ->orderBy('mata_pelajaran_id', 'asc')
            ->get();
        
        $mataPelajarans = MataPelajaran::orderBy('nama_mapel', 'asc')->get();
        $kelas = Kelas::with('jurusan')->orderBy('tingkat_kelas', 'asc')->orderBy('nama_kelas', 'asc')->get();
        $semesters = Semester::with('tahunAjaran')->orderBy('tahun_ajaran_id', 'desc')->orderBy('nama_semester', 'asc')->get();
        
        $stats = [
            'total_kkm' => $kkms->count(),
            'rata_rata_kkm' => $kkms->avg('nilai_kkm') ?: 0,
            'kkm_tertinggi' => $kkms->max('nilai_kkm') ?: 0,
        ];

        return Inertia::render('Master/Kkm/Index', [
            'kkms' => $kkms,
            'mataPelajarans' => $mataPelajarans,
            'kelas' => $kelas,
            'semesters' => $semesters,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'mata_pelajaran_id' => 'required|exists:tm_data_mata_pelajaran,id',
            'kelas_id' => 'required|exists:tm_data_kelas,id',
            'semester_id' => 'required|exists:tm_data_semester,id',
            'nilai_kkm' => 'required|numeric|min:0|max:100',
        ]);

        // Check for duplicate
        $existing = Kkm::where([
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
        ])->first();

        if ($existing) {
            return redirect()->back()->with('error', 'KKM untuk mata pelajaran, kelas, dan semester ini sudah ada');
        }

        Kkm::create([
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
            'nilai_kkm' => $request->nilai_kkm,
        ]);

        return redirect()->back()->with('success', 'Data KKM berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kkm = Kkm::findOrFail($id);

        $request->validate([
            'mata_pelajaran_id' => 'required|exists:tm_data_mata_pelajaran,id',
            'kelas_id' => 'required|exists:tm_data_kelas,id',
            'semester_id' => 'required|exists:tm_data_semester,id',
            'nilai_kkm' => 'required|numeric|min:0|max:100',
        ]);

        // Check for duplicate (exclude current record)
        $existing = Kkm::where([
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
        ])->where('id', '!=', $id)->first();

        if ($existing) {
            return redirect()->back()->with('error', 'KKM untuk mata pelajaran, kelas, dan semester ini sudah ada');
        }

        $kkm->update([
            'mata_pelajaran_id' => $request->mata_pelajaran_id,
            'kelas_id' => $request->kelas_id,
            'semester_id' => $request->semester_id,
            'nilai_kkm' => $request->nilai_kkm,
        ]);

        return redirect()->back()->with('success', 'Data KKM berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kkm = Kkm::findOrFail($id);
        
        $kkm->delete();

        return redirect()->back()->with('success', 'Data KKM berhasil dihapus');
    }
}
