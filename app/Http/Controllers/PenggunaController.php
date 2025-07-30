<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\OrangTua;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class PenggunaController extends Controller
{
    /**
     * Display the user management index page.
     */
    public function index()
    {
        // Ambil data guru dengan relasi
        $guru = User::with(['roles', 'guru'])
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['guru', 'wali-kelas']);
            })
            ->orderBy('name')
            ->get();

        // Ambil data siswa dengan relasi
        $siswa = User::with(['roles', 'siswa.kelas.jurusan'])
            ->whereHas('roles', function ($query) {
                $query->where('name', 'siswa');
            })
            ->orderBy('name')
            ->get();

        // Ambil data wali murid dengan relasi
        $waliMurid = User::with(['roles', 'orangTua.siswa'])
            ->whereHas('roles', function ($query) {
                $query->where('name', 'wali-murid');
            })
            ->orderBy('name')
            ->get();

        // Ambil data admin dengan relasi
        $admin = User::with('roles')
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['super-admin', 'admin-sekolah', 'kepala-sekolah']);
            })
            ->orderBy('name')
            ->get();

        // Hitung statistik pengguna berdasarkan role
        $stats = [
            'total_guru' => $guru->count(),
            'total_siswa' => $siswa->count(),
            'total_wali_murid' => $waliMurid->count(),
            'total_admin' => $admin->count(),
        ];

        // Get data for dropdowns
        $kelasList = Kelas::with('jurusan')->orderBy('nama_kelas')->get();
        $siswaList = User::with('siswa')
            ->whereHas('roles', function ($query) {
                $query->where('name', 'siswa');
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('Pengguna/Index', [
            'guru' => $guru,
            'siswa' => $siswa,
            'wali_murid' => $waliMurid,
            'admin' => $admin,
            'stats' => $stats,
            'kelasList' => $kelasList,
            'siswaList' => $siswaList,
        ]);
    }

    /**
     * Display guru management page.
     */
    public function guru(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $guru = User::with(['roles', 'guru'])
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['guru', 'wali-kelas']);
            })
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage);

        return Inertia::render('Pengguna/Guru/Index', [
            'guru' => $guru,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Display siswa management page.
     */
    public function siswa(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $siswa = User::with(['roles', 'siswa.kelas', 'siswa.jurusan'])
            ->whereHas('roles', function ($query) {
                $query->where('name', 'siswa');
            })
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhereHas('siswa', function ($sq) use ($search) {
                          $sq->where('nisn', 'like', "%{$search}%")
                            ->orWhere('nis', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy('name')
            ->paginate($perPage);

        return Inertia::render('Pengguna/Siswa/Index', [
            'siswa' => $siswa,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Display wali murid management page.
     */
    public function waliMurid(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $waliMurid = User::with(['roles', 'orangTua.siswa'])
            ->whereHas('roles', function ($query) {
                $query->where('name', 'wali-murid');
            })
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage);

        return Inertia::render('Pengguna/WaliMurid/Index', [
            'wali_murid' => $waliMurid,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Display admin management page.
     */
    public function admin(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $admin = User::with('roles')
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['super-admin', 'admin-sekolah', 'kepala-sekolah']);
            })
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage);

        return Inertia::render('Pengguna/Admin/Index', [
            'admin' => $admin,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    // ========== CRUD Methods for Guru ==========
    
    public function storeGuru(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nip' => 'required|string|unique:tm_data_guru,nip',
            'nomor_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'spesialisasi_mapel' => 'nullable|string',
            'role' => 'required|string|in:guru,wali-kelas',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role
        $user->assignRole($request->role);

        // Create guru profile
        Guru::create([
            'user_id' => $user->id,
            'nip' => $request->nip,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
            'spesialisasi_mapel' => $request->spesialisasi_mapel,
        ]);

        return redirect()->back()->with('success', 'Data guru berhasil ditambahkan');
    }

    public function updateGuru(Request $request, $id)
    {
        $user = User::with('guru')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'nip' => 'required|string|unique:tm_data_guru,nip,' . $user->guru->id,
            'nomor_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'spesialisasi_mapel' => 'nullable|string',
            'role' => 'required|string|in:guru,wali-kelas',
        ]);

        // Update user
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update role
        $user->syncRoles([$request->role]);

        // Update guru profile
        $user->guru->update([
            'nip' => $request->nip,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
            'spesialisasi_mapel' => $request->spesialisasi_mapel,
        ]);

        return redirect()->back()->with('success', 'Data guru berhasil diperbarui');
    }

    public function destroyGuru($id)
    {
        $user = User::with('guru')->findOrFail($id);
        
        // Delete guru profile first
        if ($user->guru) {
            $user->guru->delete();
        }
        
        // Delete user
        $user->delete();

        return redirect()->back()->with('success', 'Data guru berhasil dihapus');
    }

    // ========== CRUD Methods for Siswa ==========
    
    public function storeSiswa(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nisn' => 'required|string|unique:tm_data_siswa,nisn',
            'nis' => 'required|string|unique:tm_data_siswa,nis',
            'nomor_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string',
            'jenis_kelamin' => 'required|string|in:L,P',
            'id_kelas' => 'required|exists:tm_data_kelas,id',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role
        $user->assignRole('siswa');

        // Create siswa profile
        Siswa::create([
            'user_id' => $user->id,
            'nisn' => $request->nisn,
            'nis' => $request->nis,
            'telepon_orangtua' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
            'tempat_lahir' => $request->tempat_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
            'kelas_id' => $request->id_kelas,
            'tahun_masuk' => now()->year,
            'status_siswa' => 'aktif',
        ]);

        return redirect()->back()->with('success', 'Data siswa berhasil ditambahkan');
    }

    public function updateSiswa(Request $request, $id)
    {
        $user = User::with('siswa')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'nisn' => 'required|string|unique:tm_data_siswa,nisn,' . $user->siswa->id,
            'nis' => 'required|string|unique:tm_data_siswa,nis,' . $user->siswa->id,
            'nomor_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string',
            'jenis_kelamin' => 'required|string|in:L,P',
            'id_kelas' => 'required|exists:tm_data_kelas,id',
        ]);

        // Update user
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update siswa profile
        $user->siswa->update([
            'nisn' => $request->nisn,
            'nis' => $request->nis,
            'telepon_orangtua' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
            'tempat_lahir' => $request->tempat_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
            'kelas_id' => $request->id_kelas,
        ]);

        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui');
    }

    public function destroySiswa($id)
    {
        $user = User::with('siswa')->findOrFail($id);
        
        // Delete siswa profile first
        if ($user->siswa) {
            $user->siswa->delete();
        }
        
        // Delete user
        $user->delete();

        return redirect()->back()->with('success', 'Data siswa berhasil dihapus');
    }

    // ========== CRUD Methods for Wali Murid ==========
    
    public function storeWaliMurid(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nomor_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'pekerjaan' => 'nullable|string',
            'id_siswa' => 'required|exists:tm_data_siswa,id',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role
        $user->assignRole('wali-murid');

        // Create orang tua profile
        OrangTua::create([
            'user_id' => $user->id,
            'siswa_id' => $request->id_siswa,
            'hubungan_keluarga' => 'Orang Tua',
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'pekerjaan' => $request->pekerjaan,
        ]);

        return redirect()->back()->with('success', 'Data wali murid berhasil ditambahkan');
    }

    public function updateWaliMurid(Request $request, $id)
    {
        $user = User::with('orangTua')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'nomor_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'pekerjaan' => 'nullable|string',
            'id_siswa' => 'required|exists:tm_data_siswa,id',
        ]);

        // Update user
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update orang tua profile
        $user->orangTua->update([
            'siswa_id' => $request->id_siswa,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'pekerjaan' => $request->pekerjaan,
        ]);

        return redirect()->back()->with('success', 'Data wali murid berhasil diperbarui');
    }

    public function destroyWaliMurid($id)
    {
        $user = User::with('orangTua')->findOrFail($id);
        
        // Delete orang tua profile first
        if ($user->orangTua) {
            $user->orangTua->delete();
        }
        
        // Delete user
        $user->delete();

        return redirect()->back()->with('success', 'Data wali murid berhasil dihapus');
    }

    // ========== CRUD Methods for Admin ==========
    
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:admin,super-admin',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role
        $user->assignRole($request->role);

        return redirect()->back()->with('success', 'Data admin berhasil ditambahkan');
    }

    public function updateAdmin(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:admin,super-admin',
        ]);

        // Update user
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update role
        $user->syncRoles([$request->role]);

        return redirect()->back()->with('success', 'Data admin berhasil diperbarui');
    }

    public function destroyAdmin($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'Data admin berhasil dihapus');
    }
}
