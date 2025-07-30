import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { AlertCircle, Eye, FileText, Plus, Search, Trash2, UserCheck, Users } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
}

interface Guru {
    id: number;
    user: User;
    kelas_wali?: Kelas[];
}

interface Jurusan {
    id: number;
    nama_jurusan: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    jurusan: Jurusan;
    siswa_count: number;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Stats {
    total_wali_kelas: number;
    kelas_tanpa_wali: number;
    guru_available: number;
    total_siswa_terbina: number;
}

interface Props {
    waliKelas: Guru[];
    kelasWithoutWali: Kelas[];
    availableGurus: Guru[];
    tahunAjaranAktif: TahunAjaran;
    stats: Stats;
}

const columnHelper = createColumnHelper<Guru>();

export default function Index({ waliKelas, kelasWithoutWali, availableGurus, tahunAjaranAktif, stats }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const { data, setData, post, delete: destroy, processing, reset } = useForm({
        guru_id: '',
        kelas_id: '',
    });

    const table = useReactTable({
        data: waliKelas,
        columns: [
            columnHelper.accessor('user.name', {
                header: 'Nama Guru',
                cell: (info) => (
                    <div className="font-medium text-blue-600">
                        {info.getValue()}
                    </div>
                ),
            }),
            columnHelper.accessor('kelas_wali', {
                header: 'Kelas yang Dibina',
                cell: (info) => {
                    const kelas = info.getValue();
                    if (!kelas || kelas.length === 0) return '-';
                    
                    const k = kelas[0];
                    return (
                        <div>
                            <div className="font-medium">
                                {k.tingkat_kelas} {k.nama_kelas}
                            </div>
                            <div className="text-sm text-gray-500">{k.jurusan.nama_jurusan}</div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor('kelas_wali', {
                id: 'siswa_count',
                header: 'Jumlah Siswa',
                cell: (info) => {
                    const kelas = info.getValue();
                    if (!kelas || kelas.length === 0) return '-';
                    
                    return (
                        <Badge variant="default">
                            {kelas[0].siswa_count} siswa
                        </Badge>
                    );
                },
            }),
        ],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleAssignWaliKelas = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('pengaturan.wali-kelas.assign'), {
            onSuccess: () => {
                toast.success('Wali kelas berhasil ditugaskan', {
                    position: 'top-right',
                });
                setIsAssignModalOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat menugaskan wali kelas', {
                    position: 'top-right',
                });
            },
        });
    };

    const handleRemoveWaliKelas = (guruId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus penugasan wali kelas ini?')) {
            destroy(route('pengaturan.wali-kelas.remove', guruId), {
                onSuccess: () => {
                    toast.success('Penugasan wali kelas berhasil dihapus', {
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menghapus penugasan', {
                        position: 'top-right',
                    });
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Wali Kelas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Pengaturan Wali Kelas
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola penugasan wali kelas untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran}
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
                            <Button 
                                onClick={() => window.open(route('pengaturan.wali-kelas.laporan'), '_blank')}
                                variant="outline"
                                className="inline-flex items-center"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Laporan
                            </Button>
                            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="inline-flex items-center">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tugaskan Wali Kelas
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Tugaskan Wali Kelas</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAssignWaliKelas} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Pilih Guru</label>
                                            <Select
                                                value={data.guru_id}
                                                onValueChange={(value) => setData('guru_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih guru" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableGurus.map((guru) => (
                                                        <SelectItem key={guru.id} value={guru.id.toString()}>
                                                            {guru.user.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Pilih Kelas</label>
                                            <Select
                                                value={data.kelas_id}
                                                onValueChange={(value) => setData('kelas_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kelas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kelasWithoutWali.map((kelas) => (
                                                        <SelectItem key={kelas.id} value={kelas.id.toString()}>
                                                            {kelas.tingkat_kelas} {kelas.nama_kelas} - {kelas.jurusan.nama_jurusan}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={() => setIsAssignModalOpen(false)}
                                            >
                                                Batal
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Menyimpan...' : 'Tugaskan'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Wali Kelas
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_wali_kelas}</div>
                                <p className="text-xs text-muted-foreground">
                                    Guru yang ditugaskan
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Kelas Tanpa Wali
                                </CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-amber-600">{stats.kelas_tanpa_wali}</div>
                                <p className="text-xs text-muted-foreground">
                                    Perlu penugasan
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Guru Tersedia
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.guru_available}</div>
                                <p className="text-xs text-muted-foreground">
                                    Belum ditugaskan
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Siswa Terbina
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_siswa_terbina}</div>
                                <p className="text-xs text-muted-foreground">
                                    Siswa dalam bimbingan
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alert untuk kelas tanpa wali */}
                    {kelasWithoutWali.length > 0 && (
                        <Card className="border-amber-200 bg-amber-50 mb-6">
                            <CardContent className="pt-6">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-medium text-amber-800">
                                            Kelas yang Belum Memiliki Wali Kelas
                                        </h3>
                                        <div className="mt-2 text-sm text-amber-700">
                                            <div className="flex flex-wrap gap-2">
                                                {kelasWithoutWali.map((kelas) => (
                                                    <Badge key={kelas.id} variant="outline" className="border-amber-300 text-amber-700">
                                                        {kelas.tingkat_kelas} {kelas.nama_kelas}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Daftar Wali Kelas Aktif</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari wali kelas..."
                                        value={globalFilter ?? ''}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
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
                                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                        Aksi
                                                    </th>
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
                                                            ? 'Tidak ada wali kelas yang sesuai dengan pencarian'
                                                            : 'Belum ada wali kelas yang ditugaskan'}
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
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.open(
                                                                        route('pengaturan.wali-kelas.detail', row.original.id), 
                                                                        '_blank'
                                                                    )}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveWaliKelas(row.original.id)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                    disabled={processing}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
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
