<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\Jurusan;
use App\Models\MataPelajaran;
use App\Models\Ekstrakurikuler;

class DataMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tahun Ajaran
        $tahunAjaran = TahunAjaran::create([
            'nama_tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => '2024-07-15',
            'tanggal_selesai' => '2025-06-30',
            'status_aktif' => true,
        ]);

        // Semester
        Semester::create([
            'tahun_ajaran_id' => $tahunAjaran->id,
            'nama_semester' => 'Ganjil',
            'tanggal_mulai' => '2024-07-15',
            'tanggal_selesai' => '2024-12-20',
            'status_aktif' => true,
        ]);

        Semester::create([
            'tahun_ajaran_id' => $tahunAjaran->id,
            'nama_semester' => 'Genap',
            'tanggal_mulai' => '2025-01-15',
            'tanggal_selesai' => '2025-06-30',
            'status_aktif' => false,
        ]);

        // Jurusan
        $jurusanTKJ = Jurusan::create([
            'kode_jurusan' => 'TKJ',
            'nama_jurusan' => 'Teknik Komputer dan Jaringan',
            'deskripsi' => 'Jurusan yang mempelajari tentang teknologi komputer dan jaringan',
        ]);

        $jurusanRPL = Jurusan::create([
            'kode_jurusan' => 'RPL',
            'nama_jurusan' => 'Rekayasa Perangkat Lunak',
            'deskripsi' => 'Jurusan yang mempelajari tentang pengembangan perangkat lunak',
        ]);

        $jurusanMM = Jurusan::create([
            'kode_jurusan' => 'MM',
            'nama_jurusan' => 'Multimedia',
            'deskripsi' => 'Jurusan yang mempelajari tentang desain grafis dan multimedia',
        ]);

        // Mata Pelajaran Umum
        $mataPelajaranUmum = [
            ['PKN', 'Pendidikan Kewarganegaraan', 2],
            ['PAI', 'Pendidikan Agama Islam', 3],
            ['BIND', 'Bahasa Indonesia', 4],
            ['MTK', 'Matematika', 4],
            ['SEJ', 'Sejarah Indonesia', 2],
            ['BING', 'Bahasa Inggris', 3],
            ['SBK', 'Seni Budaya', 2],
            ['PJOK', 'Pendidikan Jasmani dan Kesehatan', 3],
            ['PKWU', 'Prakarya dan Kewirausahaan', 2],
        ];

        foreach ($mataPelajaranUmum as $mapel) {
            MataPelajaran::create([
                'kode_mapel' => $mapel[0],
                'nama_mapel' => $mapel[1],
                'jam_pelajaran' => $mapel[2],
                'deskripsi' => 'Mata pelajaran umum untuk semua jurusan',
            ]);
        }

        // Mata Pelajaran Produktif TKJ
        $mataPelajaranTKJ = [
            ['TKJDAS', 'Dasar-dasar Teknik Komputer dan Jaringan', 6],
            ['TKJKOM', 'Komputer dan Jaringan Dasar', 8],
            ['TKJPEM', 'Pemrograman Dasar', 6],
            ['TKJSIS', 'Sistem Komputer', 4],
            ['TKJJAR', 'Administrasi Infrastruktur Jaringan', 8],
            ['TKJSRV', 'Administrasi Sistem Jaringan', 6],
            ['TKJTRB', 'Troubleshooting Jaringan', 4],
        ];

        foreach ($mataPelajaranTKJ as $mapel) {
            MataPelajaran::create([
                'kode_mapel' => $mapel[0],
                'nama_mapel' => $mapel[1],
                'jam_pelajaran' => $mapel[2],
                'deskripsi' => 'Mata pelajaran produktif jurusan TKJ',
            ]);
        }

        // Mata Pelajaran Produktif RPL
        $mataPelajaranRPL = [
            ['RPLDAS', 'Dasar-dasar Rekayasa Perangkat Lunak', 6],
            ['RPLPEM', 'Pemrograman Dasar', 8],
            ['RPLWEB', 'Pemrograman Web', 8],
            ['RPLMOB', 'Pemrograman Mobile', 6],
            ['RPLBAS', 'Basis Data', 6],
            ['RPLRPL', 'Rekayasa Perangkat Lunak', 4],
            ['RPLTES', 'Testing Software', 4],
        ];

        foreach ($mataPelajaranRPL as $mapel) {
            MataPelajaran::create([
                'kode_mapel' => $mapel[0],
                'nama_mapel' => $mapel[1],
                'jam_pelajaran' => $mapel[2],
                'deskripsi' => 'Mata pelajaran produktif jurusan RPL',
            ]);
        }

        // Mata Pelajaran Produktif MM
        $mataPelajaranMM = [
            ['MMDAS', 'Dasar-dasar Multimedia', 6],
            ['MMDES', 'Desain Grafis', 8],
            ['MMVID', 'Produksi Video', 6],
            ['MMANIM', 'Animasi 2D/3D', 8],
            ['MMFOTO', 'Fotografi', 4],
            ['MMWEB', 'Desain Web', 6],
            ['MMAUDIO', 'Audio Visual', 4],
        ];

        foreach ($mataPelajaranMM as $mapel) {
            MataPelajaran::create([
                'kode_mapel' => $mapel[0],
                'nama_mapel' => $mapel[1],
                'jam_pelajaran' => $mapel[2],
                'deskripsi' => 'Mata pelajaran produktif jurusan MM',
            ]);
        }

        // Ekstrakurikuler
        $ekstrakurikuler = [
            'Pramuka',
            'PMR (Palang Merah Remaja)',
            'OSIS',
            'Rohis',
            'English Club',
            'Programming Club',
            'Fotografi',
            'Futsal',
            'Basket',
            'Voli',
            'Badminton',
            'Karate',
            'Paskibra',
            'Band',
            'Teater',
        ];

        foreach ($ekstrakurikuler as $ekskul) {
            Ekstrakurikuler::create([
                'nama_ekstrakurikuler' => $ekskul,
                'deskripsi' => 'Kegiatan ekstrakurikuler ' . $ekskul,
                'status_aktif' => true,
            ]);
        }
    }
}
