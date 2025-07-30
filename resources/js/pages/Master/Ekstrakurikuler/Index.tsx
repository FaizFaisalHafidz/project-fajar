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
import { PlusCircle, Search, Trophy, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import FormModal from './FormModal';

interface Guru {
    id: number;
    user: {
        name: string;
    };
    nip: string;
    nama_lengkap: string;
}

interface Ekstrakurikuler {
    id: number;
    nama_ekstrakurikuler: string;
    deskripsi?: string;
    pembina_id: number;
    status_aktif: boolean;
    nilai_ekstrakurikuler_count: number;
    pembina: Guru;
}

interface Stats {
    total_ekstrakurikuler: number;
    ekstrakurikuler_aktif: number;
    ekstrakurikuler_dengan_peserta: number;
}

interface Props {
    ekstrakurikulers: Ekstrakurikuler[];
    gurus: Guru[];
    stats: Stats;
}

const columnHelper = createColumnHelper<Ekstrakurikuler>();

const columns = [
    columnHelper.accessor('nama_ekstrakurikuler', {
        header: 'Nama Ekstrakurikuler',
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
    columnHelper.accessor('pembina', {
        header: 'Pembina',
        cell: (info) => (
            <div>
                <div className="font-medium">{info.getValue()?.user?.name}</div>
                <div className="text-sm text-gray-500">
                    NIP: {info.getValue()?.nip}
                </div>
            </div>
        ),
    }),
    columnHelper.accessor('status_aktif', {
        header: 'Status',
        cell: (info) => (
            <Badge variant={info.getValue() ? "default" : "secondary"}>
                {info.getValue() ? 'Aktif' : 'Tidak Aktif'}
            </Badge>
        ),
    }),
    columnHelper.accessor('nilai_ekstrakurikuler_count', {
        header: 'Peserta',
        cell: (info) => (
            <div className="text-center">
                <Badge variant={info.getValue() > 0 ? "default" : "secondary"}>
                    {info.getValue()}
                </Badge>
            </div>
        ),
    }),
];

export default function Index({ ekstrakurikulers, gurus, stats }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingEkstrakurikuler, setEditingEkstrakurikuler] = useState<Ekstrakurikuler | null>(null);

    const table = useReactTable({
        data: ekstrakurikulers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleEdit = (ekstrakurikuler: Ekstrakurikuler) => {
        setEditingEkstrakurikuler(ekstrakurikuler);
        setIsFormModalOpen(true);
    };

    const handleAdd = () => {
        setEditingEkstrakurikuler(null);
        setIsFormModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Data Ekstrakurikuler" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Data Ekstrakurikuler
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola data ekstrakurikuler yang tersedia di sekolah
                            </p>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Button onClick={handleAdd} className="inline-flex items-center">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Tambah Ekstrakurikuler
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Ekstrakurikuler
                                </CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_ekstrakurikuler}</div>
                                <p className="text-xs text-muted-foreground">
                                    Ekstrakurikuler terdaftar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Ekstrakurikuler Aktif
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.ekstrakurikuler_aktif}</div>
                                <p className="text-xs text-muted-foreground">
                                    Sedang berjalan
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Ada Peserta
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.ekstrakurikuler_dengan_peserta}</div>
                                <p className="text-xs text-muted-foreground">
                                    Sudah memiliki peserta
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Daftar Ekstrakurikuler</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari ekstrakurikuler..."
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
                                                            ? 'Tidak ada ekstrakurikuler yang sesuai dengan pencarian'
                                                            : 'Belum ada data ekstrakurikuler'}
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
                        ekstrakurikuler={editingEkstrakurikuler}
                        gurus={gurus}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
