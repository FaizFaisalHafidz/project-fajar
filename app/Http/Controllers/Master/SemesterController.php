<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $semesters = Semester::with('tahunAjaran')
            ->orderBy('tahun_ajaran_id', 'desc')
            ->orderBy('nama_semester', 'asc')
            ->get();
        
        $tahunAjaranList = TahunAjaran::orderBy('nama_tahun_ajaran', 'desc')->get();
        
        $stats = [
            'total_semester' => $semesters->count(),
            'semester_aktif' => $semesters->where('status_aktif', true)->count(),
            'semester_nonaktif' => $semesters->where('status_aktif', false)->count(),
        ];

        return Inertia::render('Master/Semester/Index', [
            'semesters' => $semesters,
            'tahunAjaranList' => $tahunAjaranList,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tahun_ajaran_id' => 'required|exists:tm_data_tahun_ajaran,id',
            'nama_semester' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status_aktif' => 'boolean',
        ]);

        // Validasi unik untuk kombinasi tahun_ajaran_id dan nama_semester
        $exists = Semester::where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->where('nama_semester', $request->nama_semester)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Semester ini sudah ada untuk tahun ajaran yang dipilih');
        }

        // Jika status_aktif true, nonaktifkan semester lainnya untuk tahun ajaran yang sama
        if ($request->status_aktif) {
            Semester::where('tahun_ajaran_id', $request->tahun_ajaran_id)
                ->where('status_aktif', true)
                ->update(['status_aktif' => false]);
        }

        Semester::create([
            'tahun_ajaran_id' => $request->tahun_ajaran_id,
            'nama_semester' => $request->nama_semester,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'status_aktif' => $request->status_aktif ?? false,
        ]);

        return redirect()->back()->with('success', 'Data semester berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $semester = Semester::findOrFail($id);

        $request->validate([
            'tahun_ajaran_id' => 'required|exists:tm_data_tahun_ajaran,id',
            'nama_semester' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status_aktif' => 'boolean',
        ]);

        // Validasi unik untuk kombinasi tahun_ajaran_id dan nama_semester (kecuali diri sendiri)
        $exists = Semester::where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->where('nama_semester', $request->nama_semester)
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Semester ini sudah ada untuk tahun ajaran yang dipilih');
        }

        // Jika status_aktif true, nonaktifkan semester lainnya untuk tahun ajaran yang sama
        if ($request->status_aktif) {
            Semester::where('tahun_ajaran_id', $request->tahun_ajaran_id)
                ->where('status_aktif', true)
                ->where('id', '!=', $id)
                ->update(['status_aktif' => false]);
        }

        $semester->update([
            'tahun_ajaran_id' => $request->tahun_ajaran_id,
            'nama_semester' => $request->nama_semester,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'status_aktif' => $request->status_aktif ?? false,
        ]);

        return redirect()->back()->with('success', 'Data semester berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $semester = Semester::findOrFail($id);
        
        // Check if semester has related data
        if ($semester->komponenNilai()->exists() || $semester->nilaiSiswa()->exists()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus semester yang masih memiliki data terkait');
        }

        $semester->delete();

        return redirect()->back()->with('success', 'Data semester berhasil dihapus');
    }

    /**
     * Set active semester
     */
    public function setActive($id)
    {
        $semester = Semester::findOrFail($id);
        
        // Nonaktifkan semua semester untuk tahun ajaran yang sama
        Semester::where('tahun_ajaran_id', $semester->tahun_ajaran_id)
            ->where('status_aktif', true)
            ->update(['status_aktif' => false]);
        
        // Aktifkan semester yang dipilih
        $semester->update(['status_aktif' => true]);

        return redirect()->back()->with('success', 'Semester berhasil diaktifkan');
    }
}
