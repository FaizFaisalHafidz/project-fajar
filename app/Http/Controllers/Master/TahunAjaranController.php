<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class TahunAjaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tahunAjaran = TahunAjaran::orderBy('nama_tahun_ajaran', 'desc')->get();
        
        $stats = [
            'total_tahun_ajaran' => $tahunAjaran->count(),
            'tahun_aktif' => $tahunAjaran->where('status_aktif', true)->count(),
            'tahun_nonaktif' => $tahunAjaran->where('status_aktif', false)->count(),
        ];

        return Inertia::render('Master/TahunAjaran/Index', [
            'tahunAjaran' => $tahunAjaran,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_tahun_ajaran' => 'required|string|max:255|unique:tm_data_tahun_ajaran,nama_tahun_ajaran',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status_aktif' => 'boolean',
        ]);

        // Jika status_aktif true, nonaktifkan tahun ajaran lainnya
        if ($request->status_aktif) {
            TahunAjaran::where('status_aktif', true)->update(['status_aktif' => false]);
        }

        TahunAjaran::create([
            'nama_tahun_ajaran' => $request->nama_tahun_ajaran,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'status_aktif' => $request->status_aktif ?? false,
        ]);

        return redirect()->back()->with('success', 'Data tahun ajaran berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tahunAjaran = TahunAjaran::findOrFail($id);

        $request->validate([
            'nama_tahun_ajaran' => 'required|string|max:255|unique:tm_data_tahun_ajaran,nama_tahun_ajaran,' . $id,
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status_aktif' => 'boolean',
        ]);

        // Jika status_aktif true, nonaktifkan tahun ajaran lainnya
        if ($request->status_aktif) {
            TahunAjaran::where('status_aktif', true)->where('id', '!=', $id)->update(['status_aktif' => false]);
        }

        $tahunAjaran->update([
            'nama_tahun_ajaran' => $request->nama_tahun_ajaran,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'status_aktif' => $request->status_aktif ?? false,
        ]);

        return redirect()->back()->with('success', 'Data tahun ajaran berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tahunAjaran = TahunAjaran::findOrFail($id);
        
        // Check if tahun ajaran has related data
        if ($tahunAjaran->semesters()->exists() || $tahunAjaran->kelas()->exists()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus tahun ajaran yang masih memiliki data terkait');
        }

        $tahunAjaran->delete();

        return redirect()->back()->with('success', 'Data tahun ajaran berhasil dihapus');
    }

    /**
     * Set active tahun ajaran
     */
    public function setActive($id)
    {
        // Nonaktifkan semua tahun ajaran
        TahunAjaran::where('status_aktif', true)->update(['status_aktif' => false]);
        
        // Aktifkan tahun ajaran yang dipilih
        $tahunAjaran = TahunAjaran::findOrFail($id);
        $tahunAjaran->update(['status_aktif' => true]);

        return redirect()->back()->with('success', 'Tahun ajaran berhasil diaktifkan');
    }
}
