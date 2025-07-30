<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataPelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mataPelajarans = MataPelajaran::withCount(['komponenNilai', 'penugasanMengajar', 'kkm'])
            ->orderBy('kode_mapel', 'asc')
            ->get();
        
        $stats = [
            'total_mata_pelajaran' => $mataPelajarans->count(),
            'mata_pelajaran_aktif' => $mataPelajarans->where('penugasan_mengajar_count', '>', 0)->count(),
            'mata_pelajaran_dengan_kkm' => $mataPelajarans->where('kkm_count', '>', 0)->count(),
        ];

        return Inertia::render('Master/MataPelajaran/Index', [
            'mataPelajarans' => $mataPelajarans,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kode_mapel' => 'required|string|max:20|unique:tm_data_mata_pelajaran,kode_mapel',
            'nama_mapel' => 'required|string|max:255|unique:tm_data_mata_pelajaran,nama_mapel',
            'deskripsi' => 'nullable|string|max:1000',
            'jam_pelajaran' => 'required|integer|min:1|max:10',
        ]);

        MataPelajaran::create([
            'kode_mapel' => strtoupper($request->kode_mapel),
            'nama_mapel' => $request->nama_mapel,
            'deskripsi' => $request->deskripsi,
            'jam_pelajaran' => $request->jam_pelajaran,
        ]);

        return redirect()->back()->with('success', 'Data mata pelajaran berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $mataPelajaran = MataPelajaran::findOrFail($id);

        $request->validate([
            'kode_mapel' => 'required|string|max:20|unique:tm_data_mata_pelajaran,kode_mapel,' . $id,
            'nama_mapel' => 'required|string|max:255|unique:tm_data_mata_pelajaran,nama_mapel,' . $id,
            'deskripsi' => 'nullable|string|max:1000',
            'jam_pelajaran' => 'required|integer|min:1|max:10',
        ]);

        $mataPelajaran->update([
            'kode_mapel' => strtoupper($request->kode_mapel),
            'nama_mapel' => $request->nama_mapel,
            'deskripsi' => $request->deskripsi,
            'jam_pelajaran' => $request->jam_pelajaran,
        ]);

        return redirect()->back()->with('success', 'Data mata pelajaran berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $mataPelajaran = MataPelajaran::findOrFail($id);
        
        // Check if mata pelajaran has related data
        if ($mataPelajaran->komponenNilai()->exists() || 
            $mataPelajaran->nilaiSiswa()->exists() || 
            $mataPelajaran->penugasanMengajar()->exists() || 
            $mataPelajaran->kkm()->exists()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus mata pelajaran yang masih memiliki data terkait');
        }

        $mataPelajaran->delete();

        return redirect()->back()->with('success', 'Data mata pelajaran berhasil dihapus');
    }
}
