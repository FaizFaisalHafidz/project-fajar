import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Award, Download, Medal, RefreshCw, Star, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Kelas {
    id: number;
    nama_kelas: string;
    jurusan: {
        nama_jurusan: string;
    };
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Semester {
    id: number;
    nama_semester: string;
}

interface PrestasiSiswa {
    id: number;
    siswa: {
        id: number;
        nis: string;
        user: {
            name: string;
        };
        kelas: {
            nama_kelas: string;
            jurusan: {
                nama_jurusan: string;
            };
        };
    };
    nama_prestasi: string;
    jenis_prestasi: string;
    tingkat: string; // Bukan tingkat_lomba, tapi tingkat sesuai model
    peringkat: string;
    tanggal_prestasi: string;
    deskripsi: string; // Bukan keterangan, tapi deskripsi sesuai model
}

interface Props {
    tahunAjaranAktif: TahunAjaran;
    semesterAktif: Semester;
    kelasList: Kelas[];
    prestasi: PrestasiSiswa[];
    summary: {
        total_prestasi: number;
        prestasi_internasional: number;
        prestasi_nasional: number;
        prestasi_provinsi: number;
        prestasi_kabupaten: number;
        prestasi_kecamatan: number;
        prestasi_sekolah: number;
    };
    jenisPrestasiStats: Record<string, number>;
    filters: {
        kelas_id?: string;
        tingkat_lomba?: string;
        jenis_prestasi?: string;
    };
}

export default function LaporanPrestasi({ 
    tahunAjaranAktif, 
    semesterAktif, 
    kelasList, 
    prestasi, 
    summary, 
    jenisPrestasiStats,
    filters 
}: Props) {
    const [selectedKelas, setSelectedKelas] = useState<string>(filters.kelas_id || '');
    const [selectedTingkat, setSelectedTingkat] = useState<string>(filters.tingkat_lomba || '');
    const [selectedJenis, setSelectedJenis] = useState<string>(filters.jenis_prestasi || '');
    const [loading, setLoading] = useState(false);

    const tingkatLombaOptions = [
        'Internasional',
        'Nasional', 
        'Provinsi',
        'Kabupaten/Kota',
        'Kecamatan',
        'Sekolah'
    ];

    const jenisPrestasiOptions = [
        'Akademik',
        'Non-Akademik',
        'Olahraga',
        'Seni',
        'Teknologi',
        'Lainnya'
    ];

    const fetchData = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedKelas) params.append('kelas_id', selectedKelas);
        if (selectedTingkat) params.append('tingkat_lomba', selectedTingkat);
        if (selectedJenis) params.append('jenis_prestasi', selectedJenis);

        router.get(`/laporan/prestasi?${params}`, {}, {
            preserveState: true,
            onFinish: () => setLoading(false)
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [selectedKelas, selectedTingkat, selectedJenis]);

    const handleExport = (format: 'excel' | 'pdf') => {
        const params = {
            format: format,
            kelas_id: selectedKelas || undefined,
            tingkat_lomba: selectedTingkat || undefined,
            jenis_prestasi: selectedJenis || undefined,
        };

        router.post('/laporan/prestasi/export', params, {
            onSuccess: () => {
                toast.success(`Export ${format.toUpperCase()} berhasil diproses`);
            },
            onError: () => {
                toast.error('Gagal melakukan export');
            }
        });
    };

    const getTingkatIcon = (tingkat: string) => {
        switch (tingkat) {
            case 'Internasional':
                return <Trophy className="h-4 w-4 text-yellow-500" />;
            case 'Nasional':
                return <Award className="h-4 w-4 text-red-500" />;
            case 'Provinsi':
                return <Medal className="h-4 w-4 text-blue-500" />;
            default:
                return <Star className="h-4 w-4 text-green-500" />;
        }
    };

    const getTingkatColor = (tingkat: string) => {
        switch (tingkat) {
            case 'Internasional':
                return 'bg-yellow-100 text-yellow-800';
            case 'Nasional':
                return 'bg-red-100 text-red-800';
            case 'Provinsi':
                return 'bg-blue-100 text-blue-800';
            case 'Kabupaten/Kota':
                return 'bg-green-100 text-green-800';
            case 'Kecamatan':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="Laporan Prestasi Siswa" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Laporan Prestasi Siswa</h1>
                        <p className="text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{summary.total_prestasi}</div>
                                    <p className="text-sm text-muted-foreground">Total Prestasi</p>
                                </div>
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">{summary.prestasi_internasional}</div>
                                    <p className="text-sm text-muted-foreground">Internasional</p>
                                </div>
                                <Trophy className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-red-600">{summary.prestasi_nasional}</div>
                                    <p className="text-sm text-muted-foreground">Nasional</p>
                                </div>
                                <Award className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">{summary.prestasi_provinsi}</div>
                                    <p className="text-sm text-muted-foreground">Provinsi</p>
                                </div>
                                <Medal className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Filter & Export Data</span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchData}
                                    disabled={loading}
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExport('excel')}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Excel
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExport('pdf')}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    PDF
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label htmlFor="kelas" className="block text-sm font-medium mb-2">
                                    Filter Kelas
                                </label>
                                <select
                                    id="kelas"
                                    value={selectedKelas}
                                    onChange={(e) => setSelectedKelas(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasList.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id.toString()}>
                                            {kelas.nama_kelas} - {kelas.jurusan.nama_jurusan}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="tingkat" className="block text-sm font-medium mb-2">
                                    Filter Tingkat Lomba
                                </label>
                                <select
                                    id="tingkat"
                                    value={selectedTingkat}
                                    onChange={(e) => setSelectedTingkat(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Semua Tingkat</option>
                                    {tingkatLombaOptions.map((tingkat) => (
                                        <option key={tingkat} value={tingkat}>
                                            {tingkat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="jenis" className="block text-sm font-medium mb-2">
                                    Filter Jenis Prestasi
                                </label>
                                <select
                                    id="jenis"
                                    value={selectedJenis}
                                    onChange={(e) => setSelectedJenis(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Semua Jenis</option>
                                    {jenisPrestasiOptions.map((jenis) => (
                                        <option key={jenis} value={jenis}>
                                            {jenis}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Nama Prestasi</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead>Tingkat</TableHead>
                                        <TableHead>Peringkat</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8">
                                                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                                Memuat data...
                                            </TableCell>
                                        </TableRow>
                                    ) : prestasi.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                                Tidak ada data prestasi
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        prestasi.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.siswa.nis}</TableCell>
                                                <TableCell className="font-medium">{item.siswa.user.name}</TableCell>
                                                <TableCell>
                                                    {item.siswa.kelas.nama_kelas} - {item.siswa.kelas.jurusan.nama_jurusan}
                                                </TableCell>
                                                <TableCell className="font-medium">{item.nama_prestasi}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{item.jenis_prestasi}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getTingkatIcon(item.tingkat)}
                                                        <Badge className={getTingkatColor(item.tingkat)}>
                                                            {item.tingkat}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{item.peringkat}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(item.tanggal_prestasi).toLocaleDateString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
