<?php

namespace App\Http\Controllers\Pengaturan;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\TahunAjaran;
use App\Models\PenugasanMengajar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaturanKelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        $kelas = Kelas::with(['jurusan', 'waliKelas.user', 'penugasanMengajar.guru.user', 'penugasanMengajar.mataPelajaran'])
            ->where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->orderBy('tingkat_kelas', 'asc')
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $gurus = Guru::with('user')
            ->get()
            ->sortBy('user.name')
            ->values(); // Ensure it's a proper indexed array

        $stats = [
            'total_kelas' => $kelas->count(),
            'kelas_dengan_wali' => $kelas->whereNotNull('wali_kelas_id')->count(),
            'total_penugasan' => $kelas->sum(fn($k) => $k->penugasanMengajar->count()),
        ];

        return Inertia::render('Pengaturan/Kelas/Index', [
            'kelas' => $kelas,
            'gurus' => $gurus,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'stats' => $stats,
        ]);
    }

    /**
     * Update wali kelas
     */
    public function updateWaliKelas(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        
        $request->validate([
            'wali_kelas_id' => 'nullable|exists:tm_data_guru,id',
        ]);

        // Check if guru is already assigned as wali kelas for another class in the same academic year
        if ($request->wali_kelas_id) {
            $existingWali = Kelas::where('wali_kelas_id', $request->wali_kelas_id)
                ->where('tahun_ajaran_id', $kelas->tahun_ajaran_id)
                ->where('id', '!=', $id)
                ->first();

            if ($existingWali) {
                return redirect()->back()->with('error', 'Guru ini sudah menjadi wali kelas untuk kelas lain di tahun ajaran yang sama');
            }
        }

        $kelas->update([
            'wali_kelas_id' => $request->wali_kelas_id,
        ]);

        return redirect()->back()->with('success', 'Wali kelas berhasil diperbarui');
    }

    /**
     * Reset all wali kelas assignments
     */
    public function resetWaliKelas()
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        if (!$tahunAjaranAktif) {
            return redirect()->back()->with('error', 'Tidak ada tahun ajaran aktif');
        }

        Kelas::where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->update(['wali_kelas_id' => null]);

        return redirect()->back()->with('success', 'Semua penugasan wali kelas berhasil direset');
    }

    /**
     * Bulk assign wali kelas
     */
    public function bulkAssignWaliKelas(Request $request)
    {
        $request->validate([
            'assignments' => 'required|array',
            'assignments.*.kelas_id' => 'required|exists:tm_data_kelas,id',
            'assignments.*.wali_kelas_id' => 'required|exists:tm_data_guru,id',
        ]);

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        
        // Check for duplicate wali kelas assignments
        $waliKelasIds = collect($request->assignments)->pluck('wali_kelas_id');
        if ($waliKelasIds->count() !== $waliKelasIds->unique()->count()) {
            return redirect()->back()->with('error', 'Tidak boleh ada guru yang ditugaskan sebagai wali kelas lebih dari satu kelas');
        }

        foreach ($request->assignments as $assignment) {
            Kelas::where('id', $assignment['kelas_id'])
                ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
                ->update(['wali_kelas_id' => $assignment['wali_kelas_id']]);
        }

        return redirect()->back()->with('success', 'Penugasan wali kelas berhasil disimpan');
    }
}
