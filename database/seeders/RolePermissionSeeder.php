<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Dashboard
            'view-dashboard',
            
            // User Management
            'view-users',
            'create-users', 
            'edit-users',
            'delete-users',
            
            // Data Master
            'manage-tahun-akademik',
            'manage-semester',
            'manage-jurusan',
            'manage-kelas',
            'manage-mata-pelajaran',
            'manage-ekstrakurikuler',
            'manage-kkm',
            
            // People Management
            'manage-guru',
            'manage-siswa',
            'manage-wali-murid',
            
            // Teaching Assignment
            'view-penugasan-mengajar',
            'create-penugasan-mengajar',
            'edit-penugasan-mengajar',
            'delete-penugasan-mengajar',
            
            // Grades Management
            'view-nilai',
            'input-nilai-pengetahuan',
            'input-nilai-keterampilan',
            'input-nilai-absensi',
            'input-nilai-sosial',
            'input-nilai-spiritual',
            'input-nilai-ekstrakurikuler',
            'input-prestasi',
            'edit-nilai',
            'delete-nilai',
            'approve-nilai',
            
            // Homeroom Teacher
            'manage-wali-kelas',
            'view-siswa-kelas',
            'input-catatan-wali-kelas',
            'rekap-nilai-kelas',
            
            // Reports
            'view-raport',
            'generate-raport',
            'cetak-raport-sampul-1',
            'cetak-raport-sampul-2', 
            'cetak-raport-sampul-4',
            'cetak-raport-nilai',
            'cetak-prestasi-catatan',
            'export-laporan',
            
            // K-Means Clustering
            'view-clustering',
            'run-clustering',
            'manage-clustering-config',
            'view-cluster-profile',
            'view-rekomendasi',
            
            // Statistics & Monitoring
            'view-statistik',
            'view-monitoring',
            'view-analytics',
            
            // System Settings
            'manage-system-settings',
            'view-logs',
            'manage-backup',
            'reset-tahun-akademik',
            
            // Student & Parent specific
            'view-own-grades',
            'view-own-raport',
            'view-child-grades',
            'view-child-raport',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Super Admin - All permissions
        $superAdmin = Role::create(['name' => 'super-admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Admin Sekolah
        $adminSekolah = Role::create(['name' => 'admin-sekolah']);
        $adminSekolah->givePermissionTo([
            'view-dashboard',
            'view-users', 'create-users', 'edit-users', 'delete-users',
            'manage-tahun-akademik', 'manage-semester', 'manage-jurusan', 
            'manage-kelas', 'manage-mata-pelajaran', 'manage-ekstrakurikuler', 'manage-kkm',
            'manage-guru', 'manage-siswa', 'manage-wali-murid',
            'view-penugasan-mengajar', 'create-penugasan-mengajar', 'edit-penugasan-mengajar', 'delete-penugasan-mengajar',
            'view-nilai', 'approve-nilai',
            'view-raport', 'generate-raport', 'cetak-raport-sampul-1', 'cetak-raport-sampul-2', 
            'cetak-raport-sampul-4', 'cetak-raport-nilai', 'cetak-prestasi-catatan', 'export-laporan',
            'view-clustering', 'run-clustering', 'manage-clustering-config', 'view-cluster-profile',
            'view-statistik', 'view-monitoring', 'view-analytics',
            'manage-system-settings', 'view-logs', 'manage-backup', 'reset-tahun-akademik',
        ]);

        // Kepala Sekolah
        $kepalaSekolah = Role::create(['name' => 'kepala-sekolah']);
        $kepalaSekolah->givePermissionTo([
            'view-dashboard',
            'view-users',
            'view-nilai', 'approve-nilai',
            'view-raport', 'generate-raport', 'cetak-raport-sampul-1', 'cetak-raport-sampul-2', 
            'cetak-raport-sampul-4', 'cetak-raport-nilai', 'cetak-prestasi-catatan', 'export-laporan',
            'view-clustering', 'view-cluster-profile',
            'view-statistik', 'view-monitoring', 'view-analytics',
        ]);

        // Guru
        $guru = Role::create(['name' => 'guru']);
        $guru->givePermissionTo([
            'view-dashboard',
            'view-penugasan-mengajar',
            'view-nilai', 'input-nilai-pengetahuan', 'input-nilai-keterampilan', 
            'input-nilai-absensi', 'input-nilai-sosial', 'input-nilai-spiritual',
            'input-nilai-ekstrakurikuler', 'input-prestasi', 'edit-nilai',
            'view-raport', 'generate-raport', 'cetak-raport-sampul-1', 'cetak-raport-sampul-2', 
            'cetak-raport-sampul-4', 'cetak-raport-nilai', 'cetak-prestasi-catatan', 'export-laporan',
            'view-clustering', 'view-cluster-profile', 'view-rekomendasi',
        ]);

        // Wali Kelas
        $waliKelas = Role::create(['name' => 'wali-kelas']);
        $waliKelas->givePermissionTo([
            'view-dashboard',
            'view-penugasan-mengajar',
            'view-nilai', 'input-nilai-pengetahuan', 'input-nilai-keterampilan', 
            'input-nilai-absensi', 'input-nilai-sosial', 'input-nilai-spiritual',
            'input-nilai-ekstrakurikuler', 'input-prestasi', 'edit-nilai',
            'manage-wali-kelas', 'view-siswa-kelas', 'input-catatan-wali-kelas', 'rekap-nilai-kelas',
            'view-raport', 'generate-raport', 'cetak-raport-sampul-1', 'cetak-raport-sampul-2', 
            'cetak-raport-sampul-4', 'cetak-raport-nilai', 'cetak-prestasi-catatan', 'export-laporan',
            'view-clustering', 'view-cluster-profile', 'view-rekomendasi',
        ]);

        // Siswa
        $siswa = Role::create(['name' => 'siswa']);
        $siswa->givePermissionTo([
            'view-dashboard',
            'view-own-grades',
            'view-own-raport',
            'view-rekomendasi',
        ]);

        // Wali Murid / Orang Tua
        $waliMurid = Role::create(['name' => 'wali-murid']);
        $waliMurid->givePermissionTo([
            'view-dashboard',
            'view-child-grades',
            'view-child-raport',
        ]);
    }
}
