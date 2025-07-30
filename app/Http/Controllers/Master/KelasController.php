<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Jurusan;
use App\Models\TahunAjaran;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kelas = Kelas::with(['jurusan', 'tahunAjaran', 'waliKelas.user'])
            ->withCount('siswa')
            ->orderBy('tahun_ajaran_id', 'desc')
            ->orderBy('tingkat_kelas', 'asc')
            ->orderBy('nama_kelas', 'asc')
            ->get();
        
        $jurusanList = Jurusan::orderBy('kode_jurusan', 'asc')->get();
        $tahunAjaranList = TahunAjaran::orderBy('nama_tahun_ajaran', 'desc')->get();
        $guruList = Guru::with('user')->get()->sortBy('nama_lengkap');
        
        $stats = [
            'total_kelas' => $kelas->count(),
            'kelas_dengan_siswa' => $kelas->where('siswa_count', '>', 0)->count(),
            'kelas_tanpa_wali' => $kelas->whereNull('wali_kelas_id')->count(),
        ];

        return Inertia::render('Master/Kelas/Index', [
            'kelas' => $kelas,
            'jurusanList' => $jurusanList,
            'tahunAjaranList' => $tahunAjaranList,
            'guruList' => $guruList,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'jurusan_id' => 'required|exists:tm_data_jurusan,id',
            'tahun_ajaran_id' => 'required|exists:tm_data_tahun_ajaran,id',
            'nama_kelas' => 'required|string|max:255',
            'tingkat_kelas' => 'required|integer|between:1,3',
            'wali_kelas_id' => 'nullable|exists:tm_data_guru,id',
        ]);

        // Validasi unik untuk kombinasi tahun_ajaran_id, tingkat_kelas, dan nama_kelas
        $exists = Kelas::where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->where('tingkat_kelas', $request->tingkat_kelas)
            ->where('nama_kelas', $request->nama_kelas)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Kelas ini sudah ada untuk tahun ajaran dan tingkat yang dipilih');
        }

        // Validasi wali kelas tidak boleh duplikat dalam tahun ajaran yang sama
        if ($request->wali_kelas_id) {
            $waliExists = Kelas::where('tahun_ajaran_id', $request->tahun_ajaran_id)
                ->where('wali_kelas_id', $request->wali_kelas_id)
                ->exists();

            if ($waliExists) {
                return redirect()->back()->with('error', 'Guru ini sudah menjadi wali kelas lain di tahun ajaran yang sama');
            }
        }

        Kelas::create([
            'jurusan_id' => $request->jurusan_id,
            'tahun_ajaran_id' => $request->tahun_ajaran_id,
            'nama_kelas' => $request->nama_kelas,
            'tingkat_kelas' => $request->tingkat_kelas,
            'wali_kelas_id' => $request->wali_kelas_id,
        ]);

        return redirect()->back()->with('success', 'Data kelas berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);

        $request->validate([
            'jurusan_id' => 'required|exists:tm_data_jurusan,id',
            'tahun_ajaran_id' => 'required|exists:tm_data_tahun_ajaran,id',
            'nama_kelas' => 'required|string|max:255',
            'tingkat_kelas' => 'required|integer|between:1,3',
            'wali_kelas_id' => 'nullable|exists:tm_data_guru,id',
        ]);

        // Validasi unik untuk kombinasi tahun_ajaran_id, tingkat_kelas, dan nama_kelas (kecuali diri sendiri)
        $exists = Kelas::where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->where('tingkat_kelas', $request->tingkat_kelas)
            ->where('nama_kelas', $request->nama_kelas)
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Kelas ini sudah ada untuk tahun ajaran dan tingkat yang dipilih');
        }

        // Validasi wali kelas tidak boleh duplikat dalam tahun ajaran yang sama (kecuali diri sendiri)
        if ($request->wali_kelas_id) {
            $waliExists = Kelas::where('tahun_ajaran_id', $request->tahun_ajaran_id)
                ->where('wali_kelas_id', $request->wali_kelas_id)
                ->where('id', '!=', $id)
                ->exists();

            if ($waliExists) {
                return redirect()->back()->with('error', 'Guru ini sudah menjadi wali kelas lain di tahun ajaran yang sama');
            }
        }

        $kelas->update([
            'jurusan_id' => $request->jurusan_id,
            'tahun_ajaran_id' => $request->tahun_ajaran_id,
            'nama_kelas' => $request->nama_kelas,
            'tingkat_kelas' => $request->tingkat_kelas,
            'wali_kelas_id' => $request->wali_kelas_id,
        ]);

        return redirect()->back()->with('success', 'Data kelas berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        
        // Check if kelas has related data
        if ($kelas->siswa()->exists() || $kelas->penugasanMengajar()->exists()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus kelas yang masih memiliki siswa atau penugasan mengajar');
        }

        $kelas->delete();

        return redirect()->back()->with('success', 'Data kelas berhasil dihapus');
    }
}
