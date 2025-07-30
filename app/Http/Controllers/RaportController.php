<?php

namespace App\Http\Controllers;

use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\NilaiSiswa;
use App\Models\NilaiSikap;
use App\Models\NilaiEkstrakurikuler;
use App\Models\PrestasiSiswa;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Facades\Storage;

class RaportController extends Controller
{
    /**
     * Display the raport page with tabs
     */
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get all kelas for selection
        $kelasList = Kelas::with(['jurusan'])
            ->orderBy('nama_kelas')
            ->get();

        // Get all siswa for selection
        $siswaList = Siswa::with(['user', 'kelas.jurusan'])
            ->whereHas('kelas')
            ->get()
            ->sortBy('user.name')
            ->values();

        return Inertia::render('Raport/Index', [
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'semesterAktif' => $semesterAktif,
            'kelasList' => $kelasList,
            'siswaList' => $siswaList,
        ]);
    }

    /**
     * Generate PDF raport lengkap
     */
    public function generateLengkap(Request $request)
    {
        $request->validate([
            'format' => 'required|in:pdf,excel',
            'include_prestasi' => 'boolean',
            'include_ekstrakurikuler' => 'boolean',
            'include_absensi' => 'boolean',
        ]);

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get all siswa with their complete data
        $siswaData = $this->getAllSiswaRaportData($semesterAktif->id, $request);

        if ($request->format === 'pdf') {
            return $this->generatePDF($siswaData, 'lengkap', $tahunAjaranAktif, $semesterAktif);
        } else {
            return $this->generateExcel($siswaData, 'lengkap', $tahunAjaranAktif, $semesterAktif);
        }
    }

    /**
     * Generate PDF raport per siswa
     */
    public function generatePerSiswa(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:tm_data_siswa,id',
            'format' => 'required|in:pdf,excel',
            'include_prestasi' => 'boolean',
            'include_ekstrakurikuler' => 'boolean',
            'include_absensi' => 'boolean',
        ]);

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get specific siswa data
        $siswaData = $this->getSiswaRaportData($request->siswa_id, $semesterAktif->id, $request);

        if ($request->format === 'pdf') {
            return $this->generatePDF([$siswaData], 'per-siswa', $tahunAjaranAktif, $semesterAktif);
        } else {
            return $this->generateExcel([$siswaData], 'per-siswa', $tahunAjaranAktif, $semesterAktif);
        }
    }

    /**
     * Generate PDF raport per kelas
     */
    public function generatePerKelas(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:tm_data_kelas,id',
            'format' => 'required|in:pdf,excel',
            'include_prestasi' => 'boolean',
            'include_ekstrakurikuler' => 'boolean',
            'include_absensi' => 'boolean',
        ]);

        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get all siswa in the class
        $siswaList = Siswa::where('kelas_id', $request->kelas_id)->get();
        $siswaData = [];

        foreach ($siswaList as $siswa) {
            $siswaData[] = $this->getSiswaRaportData($siswa->id, $semesterAktif->id, $request);
        }

        if ($request->format === 'pdf') {
            return $this->generatePDF($siswaData, 'per-kelas', $tahunAjaranAktif, $semesterAktif);
        } else {
            return $this->generateExcel($siswaData, 'per-kelas', $tahunAjaranAktif, $semesterAktif);
        }
    }

    /**
     * Get complete raport data for a student
     */
    private function getSiswaRaportData($siswaId, $semesterId, $request)
    {
        $siswa = Siswa::with(['user', 'kelas.jurusan'])->findOrFail($siswaId);

        // Get nilai pengetahuan dan keterampilan
        $nilaiAkademik = NilaiSiswa::with(['mataPelajaran', 'komponenNilai'])
            ->where('siswa_id', $siswaId)
            ->where('semester_id', $semesterId)
            ->get()
            ->groupBy('mata_pelajaran_id');

        // Get nilai sikap
        $nilaiSikap = [];
        if ($request->get('include_sikap', true)) {
            $nilaiSikap = NilaiSikap::with(['siswa'])
                ->where('siswa_id', $siswaId)
                ->where('semester_id', $semesterId)
                ->get();
        }

        // Get nilai ekstrakurikuler
        $nilaiEkstrakurikuler = [];
        if ($request->get('include_ekstrakurikuler', true)) {
            $nilaiEkstrakurikuler = NilaiEkstrakurikuler::with(['ekstrakurikuler'])
                ->where('siswa_id', $siswaId)
                ->where('semester_id', $semesterId)
                ->get();
        }

        // Get prestasi
        $prestasi = [];
        if ($request->get('include_prestasi', true)) {
            $prestasi = PrestasiSiswa::where('siswa_id', $siswaId)
                ->where('semester_id', $semesterId)
                ->get();
        }

        // Get absensi
        $absensi = [];
        if ($request->get('include_absensi', true)) {
            $absensi = Absensi::where('siswa_id', $siswaId)
                ->where('semester_id', $semesterId)
                ->first();
        }

        return [
            'siswa' => $siswa,
            'nilai_akademik' => $nilaiAkademik,
            'nilai_sikap' => $nilaiSikap,
            'nilai_ekstrakurikuler' => $nilaiEkstrakurikuler,
            'prestasi' => $prestasi,
            'absensi' => $absensi,
        ];
    }

    /**
     * Get all siswa raport data
     */
    private function getAllSiswaRaportData($semesterId, $request)
    {
        $siswaList = Siswa::with(['user', 'kelas.jurusan'])->get();
        $data = [];

        foreach ($siswaList as $siswa) {
            $data[] = $this->getSiswaRaportData($siswa->id, $semesterId, $request);
        }

        return $data;
    }

    /**
     * Preview raport HTML for testing
     */
    public function preview(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('status_aktif', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->where('status_aktif', true)
            ->first();

        // Get sample data (first student for preview)
        $firstSiswa = Siswa::with(['user', 'kelas.jurusan'])->first();
        
        if (!$firstSiswa) {
            return response()->json(['error' => 'No student data found for preview']);
        }
        
        $siswaData = $this->getSiswaRaportData($firstSiswa->id, $semesterAktif->id, $request);
        
        return view('pdf.raport', [
            'data' => [$siswaData],
            'type' => 'preview',
            'tahunAjaran' => $tahunAjaranAktif,
            'semester' => $semesterAktif,
            'generated_at' => now(),
        ]);
    }

    /**
     * Generate PDF
     */
    private function generatePDF($data, $type, $tahunAjaran, $semester)
    {
        try {
            // Generate HTML content
            $html = view('pdf.raport', [
                'data' => $data,
                'type' => $type,
                'tahunAjaran' => $tahunAjaran,
                'semester' => $semester,
                'generated_at' => now(),
            ])->render();
            
            $filename = "raport_{$type}_" . now()->format('Y-m-d_H-i-s') . '.pdf';
            $filePath = storage_path('app/public/raport/' . $filename);
            
            // Ensure directory exists
            if (!file_exists(dirname($filePath))) {
                mkdir(dirname($filePath), 0755, true);
            }
            
            // Try different Chrome paths for different systems
            $chromePaths = [
                '/usr/bin/google-chrome',           // Ubuntu/Debian
                '/usr/bin/chromium-browser',        // Ubuntu/Debian alternative
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
                '/usr/bin/chrome',                  // Some Linux distros
                'chrome',                           // Windows/PATH
                'chromium',                         // Alternative
            ];
            
            $browsershot = Browsershot::html($html)
                ->format('A4')
                ->margins(10, 10, 10, 10)
                ->showBackground()
                ->emulateMedia('print')
                ->waitUntilNetworkIdle()
                ->timeout(60);
                
            // Try to find available Chrome executable
            foreach ($chromePaths as $path) {
                if (file_exists($path) || (PHP_OS_FAMILY === 'Windows' && $path === 'chrome')) {
                    $browsershot->setChromePath($path);
                    break;
                }
            }
            
            $browsershot->save($filePath);
            
            // Return file download
            return response()->download($filePath, $filename, [
                'Content-Type' => 'application/pdf',
            ])->deleteFileAfterSend(true);
            
        } catch (\Exception $e) {
            // For development: return HTML version in new tab
            if (app()->environment('local')) {
                $html = view('pdf.raport', [
                    'data' => $data,
                    'type' => $type,
                    'tahunAjaran' => $tahunAjaran,
                    'semester' => $semester,
                    'generated_at' => now(),
                ])->render();
                
                return response($html)->header('Content-Type', 'text/html');
            }
            
            // Production: return error JSON
            return response()->json([
                'error' => 'PDF generation failed: ' . $e->getMessage(),
                'message' => 'Silakan coba lagi atau hubungi administrator',
                'debug_info' => [
                    'chrome_paths_checked' => $chromePaths ?? [],
                    'environment' => app()->environment(),
                ],
                'filename' => $filename ?? 'raport_error.pdf',
                'type' => $type,
                'tahun_ajaran' => $tahunAjaran->nama_tahun_ajaran,
                'semester' => $semester->nama_semester,
                'data_count' => count($data),
                'generated_at' => now()->format('Y-m-d H:i:s'),
            ], 500);
        }
    }

    /**
     * Generate Excel (placeholder for future implementation)
     */
    private function generateExcel($data, $type, $tahunAjaran, $semester)
    {
        // TODO: Implement Excel export using Laravel Excel
        return response()->json([
            'message' => 'Excel export akan segera tersedia',
            'data' => $data
        ]);
    }

    /**
     * Generate sample nilai for demo purposes
     */
    private function generateSampleNilai($siswaId)
    {
        $mataPelajaranList = [
            ['id' => 1, 'nama_mapel' => 'Bahasa Indonesia'],
            ['id' => 2, 'nama_mapel' => 'Matematika'],
            ['id' => 3, 'nama_mapel' => 'Bahasa Inggris'],
            ['id' => 4, 'nama_mapel' => 'Pemrograman Dasar'],
            ['id' => 5, 'nama_mapel' => 'Basis Data'],
        ];

        $nilaiSample = [88, 92, 82, 85, 90]; // Grade A-B range
        $nilaiAkademik = collect();

        foreach ($mataPelajaranList as $index => $mapel) {
            $nilai = (object) [
                'siswa_id' => $siswaId,
                'mata_pelajaran_id' => $mapel['id'],
                'nilai' => $nilaiSample[$index] ?? 85,
                'mataPelajaran' => (object) [
                    'id' => $mapel['id'],
                    'nama_mapel' => $mapel['nama_mapel']
                ]
            ];
            
            $nilaiAkademik->put($mapel['id'], collect([$nilai]));
        }

        return $nilaiAkademik;
    }
}
