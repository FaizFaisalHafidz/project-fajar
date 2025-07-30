<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportDataExport implements WithMultipleSheets
{
    protected $data;
    protected $exportType;
    protected $tahunAjaran;

    public function __construct($data, $exportType, $tahunAjaran)
    {
        $this->data = $data;
        $this->exportType = $exportType;
        $this->tahunAjaran = $tahunAjaran;
    }

    public function sheets(): array
    {
        $sheets = [];
        
        if ($this->exportType === 'semua') {
            // Export semua data dalam sheet terpisah
            if (!empty($this->data['siswa'])) {
                $sheets[] = new SiswaExportSheet($this->data['siswa']);
            }
            if (!empty($this->data['guru'])) {
                $sheets[] = new GuruExportSheet($this->data['guru']);
            }
            if (!empty($this->data['nilai'])) {
                $sheets[] = new NilaiExportSheet($this->data['nilai']);
            }
            if (!empty($this->data['absensi'])) {
                $sheets[] = new AbsensiExportSheet($this->data['absensi']);
            }
            if (!empty($this->data['prestasi'])) {
                $sheets[] = new PrestasiExportSheet($this->data['prestasi']);
            }
        } else {
            // Export single type data
            switch ($this->exportType) {
                case 'siswa':
                    $sheets[] = new SiswaExportSheet($this->data);
                    break;
                case 'guru':
                    $sheets[] = new GuruExportSheet($this->data);
                    break;
                case 'nilai':
                    $sheets[] = new NilaiExportSheet($this->data);
                    break;
                case 'absensi':
                    $sheets[] = new AbsensiExportSheet($this->data);
                    break;
                case 'prestasi':
                    $sheets[] = new PrestasiExportSheet($this->data);
                    break;
            }
        }
        
        return $sheets;
    }
}

// Sheet classes for each data type
class SiswaExportSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }
    
    public function collection()
    {
        return $this->data;
    }
    
    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'NISN',
            'Nama Siswa',
            'Kelas',
            'Jurusan',
            'Jenis Kelamin',
            'Tahun Masuk',
            'Status',
        ];
    }
    
    public function map($siswa): array
    {
        static $no = 1;
        
        return [
            $no++,
            $siswa->nis,
            $siswa->nisn,
            $siswa->user->name,
            $siswa->kelas->nama_kelas,
            $siswa->kelas->jurusan->nama_jurusan,
            ucfirst($siswa->jenis_kelamin),
            $siswa->tahun_masuk,
            ucfirst($siswa->status_siswa),
        ];
    }
    
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
    
    public function title(): string
    {
        return 'Data Siswa';
    }
}

class GuruExportSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }
    
    public function collection()
    {
        return $this->data;
    }
    
    public function headings(): array
    {
        return [
            'No',
            'NIP',
            'Nama Guru',
            'Email',
            'No. Telepon',
            'Spesialisasi',
            'Wali Kelas',
        ];
    }
    
    public function map($guru): array
    {
        static $no = 1;
        
        return [
            $no++,
            $guru->nip,
            $guru->user->name,
            $guru->user->email,
            $guru->nomor_telepon,
            $guru->spesialisasi_mapel,
            $guru->kelasWali->isNotEmpty() ? $guru->kelasWali->first()->nama_kelas : 'Tidak',
        ];
    }
    
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
    
    public function title(): string
    {
        return 'Data Guru';
    }
}

class NilaiExportSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }
    
    public function collection()
    {
        return $this->data;
    }
    
    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Mata Pelajaran',
            'Komponen',
            'Nilai',
            'Tanggal Input',
        ];
    }
    
    public function map($nilai): array
    {
        static $no = 1;
        
        return [
            $no++,
            $nilai->siswa->nis,
            $nilai->siswa->user->name,
            $nilai->siswa->kelas->nama_kelas,
            $nilai->mataPelajaran->nama_mapel,
            $nilai->komponenNilai->nama_komponen,
            $nilai->nilai,
            \Carbon\Carbon::parse($nilai->tanggal_input)->format('d/m/Y'),
        ];
    }
    
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
    
    public function title(): string
    {
        return 'Data Nilai';
    }
}

class AbsensiExportSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }
    
    public function collection()
    {
        return $this->data;
    }
    
    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Sakit',
            'Izin',
            'Alpha',
            'Total',
        ];
    }
    
    public function map($absensi): array
    {
        static $no = 1;
        
        return [
            $no++,
            $absensi->siswa->nis,
            $absensi->siswa->user->name,
            $absensi->siswa->kelas->nama_kelas,
            $absensi->jumlah_sakit,
            $absensi->jumlah_izin,
            $absensi->jumlah_tanpa_keterangan,
            $absensi->jumlah_sakit + $absensi->jumlah_izin + $absensi->jumlah_tanpa_keterangan,
        ];
    }
    
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
    
    public function title(): string
    {
        return 'Data Absensi';
    }
}

class PrestasiExportSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }
    
    public function collection()
    {
        return $this->data;
    }
    
    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Nama Prestasi',
            'Jenis',
            'Tingkat',
            'Peringkat',
            'Tanggal',
        ];
    }
    
    public function map($prestasi): array
    {
        static $no = 1;
        
        return [
            $no++,
            $prestasi->siswa->nis,
            $prestasi->siswa->user->name,
            $prestasi->siswa->kelas->nama_kelas,
            $prestasi->nama_prestasi,
            $prestasi->jenis_prestasi,
            $prestasi->tingkat,
            $prestasi->peringkat,
            \Carbon\Carbon::parse($prestasi->tanggal_prestasi)->format('d/m/Y'),
        ];
    }
    
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
    
    public function title(): string
    {
        return 'Data Prestasi';
    }
}
