<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Siswa;
use App\Models\NilaiSiswa;
use App\Models\NilaiSikap;
use App\Models\NilaiEkstrakurikuler;
use App\Models\PrestasiSiswa;
use App\Models\Absensi;
use App\Models\Ekstrakurikuler;
use App\Models\MataPelajaran;
use App\Models\KomponenNilai;
use App\Models\Guru;
use App\Models\Semester;

class RaportDummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $siswa = Siswa::first();
        $semester = Semester::where('status_aktif', true)->first();
        $guru = Guru::first();

        if (!$siswa || !$semester || !$guru) {
            $this->command->error('Data siswa, semester, atau guru tidak ditemukan');
            return;
        }

        // 1. Buat Mata Pelajaran dummy jika belum ada
        $mataPelajaranList = [
            ['kode' => 'BIND', 'nama' => 'Bahasa Indonesia', 'jam' => 4],
            ['kode' => 'MTK', 'nama' => 'Matematika', 'jam' => 4],
            ['kode' => 'BING', 'nama' => 'Bahasa Inggris', 'jam' => 3],
            ['kode' => 'PROG', 'nama' => 'Pemrograman Dasar', 'jam' => 6],
            ['kode' => 'BD', 'nama' => 'Basis Data', 'jam' => 4],
            ['kode' => 'JK', 'nama' => 'Jaringan Komputer', 'jam' => 4],
            ['kode' => 'SO', 'nama' => 'Sistem Operasi', 'jam' => 3]
        ];

        foreach ($mataPelajaranList as $mapel) {
            MataPelajaran::firstOrCreate([
                'nama_mapel' => $mapel['nama']
            ], [
                'kode_mapel' => $mapel['kode'],
                'deskripsi' => 'Mata pelajaran ' . $mapel['nama'],
                'jam_pelajaran' => $mapel['jam']
            ]);
        }

        $mataPelajaran = MataPelajaran::take(7)->get();

        // 2. Buat Komponen Nilai untuk setiap mata pelajaran
        $this->command->info('Membuat komponen nilai...');
        foreach ($mataPelajaran as $mapel) {
            KomponenNilai::firstOrCreate([
                'mata_pelajaran_id' => $mapel->id,
                'semester_id' => $semester->id,
                'nama_komponen' => 'Ulangan Harian'
            ], [
                'bobot_persen' => 30.00
            ]);
        }

        // 3. Buat Nilai Akademik (Section A)
        $this->command->info('Membuat nilai akademik...');
        $nilaiSample = [88, 92, 82, 85, 90, 87, 84];
        
        foreach ($mataPelajaran as $index => $mapel) {
            // Cari komponen nilai untuk mata pelajaran ini
            $komponenNilai = KomponenNilai::where('mata_pelajaran_id', $mapel->id)
                ->where('semester_id', $semester->id)
                ->first();
                
            if ($komponenNilai) {
                NilaiSiswa::updateOrCreate([
                    'siswa_id' => $siswa->id,
                    'mata_pelajaran_id' => $mapel->id,
                    'semester_id' => $semester->id,
                    'komponen_nilai_id' => $komponenNilai->id,
                ], [
                    'guru_id' => $guru->id,
                    'nilai' => $nilaiSample[$index] ?? 85,
                    'tanggal_input' => now(),
                    'catatan' => 'Nilai bagus, pertahankan prestasi'
                ]);
            }
        }

        // 4. Buat Nilai Sikap (Section B)
        $this->command->info('Membuat nilai sikap...');
        NilaiSikap::updateOrCreate([
            'siswa_id' => $siswa->id,
            'semester_id' => $semester->id,
        ], [
            'guru_id' => $guru->id,
            'nilai_spiritual' => 'A',
            'deskripsi_spiritual' => 'Siswa menunjukkan sikap spiritual yang sangat baik, rajin beribadah dan menghormati agama.',
            'nilai_sosial' => 'B',
            'deskripsi_sosial' => 'Siswa menunjukkan sikap sosial yang baik, mampu bekerjasama dengan teman dan menghormati orang lain.',
        ]);

        // 5. Buat Ekstrakurikuler dan Nilainya (Section C)
        $this->command->info('Membuat data ekstrakurikuler...');
        $ekstraList = [
            ['nama' => 'Pramuka', 'nilai' => 'A', 'deskripsi' => 'Aktif mengikuti kegiatan kepramukaan dengan baik'],
            ['nama' => 'Rohis', 'nilai' => 'B', 'deskripsi' => 'Mengikuti kegiatan keagamaan dengan antusias']
        ];

        foreach ($ekstraList as $ekstra) {
            $ekstrakurikuler = Ekstrakurikuler::firstOrCreate([
                'nama_ekstrakurikuler' => $ekstra['nama']
            ], [
                'deskripsi' => 'Kegiatan ' . strtolower($ekstra['nama']),
                'pembina_id' => $guru->id,
                'status_aktif' => true
            ]);

            NilaiEkstrakurikuler::updateOrCreate([
                'siswa_id' => $siswa->id,
                'ekstrakurikuler_id' => $ekstrakurikuler->id,
                'semester_id' => $semester->id,
            ], [
                'guru_id' => $guru->id,
                'nilai' => $ekstra['nilai'],
                'deskripsi' => $ekstra['deskripsi'],
            ]);
        }

        // 6. Buat Prestasi (Section D)
        $this->command->info('Membuat data prestasi...');
        $prestasiList = [
            [
                'jenis' => 'Akademik',
                'nama' => 'Juara 2 Lomba Pemrograman',
                'tingkat' => 'kabupaten',
                'peringkat' => '2',
                'tanggal' => '2024-10-15',
                'deskripsi' => 'Mendapat juara 2 dalam lomba programming tingkat kabupaten'
            ],
            [
                'jenis' => 'Olahraga',
                'nama' => 'Juara 1 Futsal',
                'tingkat' => 'sekolah',
                'peringkat' => '1',
                'tanggal' => '2024-09-20',
                'deskripsi' => 'Menjadi juara 1 turnamen futsal antar kelas'
            ]
        ];

        foreach ($prestasiList as $prestasi) {
            PrestasiSiswa::updateOrCreate([
                'siswa_id' => $siswa->id,
                'semester_id' => $semester->id,
                'nama_prestasi' => $prestasi['nama'],
            ], [
                'jenis_prestasi' => $prestasi['jenis'],
                'tingkat' => $prestasi['tingkat'],
                'peringkat' => $prestasi['peringkat'],
                'tanggal_prestasi' => $prestasi['tanggal'],
                'deskripsi' => $prestasi['deskripsi'],
            ]);
        }

        // 7. Buat Data Absensi (Section E)
        $this->command->info('Membuat data absensi...');
        Absensi::updateOrCreate([
            'siswa_id' => $siswa->id,
            'semester_id' => $semester->id,
        ], [
            'jumlah_sakit' => 2,
            'jumlah_izin' => 1,
            'jumlah_tanpa_keterangan' => 0,
        ]);

        $this->command->info('✅ Seeder RaportDummyData berhasil dijalankan!');
        $this->command->info('📋 Data yang dibuat:');
        $this->command->info('   - Nilai Akademik: ' . NilaiSiswa::where('siswa_id', $siswa->id)->count() . ' mata pelajaran');
        $this->command->info('   - Nilai Sikap: ' . NilaiSikap::where('siswa_id', $siswa->id)->count() . ' record');
        $this->command->info('   - Ekstrakurikuler: ' . NilaiEkstrakurikuler::where('siswa_id', $siswa->id)->count() . ' kegiatan');
        $this->command->info('   - Prestasi: ' . PrestasiSiswa::where('siswa_id', $siswa->id)->count() . ' prestasi');
        $this->command->info('   - Absensi: ' . Absensi::where('siswa_id', $siswa->id)->count() . ' record');
    }
}
