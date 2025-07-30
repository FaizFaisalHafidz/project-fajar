<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JurusanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jurusans = Jurusan::withCount('kelas')
            ->orderBy('kode_jurusan', 'asc')
            ->get();
        
        $stats = [
            'total_jurusan' => $jurusans->count(),
            'jurusan_dengan_kelas' => $jurusans->where('kelas_count', '>', 0)->count(),
            'jurusan_tanpa_kelas' => $jurusans->where('kelas_count', 0)->count(),
        ];

        return Inertia::render('Master/Jurusan/Index', [
            'jurusans' => $jurusans,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kode_jurusan' => 'required|string|max:10|unique:tm_data_jurusan,kode_jurusan',
            'nama_jurusan' => 'required|string|max:255|unique:tm_data_jurusan,nama_jurusan',
            'deskripsi' => 'nullable|string|max:1000',
        ]);

        Jurusan::create([
            'kode_jurusan' => strtoupper($request->kode_jurusan),
            'nama_jurusan' => $request->nama_jurusan,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'Data jurusan berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $jurusan = Jurusan::findOrFail($id);

        $request->validate([
            'kode_jurusan' => 'required|string|max:10|unique:tm_data_jurusan,kode_jurusan,' . $id,
            'nama_jurusan' => 'required|string|max:255|unique:tm_data_jurusan,nama_jurusan,' . $id,
            'deskripsi' => 'nullable|string|max:1000',
        ]);

        $jurusan->update([
            'kode_jurusan' => strtoupper($request->kode_jurusan),
            'nama_jurusan' => $request->nama_jurusan,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'Data jurusan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $jurusan = Jurusan::findOrFail($id);
        
        // Check if jurusan has related data (kelas)
        if ($jurusan->kelas()->exists()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus jurusan yang masih memiliki kelas terkait');
        }

        $jurusan->delete();

        return redirect()->back()->with('success', 'Data jurusan berhasil dihapus');
    }
}
