<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\OrangTua;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Jurusan;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin
        $superAdmin = User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@smkmohamadtoha.sch.id',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('super-admin');

        // Admin Sekolah
        $adminSekolah = User::create([
            'name' => 'Admin Sekolah',
            'email' => 'admin@smkmohamadtoha.sch.id',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $adminSekolah->assignRole('admin-sekolah');

        // Kepala Sekolah
        $kepalaSekolah = User::create([
            'name' => 'Drs. Ahmad Subagio, M.Pd',
            'email' => 'kepsek@smkmohamadtoha.sch.id',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $kepalaSekolah->assignRole('kepala-sekolah');

        // Get data yang diperlukan
        $tahunAjaran = TahunAjaran::where('status_aktif', true)->first();
        $jurusanTKJ = Jurusan::where('kode_jurusan', 'TKJ')->first();
        $jurusanRPL = Jurusan::where('kode_jurusan', 'RPL')->first();
        $jurusanMM = Jurusan::where('kode_jurusan', 'MM')->first();

        // Data Guru
        $dataGuru = [
            [
                'name' => 'Budi Santoso, S.Kom',
                'email' => 'budi.santoso@smkmohamadtoha.sch.id',
                'nip' => '197501012000031001',
                'nomor_telepon' => '081234567801',
                'spesialisasi_mapel' => 'Teknik Komputer dan Jaringan',
                'role' => 'guru'
            ],
            [
                'name' => 'Siti Nurhaliza, S.Pd',
                'email' => 'siti.nurhaliza@smkmohamadtoha.sch.id',
                'nip' => '198203152005042001',
                'nomor_telepon' => '081234567802',
                'spesialisasi_mapel' => 'Bahasa Indonesia',
                'role' => 'wali-kelas'
            ],
            [
                'name' => 'Muhammad Rizky, S.Kom',
                'email' => 'muhammad.rizky@smkmohamadtoha.sch.id',
                'nip' => '198906302010121001',
                'nomor_telepon' => '081234567803',
                'spesialisasi_mapel' => 'Rekayasa Perangkat Lunak',
                'role' => 'guru'
            ],
            [
                'name' => 'Dewi Sartika, S.Pd',
                'email' => 'dewi.sartika@smkmohamadtoha.sch.id',
                'nip' => '199001152012042001',
                'nomor_telepon' => '081234567804',
                'spesialisasi_mapel' => 'Matematika',
                'role' => 'wali-kelas'
            ],
            [
                'name' => 'Agus Priyanto, S.Sn',
                'email' => 'agus.priyanto@smkmohamadtoha.sch.id',
                'nip' => '198512202008031001',
                'nomor_telepon' => '081234567805',
                'spesialisasi_mapel' => 'Multimedia',
                'role' => 'guru'
            ],
            [
                'name' => 'Rina Wijayanti, S.Pd',
                'email' => 'rina.wijayanti@smkmohamadtoha.sch.id',
                'nip' => '199205102015042001',
                'nomor_telepon' => '081234567806',
                'spesialisasi_mapel' => 'Bahasa Inggris',
                'role' => 'wali-kelas'
            ],
        ];

        $guruIds = [];
        foreach ($dataGuru as $guru) {
            $user = User::create([
                'name' => $guru['name'],
                'email' => $guru['email'],
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
            $user->assignRole($guru['role']);

            $guruModel = Guru::create([
                'user_id' => $user->id,
                'nip' => $guru['nip'],
                'nomor_telepon' => $guru['nomor_telepon'],
                'alamat' => 'Alamat ' . $guru['name'],
                'tanggal_lahir' => '1985-01-01',
                'spesialisasi_mapel' => $guru['spesialisasi_mapel'],
            ]);

            $guruIds[] = $guruModel->id;
        }

        // Buat Kelas
        $dataKelas = [
            ['X TKJ 1', '10', $jurusanTKJ->id, $guruIds[1]], // Wali Kelas: Siti Nurhaliza
            ['X TKJ 2', '10', $jurusanTKJ->id, null],
            ['XI TKJ 1', '11', $jurusanTKJ->id, $guruIds[3]], // Wali Kelas: Dewi Sartika
            ['XI TKJ 2', '11', $jurusanTKJ->id, null],
            ['XII TKJ 1', '12', $jurusanTKJ->id, null],
            
            ['X RPL 1', '10', $jurusanRPL->id, null],
            ['X RPL 2', '10', $jurusanRPL->id, null],
            ['XI RPL 1', '11', $jurusanRPL->id, null],
            ['XI RPL 2', '11', $jurusanRPL->id, null],
            ['XII RPL 1', '12', $jurusanRPL->id, null],
            
            ['X MM 1', '10', $jurusanMM->id, $guruIds[5]], // Wali Kelas: Rina Wijayanti
            ['X MM 2', '10', $jurusanMM->id, null],
            ['XI MM 1', '11', $jurusanMM->id, null],
            ['XII MM 1', '12', $jurusanMM->id, null],
        ];

        $kelasIds = [];
        foreach ($dataKelas as $kelas) {
            $kelasModel = Kelas::create([
                'jurusan_id' => $kelas[2],
                'tahun_ajaran_id' => $tahunAjaran->id,
                'nama_kelas' => $kelas[0],
                'tingkat_kelas' => $kelas[1],
                'wali_kelas_id' => $kelas[3],
            ]);
            $kelasIds[] = $kelasModel->id;
        }

        // Data Siswa Sample
        $dataSiswa = [
            // Kelas X TKJ 1
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmadzauzi.siswa@smkmohamadtoha.sch.id',
                'nis' => '2024001',
                'nisn' => '1234567890',
                'kelas_id' => $kelasIds[0], // X TKJ 1
                'jenis_kelamin' => 'L',
                'tahun_masuk' => 2024,
            ],
            [
                'name' => 'Bella Safitri',
                'email' => 'bella.safitri.siswa@smkmohamadtoha.sch.id',
                'nis' => '2024002',
                'nisn' => '1234567891',
                'kelas_id' => $kelasIds[0], // X TKJ 1
                'jenis_kelamin' => 'P',
                'tahun_masuk' => 2024,
            ],
            [
                'name' => 'Cahya Nugraha',
                'email' => 'cahya.nugraha.siswa@smkmohamadtoha.sch.id',
                'nis' => '2024003',
                'nisn' => '1234567892',
                'kelas_id' => $kelasIds[0], // X TKJ 1
                'jenis_kelamin' => 'L',
                'tahun_masuk' => 2024,
            ],
            // Kelas X RPL 1
            [
                'name' => 'Dedi Kurniawan',
                'email' => 'dedi.kurniawan.siswa@smkmohamadtoha.sch.id',
                'nis' => '2024004',
                'nisn' => '1234567893',
                'kelas_id' => $kelasIds[5], // X RPL 1
                'jenis_kelamin' => 'L',
                'tahun_masuk' => 2024,
            ],
            [
                'name' => 'Eka Putri',
                'email' => 'eka.putri.siswa@smkmohamadtoha.sch.id',
                'nis' => '2024005',
                'nisn' => '1234567894',
                'kelas_id' => $kelasIds[5], // X RPL 1
                'jenis_kelamin' => 'P',
                'tahun_masuk' => 2024,
            ],
            // Kelas X MM 1
            [
                'name' => 'Fajar Ramadhan',
                'email' => 'fajar.ramadhan.siswa@smkmohamadtoha.sch.id',
                'nis' => '2024006',
                'nisn' => '1234567895',
                'kelas_id' => $kelasIds[10], // X MM 1
                'jenis_kelamin' => 'L',
                'tahun_masuk' => 2024,
            ],
        ];

        $siswaIds = [];
        foreach ($dataSiswa as $siswa) {
            $user = User::create([
                'name' => $siswa['name'],
                'email' => $siswa['email'],
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
            $user->assignRole('siswa');

            $siswaModel = Siswa::create([
                'user_id' => $user->id,
                'nis' => $siswa['nis'],
                'nisn' => $siswa['nisn'],
                'kelas_id' => $siswa['kelas_id'],
                'telepon_orangtua' => '081234567' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT),
                'alamat' => 'Alamat ' . $siswa['name'],
                'tanggal_lahir' => '2008-01-01',
                'jenis_kelamin' => $siswa['jenis_kelamin'],
                'tahun_masuk' => $siswa['tahun_masuk'],
                'status_siswa' => 'aktif',
            ]);

            $siswaIds[] = $siswaModel->id;
        }

        // Data Orang Tua / Wali Murid
        $dataOrangTua = [
            [
                'name' => 'Bapak Ahmad Suharto',
                'email' => 'ahmad.suharto.ortu@gmail.com',
                'siswa_id' => $siswaIds[0],
                'hubungan_keluarga' => 'ayah',
                'nomor_telepon' => '081234567901',
                'pekerjaan' => 'Wiraswasta',
            ],
            [
                'name' => 'Ibu Siti Aminah',
                'email' => 'siti.aminah.ortu@gmail.com',
                'siswa_id' => $siswaIds[1],
                'hubungan_keluarga' => 'ibu',
                'nomor_telepon' => '081234567902',
                'pekerjaan' => 'Ibu Rumah Tangga',
            ],
            [
                'name' => 'Bapak Cahya Setiawan',
                'email' => 'cahya.setiawan.ortu@gmail.com',
                'siswa_id' => $siswaIds[2],
                'hubungan_keluarga' => 'ayah',
                'nomor_telepon' => '081234567903',
                'pekerjaan' => 'PNS',
            ],
            [
                'name' => 'Ibu Desi Ratnasari',
                'email' => 'desi.ratnasari.ortu@gmail.com',
                'siswa_id' => $siswaIds[3],
                'hubungan_keluarga' => 'ibu',
                'nomor_telepon' => '081234567904',
                'pekerjaan' => 'Guru',
            ],
            [
                'name' => 'Bapak Eko Prasetyo',
                'email' => 'eko.prasetyo.ortu@gmail.com',
                'siswa_id' => $siswaIds[4],
                'hubungan_keluarga' => 'ayah',
                'nomor_telepon' => '081234567905',
                'pekerjaan' => 'Pegawai Swasta',
            ],
            [
                'name' => 'Ibu Fatimah',
                'email' => 'fatimah.ortu@gmail.com',
                'siswa_id' => $siswaIds[5],
                'hubungan_keluarga' => 'ibu',
                'nomor_telepon' => '081234567906',
                'pekerjaan' => 'Pedagang',
            ],
        ];

        foreach ($dataOrangTua as $ortu) {
            $user = User::create([
                'name' => $ortu['name'],
                'email' => $ortu['email'],
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
            $user->assignRole('wali-murid');

            OrangTua::create([
                'user_id' => $user->id,
                'siswa_id' => $ortu['siswa_id'],
                'hubungan_keluarga' => $ortu['hubungan_keluarga'],
                'nomor_telepon' => $ortu['nomor_telepon'],
                'pekerjaan' => $ortu['pekerjaan'],
                'alamat' => 'Alamat ' . $ortu['name'],
            ]);
        }
    }
}
