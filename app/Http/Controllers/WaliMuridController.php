<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Siswa;
use App\Models\OrangTua;
use App\Models\NilaiSiswa;
use App\Models\Absensi;
use App\Models\PrestasiSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WaliMuridController extends Controller
{
    /**
     * Display pantau anak page for wali murid
     */
    public function pantauAnak()
    {
        $user = Auth::user();
        
        // Get orang tua data for current user
        $orangTua = OrangTua::where('user_id', $user->id)->first();
        
        if (!$orangTua || !$orangTua->siswa) {
            return Inertia::render('WaliMurid/PantauAnak', [
                'anak' => null,
                'nilai' => null,
                'absensi' => null,
                'prestasi' => null,
            ]);
        }

        $siswa = $orangTua->siswa;

        // Get anak data with relationships
        $anakData = [
            'id' => $siswa->id,
            'nama' => $siswa->user->name,
            'nis' => $siswa->nis,
            'kelas' => [
                'nama_kelas' => $siswa->kelas->nama_kelas ?? 'Belum ada kelas',
                'jurusan' => [
                    'nama_jurusan' => $siswa->kelas->jurusan->nama_jurusan ?? 'Belum ada jurusan'
                ]
            ]
        ];

        // Get nilai data grouped by type
        $nilai = [
            'pengetahuan' => $this->getNilaiByType($siswa->id, 'pengetahuan'),
            'keterampilan' => $this->getNilaiByType($siswa->id, 'keterampilan'),
            'sikap' => $this->getNilaiByType($siswa->id, 'sikap'),
            'ekstrakurikuler' => $this->getNilaiByType($siswa->id, 'ekstrakurikuler'),
        ];

        // Get absensi data
        $absensi = $this->getAbsensiData($siswa->id);

        // Get prestasi data
        $prestasi = PrestasiSiswa::where('siswa_id', $siswa->id)
            ->orderBy('tanggal_prestasi', 'desc')
            ->get()
            ->toArray();

        return Inertia::render('WaliMurid/PantauAnak', [
            'anak' => $anakData,
            'nilai' => $nilai,
            'absensi' => $absensi,
            'prestasi' => $prestasi,
        ]);
    }

    private function getNilaiByType($siswaId, $type)
    {
        // This is a simplified version - you might need to adjust based on your actual database structure
        $query = NilaiSiswa::where('siswa_id', $siswaId);
        
        switch ($type) {
            case 'pengetahuan':
                $query->where('jenis_nilai', 'pengetahuan');
                break;
            case 'keterampilan':
                $query->where('jenis_nilai', 'keterampilan');
                break;
            case 'sikap':
                $query->whereIn('jenis_nilai', ['sosial', 'spiritual']);
                break;
            case 'ekstrakurikuler':
                $query->where('jenis_nilai', 'ekstrakurikuler');
                break;
        }

        return $query->with(['mataPelajaran', 'guru.user'])
            ->get()
            ->groupBy('mata_pelajaran_id')
            ->map(function ($nilai) {
                $first = $nilai->first();
                return [
                    'mata_pelajaran' => $first->mataPelajaran,
                    'guru' => $first->guru,
                    'rata_rata' => $nilai->avg('nilai'),
                    'nilai_detail' => $nilai->toArray()
                ];
            })
            ->values()
            ->toArray();
    }

    private function getAbsensiData($siswaId)
    {
        // Get current semester absensi data
        $absensi = Absensi::where('siswa_id', $siswaId)
            ->whereHas('tahunAjaran', function($query) {
                $query->where('is_active', true);
            })
            ->whereHas('semester', function($query) {
                $query->where('is_active', true);
            })
            ->get();

        $hadir = $absensi->where('status', 'hadir')->count();
        $sakit = $absensi->where('status', 'sakit')->count();
        $izin = $absensi->where('status', 'izin')->count();
        $alpha = $absensi->where('status', 'alpha')->count();
        $total = $absensi->count();

        return [
            'hadir' => $hadir,
            'sakit' => $sakit,
            'izin' => $izin,
            'alpha' => $alpha,
            'total_hari' => $total ?: 1, // Prevent division by zero
        ];
    }
}
