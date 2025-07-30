<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EkstrakurikulerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ekstrakurikulers = Ekstrakurikuler::with('pembina.user')
            ->withCount('nilaiEkstrakurikuler')
            ->orderBy('nama_ekstrakurikuler', 'asc')
            ->get();
        
        $gurus = Guru::with('user')->get()->sortBy('nama_lengkap');
        
                $stats = [
            'total_ekstrakurikuler' => $ekstrakurikulers->count(),
            'ekstrakurikuler_aktif' => $ekstrakurikulers->where('status_aktif', true)->count(),
            'ekstrakurikuler_dengan_peserta' => $ekstrakurikulers->where('nilai_ekstrakurikuler_count', '>', 0)->count(),
        ];

        return Inertia::render('Master/Ekstrakurikuler/Index', [
            'ekstrakurikulers' => $ekstrakurikulers,
            'gurus' => $gurus,
            'stats' => $stats,
        ]);

        return Inertia::render('Master/Ekstrakurikuler/Index', [
            'ekstrakurikulers' => $ekstrakurikulers,
            'gurus' => $gurus,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_ekstrakurikuler' => 'required|string|max:255|unique:tm_data_ekstrakurikuler,nama_ekstrakurikuler',
            'deskripsi' => 'nullable|string|max:1000',
            'pembina_id' => 'required|exists:tm_data_guru,id',
            'status_aktif' => 'boolean',
        ]);

        Ekstrakurikuler::create([
            'nama_ekstrakurikuler' => $request->nama_ekstrakurikuler,
            'deskripsi' => $request->deskripsi,
            'pembina_id' => $request->pembina_id,
            'status_aktif' => $request->status_aktif ?? true,
        ]);

        return redirect()->back()->with('success', 'Data ekstrakurikuler berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $ekstrakurikuler = Ekstrakurikuler::findOrFail($id);

        $request->validate([
            'nama_ekstrakurikuler' => 'required|string|max:255|unique:tm_data_ekstrakurikuler,nama_ekstrakurikuler,' . $id,
            'deskripsi' => 'nullable|string|max:1000',
            'pembina_id' => 'required|exists:tm_data_guru,id',
            'status_aktif' => 'boolean',
        ]);

        $ekstrakurikuler->update([
            'nama_ekstrakurikuler' => $request->nama_ekstrakurikuler,
            'deskripsi' => $request->deskripsi,
            'pembina_id' => $request->pembina_id,
            'status_aktif' => $request->status_aktif ?? $ekstrakurikuler->status_aktif,
        ]);

        return redirect()->back()->with('success', 'Data ekstrakurikuler berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $ekstrakurikuler = Ekstrakurikuler::findOrFail($id);
        
        // Check if ekstrakurikuler has related data
        if ($ekstrakurikuler->nilaiEkstrakurikuler()->exists()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus ekstrakurikuler yang masih memiliki data nilai');
        }

        $ekstrakurikuler->delete();

        return redirect()->back()->with('success', 'Data ekstrakurikuler berhasil dihapus');
    }
}
