<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanAbsensiExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $absensi;
    protected $tahunAjaran;
    protected $semester;

    public function __construct($absensi, $tahunAjaran, $semester)
    {
        $this->absensi = $absensi;
        $this->tahunAjaran = $tahunAjaran;
        $this->semester = $semester;
    }

    public function collection()
    {
        return $this->absensi;
    }

    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Jurusan',
            'Jumlah Sakit',
            'Jumlah Izin',
            'Jumlah Alpha',
            'Total Absen'
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
            $absensi->siswa->kelas->jurusan->nama_jurusan,
            $absensi->jumlah_sakit,
            $absensi->jumlah_izin,
            $absensi->jumlah_tanpa_keterangan,
            $absensi->jumlah_sakit + $absensi->jumlah_izin + $absensi->jumlah_tanpa_keterangan
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
            
            // Style all borders
            'A1:H' . ($this->absensi->count() + 1) => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ],
        ];
    }
}
