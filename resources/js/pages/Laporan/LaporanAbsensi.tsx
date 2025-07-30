import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Download, RefreshCw, UserCheck, Users, UserX } from 'lucide-react';
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

interface AbsensiSiswa {
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
    jumlah_sakit: number;
    jumlah_izin: number;
    jumlah_tanpa_keterangan: number;
}

interface RekapSiswa {
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
    total_hadir: number;
    total_izin: number;
    total_sakit: number;
    total_alpha: number;
    total_keseluruhan: number;
    persentase_kehadiran: number;
}

interface Props {
    tahunAjaranAktif: TahunAjaran;
    semesterAktif: Semester;
    kelasList: Kelas[];
    absensi: AbsensiSiswa[];
    rekapPerSiswa: RekapSiswa[];
    summary: {
        total_keseluruhan: number;
        total_hadir: number;
        total_izin: number;
        total_sakit: number;
        total_alpha: number;
        persentase_hadir: number;
        persentase_izin: number;
        persentase_sakit: number;
        persentase_alpha: number;
    };
    filters: {
        kelas_id?: string;
        status_kehadiran?: string;
        start_date: string;
        end_date: string;
    };
}

export default function LaporanAbsensi({ 
    tahunAjaranAktif, 
    semesterAktif, 
    kelasList, 
    absensi, 
    rekapPerSiswa,
    summary, 
    filters 
}: Props) {
    const [selectedKelas, setSelectedKelas] = useState<string>(filters.kelas_id || '');
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status_kehadiran || '');
    const [startDate, setStartDate] = useState<string>(filters.start_date);
    const [endDate, setEndDate] = useState<string>(filters.end_date);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('rekap');

    const statusOptions = ['Hadir', 'Izin', 'Sakit', 'Alpha'];

    const fetchData = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedKelas) params.append('kelas_id', selectedKelas);

        router.get(`/laporan/absensi?${params}`, {}, {
            preserveState: true,
            onFinish: () => setLoading(false)
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [selectedKelas]);

    const handleExport = (format: 'excel' | 'pdf') => {
        const params = {
            format: format,
            kelas_id: selectedKelas || undefined,
        };

        router.post('/laporan/absensi/export', params, {
            onSuccess: () => {
                toast.success(`Export ${format.toUpperCase()} berhasil diproses`);
            },
            onError: () => {
                toast.error('Gagal melakukan export');
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Hadir':
                return 'bg-green-100 text-green-800';
            case 'Izin':
                return 'bg-blue-100 text-blue-800';
            case 'Sakit':
                return 'bg-yellow-100 text-yellow-800';
            case 'Alpha':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Hadir':
                return <UserCheck className="h-4 w-4 text-green-500" />;
            case 'Izin':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'Sakit':
                return <Users className="h-4 w-4 text-yellow-500" />;
            case 'Alpha':
                return <UserX className="h-4 w-4 text-red-500" />;
            default:
                return <Users className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <AppLayout>
            <Head title="Laporan Absensi Siswa" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Laporan Absensi Siswa</h1>
                        <p className="text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{summary.total_keseluruhan}</div>
                                    <p className="text-sm text-muted-foreground">Total Record</p>
                                </div>
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{summary.total_hadir}</div>
                                    <p className="text-sm text-muted-foreground">Hadir</p>
                                    <p className="text-xs text-green-600">{summary.persentase_hadir}%</p>
                                </div>
                                <UserCheck className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">{summary.total_izin}</div>
                                    <p className="text-sm text-muted-foreground">Izin</p>
                                    <p className="text-xs text-blue-600">{summary.persentase_izin}%</p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">{summary.total_sakit}</div>
                                    <p className="text-sm text-muted-foreground">Sakit</p>
                                    <p className="text-xs text-yellow-600">{summary.persentase_sakit}%</p>
                                </div>
                                <Users className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-red-600">{summary.total_alpha}</div>
                                    <p className="text-sm text-muted-foreground">Alpha</p>
                                    <p className="text-xs text-red-600">{summary.persentase_alpha}%</p>
                                </div>
                                <UserX className="h-8 w-8 text-red-500" />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                                <label htmlFor="semester" className="block text-sm font-medium mb-2">
                                    Data Semester
                                </label>
                                <input
                                    type="text"
                                    id="semester"
                                    value={`${semesterAktif?.nama_semester} - ${tahunAjaranAktif?.nama_tahun_ajaran}`}
                                    disabled
                                    className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-1">
                                <TabsTrigger value="rekap">Rekap Per Siswa</TabsTrigger>
                            </TabsList>

                            <TabsContent value="rekap" className="space-y-4">
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>NIS</TableHead>
                                                <TableHead>Nama Siswa</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Sakit</TableHead>
                                                <TableHead>Izin</TableHead>
                                                <TableHead>Alpha</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-8">
                                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                                        Memuat data...
                                                    </TableCell>
                                                </TableRow>
                                            ) : absensi.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                        Tidak ada data absensi
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                absensi.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.siswa.nis}</TableCell>
                                                        <TableCell className="font-medium">{item.siswa.user.name}</TableCell>
                                                        <TableCell>
                                                            {item.siswa.kelas.nama_kelas} - {item.siswa.kelas.jurusan.nama_jurusan}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                                {item.jumlah_sakit}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-blue-100 text-blue-800">
                                                                {item.jumlah_izin}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-red-100 text-red-800">
                                                                {item.jumlah_tanpa_keterangan}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {item.jumlah_sakit + item.jumlah_izin + item.jumlah_tanpa_keterangan}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
