<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Prestasi Siswa</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        
        .header h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .header h2 {
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .header p {
            font-size: 11px;
            color: #666;
        }
        
        .info-section {
            margin-bottom: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .info-item {
            padding: 8px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
        }
        
        .info-item strong {
            display: block;
            margin-bottom: 3px;
            font-size: 10px;
            color: #666;
        }
        
        .summary-section {
            margin-bottom: 20px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .summary-card {
            text-align: center;
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #f0f8ff;
        }
        
        .summary-card .number {
            font-size: 20px;
            font-weight: bold;
            color: #0066cc;
        }
        
        .summary-card .label {
            font-size: 9px;
            color: #666;
            margin-top: 3px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
            vertical-align: top;
        }
        
        th {
            background-color: #f5f5f5;
            font-weight: bold;
            font-size: 10px;
            text-align: center;
        }
        
        td {
            font-size: 9px;
        }
        
        .text-center {
            text-align: center;
        }
        
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        
        .badge-internasional {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        .badge-nasional {
            background-color: #fee2e2;
            color: #991b1b;
        }
        
        .badge-provinsi {
            background-color: #dbeafe;
            color: #1e40af;
        }
        
        .badge-kabupaten {
            background-color: #dcfce7;
            color: #166534;
        }
        
        .badge-kecamatan {
            background-color: #f3e8ff;
            color: #7c3aed;
        }
        
        .badge-sekolah {
            background-color: #f1f5f9;
            color: #475569;
        }
        
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
        }
        
        .no-data {
            text-align: center;
            padding: 30px;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN PRESTASI SISWA</h1>
        <h2>SMK NEGERI 1 EXAMPLE</h2>
        <p>Tahun Ajaran {{ $tahunAjaran->nama_tahun_ajaran }}</p>
        <p>Dicetak pada: {{ date('d F Y, H:i') }} WIB</p>
    </div>

    <div class="info-section">
        <div class="info-grid">
            <div class="info-item">
                <strong>Filter Kelas:</strong>
                {{ isset($filters['kelas_id']) && $filters['kelas_id'] ? 'Kelas Tertentu' : 'Semua Kelas' }}
            </div>
            <div class="info-item">
                <strong>Filter Tingkat:</strong>
                {{ $filters['tingkat_lomba'] ?? 'Semua Tingkat' }}
            </div>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <strong>Filter Jenis:</strong>
                {{ $filters['jenis_prestasi'] ?? 'Semua Jenis' }}
            </div>
            <div class="info-item">
                <strong>Total Data:</strong>
                {{ $prestasi->count() }} prestasi
            </div>
        </div>
    </div>

    <div class="summary-section">
        <h3 style="margin-bottom: 10px; font-size: 12px;">Ringkasan Prestasi per Tingkat</h3>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="number">{{ $prestasi->where('tingkat_lomba', 'Internasional')->count() }}</div>
                <div class="label">Internasional</div>
            </div>
            <div class="summary-card">
                <div class="number">{{ $prestasi->where('tingkat_lomba', 'Nasional')->count() }}</div>
                <div class="label">Nasional</div>
            </div>
            <div class="summary-card">
                <div class="number">{{ $prestasi->where('tingkat_lomba', 'Provinsi')->count() }}</div>
                <div class="label">Provinsi</div>
            </div>
        </div>
    </div>

    @if($prestasi->count() > 0)
        <table>
            <thead>
                <tr>
                    <th width="3%">No</th>
                    <th width="8%">NIS</th>
                    <th width="15%">Nama Siswa</th>
                    <th width="8%">Kelas</th>
                    <th width="20%">Nama Prestasi</th>
                    <th width="8%">Jenis</th>
                    <th width="10%">Tingkat</th>
                    <th width="8%">Peringkat</th>
                    <th width="10%">Penyelenggara</th>
                    <th width="8%">Tanggal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($prestasi as $index => $item)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td>{{ $item->siswa->nis }}</td>
                        <td>{{ $item->siswa->user->name }}</td>
                        <td class="text-center">{{ $item->siswa->kelas->nama_kelas }}</td>
                        <td>{{ $item->nama_prestasi }}</td>
                        <td class="text-center">{{ $item->jenis_prestasi }}</td>
                        <td class="text-center">
                            <span class="badge badge-{{ strtolower(str_replace(['/', ' '], ['-', '-'], $item->tingkat_lomba)) }}">
                                {{ $item->tingkat_lomba }}
                            </span>
                        </td>
                        <td class="text-center">{{ $item->peringkat }}</td>
                        <td>{{ $item->nama_penyelenggara }}</td>
                        <td class="text-center">{{ \Carbon\Carbon::parse($item->tanggal_prestasi)->format('d/m/Y') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="no-data">
            <p>Tidak ada data prestasi yang sesuai dengan filter yang dipilih.</p>
        </div>
    @endif

    <div class="footer">
        <p>Kepala Sekolah</p>
        <br><br><br>
        <p><strong>_________________________</strong></p>
        <p>NIP. _________________</p>
    </div>
</body>
</html>
