import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, Plus, School, Settings2, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { KelasFormModal } from './components/kelas-form-modal';

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface Jurusan {
    id: number;
    kode_jurusan: string;
    nama_jurusan: string;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Guru {
    id: number;
    nama_guru: string;
    nip: string;
}

interface Kelas {
    id: number;
    jurusan_id: number;
    tahun_ajaran_id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    wali_kelas_id: number | null;
    siswa_count: number;
    created_at: string;
    updated_at: string;
    jurusan: Jurusan;
    tahun_ajaran: TahunAjaran;
    wali_kelas: Guru | null;
}

interface Stats {
    total_kelas: number;
    kelas_dengan_siswa: number;
    kelas_tanpa_wali: number;
}

interface Props {
    auth: {
        user: User;
    };
    kelas: Kelas[];
    jurusanList: Jurusan[];
    tahunAjaranList: TahunAjaran[];
    guruList: Guru[];
    stats: Stats;
}

const tingkatKelasMap: { [key: number]: string } = {
    1: 'Kelas X',
    2: 'Kelas XI',
    3: 'Kelas XII',
};

export default function KelasIndex({ auth, kelas, jurusanList, tahunAjaranList, guruList, stats }: Props) {
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const columns: ColumnDef<Kelas>[] = [
        {
            accessorKey: 'tahun_ajaran.nama_tahun_ajaran',
            header: 'Tahun Ajaran',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{row.original.tahun_ajaran?.nama_tahun_ajaran}</span>
                </div>
            ),
        },
        {
            accessorKey: 'tingkat_kelas',
            header: 'Tingkat',
            cell: ({ row }) => (
                <Badge variant="outline">
                    {tingkatKelasMap[row.getValue('tingkat_kelas') as number]}
                </Badge>
            ),
        },
        {
            accessorKey: 'nama_kelas',
            header: 'Nama Kelas',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{row.getValue('nama_kelas')}</span>
                </div>
            ),
        },
        {
            accessorKey: 'jurusan.kode_jurusan',
            header: 'Jurusan',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        {row.original.jurusan?.kode_jurusan}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        {row.original.jurusan?.nama_jurusan}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'wali_kelas.nama_guru',
            header: 'Wali Kelas',
            cell: ({ row }) => {
                const waliKelas = row.original.wali_kelas;
                return (
                    <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        {waliKelas ? (
                            <span className="text-sm">{waliKelas.nama_guru}</span>
                        ) : (
                            <span className="text-sm text-muted-foreground italic">Belum ditentukan</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'siswa_count',
            header: 'Jumlah Siswa',
            cell: ({ row }) => {
                const count = row.getValue('siswa_count') as number;
                return (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Badge variant={count > 0 ? 'default' : 'secondary'}>
                            {count} Siswa
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const kelas = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedKelas(kelas);
                                setIsFormModalOpen(true);
                            }}
                        >
                            <Settings2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <Head title="Data Master - Kelas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Data Master - Kelas
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola data kelas untuk setiap jurusan dan tahun ajaran
                            </p>
                        </div>
                        <Button onClick={() => setIsFormModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Kelas
                        </Button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                                <School className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_kelas}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total kelas terdaftar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Kelas Aktif</CardTitle>
                                <Users className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.kelas_dengan_siswa}</div>
                                <p className="text-xs text-muted-foreground">
                                    Kelas yang memiliki siswa
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tanpa Wali Kelas</CardTitle>
                                <UserCheck className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{stats.kelas_tanpa_wali}</div>
                                <p className="text-xs text-muted-foreground">
                                    Kelas belum ada wali kelas
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Kelas</CardTitle>
                            <CardDescription>
                                Kelola dan pantau data kelas untuk setiap jurusan dan tahun ajaran
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={kelas}
                                searchPlaceholder="Cari kelas..."
                                searchKey="nama_kelas"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Modal */}
            <KelasFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedKelas(null);
                }}
                kelas={selectedKelas}
                jurusanList={jurusanList}
                tahunAjaranList={tahunAjaranList}
                guruList={guruList}
            />
        </AppLayout>
    );
}
