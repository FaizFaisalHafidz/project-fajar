<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Data - {{ ucfirst($exportType) }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }
        
        .header h2 {
            margin: 5px 0 0 0;
            font-size: 14px;
            font-weight: normal;
            color: #666;
        }
        
        .info-section {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
        }
        
        .info-box {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }
        
        .info-box h3 {
            margin: 0 0 10px 0;
            font-size: 13px;
            font-weight: bold;
            color: #333;
        }
        
        .info-box p {
            margin: 0;
            font-size: 11px;
            color: #666;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 10px;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: center;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #666;
        }
        
        .summary-stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        
        .stat-item {
            text-align: center;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            min-width: 80px;
        }
        
        .stat-number {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 10px;
            color: #666;
        }
        
        .badge {
            display: inline-block;
            padding: 2px 6px;
            background: #e9ecef;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        
        .badge-success { background: #d4edda; color: #155724; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .badge-danger { background: #f8d7da; color: #721c24; }
        .badge-info { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN EXPORT DATA</h1>
        <h2>{{ strtoupper(str_replace('_', ' ', $exportType)) }}</h2>
        <p>{{ $tahunAjaran->nama_tahun_ajaran }} - {{ $semester->nama_semester ?? 'Semua Semester' }}</p>
    </div>
    
    <div class="info-section">
        <div class="info-box">
            <h3>Informasi Export</h3>
            <p><strong>Tanggal Export:</strong> {{ date('d/m/Y H:i:s') }}</p>
            <p><strong>Jenis Data:</strong> {{ ucwords(str_replace('_', ' ', $exportType)) }}</p>
            @if(isset($filters['kelas_id']) && $filters['kelas_id'])
                <p><strong>Filter Kelas:</strong> Ya</p>
            @endif
            @if(isset($filters['mata_pelajaran_id']) && $filters['mata_pelajaran_id'])
                <p><strong>Filter Mata Pelajaran:</strong> Ya</p>
            @endif
        </div>
        
        <div class="info-box">
            <h3>Jumlah Data</h3>
            @if($exportType === 'semua')
                <p><strong>Total Records:</strong> 
                    {{ collect($data)->flatten()->count() }}
                </p>
            @else
                <p><strong>Total Records:</strong> {{ $data->count() }}</p>
            @endif
        </div>
    </div>

    @if($exportType === 'siswa')
        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="10%">NIS</th>
                    <th width="10%">NISN</th>
                    <th width="25%">Nama Siswa</th>
                    <th width="15%">Kelas</th>
                    <th width="15%">Jurusan</th>
                    <th width="10%">L/P</th>
                    <th width="10%">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->nis }}</td>
                    <td class="text-center">{{ $item->nisn }}</td>
                    <td>{{ $item->user->name }}</td>
                    <td class="text-center">{{ $item->kelas->nama_kelas }}</td>
                    <td>{{ $item->kelas->jurusan->nama_jurusan }}</td>
                    <td class="text-center">{{ strtoupper($item->jenis_kelamin) }}</td>
                    <td class="text-center">
                        <span class="badge {{ $item->status_siswa === 'aktif' ? 'badge-success' : 'badge-warning' }}">
                            {{ ucfirst($item->status_siswa) }}
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
    @elseif($exportType === 'guru')
        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="15%">NIP</th>
                    <th width="25%">Nama Guru</th>
                    <th width="25%">Email</th>
                    <th width="15%">No. Telepon</th>
                    <th width="15%">Wali Kelas</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->nip }}</td>
                    <td>{{ $item->user->name }}</td>
                    <td>{{ $item->user->email }}</td>
                    <td class="text-center">{{ $item->nomor_telepon }}</td>
                    <td class="text-center">
                        {{ $item->kelasWali->isNotEmpty() ? $item->kelasWali->first()->nama_kelas : 'Tidak' }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
    @elseif($exportType === 'nilai')
        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="10%">NIS</th>
                    <th width="20%">Nama Siswa</th>
                    <th width="10%">Kelas</th>
                    <th width="20%">Mata Pelajaran</th>
                    <th width="15%">Komponen</th>
                    <th width="10%">Nilai</th>
                    <th width="10%">Tanggal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->siswa->nis }}</td>
                    <td>{{ $item->siswa->user->name }}</td>
                    <td class="text-center">{{ $item->siswa->kelas->nama_kelas }}</td>
                    <td>{{ $item->mataPelajaran->nama_mapel }}</td>
                    <td>{{ $item->komponenNilai->nama_komponen }}</td>
                    <td class="text-center">
                        <span class="badge {{ $item->nilai >= 75 ? 'badge-success' : 'badge-warning' }}">
                            {{ $item->nilai }}
                        </span>
                    </td>
                    <td class="text-center">{{\Carbon\Carbon::parse($item->tanggal_input)->format('d/m/Y') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
    @elseif($exportType === 'absensi')
        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="10%">NIS</th>
                    <th width="25%">Nama Siswa</th>
                    <th width="15%">Kelas</th>
                    <th width="10%">Sakit</th>
                    <th width="10%">Izin</th>
                    <th width="10%">Alpha</th>
                    <th width="15%">Total Absen</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->siswa->nis }}</td>
                    <td>{{ $item->siswa->user->name }}</td>
                    <td class="text-center">{{ $item->siswa->kelas->nama_kelas }}</td>
                    <td class="text-center">{{ $item->jumlah_sakit }}</td>
                    <td class="text-center">{{ $item->jumlah_izin }}</td>
                    <td class="text-center">{{ $item->jumlah_tanpa_keterangan }}</td>
                    <td class="text-center">
                        <span class="badge">
                            {{ $item->jumlah_sakit + $item->jumlah_izin + $item->jumlah_tanpa_keterangan }}
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
    @elseif($exportType === 'prestasi')
        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="10%">NIS</th>
                    <th width="20%">Nama Siswa</th>
                    <th width="10%">Kelas</th>
                    <th width="20%">Nama Prestasi</th>
                    <th width="10%">Jenis</th>
                    <th width="10%">Tingkat</th>
                    <th width="10%">Peringkat</th>
                    <th width="5%">Tanggal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->siswa->nis }}</td>
                    <td>{{ $item->siswa->user->name }}</td>
                    <td class="text-center">{{ $item->siswa->kelas->nama_kelas }}</td>
                    <td>{{ $item->nama_prestasi }}</td>
                    <td class="text-center">{{ $item->jenis_prestasi }}</td>
                    <td class="text-center">
                        <span class="badge badge-info">{{ $item->tingkat }}</span>
                    </td>
                    <td class="text-center">{{ $item->peringkat }}</td>
                    <td class="text-center">{{\Carbon\Carbon::parse($item->tanggal_prestasi)->format('d/m/Y') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
    @elseif($exportType === 'semua')
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $data['siswa']->count() }}</div>
                <div class="stat-label">Siswa</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $data['guru']->count() }}</div>
                <div class="stat-label">Guru</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $data['nilai']->count() }}</div>
                <div class="stat-label">Nilai</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $data['absensi']->count() }}</div>
                <div class="stat-label">Absensi</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $data['prestasi']->count() }}</div>
                <div class="stat-label">Prestasi</div>
            </div>
        </div>
        
        <p><strong>Catatan:</strong> Export "Semua Data" dalam format PDF hanya menampilkan ringkasan. 
        Untuk data lengkap, silakan gunakan format Excel atau CSV.</p>
    @endif
    
    <div class="footer">
        <p>Dicetak pada: {{ date('d F Y, H:i:s') }} | 
           Export Data Sistem Informasi Sekolah</p>
    </div>
</body>
</html>
