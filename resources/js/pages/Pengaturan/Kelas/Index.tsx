import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { RotateCcw, Save, Search, Settings, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
}

interface Guru {
    id: number;
    user: User;
}

interface Jurusan {
    id: number;
    nama_jurusan: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    wali_kelas_id?: number;
    jurusan: Jurusan;
    wali_kelas?: Guru;
    penugasan_mengajar_count: number;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Stats {
    total_kelas: number;
    kelas_dengan_wali: number;
    total_penugasan: number;
}

interface Props {
    kelas: Kelas[];
    gurus: Guru[];
    tahunAjaranAktif: TahunAjaran;
    stats: Stats;
}

const columnHelper = createColumnHelper<Kelas>();

export default function Index({ kelas, gurus, tahunAjaranAktif, stats }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [editingAssignments, setEditingAssignments] = useState<{[key: number]: number | null}>({});

    const { data, setData, post, processing } = useForm({
        assignments: [] as {kelas_id: number, wali_kelas_id: number | null}[]
    });

    const table = useReactTable({
        data: kelas,
        columns: [
            columnHelper.accessor('tingkat_kelas', {
                header: 'Tingkat',
                cell: (info) => (
                    <Badge variant="outline">
                        Kelas {info.getValue()}
                    </Badge>
                ),
            }),
            columnHelper.accessor('nama_kelas', {
                header: 'Nama Kelas',
                cell: (info) => (
                    <div>
                        <div className="font-medium">{info.getValue()}</div>
                        <div className="text-sm text-gray-500">{info.row.original.jurusan.nama_jurusan}</div>
                    </div>
                ),
            }),
            columnHelper.accessor('wali_kelas', {
                header: 'Wali Kelas',
                cell: (info) => {
                    const kelasId = info.row.original.id;
                    const currentWali = info.getValue();
                    const editingValue = editingAssignments[kelasId];
                    
                    return (
                        <div className="min-w-[200px]">
                            <select
                                value={editingValue !== undefined ? (editingValue?.toString() || '') : (currentWali?.id.toString() || '')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setEditingAssignments(prev => ({
                                        ...prev,
                                        [kelasId]: value ? parseInt(value) : null
                                    }));
                                }}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Tidak ada</option>
                                {gurus.map((guru) => (
                                    <option key={guru.id} value={guru.id.toString()}>
                                        {guru.user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                },
            }),
            columnHelper.accessor('penugasan_mengajar_count', {
                header: 'Guru Mengajar',
                cell: (info) => (
                    <Badge variant={info.getValue() > 0 ? "default" : "secondary"}>
                        {info.getValue()}
                    </Badge>
                ),
            }),
        ],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleSaveAssignments = () => {
        const assignments = Object.entries(editingAssignments).map(([kelasId, waliKelasId]) => ({
            kelas_id: parseInt(kelasId),
            wali_kelas_id: waliKelasId,
        }));

        if (assignments.length === 0) {
            toast.error('Tidak ada perubahan untuk disimpan', {
                position: 'top-right',
            });
            return;
        }

        setData('assignments', assignments);
        
        post(route('pengaturan.kelas.bulk-assign-wali'), {
            onSuccess: () => {
                toast.success('Penugasan wali kelas berhasil disimpan', {
                    position: 'top-right',
                });
                setEditingAssignments({});
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat menyimpan penugasan', {
                    position: 'top-right',
                });
            },
        });
    };

    const handleResetWaliKelas = () => {
        if (confirm('Apakah Anda yakin ingin mereset semua penugasan wali kelas?')) {
            post(route('pengaturan.kelas.reset-wali'), {
                onSuccess: () => {
                    toast.success('Semua penugasan wali kelas berhasil direset', {
                        position: 'top-right',
                    });
                    setEditingAssignments({});
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat mereset penugasan', {
                        position: 'top-right',
                    });
                },
            });
        }
    };

    const hasChanges = Object.keys(editingAssignments).length > 0;

    return (
        <AppLayout>
            <Head title="Pengaturan Kelas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Pengaturan Kelas
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola penugasan wali kelas untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran}
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
                            {hasChanges && (
                                <Button 
                                    onClick={handleSaveAssignments}
                                    disabled={processing}
                                    className="inline-flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            )}
                            <Button 
                                variant="outline"
                                onClick={handleResetWaliKelas}
                                disabled={processing}
                                className="inline-flex items-center"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Semua
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Kelas
                                </CardTitle>
                                <Settings className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_kelas}</div>
                                <p className="text-xs text-muted-foreground">
                                    Kelas aktif tahun ini
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Kelas dengan Wali
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.kelas_dengan_wali}</div>
                                <p className="text-xs text-muted-foreground">
                                    Sudah ada wali kelas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Penugasan
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_penugasan}</div>
                                <p className="text-xs text-muted-foreground">
                                    Penugasan mengajar aktif
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Daftar Kelas & Penugasan Wali</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari kelas..."
                                        value={globalFilter ?? ''}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            {hasChanges && (
                                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                                    <p className="text-sm text-amber-700">
                                        <strong>Perhatian:</strong> Anda memiliki perubahan yang belum disimpan. 
                                        Klik "Simpan Perubahan" untuk menyimpan atau refresh halaman untuk membatalkan.
                                    </p>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <tr key={headerGroup.id} className="border-b bg-gray-50">
                                                    {headerGroup.headers.map((header) => (
                                                        <th
                                                            key={header.id}
                                                            className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                                                        >
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                      header.column.columnDef.header,
                                                                      header.getContext()
                                                                  )}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody>
                                            {table.getRowModel().rows.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="px-4 py-8 text-center text-gray-500"
                                                    >
                                                        {globalFilter
                                                            ? 'Tidak ada kelas yang sesuai dengan pencarian'
                                                            : 'Belum ada data kelas'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                table.getRowModel().rows.map((row) => (
                                                    <tr key={row.id} className="border-b hover:bg-gray-50">
                                                        {row.getVisibleCells().map((cell) => (
                                                            <td key={cell.id} className="px-4 py-3">
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
