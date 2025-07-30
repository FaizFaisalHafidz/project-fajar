<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LaporanAbsensiExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class LaporanAbsensiController extends Controller
{
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        $kelasList = Kelas::with('jurusan')->get();
        
        // Default tanggal range (bulan ini)
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        
        // Perhatikan: Model Absensi hanya punya siswa_id dan semester_id, tidak ada tanggal atau status_kehadiran
        // Kita perlu menyesuaikan dengan struktur tabel yang sebenarnya
        $query = Absensi::with(['siswa.user', 'siswa.kelas.jurusan', 'semester'])
            ->where('semester_id', $semesterAktif->id);
            
        if ($request->has('kelas_id') && $request->kelas_id) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }
        
        $absensi = $query->orderBy('created_at', 'desc')
                        ->orderBy('siswa_id')
                        ->get();
        
        // Summary statistics berdasarkan kolom yang ada: jumlah_sakit, jumlah_izin, jumlah_tanpa_keterangan
        $totalSakit = $absensi->sum('jumlah_sakit');
        $totalIzin = $absensi->sum('jumlah_izin');
        $totalAlpha = $absensi->sum('jumlah_tanpa_keterangan');
        $totalKeseluruhan = $totalSakit + $totalIzin + $totalAlpha;
        
        $summary = [
            'total_keseluruhan' => $totalKeseluruhan,
            'total_hadir' => 0, // Tidak ada data hadir di model Absensi
            'total_izin' => $totalIzin,
            'total_sakit' => $totalSakit,
            'total_alpha' => $totalAlpha,
            'persentase_hadir' => 0,
            'persentase_izin' => $totalKeseluruhan > 0 ? round(($totalIzin / $totalKeseluruhan) * 100, 2) : 0,
            'persentase_sakit' => $totalKeseluruhan > 0 ? round(($totalSakit / $totalKeseluruhan) * 100, 2) : 0,
            'persentase_alpha' => $totalKeseluruhan > 0 ? round(($totalAlpha / $totalKeseluruhan) * 100, 2) : 0,
        ];
        
        // Group by siswa untuk rekap per siswa
        $rekapPerSiswa = $absensi->map(function($item) {
            return [
                'siswa' => $item->siswa,
                'total_hadir' => 0, // Tidak ada data hadir
                'total_izin' => $item->jumlah_izin,
                'total_sakit' => $item->jumlah_sakit,
                'total_alpha' => $item->jumlah_tanpa_keterangan,
                'total_keseluruhan' => $item->jumlah_izin + $item->jumlah_sakit + $item->jumlah_tanpa_keterangan,
                'persentase_kehadiran' => 0 // Tidak bisa dihitung tanpa data hadir
            ];
        });
        
        return Inertia::render('Laporan/LaporanAbsensi', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'kelasList' => $kelasList,
            'absensi' => $absensi,
            'rekapPerSiswa' => $rekapPerSiswa,
            'summary' => $summary,
            'filters' => array_merge(
                $request->only(['kelas_id', 'status_kehadiran']),
                ['start_date' => $startDate, 'end_date' => $endDate]
            )
        ]);
    }
    
    public function export(Request $request)
    {
        $format = $request->get('format', 'excel');
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        // Default tanggal range
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        
        // Filter data sama seperti di index
        $query = Absensi::with(['siswa.user', 'siswa.kelas.jurusan', 'semester'])
            ->where('semester_id', $semesterAktif->id);
            
        if ($request->has('kelas_id') && $request->kelas_id) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }
        
        $absensi = $query->orderBy('created_at', 'desc')->get();
        
        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.laporan-absensi', [
                'absensi' => $absensi,
                'tahunAjaran' => $tahunAjaranAktif,
                'semester' => $semesterAktif,
                'filters' => array_merge(
                    $request->only(['kelas_id', 'status_kehadiran']),
                    ['start_date' => $startDate, 'end_date' => $endDate]
                )
            ]);
            
            return $pdf->download('laporan-absensi-' . date('Y-m-d') . '.pdf');
        }
        
        return Excel::download(
            new LaporanAbsensiExport($absensi, $tahunAjaranAktif, $semesterAktif),
            'laporan-absensi-' . date('Y-m-d') . '.xlsx'
        );
    }
}
