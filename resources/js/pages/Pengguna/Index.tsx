import { AdminFormModal } from '@/components/modals/AdminFormModal';
import { GuruFormModal } from '@/components/modals/GuruFormModal';
import { SiswaFormModal } from '@/components/modals/SiswaFormModal';
import { WaliMuridFormModal } from '@/components/modals/WaliMuridFormModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    GraduationCap,
    Pencil,
    Plus,
    Shield,
    Trash2,
    UserCircle,
    Users
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: { name: string }[];
}

interface GuruData extends User {
    guru?: {
        nip: string;
        tanggal_lahir: string;
        alamat: string;
        nomor_telepon: string;
        spesialisasi_mapel: string;
    };
}

interface SiswaData extends User {
    siswa?: {
        nisn: string;
        nis: string;
        tanggal_lahir: string;
        alamat: string;
        telepon_orangtua: string;
        jenis_kelamin: string;
        tahun_masuk: number;
        status_siswa: string;
        kelas?: {
            nama_kelas: string;
            jurusan?: {
                nama_jurusan: string;
            };
        };
    };
}

interface Props {
    guru: GuruData[];
    siswa: SiswaData[];
    wali_murid: User[];
    admin: User[];
    stats: {
        total_guru: number;
        total_siswa: number;
        total_wali_murid: number;
        total_admin: number;
    };
    kelasList: Array<{ id: number; nama_kelas: string; jurusan: { nama_jurusan: string } }>;
    siswaList: Array<{ id: number; name: string; siswa: { nisn: string } }>;
}

export default function PenggunaIndex({ guru, siswa, wali_murid, admin, stats, kelasList, siswaList }: Props) {
    
    const handleDelete = (type: string, id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(`/pengguna/${type}/${id}`, {
                onSuccess: () => {
                    toast.success('Data berhasil dihapus');
                },
                onError: () => {
                    toast.error('Gagal menghapus data');
                }
            });
        }
    };

    // Columns untuk Data Guru
    const guruColumns: ColumnDef<GuruData>[] = [
        {
            accessorKey: "name",
            header: "Nama Guru",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "guru.nip",
            header: "NIP",
            cell: ({ row }) => row.original.guru?.nip || "-",
        },
        {
            accessorKey: "guru.nomor_telepon",
            header: "No. Telepon",
            cell: ({ row }) => row.original.guru?.nomor_telepon || "-",
        },
        {
            accessorKey: "roles",
            header: "Role",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {row.original.roles.map((role) => (
                        <Badge key={role.name} variant="secondary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <GuruFormModal mode="edit" guru={row.original}>
                        <Button size="sm" variant="outline">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </GuruFormModal>
                    <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete('guru', row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Columns untuk Data Siswa
    const siswaColumns: ColumnDef<SiswaData>[] = [
        {
            accessorKey: "name",
            header: "Nama Siswa",
        },
        {
            accessorKey: "siswa.nisn",
            header: "NISN",
            cell: ({ row }) => row.original.siswa?.nisn || "-",
        },
        {
            accessorKey: "siswa.nis",
            header: "NIS",
            cell: ({ row }) => row.original.siswa?.nis || "-",
        },
        {
            accessorKey: "siswa.kelas.nama_kelas",
            header: "Kelas",
            cell: ({ row }) => row.original.siswa?.kelas?.nama_kelas || "-",
        },
        {
            accessorKey: "siswa.kelas.jurusan.nama_jurusan",
            header: "Jurusan",
            cell: ({ row }) => row.original.siswa?.kelas?.jurusan?.nama_jurusan || "-",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <SiswaFormModal mode="edit" siswa={row.original} kelasList={kelasList}>
                        <Button size="sm" variant="outline">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </SiswaFormModal>
                    <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete('siswa', row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Columns untuk Data Wali Murid
    const waliMuridColumns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: "Nama Wali Murid",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "created_at",
            header: "Tanggal Daftar",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('id-ID'),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <WaliMuridFormModal mode="edit" waliMurid={row.original} siswaList={siswaList}>
                        <Button size="sm" variant="outline">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </WaliMuridFormModal>
                    <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete('wali-murid', row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Columns untuk Data Admin
    const adminColumns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: "Nama Admin",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "roles",
            header: "Role",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {row.original.roles.map((role) => (
                        <Badge key={role.name} variant="secondary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Tanggal Daftar",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('id-ID'),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <AdminFormModal mode="edit" admin={row.original}>
                        <Button size="sm" variant="outline">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </AdminFormModal>
                    <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete('admin', row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
                        <p className="text-muted-foreground">
                            Kelola semua data pengguna dalam sistem e-raport
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_guru}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <UserCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_siswa}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Total Wali Murid</CardTitle>
                            <Users className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_wali_murid}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
                            <Shield className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_admin}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Tables with Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Pengguna</CardTitle>
                        <CardDescription>
                            Kelola data pengguna berdasarkan kategori
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="guru" className="w-full">
                            <div className="flex items-center justify-between">
                                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                                    <TabsTrigger value="guru">Data Guru</TabsTrigger>
                                    <TabsTrigger value="siswa">Data Siswa</TabsTrigger>
                                    <TabsTrigger value="wali-murid">Wali Murid</TabsTrigger>
                                    <TabsTrigger value="admin">Admin</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <TabsContent value="guru" className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Data Guru ({stats.total_guru})</h3>
                                    <GuruFormModal mode="create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Guru
                                        </Button>
                                    </GuruFormModal>
                                </div>
                                <DataTable 
                                    columns={guruColumns} 
                                    data={guru} 
                                    searchKey="name"
                                    searchPlaceholder="Cari nama guru..."
                                />
                            </TabsContent>
                            
                            <TabsContent value="siswa" className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Data Siswa ({stats.total_siswa})</h3>
                                    <SiswaFormModal mode="create" kelasList={kelasList}>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Siswa
                                        </Button>
                                    </SiswaFormModal>
                                </div>
                                <DataTable 
                                    columns={siswaColumns} 
                                    data={siswa} 
                                    searchKey="name"
                                    searchPlaceholder="Cari nama siswa..."
                                />
                            </TabsContent>
                            
                            <TabsContent value="wali-murid" className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Data Wali Murid ({stats.total_wali_murid})</h3>
                                    <WaliMuridFormModal mode="create" siswaList={siswaList}>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Wali Murid
                                        </Button>
                                    </WaliMuridFormModal>
                                </div>
                                <DataTable 
                                    columns={waliMuridColumns} 
                                    data={wali_murid} 
                                    searchKey="name"
                                    searchPlaceholder="Cari nama wali murid..."
                                />
                            </TabsContent>
                            
                            <TabsContent value="admin" className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Data Admin ({stats.total_admin})</h3>
                                    <AdminFormModal mode="create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Admin
                                        </Button>
                                    </AdminFormModal>
                                </div>
                                <DataTable 
                                    columns={adminColumns} 
                                    data={admin} 
                                    searchKey="name"
                                    searchPlaceholder="Cari nama admin..."
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
