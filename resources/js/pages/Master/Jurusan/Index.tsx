import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, GraduationCap, Plus, Settings2, Users } from 'lucide-react';
import { useState } from 'react';
import { JurusanFormModal } from './components/jurusan-form-modal';

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
    deskripsi: string | null;
    kelas_count: number;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total_jurusan: number;
    jurusan_dengan_kelas: number;
    jurusan_tanpa_kelas: number;
}

interface Props {
    auth: {
        user: User;
    };
    jurusans: Jurusan[];
    stats: Stats;
}

export default function JurusanIndex({ auth, jurusans, stats }: Props) {
    const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const columns: ColumnDef<Jurusan>[] = [
        {
            accessorKey: 'kode_jurusan',
            header: 'Kode Jurusan',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                        {row.getValue('kode_jurusan')}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'nama_jurusan',
            header: 'Nama Jurusan',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{row.getValue('nama_jurusan')}</span>
                </div>
            ),
        },
        {
            accessorKey: 'deskripsi',
            header: 'Deskripsi',
            cell: ({ row }) => {
                const deskripsi = row.getValue('deskripsi') as string | null;
                return (
                    <div className="max-w-xs">
                        {deskripsi ? (
                            <p className="text-sm text-muted-foreground truncate" title={deskripsi}>
                                {deskripsi}
                            </p>
                        ) : (
                            <span className="text-sm text-muted-foreground italic">-</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'kelas_count',
            header: 'Jumlah Kelas',
            cell: ({ row }) => {
                const count = row.getValue('kelas_count') as number;
                return (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Badge variant={count > 0 ? 'default' : 'secondary'}>
                            {count} Kelas
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const jurusan = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedJurusan(jurusan);
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
            <Head title="Data Master - Jurusan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Data Master - Jurusan
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola data jurusan sekolah
                            </p>
                        </div>
                        <Button onClick={() => setIsFormModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Jurusan
                        </Button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Jurusan</CardTitle>
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_jurusan}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total jurusan terdaftar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Jurusan Aktif</CardTitle>
                                <Users className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.jurusan_dengan_kelas}</div>
                                <p className="text-xs text-muted-foreground">
                                    Jurusan yang memiliki kelas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Jurusan Kosong</CardTitle>
                                <BookOpen className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-600">{stats.jurusan_tanpa_kelas}</div>
                                <p className="text-xs text-muted-foreground">
                                    Jurusan tanpa kelas
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Jurusan</CardTitle>
                            <CardDescription>
                                Kelola dan pantau data jurusan sekolah
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={jurusans}
                                searchPlaceholder="Cari jurusan..."
                                searchKey="nama_jurusan"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Modal */}
            <JurusanFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedJurusan(null);
                }}
                jurusan={selectedJurusan}
            />
        </AppLayout>
    );
}
