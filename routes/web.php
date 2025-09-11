<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\Master\TahunAjaranController;
use App\Http\Controllers\Master\SemesterController;
use App\Http\Controllers\Master\JurusanController;
use App\Http\Controllers\Master\KelasController;
use App\Http\Controllers\Master\MataPelajaranController;
use App\Http\Controllers\Master\EkstrakurikulerController;
use App\Http\Controllers\Master\KkmController;
use App\Http\Controllers\Pengaturan\PengaturanKelasController;
use App\Http\Controllers\Pengaturan\PengaturanWaliKelasController;
use App\Http\Controllers\Pengaturan\PengaturanMataPelajaranController;
use App\Http\Controllers\Pengaturan\ResetTahunAkademikController;
use App\Http\Controllers\PengajaranController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\WaliMuridController;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Routes untuk Manajemen Pengguna
    Route::prefix('pengguna')->name('pengguna.')->group(function () {
        Route::get('/', [PenggunaController::class, 'index'])->name('index');
        
        // CRUD Routes untuk Guru
        Route::post('/guru', [PenggunaController::class, 'storeGuru'])->name('guru.store');
        Route::put('/guru/{id}', [PenggunaController::class, 'updateGuru'])->name('guru.update');
        Route::delete('/guru/{id}', [PenggunaController::class, 'destroyGuru'])->name('guru.destroy');
        
        // CRUD Routes untuk Siswa
        Route::post('/siswa', [PenggunaController::class, 'storeSiswa'])->name('siswa.store');
        Route::put('/siswa/{id}', [PenggunaController::class, 'updateSiswa'])->name('siswa.update');
        Route::delete('/siswa/{id}', [PenggunaController::class, 'destroySiswa'])->name('siswa.destroy');
        
        // CRUD Routes untuk Wali Murid
        Route::post('/wali-murid', [PenggunaController::class, 'storeWaliMurid'])->name('wali-murid.store');
        Route::put('/wali-murid/{id}', [PenggunaController::class, 'updateWaliMurid'])->name('wali-murid.update');
        Route::delete('/wali-murid/{id}', [PenggunaController::class, 'destroyWaliMurid'])->name('wali-murid.destroy');
        
        // CRUD Routes untuk Admin
        Route::post('/admin', [PenggunaController::class, 'storeAdmin'])->name('admin.store');
        Route::put('/admin/{id}', [PenggunaController::class, 'updateAdmin'])->name('admin.update');
        Route::delete('/admin/{id}', [PenggunaController::class, 'destroyAdmin'])->name('admin.destroy');
        
        // Route::get('/guru', [PenggunaController::class, 'guru'])->name('guru.index');
        // Route::get('/siswa', [PenggunaController::class, 'siswa'])->name('siswa.index');
        // Route::get('/wali-murid', [PenggunaController::class, 'waliMurid'])->name('wali-murid.index');
        // Route::get('/admin', [PenggunaController::class, 'admin'])->name('admin.index');
    });

    // Routes untuk Data Master
    Route::prefix('master')->name('master.')->group(function () {
        // Tahun Akademik
        Route::resource('tahun-akademik', TahunAjaranController::class)->except(['show', 'create', 'edit']);
        Route::put('tahun-akademik/{id}/set-active', [TahunAjaranController::class, 'setActive'])->name('tahun-akademik.set-active');
        
        // Semester
        Route::resource('semester', SemesterController::class)->except(['show', 'create', 'edit']);
        Route::put('semester/{id}/set-active', [SemesterController::class, 'setActive'])->name('semester.set-active');
        
        // Jurusan
        Route::resource('jurusan', JurusanController::class)->except(['show', 'create', 'edit']);
        
        // Kelas
        Route::resource('kelas', KelasController::class)->except(['show', 'create', 'edit']);
        
        // Mata Pelajaran
        Route::resource('mata-pelajaran', MataPelajaranController::class)->except(['show', 'create', 'edit']);
        
        // Ekstrakurikuler
        Route::resource('ekstrakurikuler', EkstrakurikulerController::class)->except(['show', 'create', 'edit']);
        
        // KKM
        Route::resource('kkm', KkmController::class)->except(['show', 'create', 'edit']);
    });

    // Routes untuk Pengaturan Sistem
    Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
        // Pengaturan Kelas
        Route::get('kelas', [PengaturanKelasController::class, 'index'])->name('kelas.index');
        Route::put('kelas/{id}/wali', [PengaturanKelasController::class, 'updateWaliKelas'])->name('kelas.update-wali');
        Route::post('kelas/bulk-assign-wali', [PengaturanKelasController::class, 'bulkAssignWaliKelas'])->name('kelas.bulk-assign-wali');
        Route::post('kelas/reset-wali', [PengaturanKelasController::class, 'resetWaliKelas'])->name('kelas.reset-wali');
        
        // Pengaturan Wali Kelas
        Route::get('wali-kelas', [PengaturanWaliKelasController::class, 'index'])->name('wali-kelas.index');
        Route::post('wali-kelas/assign', [PengaturanWaliKelasController::class, 'assignWaliKelas'])->name('wali-kelas.assign');
        Route::delete('wali-kelas/{guruId}/remove', [PengaturanWaliKelasController::class, 'removeWaliKelas'])->name('wali-kelas.remove');
        Route::get('wali-kelas/{guruId}/detail', [PengaturanWaliKelasController::class, 'show'])->name('wali-kelas.detail');
        Route::get('wali-kelas/laporan', [PengaturanWaliKelasController::class, 'laporan'])->name('wali-kelas.laporan');
        
        // Pengaturan Mata Pelajaran
        Route::get('mata-pelajaran', [PengaturanMataPelajaranController::class, 'index'])->name('mata-pelajaran.index');
        Route::post('mata-pelajaran', [PengaturanMataPelajaranController::class, 'store'])->name('mata-pelajaran.store');
        Route::put('mata-pelajaran/penugasan/{id}', [PengaturanMataPelajaranController::class, 'updatePenugasan'])->name('mata-pelajaran.update-penugasan');
        Route::delete('mata-pelajaran/{id}', [PengaturanMataPelajaranController::class, 'destroy'])->name('mata-pelajaran.destroy');
        Route::post('mata-pelajaran/bulk-delete', [PengaturanMataPelajaranController::class, 'bulkDelete'])->name('mata-pelajaran.bulk-delete');
        Route::post('mata-pelajaran/bulk-assign', [PengaturanMataPelajaranController::class, 'bulkAssignPenugasan'])->name('mata-pelajaran.bulk-assign');
        Route::get('mata-pelajaran/guru/{guruId}', [PengaturanMataPelajaranController::class, 'getPenugasanByGuru'])->name('mata-pelajaran.by-guru');
        
        // Reset Tahun Akademik
        Route::get('reset-tahun', [ResetTahunAkademikController::class, 'index'])->name('reset-tahun.index');
        Route::post('reset-tahun/reset-all', [ResetTahunAkademikController::class, 'resetAllData'])->name('reset-tahun.reset-all');
        Route::post('reset-tahun/reset-selective', [ResetTahunAkademikController::class, 'resetSpecificData'])->name('reset-tahun.reset-selective');
        Route::post('reset-tahun/copy-from-previous', [ResetTahunAkademikController::class, 'copyFromPreviousYear'])->name('reset-tahun.copy-from-previous');
    });

    // Clustering Routes
    Route::prefix('clustering')->name('clustering.')->group(function () {
        Route::get('analisis', [App\Http\Controllers\Clustering\ClusteringController::class, 'analisis'])->name('analisis.index');
        Route::post('analisis/store-config', [App\Http\Controllers\Clustering\ClusteringController::class, 'storeConfig'])->name('analisis.store-config');
        Route::post('analisis/execute', [App\Http\Controllers\Clustering\ClusteringController::class, 'executeClustering'])->name('analisis.execute');
        Route::post('analisis/reset', [App\Http\Controllers\Clustering\ClusteringController::class, 'resetClustering'])->name('analisis.reset');
        
        Route::get('profil', [App\Http\Controllers\Clustering\ProfilClusterController::class, 'index'])->name('profil.index');
        Route::get('profil/{clusterId}', [App\Http\Controllers\Clustering\ProfilClusterController::class, 'show'])->name('profil.show');
        Route::put('profil/{id}', [App\Http\Controllers\Clustering\ProfilClusterController::class, 'update'])->name('profil.update');
        Route::get('profil/export', [App\Http\Controllers\Clustering\ProfilClusterController::class, 'export'])->name('profil.export');
        Route::post('profil/compare', [App\Http\Controllers\Clustering\ProfilClusterController::class, 'compare'])->name('profil.compare');

        // Visualisasi Routes
        Route::get('visualisasi', [App\Http\Controllers\Clustering\VisualisasiController::class, 'index'])->name('visualisasi.index');
        Route::get('visualisasi/export', [App\Http\Controllers\Clustering\VisualisasiController::class, 'export'])->name('visualisasi.export');

        // Konfigurasi Routes
        Route::get('konfigurasi', [App\Http\Controllers\Clustering\KonfigurasiController::class, 'index'])->name('konfigurasi.index');
        Route::post('konfigurasi', [App\Http\Controllers\Clustering\KonfigurasiController::class, 'store'])->name('konfigurasi.store');
        Route::get('konfigurasi/{id}', [App\Http\Controllers\Clustering\KonfigurasiController::class, 'show'])->name('konfigurasi.show');
        Route::put('konfigurasi/{id}', [App\Http\Controllers\Clustering\KonfigurasiController::class, 'update'])->name('konfigurasi.update');
        Route::delete('konfigurasi/{id}', [App\Http\Controllers\Clustering\KonfigurasiController::class, 'destroy'])->name('konfigurasi.destroy');
        Route::post('konfigurasi/{id}/activate', [App\Http\Controllers\Clustering\KonfigurasiController::class, 'activate'])->name('konfigurasi.activate');
        Route::post('konfigurasi/{id}/duplicate', [App\Http\Controllers\Clustering\KonfigurasiController::class, 'duplicate'])->name('konfigurasi.duplicate');
    });

    // Routes untuk Laporan Rekap Nilai
    Route::prefix('laporan')->name('laporan.')->group(function () {
        Route::get('rekap-nilai', [App\Http\Controllers\RekapNilaiController::class, 'index'])->name('rekap-nilai.index');
        Route::get('rekap-pengetahuan', [App\Http\Controllers\RekapNilaiController::class, 'rekapPengetahuan'])->name('rekap-pengetahuan');
        Route::get('rekap-keterampilan', [App\Http\Controllers\RekapNilaiController::class, 'rekapKeterampilan'])->name('rekap-keterampilan');
        Route::get('rekap-sikap', [App\Http\Controllers\RekapNilaiController::class, 'rekapSikap'])->name('rekap-sikap');
        Route::post('rekap-nilai/export', [App\Http\Controllers\RekapNilaiController::class, 'exportRekap'])->name('rekap-nilai.export');
        
        // Routes untuk Laporan Prestasi
        Route::get('prestasi', [App\Http\Controllers\LaporanPrestasiController::class, 'index'])->name('prestasi.index');
        Route::post('prestasi/export', [App\Http\Controllers\LaporanPrestasiController::class, 'export'])->name('prestasi.export');
        
        // Routes untuk Laporan Absensi
        Route::get('absensi', [App\Http\Controllers\LaporanAbsensiController::class, 'index'])->name('absensi.index');
        Route::post('absensi/export', [App\Http\Controllers\LaporanAbsensiController::class, 'export'])->name('absensi.export');
        
        // Routes untuk Export Data
        Route::get('export', [App\Http\Controllers\ExportDataController::class, 'index'])->name('export.index');
        Route::post('export/data', [App\Http\Controllers\ExportDataController::class, 'export'])->name('export.data');
    });

    // Routes untuk Statistik & Monitoring
    Route::prefix('statistik')->name('statistik.')->group(function () {
        Route::get('overview', [App\Http\Controllers\StatistikController::class, 'overview'])->name('overview');
        Route::get('trend', [App\Http\Controllers\StatistikController::class, 'trend'])->name('trend');
        Route::get('performa', [App\Http\Controllers\StatistikController::class, 'performa'])->name('performa');
        Route::get('monitoring', [App\Http\Controllers\StatistikController::class, 'monitoring'])->name('monitoring');
    });

    // Routes untuk Pengajaran (Guru)
    Route::prefix('pengajaran')->name('pengajaran.')->group(function () {
        Route::get('kelas', [App\Http\Controllers\PengajaranController::class, 'kelasMengajar'])->name('kelas');
        Route::get('jadwal', [App\Http\Controllers\PengajaranController::class, 'jadwalMengajar'])->name('jadwal');
        Route::get('penugasan', [App\Http\Controllers\PengajaranController::class, 'penugasan'])->name('penugasan');
    });

    // Routes untuk Penilaian (Guru)
    Route::prefix('penilaian')->name('penilaian.')->group(function () {
        Route::get('/', [App\Http\Controllers\PenilaianController::class, 'index'])->name('index');
        Route::post('nilai', [App\Http\Controllers\PenilaianController::class, 'storeNilai'])->name('nilai.store');
        Route::post('sikap', [App\Http\Controllers\PenilaianController::class, 'storeSikap'])->name('sikap.store');
    });

    // Routes untuk Wali Kelas
    Route::prefix('wali-kelas')->name('wali-kelas.')->group(function () {
        Route::get('/', [App\Http\Controllers\WaliKelasController::class, 'index'])->name('index');
        Route::get('/siswa', [App\Http\Controllers\WaliKelasController::class, 'siswa'])->name('siswa');
        Route::get('/rekap-nilai', [App\Http\Controllers\WaliKelasController::class, 'rekapNilai'])->name('rekap-nilai');
        Route::get('/monitoring-absensi', [App\Http\Controllers\WaliKelasController::class, 'monitoringAbsensi'])->name('monitoring-absensi');
        Route::get('/catatan', [App\Http\Controllers\WaliKelasController::class, 'catatan'])->name('catatan.index');
        Route::post('/catatan', [App\Http\Controllers\WaliKelasController::class, 'storeCatatan'])->name('catatan.store');
        Route::delete('/catatan/{id}', [App\Http\Controllers\WaliKelasController::class, 'deleteCatatan'])->name('catatan.destroy');
    });

    // Routes untuk Siswa
    Route::prefix('siswa')->name('siswa.')->group(function () {
        Route::get('/', [SiswaController::class, 'index'])->name('index');
        Route::get('/profil', [SiswaController::class, 'profil'])->name('profil');
        Route::get('/analisis', [SiswaController::class, 'analisis'])->name('analisis');
        Route::get('/rekomendasi', [SiswaController::class, 'rekomendasi'])->name('rekomendasi');
        Route::get('/progress', [SiswaController::class, 'progress'])->name('progress');
    });

    // Routes untuk Wali Murid
    Route::prefix('wali-murid')->name('wali-murid.')->group(function () {
        Route::get('/', [WaliMuridController::class, 'pantauAnak'])->name('pantau-anak');
        Route::get('/pantau-anak', [WaliMuridController::class, 'pantauAnak'])->name('pantau-anak.index');
    });

    // Routes untuk Raport
    Route::get('raport', [App\Http\Controllers\RaportController::class, 'index'])->name('raport.index');
    Route::post('raport/generate-lengkap', [App\Http\Controllers\RaportController::class, 'generateLengkap'])->name('raport.generate-lengkap');
    Route::post('raport/generate-per-siswa', [App\Http\Controllers\RaportController::class, 'generatePerSiswa'])->name('raport.generate-per-siswa');
    Route::post('raport/generate-per-kelas', [App\Http\Controllers\RaportController::class, 'generatePerKelas'])->name('raport.generate-per-kelas');
    Route::get('raport/preview', [App\Http\Controllers\RaportController::class, 'preview'])->name('raport.preview'); // For testing HTML preview
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';