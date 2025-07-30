<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raport Siswa - SMK Mohamad Toha Cimahi</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            background: #fff;
            padding: 20px;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            page-break-after: always;
            padding: 20px;
        }
        
        .page:last-child {
            page-break-after: auto;
        }
        
        /* Header/Kop Surat */
        .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            float: left;
            margin-right: 15px;
        }
        }
        
        .school-info {
            text-align: center;
            padding-top: 10px;
        }
        
        .school-name {
            font-size: 18pt;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 5px;
        }
        
        .school-address {
            font-size: 10pt;
            margin-bottom: 3px;
        }
        
        .school-contact {
            font-size: 9pt;
            color: #666;
        }
        
        .clear {
            clear: both;
        }
        
        /* Judul Raport */
        .report-title {
            text-align: center;
            margin: 20px 0;
        }
        
        .title-main {
            font-size: 16pt;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 5px;
        }
        
        .title-sub {
            font-size: 12pt;
            margin-bottom: 10px;
        }
        
        /* Info Siswa */
        .student-info {
            margin-bottom: 20px;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .info-table td {
            padding: 5px 0;
            vertical-align: top;
            border-bottom: 1px dotted #ccc;
        }
        
        .info-label {
            width: 130px;
            font-weight: bold;
        }
        
        .info-colon {
            width: 15px;
        }
        
        /* Tabel Nilai */
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border: 2px solid #000;
        }
        
        .grades-table th,
        .grades-table td {
            border: 1px solid #000;
            padding: 8px 6px;
            text-align: center;
            vertical-align: middle;
        }
        
        .grades-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 10pt;
        }
        
        .grades-table td {
            font-size: 10pt;
        }
        
        .grades-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .subject-name {
            text-align: left !important;
            padding-left: 8px;
        }
        
        .grade-excellent {
            background-color: #d4edda !important;
            color: #155724;
            font-weight: bold;
        }
        
        .grade-good {
            background-color: #fff3cd !important;
            color: #856404;
        }
        
        .grade-fair {
            background-color: #f8d7da !important;
            color: #721c24;
        }
        
        .grade-poor {
            background-color: #f8d7da !important;
            color: #721c24;
        }
        
        /* Ekstra Section */
        .extra-section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
            padding: 8px;
            background-color: #f0f0f0;
            border: 1px solid #000;
        }
        
        .extra-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
        }
        
        .extra-table th,
        .extra-table td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }
        
        .extra-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        
        .extra-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        /* Absensi */
        .attendance-box {
            display: inline-block;
            width: 48%;
            vertical-align: top;
        }
        
        .attendance-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
        }
        
        .attendance-table th,
        .attendance-table td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }
        
        .attendance-table th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        
        /* Catatan dan TTD */
        .notes-signature {
            margin-top: 30px;
        }
        
        .notes {
            width: 48%;
            display: inline-block;
            vertical-align: top;
        }
        
        .signature {
            width: 48%;
            display: inline-block;
            vertical-align: top;
            text-align: center;
            float: right;
        }
        
        .signature-space {
            height: 60px;
            border-bottom: 1px solid #000;
            margin: 20px auto 5px;
            width: 200px;
        }
        
        .date-place {
            text-align: right;
            margin-bottom: 10px;
        }
        
        /* Print Styles */
        @media print {
            body {
                padding: 0;
            }
            
            .page {
                box-shadow: none;
                margin: 0;
                width: 100%;
            }
        }
        
        /* Utilities */
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .mt-20 { margin-top: 20px; }
        .mb-20 { margin-bottom: 20px; }
    </style>
</head>
<body>
    @foreach($data as $siswaData)
    <div class="page">
        <!-- Header/Kop Surat -->
        <div class="header">
            <img src="https://neoflash.sgp1.cdn.digitaloceanspaces.com/logo-smk-mohammad-toha.png" alt="Logo SMK" class="logo">
            <div class="school-info">
                <div class="school-name">SMK MOHAMAD TOHA CIMAHI</div>
                <div class="school-address">
                    Jl. Baros No. 207 Cimahi Tengah, Kota Cimahi, Jawa Barat 40521
                </div>
                <div class="school-contact">
                    Telp: (022) 6629796 | Email: smkmohamadtoha@gmail.com | Website: www.smkmohamadtoha.sch.id
                </div>
            </div>
            <div class="clear"></div>
        </div>
        
        <!-- Judul Raport -->
        <div class="report-title">
            <div class="title-main">LAPORAN HASIL BELAJAR SISWA</div>
            <div class="title-sub">(RAPORT)</div>
            <div class="title-sub">Tahun Pelajaran {{ $tahunAjaran->nama_tahun_ajaran }} - Semester {{ $semester->nama_semester }}</div>
        </div>
        
        <!-- Info Siswa -->
        <div class="student-info">
            <table class="info-table">
                <tr>
                    <td class="info-label">Nama Siswa</td>
                    <td class="info-colon">:</td>
                    <td class="font-bold">{{ $siswaData['siswa']->user->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">NIS / NISN</td>
                    <td class="info-colon">:</td>
                    <td>{{ $siswaData['siswa']->nis }} / {{ $siswaData['siswa']->nisn }}</td>
                </tr>
                <tr>
                    <td class="info-label">Kelas</td>
                    <td class="info-colon">:</td>
                    <td>{{ $siswaData['siswa']->kelas->nama_kelas }}</td>
                </tr>
                <tr>
                    <td class="info-label">Jurusan</td>
                    <td class="info-colon">:</td>
                    <td>{{ $siswaData['siswa']->kelas->jurusan->nama_jurusan }}</td>
                </tr>
                <tr>
                    <td class="info-label">Tahun Pelajaran</td>
                    <td class="info-colon">:</td>
                    <td>{{ $tahunAjaran->nama_tahun_ajaran }}</td>
                </tr>
                <tr>
                    <td class="info-label">Semester</td>
                    <td class="info-colon">:</td>
                    <td>{{ $semester->nama_semester }}</td>
                </tr>
            </table>
        </div>
        
        <!-- Nilai Akademik -->
        @if(count($siswaData['nilai_akademik']) > 0)
        <div class="section-title">A. NILAI MATA PELAJARAN</div>
        <table class="grades-table">
            <thead>
                <tr>
                    <th rowspan="2" style="width: 5%;">No</th>
                    <th rowspan="2" style="width: 35%;">Mata Pelajaran</th>
                    <th colspan="2">Nilai</th>
                    <th rowspan="2" style="width: 15%;">Predikat</th>
                    <th rowspan="2" style="width: 25%;">Deskripsi</th>
                </tr>
                <tr>
                    <th style="width: 10%;">Angka</th>
                    <th style="width: 10%;">Huruf</th>
                </tr>
            </thead>
            <tbody>
                @php $no = 1; @endphp
                @foreach($siswaData['nilai_akademik'] as $mataPelajaranId => $nilai)
                    @php
                        $mapel = $nilai->first()->mataPelajaran;
                        $rataRata = $nilai->avg('nilai');
                        $huruf = '';
                        $predikat = '';
                        $gradeClass = '';
                        
                        if ($rataRata >= 90) {
                            $huruf = 'A';
                            $predikat = 'Sangat Baik';
                            $gradeClass = 'grade-excellent';
                        } elseif ($rataRata >= 80) {
                            $huruf = 'B';
                            $predikat = 'Baik';
                            $gradeClass = 'grade-good';
                        } elseif ($rataRata >= 70) {
                            $huruf = 'C';
                            $predikat = 'Cukup';
                            $gradeClass = 'grade-fair';
                        } else {
                            $huruf = 'D';
                            $predikat = 'Kurang';
                            $gradeClass = 'grade-poor';
                        }
                    @endphp
                    <tr>
                        <td>{{ $no++ }}</td>
                        <td class="subject-name">{{ $mapel->nama_mapel }}</td>
                        <td class="{{ $gradeClass }}">{{ number_format($rataRata, 0) }}</td>
                        <td class="{{ $gradeClass }}"><strong>{{ $huruf }}</strong></td>
                        <td><strong>{{ $predikat }}</strong></td>
                        <td class="text-left">
                            @if($rataRata >= 90)
                                Siswa menunjukkan prestasi yang sangat baik dan memahami materi {{ $mapel->nama_mapel }} dengan sangat baik.
                            @elseif($rataRata >= 80)
                                Siswa menunjukkan kemampuan yang baik dalam mata pelajaran {{ $mapel->nama_mapel }}.
                            @elseif($rataRata >= 70)
                                Siswa menunjukkan pemahaman yang cukup dalam mata pelajaran {{ $mapel->nama_mapel }}.
                            @else
                                Siswa perlu meningkatkan pemahaman dalam mata pelajaran {{ $mapel->nama_mapel }}.
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @endif
        
        <!-- Nilai Sikap -->
        @if(count($siswaData['nilai_sikap']) > 0)
        <div class="extra-section">
            <div class="section-title">B. NILAI SIKAP</div>
            <table class="extra-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">No</th>
                        <th style="width: 25%;">Aspek</th>
                        <th style="width: 15%;">Nilai</th>
                        <th style="width: 55%;">Deskripsi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($siswaData['nilai_sikap'] as $index => $sikap)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>Sikap Sosial</td>
                        <td class="text-center">{{ $sikap->nilai_sosial }}</td>
                        <td>{{ $sikap->deskripsi_sosial ?: 'Menunjukkan sikap sosial yang baik.' }}</td>
                    </tr>
                    <tr>
                        <td>{{ $index + 2 }}</td>
                        <td>Sikap Spiritual</td>
                        <td class="text-center">{{ $sikap->nilai_spiritual }}</td>
                        <td>{{ $sikap->deskripsi_spiritual ?: 'Menunjukkan sikap spiritual yang baik.' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
        
        <!-- Ekstrakurikuler -->
        @if(count($siswaData['nilai_ekstrakurikuler']) > 0)
        <div class="extra-section">
            <div class="section-title">C. EKSTRAKURIKULER</div>
            <table class="extra-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">No</th>
                        <th style="width: 30%;">Kegiatan Ekstrakurikuler</th>
                        <th style="width: 15%;">Nilai</th>
                        <th style="width: 50%;">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($siswaData['nilai_ekstrakurikuler'] as $index => $ekstra)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $ekstra->ekstrakurikuler->nama_ekstrakurikuler }}</td>
                        <td class="text-center">{{ $ekstra->nilai }}</td>
                        <td>{{ $ekstra->deskripsi ?: 'Mengikuti kegiatan dengan baik.' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
        
        <!-- Prestasi -->
        @if(count($siswaData['prestasi']) > 0)
        <div class="extra-section">
            <div class="section-title">D. PRESTASI</div>
            <table class="extra-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">No</th>
                        <th style="width: 20%;">Jenis Prestasi</th>
                        <th style="width: 35%;">Nama Prestasi</th>
                        <th style="width: 15%;">Tingkat</th>
                        <th style="width: 15%;">Peringkat</th>
                        <th style="width: 10%;">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($siswaData['prestasi'] as $index => $prestasi)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $prestasi->jenis_prestasi }}</td>
                        <td>{{ $prestasi->nama_prestasi }}</td>
                        <td class="text-center">{{ ucfirst($prestasi->tingkat) }}</td>
                        <td class="text-center">{{ $prestasi->peringkat }}</td>
                        <td class="text-center">{{ \Carbon\Carbon::parse($prestasi->tanggal_prestasi)->format('d/m/Y') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
        
        <!-- Absensi -->
        <div class="extra-section">
            <div class="section-title">E. KETIDAKHADIRAN</div>
            <div class="attendance-box">
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th colspan="2">Ketidakhadiran</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="text-align: left; padding-left: 10px;">Sakit</td>
                            <td style="width: 50px;">{{ $siswaData['absensi']->jumlah_sakit ?? 0 }} hari</td>
                        </tr>
                        <tr>
                            <td style="text-align: left; padding-left: 10px;">Izin</td>
                            <td>{{ $siswaData['absensi']->jumlah_izin ?? 0 }} hari</td>
                        </tr>
                        <tr>
                            <td style="text-align: left; padding-left: 10px;">Tanpa Keterangan</td>
                            <td>{{ $siswaData['absensi']->jumlah_tanpa_keterangan ?? 0 }} hari</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Catatan dan Tanda Tangan -->
        <div class="notes-signature">
            <div class="notes">
                <div class="section-title">F. CATATAN WALI KELAS</div>
                <div style="min-height: 60px; border: 1px solid #000; padding: 10px; background-color: #f9f9f9;">
                    Siswa menunjukkan perkembangan yang positif dalam proses pembelajaran. 
                    Diharapkan dapat mempertahankan prestasi dan terus meningkatkan kemampuan akademik.
                </div>
            </div>
            
            <div class="signature">
                <div class="date-place">
                    Cimahi, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}
                </div>
                <div style="margin-bottom: 10px;">Wali Kelas</div>
                <div class="signature-space"></div>
                <div class="font-bold">
                    {{ $siswaData['siswa']->kelas->waliKelas->user->name ?? 'Siti Nurhaliza, S.Pd' }}
                </div>
                <div>NIP. {{ $siswaData['siswa']->kelas->waliKelas->nip ?? '198203152005042001' }}</div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
    @endforeach
</body>
</html>
