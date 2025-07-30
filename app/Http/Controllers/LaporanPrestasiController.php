<?php

namespace App\Http\Controllers;

use App\Models\PrestasiSiswa;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LaporanPrestasiExport;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanPrestasiController extends Controller
{
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        $kelasList = Kelas::with('jurusan')->get();
        
        // Filter data - perhatikan PrestasiSiswa tidak punya tahun_ajaran_id, hanya semester_id
        $query = PrestasiSiswa::with(['siswa.user', 'siswa.kelas.jurusan', 'semester'])
            ->where('semester_id', $semesterAktif->id);
            
        if ($request->has('kelas_id') && $request->kelas_id) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }
        
        if ($request->has('tingkat_lomba') && $request->tingkat_lomba) {
            // Dari model PrestasiSiswa, kolom yang benar adalah 'tingkat', bukan 'tingkat_lomba'
            $query->where('tingkat', $request->tingkat_lomba);
        }
        
        if ($request->has('jenis_prestasi') && $request->jenis_prestasi) {
            $query->where('jenis_prestasi', $request->jenis_prestasi);
        }
        
        $prestasi = $query->orderBy('tanggal_prestasi', 'desc')->get();
        
        // Summary statistics
        $summary = [
            'total_prestasi' => $prestasi->count(),
            'prestasi_internasional' => $prestasi->where('tingkat', 'Internasional')->count(),
            'prestasi_nasional' => $prestasi->where('tingkat', 'Nasional')->count(),
            'prestasi_provinsi' => $prestasi->where('tingkat', 'Provinsi')->count(),
            'prestasi_kabupaten' => $prestasi->where('tingkat', 'Kabupaten')->count(),
            'prestasi_kecamatan' => $prestasi->where('tingkat', 'Kecamatan')->count(),
            'prestasi_sekolah' => $prestasi->where('tingkat', 'Sekolah')->count(),
        ];
        
        // Group by jenis prestasi
        $jenisPrestasiStats = $prestasi->groupBy('jenis_prestasi')->map(function($group) {
            return $group->count();
        });
        
        return Inertia::render('Laporan/LaporanPrestasi', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'kelasList' => $kelasList,
            'prestasi' => $prestasi,
            'summary' => $summary,
            'jenisPrestasiStats' => $jenisPrestasiStats,
            'filters' => $request->only(['kelas_id', 'tingkat_lomba', 'jenis_prestasi'])
        ]);
    }
    
    public function export(Request $request)
    {
        $format = $request->get('format', 'excel');
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        // Filter data sama seperti di index
        $query = PrestasiSiswa::with(['siswa.user', 'siswa.kelas.jurusan', 'semester'])
            ->where('semester_id', $semesterAktif->id);
            
        if ($request->has('kelas_id') && $request->kelas_id) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }
        
        if ($request->has('tingkat_lomba') && $request->tingkat_lomba) {
            // Kolom yang benar adalah 'tingkat'
            $query->where('tingkat', $request->tingkat_lomba);
        }
        
        if ($request->has('jenis_prestasi') && $request->jenis_prestasi) {
            $query->where('jenis_prestasi', $request->jenis_prestasi);
        }
        
        $prestasi = $query->orderBy('tanggal_prestasi', 'desc')->get();
        
        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.laporan-prestasi', [
                'prestasi' => $prestasi,
                'tahunAjaran' => $tahunAjaranAktif,
                'filters' => $request->only(['kelas_id', 'tingkat_lomba', 'jenis_prestasi'])
            ]);
            
            return $pdf->download('laporan-prestasi-' . date('Y-m-d') . '.pdf');
        }
        
        return Excel::download(
            new LaporanPrestasiExport($prestasi, $tahunAjaranAktif),
            'laporan-prestasi-' . date('Y-m-d') . '.xlsx'
        );
    }
}
