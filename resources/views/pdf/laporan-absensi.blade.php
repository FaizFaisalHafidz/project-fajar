<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Absensi Siswa</title>
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
            grid-template-columns: repeat(4, 1fr);
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
            font-size: 18px;
            font-weight: bold;
        }
        
        .summary-card .label {
            font-size: 9px;
            color: #666;
            margin-top: 3px;
        }
        
        .summary-card .percentage {
            font-size: 8px;
            color: #888;
            margin-top: 2px;
        }
        
        .hadir .number { color: #16a34a; }
        .izin .number { color: #2563eb; }
        .sakit .number { color: #ca8a04; }
        .alpha .number { color: #dc2626; }
        
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
        
        .badge-hadir {
            background-color: #dcfce7;
            color: #166534;
        }
        
        .badge-izin {
            background-color: #dbeafe;
            color: #1e40af;
        }
        
        .badge-sakit {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        .badge-alpha {
            background-color: #fee2e2;
            color: #991b1b;
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
        <h1>LAPORAN ABSENSI SISWA</h1>
        <h2>SMK NEGERI 1 EXAMPLE</h2>
        <p>Tahun Ajaran {{ $tahunAjaran->nama_tahun_ajaran }} - Semester {{ $semester->nama_semester }}</p>
        <p>Periode: {{ \Carbon\Carbon::parse($filters['start_date'])->format('d F Y') }} - {{ \Carbon\Carbon::parse($filters['end_date'])->format('d F Y') }}</p>
        <p>Dicetak pada: {{ date('d F Y, H:i') }} WIB</p>
    </div>

    <div class="info-section">
        <div class="info-grid">
            <div class="info-item">
                <strong>Filter Kelas:</strong>
                {{ isset($filters['kelas_id']) && $filters['kelas_id'] ? 'Kelas Tertentu' : 'Semua Kelas' }}
            </div>
            <div class="info-item">
                <strong>Filter Status:</strong>
                {{ $filters['status_kehadiran'] ?? 'Semua Status' }}
            </div>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <strong>Total Record:</strong>
                {{ $absensi->count() }} data absensi
            </div>
            <div class="info-item">
                <strong>Rentang Waktu:</strong>
                {{ \Carbon\Carbon::parse($filters['start_date'])->diffInDays(\Carbon\Carbon::parse($filters['end_date'])) + 1 }} hari
            </div>
        </div>
    </div>

    <div class="summary-section">
        <h3 style="margin-bottom: 10px; font-size: 12px;">Ringkasan Kehadiran</h3>
        <div class="summary-grid">
            <div class="summary-card hadir">
                <div class="number">{{ $absensi->where('status_kehadiran', 'Hadir')->count() }}</div>
                <div class="label">Hadir</div>
                <div class="percentage">
                    {{ $absensi->count() > 0 ? round(($absensi->where('status_kehadiran', 'Hadir')->count() / $absensi->count()) * 100, 1) : 0 }}%
                </div>
            </div>
            <div class="summary-card izin">
                <div class="number">{{ $absensi->where('status_kehadiran', 'Izin')->count() }}</div>
                <div class="label">Izin</div>
                <div class="percentage">
                    {{ $absensi->count() > 0 ? round(($absensi->where('status_kehadiran', 'Izin')->count() / $absensi->count()) * 100, 1) : 0 }}%
                </div>
            </div>
            <div class="summary-card sakit">
                <div class="number">{{ $absensi->where('status_kehadiran', 'Sakit')->count() }}</div>
                <div class="label">Sakit</div>
                <div class="percentage">
                    {{ $absensi->count() > 0 ? round(($absensi->where('status_kehadiran', 'Sakit')->count() / $absensi->count()) * 100, 1) : 0 }}%
                </div>
            </div>
            <div class="summary-card alpha">
                <div class="number">{{ $absensi->where('status_kehadiran', 'Alpha')->count() }}</div>
                <div class="label">Alpha</div>
                <div class="percentage">
                    {{ $absensi->count() > 0 ? round(($absensi->where('status_kehadiran', 'Alpha')->count() / $absensi->count()) * 100, 1) : 0 }}%
                </div>
            </div>
        </div>
    </div>

    @if($absensi->count() > 0)
        <table>
            <thead>
                <tr>
                    <th width="4%">No</th>
                    <th width="10%">Tanggal</th>
                    <th width="10%">NIS</th>
                    <th width="20%">Nama Siswa</th>
                    <th width="10%">Kelas</th>
                    <th width="12%">Jurusan</th>
                    <th width="10%">Status</th>
                    <th width="24%">Keterangan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($absensi as $index => $item)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td class="text-center">{{ \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y') }}</td>
                        <td>{{ $item->siswa->nis }}</td>
                        <td>{{ $item->siswa->user->name }}</td>
                        <td class="text-center">{{ $item->siswa->kelas->nama_kelas }}</td>
                        <td>{{ $item->siswa->kelas->jurusan->nama_jurusan }}</td>
                        <td class="text-center">
                            <span class="badge badge-{{ strtolower($item->status_kehadiran) }}">
                                {{ $item->status_kehadiran }}
                            </span>
                        </td>
                        <td>{{ $item->keterangan ?: '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="no-data">
            <p>Tidak ada data absensi yang sesuai dengan filter yang dipilih.</p>
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
