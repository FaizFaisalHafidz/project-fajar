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
import { BookOpen, Plus, Save, Search, Trash2, Users } from 'lucide-react';
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

interface MataPelajaran {
    id: number;
    nama_mapel: string;
    kode_mapel: string;
}

interface PenugasanMengajar {
    id: number;
    mata_pelajaran: MataPelajaran;
    guru: Guru;
    kelas: {
        id: number;
        nama_kelas: string;
        tingkat_kelas: number;
        jurusan: {
            nama_jurusan: string;
        };
    };
    tahun_ajaran: {
        nama_tahun_ajaran: string;
    };
}

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    jurusan: {
        id: number;
        nama_jurusan: string;
    };
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Stats {
    total_penugasan: number;
    total_guru_mengajar: number;
    total_mapel_aktif: number;
}

interface Props {
    penugasanMengajar: PenugasanMengajar[];
    gurus: Guru[];
    mataPelajarans: MataPelajaran[];
    kelas: Kelas[];
    tahunAjaranAktif: TahunAjaran;
    stats: Stats;
}

const columnHelper = createColumnHelper<PenugasanMengajar>();

export default function Index({ 
    penugasanMengajar, 
    gurus, 
    mataPelajarans, 
    kelas, 
    tahunAjaranAktif, 
    stats 
}: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedPenugasan, setSelectedPenugasan] = useState<number[]>([]);

    const { data, setData, post, delete: destroy, processing } = useForm({
        guru_id: '',
        mata_pelajaran_id: '',
        kelas_id: '',
        penugasan_ids: [] as number[],
    });

    const table = useReactTable({
        data: penugasanMengajar,
        columns: [
            columnHelper.display({
                id: 'select',
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className="rounded border-gray-300"
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className="rounded border-gray-300"
                    />
                ),
            }),
            columnHelper.accessor('guru.user.name', {
                header: 'Guru',
                cell: (info) => (
                    <div className="font-medium">{info.getValue()}</div>
                ),
            }),
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
                        <Badge variant="outline">
                            Kelas {info.getValue().tingkat_kelas}
                        </Badge>
                        <div className="text-sm mt-1">
                            {info.getValue().nama_kelas} - {info.getValue().jurusan.nama_jurusan}
                        </div>
                    </div>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePenugasan(row.original.id)}
                        disabled={processing}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                ),
            }),
        ],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            rowSelection: selectedPenugasan.reduce((acc, id) => {
                const index = penugasanMengajar.findIndex(p => p.id === id);
                if (index !== -1) acc[index] = true;
                return acc;
            }, {} as Record<string, boolean>),
        },
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: (updater) => {
            const newSelection = typeof updater === 'function' 
                ? updater(selectedPenugasan.reduce((acc, id) => {
                    const index = penugasanMengajar.findIndex(p => p.id === id);
                    if (index !== -1) acc[index] = true;
                    return acc;
                }, {} as Record<string, boolean>))
                : updater;
                
            const newSelectedIds = Object.keys(newSelection)
                .filter(key => newSelection[key])
                .map(key => penugasanMengajar[parseInt(key)]?.id)
                .filter(Boolean);
                
            setSelectedPenugasan(newSelectedIds);
        },
    });

    const handleAddPenugasan = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.guru_id || !data.mata_pelajaran_id || !data.kelas_id) {
            toast.error('Mohon lengkapi semua field', {
                position: 'top-right',
            });
            return;
        }

        post(route('pengaturan.mata-pelajaran.store'), {
            onSuccess: () => {
                toast.success('Penugasan mengajar berhasil ditambahkan', {
                    position: 'top-right',
                });
                setData({
                    guru_id: '',
                    mata_pelajaran_id: '',
                    kelas_id: '',
                    penugasan_ids: [],
                });
                setShowAddForm(false);
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat menambahkan penugasan', {
                    position: 'top-right',
                });
            },
        });
    };

    const handleDeletePenugasan = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus penugasan ini?')) {
            destroy(route('pengaturan.mata-pelajaran.destroy', id), {
                onSuccess: () => {
                    toast.success('Penugasan mengajar berhasil dihapus', {
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

    const handleBulkDelete = () => {
        if (selectedPenugasan.length === 0) {
            toast.error('Pilih penugasan yang akan dihapus', {
                position: 'top-right',
            });
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedPenugasan.length} penugasan?`)) {
            setData('penugasan_ids', selectedPenugasan);
            
            post(route('pengaturan.mata-pelajaran.bulk-delete'), {
                onSuccess: () => {
                    toast.success('Penugasan mengajar berhasil dihapus', {
                        position: 'top-right',
                    });
                    setSelectedPenugasan([]);
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
            <Head title="Pengaturan Mata Pelajaran" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Pengaturan Mata Pelajaran
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola penugasan mengajar untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran}
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
                            <Button 
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="inline-flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Penugasan
                            </Button>
                            {selectedPenugasan.length > 0 && (
                                <Button 
                                    variant="destructive"
                                    onClick={handleBulkDelete}
                                    disabled={processing}
                                    className="inline-flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Hapus Terpilih ({selectedPenugasan.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Penugasan
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_penugasan}</div>
                                <p className="text-xs text-muted-foreground">
                                    Penugasan mengajar aktif
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Guru Mengajar
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_guru_mengajar}</div>
                                <p className="text-xs text-muted-foreground">
                                    Guru yang memiliki penugasan
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Mata Pelajaran Aktif
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_mapel_aktif}</div>
                                <p className="text-xs text-muted-foreground">
                                    Mata pelajaran yang diajarkan
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Add Form */}
                    {showAddForm && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Tambah Penugasan Mengajar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddPenugasan} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Guru</label>
                                        <select
                                            value={data.guru_id}
                                            onChange={(e) => setData('guru_id', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option value="">Pilih Guru</option>
                                            {gurus.map((guru) => (
                                                <option key={guru.id} value={guru.id.toString()}>
                                                    {guru.user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Mata Pelajaran</label>
                                        <select
                                            value={data.mata_pelajaran_id}
                                            onChange={(e) => setData('mata_pelajaran_id', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option value="">Pilih Mata Pelajaran</option>
                                            {mataPelajarans.map((mapel) => (
                                                <option key={mapel.id} value={mapel.id.toString()}>
                                                    {mapel.kode_mapel} - {mapel.nama_mapel}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Kelas</label>
                                        <select
                                            value={data.kelas_id}
                                            onChange={(e) => setData('kelas_id', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {kelas.map((k) => (
                                                <option key={k.id} value={k.id.toString()}>
                                                    {k.tingkat_kelas} {k.nama_kelas} - {k.jurusan.nama_jurusan}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Menyimpan...' : 'Simpan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Daftar Penugasan Mengajar</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari penugasan..."
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
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody>
                                            {table.getRowModel().rows.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-4 py-8 text-center text-gray-500"
                                                    >
                                                        {globalFilter
                                                            ? 'Tidak ada penugasan yang sesuai dengan pencarian'
                                                            : 'Belum ada data penugasan mengajar'}
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
