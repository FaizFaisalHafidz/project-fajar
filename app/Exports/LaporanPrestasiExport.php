<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanPrestasiExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $prestasi;
    protected $tahunAjaran;

    public function __construct($prestasi, $tahunAjaran)
    {
        $this->prestasi = $prestasi;
        $this->tahunAjaran = $tahunAjaran;
    }

    public function collection()
    {
        return $this->prestasi;
    }

    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Jurusan',
            'Nama Prestasi',
            'Jenis Prestasi',
            'Tingkat Lomba',
            'Peringkat',
            'Nama Penyelenggara',
            'Tanggal Prestasi',
            'Keterangan'
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
            $prestasi->siswa->kelas->jurusan->nama_jurusan,
            $prestasi->nama_prestasi,
            $prestasi->jenis_prestasi,
            $prestasi->tingkat,
            $prestasi->peringkat,
            '',  // nama_penyelenggara tidak ada di model PrestasiSiswa
            \Carbon\Carbon::parse($prestasi->tanggal_prestasi)->format('d/m/Y'),
            $prestasi->deskripsi
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
            
            // Style all borders
            'A1:L' . ($this->prestasi->count() + 1) => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ],
        ];
    }
}
