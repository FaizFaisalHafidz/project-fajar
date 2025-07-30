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
import { Award, PlusCircle, Search, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import FormModal from './FormModal';

interface MataPelajaran {
    id: number;
    nama_mapel: string;
    kode_mapel: string;
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
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Semester {
    id: number;
    nama_semester: string;
    tahun_ajaran: TahunAjaran;
}

interface Kkm {
    id: number;
    mata_pelajaran_id: number;
    kelas_id: number;
    semester_id: number;
    nilai_kkm: number;
    mata_pelajaran: MataPelajaran;
    kelas: Kelas;
    semester: Semester;
}

interface Stats {
    total_kkm: number;
    rata_rata_kkm: number;
    kkm_tertinggi: number;
}

interface Props {
    kkms: Kkm[];
    mataPelajarans: MataPelajaran[];
    kelas: Kelas[];
    semesters: Semester[];
    stats: Stats;
}

const columnHelper = createColumnHelper<Kkm>();

const columns = [
    columnHelper.accessor('mata_pelajaran', {
        header: 'Mata Pelajaran',
        cell: (info) => (
            <div>
                <div className="font-medium">{info.getValue().nama_mapel}</div>
                <div className="text-sm text-gray-500">{info.getValue().kode_mapel}</div>
            </div>
        ),
    }),
    columnHelper.accessor('kelas', {
        header: 'Kelas',
        cell: (info) => (
            <div>
                <div className="font-medium">
                    {info.getValue().tingkat_kelas} {info.getValue().nama_kelas}
                </div>
                <div className="text-sm text-gray-500">{info.getValue().jurusan.nama_jurusan}</div>
            </div>
        ),
    }),
    columnHelper.accessor('semester', {
        header: 'Semester',
        cell: (info) => (
            <div>
                <div className="font-medium">{info.getValue().nama_semester}</div>
                <div className="text-sm text-gray-500">{info.getValue().tahun_ajaran.nama_tahun_ajaran}</div>
            </div>
        ),
    }),
    columnHelper.accessor('nilai_kkm', {
        header: 'Nilai KKM',
        cell: (info) => (
            <Badge variant={info.getValue() >= 75 ? "default" : "secondary"} className="font-mono">
                {info.getValue()}
            </Badge>
        ),
    }),
];

export default function Index({ kkms, mataPelajarans, kelas, semesters, stats }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingKkm, setEditingKkm] = useState<Kkm | null>(null);

    const table = useReactTable({
        data: kkms,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleEdit = (kkm: Kkm) => {
        setEditingKkm(kkm);
        setIsFormModalOpen(true);
    };

    const handleAdd = () => {
        setEditingKkm(null);
        setIsFormModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Data KKM" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Data KKM (Kriteria Ketuntasan Minimal)
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola standar nilai KKM untuk setiap mata pelajaran per kelas dan semester
                            </p>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Button onClick={handleAdd} className="inline-flex items-center">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Tambah KKM
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total KKM
                                </CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_kkm}</div>
                                <p className="text-xs text-muted-foreground">
                                    Standar KKM terdaftar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Rata-rata KKM
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.rata_rata_kkm.toFixed(1)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Rata-rata nilai KKM
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    KKM Tertinggi
                                </CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.kkm_tertinggi}</div>
                                <p className="text-xs text-muted-foreground">
                                    Nilai KKM tertinggi
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Daftar KKM</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari KKM..."
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
                                                            ? 'Tidak ada KKM yang sesuai dengan pencarian'
                                                            : 'Belum ada data KKM'}
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
                        kkm={editingKkm}
                        mataPelajarans={mataPelajarans}
                        kelas={kelas}
                        semesters={semesters}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
