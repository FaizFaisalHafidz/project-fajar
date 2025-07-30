import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, CheckCircle, Plus, Settings2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { TahunAjaranFormModal } from './components/tahun-ajaran-form-modal';

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total_tahun_ajaran: number;
    tahun_aktif: number;
    tahun_nonaktif: number;
}

interface Props {
    auth: {
        user: User;
    };
    tahunAjaran: TahunAjaran[];
    stats: Stats;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

export default function TahunAjaranIndex({ auth, tahunAjaran, stats }: Props) {
    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<TahunAjaran | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const columns: ColumnDef<TahunAjaran>[] = [
        {
            accessorKey: 'nama_tahun_ajaran',
            header: 'Nama Tahun Ajaran',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{row.getValue('nama_tahun_ajaran')}</span>
                </div>
            ),
        },
        {
            accessorKey: 'tanggal_mulai',
            header: 'Tanggal Mulai',
            cell: ({ row }) => formatDate(row.getValue('tanggal_mulai')),
        },
        {
            accessorKey: 'tanggal_selesai',
            header: 'Tanggal Selesai',
            cell: ({ row }) => formatDate(row.getValue('tanggal_selesai')),
        },
        {
            accessorKey: 'status_aktif',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('status_aktif') as boolean;
                return (
                    <Badge variant={isActive ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                        {isActive ? (
                            <>
                                <CheckCircle className="h-3 w-3" />
                                Aktif
                            </>
                        ) : (
                            <>
                                <XCircle className="h-3 w-3" />
                                Tidak Aktif
                            </>
                        )}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const tahunAjaran = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedTahunAjaran(tahunAjaran);
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
            <Head title="Data Master - Tahun Akademik" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Data Master - Tahun Akademik
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola data tahun akademik sekolah
                            </p>
                        </div>
                        <Button onClick={() => setIsFormModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Tahun Ajaran
                        </Button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Tahun Ajaran</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_tahun_ajaran}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total data tahun akademik
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tahun Aktif</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.tahun_aktif}</div>
                                <p className="text-xs text-muted-foreground">
                                    Tahun ajaran yang sedang aktif
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tahun Non-Aktif</CardTitle>
                                <XCircle className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-600">{stats.tahun_nonaktif}</div>
                                <p className="text-xs text-muted-foreground">
                                    Tahun ajaran yang tidak aktif
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Tahun Akademik</CardTitle>
                            <CardDescription>
                                Kelola dan pantau data tahun akademik sekolah
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={tahunAjaran}
                                searchPlaceholder="Cari tahun ajaran..."
                                searchKey="nama_tahun_ajaran"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Modal */}
            <TahunAjaranFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedTahunAjaran(null);
                }}
                tahunAjaran={selectedTahunAjaran}
            />
        </AppLayout>
    );
}
