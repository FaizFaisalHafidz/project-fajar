<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\MataPelajaran;
use App\Models\NilaiSiswa;
use App\Models\Absensi;
use App\Models\PrestasiSiswa;
use App\Models\NilaiSikap;
use App\Models\NilaiEkstrakurikuler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ExportDataExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ExportDataController extends Controller
{
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        $kelasList = Kelas::with('jurusan')->get();
        $mataPelajaranList = MataPelajaran::all();
        
        // Summary data untuk dashboard
        $summary = [
            'total_siswa' => Siswa::where('status_siswa', 'aktif')->count(),
            'total_guru' => Guru::count(),
            'total_kelas' => Kelas::count(),
            'total_mata_pelajaran' => MataPelajaran::count(),
            'total_nilai' => NilaiSiswa::where('semester_id', $semesterAktif->id)->count(),
            'total_absensi' => Absensi::where('semester_id', $semesterAktif->id)->count(),
            'total_prestasi' => PrestasiSiswa::where('semester_id', $semesterAktif->id)->count(),
        ];
        
        // Data terkini untuk preview
        $recentData = [
            'nilai_terbaru' => NilaiSiswa::with(['siswa.user', 'mataPelajaran', 'komponenNilai'])
                ->where('semester_id', $semesterAktif->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'prestasi_terbaru' => PrestasiSiswa::with(['siswa.user'])
                ->where('semester_id', $semesterAktif->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
        ];
        
        return Inertia::render('Laporan/ExportData', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'kelasList' => $kelasList,
            'mataPelajaranList' => $mataPelajaranList,
            'summary' => $summary,
            'recentData' => $recentData,
        ]);
    }
    
    public function export(Request $request)
    {
        $request->validate([
            'export_type' => 'required|in:siswa,guru,nilai,absensi,prestasi,semua',
            'format' => 'required|in:excel,csv,pdf',
            'kelas_id' => 'nullable|exists:tm_data_kelas,id',
            'mata_pelajaran_id' => 'nullable|exists:tm_data_mata_pelajaran,id',
        ]);
        
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('status_aktif', true)->first();
        
        $exportType = $request->export_type;
        $format = $request->format;
        
        $data = [];
        $filename = 'export-data-' . date('Y-m-d');
        
        switch ($exportType) {
            case 'siswa':
                $query = Siswa::with(['user', 'kelas.jurusan'])
                    ->where('status_siswa', 'aktif');
                
                if ($request->kelas_id) {
                    $query->where('kelas_id', $request->kelas_id);
                }
                
                $data = $query->get();
                $filename = 'data-siswa-' . date('Y-m-d');
                break;
                
            case 'guru':
                $data = Guru::with(['user', 'kelasWali.jurusan', 'penugasanMengajar.mataPelajaran'])
                    ->get();
                $filename = 'data-guru-' . date('Y-m-d');
                break;
                
            case 'nilai':
                $query = NilaiSiswa::with(['siswa.user', 'siswa.kelas.jurusan', 'mataPelajaran', 'komponenNilai'])
                    ->where('semester_id', $semesterAktif->id);
                
                if ($request->kelas_id) {
                    $query->whereHas('siswa', function($q) use ($request) {
                        $q->where('kelas_id', $request->kelas_id);
                    });
                }
                
                if ($request->mata_pelajaran_id) {
                    $query->where('mata_pelajaran_id', $request->mata_pelajaran_id);
                }
                
                $data = $query->get();
                $filename = 'data-nilai-' . date('Y-m-d');
                break;
                
            case 'absensi':
                $query = Absensi::with(['siswa.user', 'siswa.kelas.jurusan', 'semester'])
                    ->where('semester_id', $semesterAktif->id);
                
                if ($request->kelas_id) {
                    $query->whereHas('siswa', function($q) use ($request) {
                        $q->where('kelas_id', $request->kelas_id);
                    });
                }
                
                $data = $query->get();
                $filename = 'data-absensi-' . date('Y-m-d');
                break;
                
            case 'prestasi':
                $query = PrestasiSiswa::with(['siswa.user', 'siswa.kelas.jurusan', 'semester'])
                    ->where('semester_id', $semesterAktif->id);
                
                if ($request->kelas_id) {
                    $query->whereHas('siswa', function($q) use ($request) {
                        $q->where('kelas_id', $request->kelas_id);
                    });
                }
                
                $data = $query->get();
                $filename = 'data-prestasi-' . date('Y-m-d');
                break;
                
            case 'semua':
                // Export semua data dalam satu file
                $data = [
                    'siswa' => Siswa::with(['user', 'kelas.jurusan'])->where('status_siswa', 'aktif')->get(),
                    'guru' => Guru::with(['user'])->get(),
                    'nilai' => NilaiSiswa::with(['siswa.user', 'mataPelajaran'])->where('semester_id', $semesterAktif->id)->get(),
                    'absensi' => Absensi::with(['siswa.user'])->where('semester_id', $semesterAktif->id)->get(),
                    'prestasi' => PrestasiSiswa::with(['siswa.user'])->where('semester_id', $semesterAktif->id)->get(),
                ];
                $filename = 'export-semua-data-' . date('Y-m-d');
                break;
        }
        
        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.export-data', [
                'data' => $data,
                'exportType' => $exportType,
                'tahunAjaran' => $tahunAjaranAktif,
                'semester' => $semesterAktif,
                'filters' => $request->only(['kelas_id', 'mata_pelajaran_id'])
            ]);
            
            return $pdf->download($filename . '.pdf');
        }
        
        $extension = $format === 'csv' ? 'csv' : 'xlsx';
        
        return Excel::download(
            new ExportDataExport($data, $exportType, $tahunAjaranAktif),
            $filename . '.' . $extension
        );
    }
}
