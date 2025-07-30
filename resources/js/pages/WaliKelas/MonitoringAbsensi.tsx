import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Calendar, CheckCircle, Clock, Download, XCircle } from 'lucide-react';

interface Props {
    guru: any;
    kelas: any;
    rekapAbsensi: any[];
    tahunAjaranAktif: any;
    semesterAktif: any;
}

export default function WaliKelasMonitoringAbsensi({ 
    guru, 
    kelas, 
    rekapAbsensi, 
    tahunAjaranAktif, 
    semesterAktif 
}: Props) {
    // Hitung statistik kehadiran
    const totalSiswa = rekapAbsensi.length;
    const rataRataKehadiran = totalSiswa > 0 
        ? rekapAbsensi.reduce((sum, siswa) => sum + siswa.persentase_kehadiran, 0) / totalSiswa 
        : 0;

    const siswaKehadiranBaik = rekapAbsensi.filter(siswa => siswa.persentase_kehadiran >= 90).length;
    const siswaKehadiranCukup = rekapAbsensi.filter(siswa => siswa.persentase_kehadiran >= 75 && siswa.persentase_kehadiran < 90).length;
    const siswaKehadiranKurang = rekapAbsensi.filter(siswa => siswa.persentase_kehadiran < 75).length;

    const totalHadir = rekapAbsensi.reduce((sum, siswa) => sum + siswa.jumlah_hadir, 0);
    const totalSakit = rekapAbsensi.reduce((sum, siswa) => sum + siswa.jumlah_sakit, 0);
    const totalIzin = rekapAbsensi.reduce((sum, siswa) => sum + siswa.jumlah_izin, 0);
    const totalAlpa = rekapAbsensi.reduce((sum, siswa) => sum + siswa.jumlah_alpa, 0);

    const getKehadiranColor = (persentase: number) => {
        if (persentase >= 90) return 'text-green-600';
        if (persentase >= 75) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getKehadiranVariant = (persentase: number): "default" | "destructive" | "outline" | "secondary" => {
        if (persentase >= 90) return 'default';
        if (persentase >= 75) return 'secondary';
        return 'destructive';
    };

    const getKehadiranStatus = (persentase: number) => {
        if (persentase >= 90) return 'Sangat Baik';
        if (persentase >= 75) return 'Cukup';
        return 'Perlu Perhatian';
    };

    return (
        <AppLayout>
            <Head title="Monitoring Absensi" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Monitoring Absensi</h2>
                        <p className="text-muted-foreground">
                            Monitor kehadiran siswa kelas {kelas?.nama_kelas} {kelas?.jurusan?.nama_jurusan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} • Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rata-rata Kehadiran</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{rataRataKehadiran.toFixed(1)}%</div>
                                <Progress value={rataRataKehadiran} className="mt-2" />
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Kehadiran Baik</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{siswaKehadiranBaik}</div>
                                <p className="text-xs text-muted-foreground">≥90% kehadiran</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Kehadiran Cukup</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{siswaKehadiranCukup}</div>
                                <p className="text-xs text-muted-foreground">75-89% kehadiran</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{siswaKehadiranKurang}</div>
                                <p className="text-xs text-muted-foreground">&lt;75% kehadiran</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-8 grid gap-4 md:grid-cols-4">
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-800">Total Hadir</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{totalHadir}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-800">Total Sakit</CardTitle>
                                <XCircle className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{totalSakit}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-yellow-50 border-yellow-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-yellow-800">Total Izin</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{totalIzin}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-50 border-red-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-red-800">Total Alpha</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{totalAlpa}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Data Absensi Siswa
                                    </CardTitle>
                                    <CardDescription>
                                        Rekap kehadiran siswa per semester
                                    </CardDescription>
                                </div>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Export Laporan
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="detail">Detail Absensi</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="mt-6">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>No</TableHead>
                                                    <TableHead>Nama Siswa</TableHead>
                                                    <TableHead className="text-center">Persentase Kehadiran</TableHead>
                                                    <TableHead className="text-center">Status</TableHead>
                                                    <TableHead className="text-center">Total Pertemuan</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {rekapAbsensi
                                                    .sort((a, b) => b.persentase_kehadiran - a.persentase_kehadiran)
                                                    .map((siswa, index) => (
                                                    <TableRow key={siswa.siswa.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell className="font-medium">
                                                            {siswa.siswa.user?.name}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Progress value={siswa.persentase_kehadiran} className="w-20 h-2" />
                                                                <span className={`font-bold ${getKehadiranColor(siswa.persentase_kehadiran)}`}>
                                                                    {siswa.persentase_kehadiran.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={getKehadiranVariant(siswa.persentase_kehadiran)}>
                                                                {getKehadiranStatus(siswa.persentase_kehadiran)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {siswa.total_pertemuan}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="detail" className="mt-6">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>No</TableHead>
                                                    <TableHead>Nama Siswa</TableHead>
                                                    <TableHead className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                            Hadir
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <XCircle className="h-4 w-4 text-blue-600" />
                                                            Sakit
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Clock className="h-4 w-4 text-yellow-600" />
                                                            Izin
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                                            Alpha
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="text-center">Total</TableHead>
                                                    <TableHead className="text-center">Persentase</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {rekapAbsensi.map((siswa, index) => (
                                                    <TableRow key={siswa.siswa.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell className="font-medium">
                                                            {siswa.siswa.user?.name}
                                                        </TableCell>
                                                        <TableCell className="text-center text-green-600 font-medium">
                                                            {siswa.jumlah_hadir}
                                                        </TableCell>
                                                        <TableCell className="text-center text-blue-600 font-medium">
                                                            {siswa.jumlah_sakit}
                                                        </TableCell>
                                                        <TableCell className="text-center text-yellow-600 font-medium">
                                                            {siswa.jumlah_izin}
                                                        </TableCell>
                                                        <TableCell className="text-center text-red-600 font-medium">
                                                            {siswa.jumlah_alpa}
                                                        </TableCell>
                                                        <TableCell className="text-center font-medium">
                                                            {siswa.total_pertemuan}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`font-bold ${getKehadiranColor(siswa.persentase_kehadiran)}`}>
                                                                {siswa.persentase_kehadiran.toFixed(1)}%
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
