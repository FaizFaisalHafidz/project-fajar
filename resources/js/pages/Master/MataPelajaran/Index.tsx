import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { BookOpen, ClipboardList, PlusCircle, Search, Users } from 'lucide-react';
import { useState } from 'react';
import FormModal from './FormModal';

interface MataPelajaran {
    id: number;
    kode_mapel: string;
    nama_mapel: string;
    deskripsi?: string;
    jam_pelajaran: number;
    komponen_nilai_count: number;
    penugasan_mengajar_count: number;
    kkm_count: number;
    nama_lengkap: string;
}

interface Stats {
    total_mata_pelajaran: number;
    mata_pelajaran_aktif: number;
    mata_pelajaran_dengan_kkm: number;
}

interface Props {
    mataPelajarans: MataPelajaran[];
    stats: Stats;
}

const columnHelper = createColumnHelper<MataPelajaran>();

const columns = [
    columnHelper.accessor('kode_mapel', {
        header: 'Kode',
        cell: (info) => (
            <Badge variant="outline" className="font-mono">
                {info.getValue()}
            </Badge>
        ),
    }),
    columnHelper.accessor('nama_mapel', {
        header: 'Nama Mata Pelajaran',
        cell: (info) => (
            <div>
                <div className="font-medium">{info.getValue()}</div>
                {info.row.original.deskripsi && (
                    <div className="text-sm text-gray-500 mt-1">
                        {info.row.original.deskripsi}
                    </div>
                )}
            </div>
        ),
    }),
    columnHelper.accessor('jam_pelajaran', {
        header: 'Jam Pelajaran',
        cell: (info) => (
            <Badge variant="secondary">
                {info.getValue()} JP
            </Badge>
        ),
    }),
    columnHelper.accessor('penugasan_mengajar_count', {
        header: 'Guru Mengajar',
        cell: (info) => (
            <div className="text-center">
                <Badge variant={info.getValue() > 0 ? "default" : "secondary"}>
                    {info.getValue()}
                </Badge>
            </div>
        ),
    }),
    columnHelper.accessor('kkm_count', {
        header: 'KKM',
        cell: (info) => (
            <div className="text-center">
                <Badge variant={info.getValue() > 0 ? "default" : "secondary"}>
                    {info.getValue()}
                </Badge>
            </div>
        ),
    }),
];

export default function Index({ mataPelajarans, stats }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingMataPelajaran, setEditingMataPelajaran] = useState<MataPelajaran | null>(null);

    const table = useReactTable({
        data: mataPelajarans,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleEdit = (mataPelajaran: MataPelajaran) => {
        setEditingMataPelajaran(mataPelajaran);
        setIsFormModalOpen(true);
    };

    const handleAdd = () => {
        setEditingMataPelajaran(null);
        setIsFormModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Data Mata Pelajaran" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Data Mata Pelajaran
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola data mata pelajaran yang tersedia di sekolah
                            </p>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Button onClick={handleAdd} className="inline-flex items-center">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Tambah Mata Pelajaran
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Mata Pelajaran
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_mata_pelajaran}</div>
                                <p className="text-xs text-muted-foreground">
                                    Mata pelajaran terdaftar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Mapel Aktif
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.mata_pelajaran_aktif}</div>
                                <p className="text-xs text-muted-foreground">
                                    Ada penugasan mengajar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Mapel dengan KKM
                                </CardTitle>
                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.mata_pelajaran_dengan_kkm}</div>
                                <p className="text-xs text-muted-foreground">
                                    Sudah memiliki standar KKM
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Daftar Mata Pelajaran</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari mata pelajaran..."
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
                                                        colSpan={columns.length + 1}
                                                        className="px-4 py-8 text-center text-gray-500"
                                                    >
                                                        {globalFilter
                                                            ? 'Tidak ada mata pelajaran yang sesuai dengan pencarian'
                                                            : 'Belum ada data mata pelajaran'}
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
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(row.original)}
                                                            >
                                                                Edit
                                                            </Button>
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

                    {/* Form Modal */}
                    <FormModal
                        isOpen={isFormModalOpen}
                        onClose={() => setIsFormModalOpen(false)}
                        mataPelajaran={editingMataPelajaran}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
