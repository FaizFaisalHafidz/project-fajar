import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Star,
    TrendingUp,
    Trophy,
} from 'lucide-react';
import { useState } from 'react';

interface NilaiSiswa {
    id: number;
    mata_pelajaran: {
        id: number;
        nama_mapel: string;
        kode_mapel: string;
    };
    komponen_nilai: {
        id: number;
        nama_komponen: string;
    };
    nilai: number;
    created_at: string;
}

interface NilaiSikap {
    id: number;
    guru: {
        id: number;
        user: {
            name: string;
        };
    };
    nilai_sosial: string;
    deskripsi_sosial: string;
    nilai_spiritual: string;
    deskripsi_spiritual: string;
    created_at: string;
}

interface NilaiEkstrakurikuler {
    id: number;
    ekstrakurikuler: {
        id: number;
        nama_ekstrakurikuler: string;
    };
    nilai: string;
    deskripsi: string;
    created_at: string;
}

interface Absensi {
    id: number;
    jumlah_sakit: number;
    jumlah_izin: number;
    jumlah_tanpa_keterangan: number;
    semester: {
        id: number;
        nama_semester: string;
        tahunAjaran: {
            nama_tahun_ajaran: string;
        };
    };
    created_at: string;
}

interface PrestasiSiswa {
    id: number;
    nama_prestasi: string;
    jenis_prestasi: string;
    tingkat: string;
    peringkat: string;
    tanggal_prestasi: string;
    deskripsi: string;
    created_at: string;
}

interface Props {
    nilaiPengetahuan: NilaiSiswa[];
    nilaiKeterampilan: NilaiSiswa[];
    nilaiSikap: NilaiSikap[];
    nilaiEkstrakurikuler: NilaiEkstrakurikuler[];
    absensi: Absensi[];
    prestasi: PrestasiSiswa[];
    statistik: {
        rata_rata_pengetahuan: number;
        rata_rata_keterampilan: number;
        total_absensi: number;
        persentase_kehadiran: number;
        total_prestasi: number;
    };
}

export default function SiswaIndex({
    nilaiPengetahuan = [],
    nilaiKeterampilan = [],
    nilaiSikap = [],
    nilaiEkstrakurikuler = [],
    absensi = [],
    prestasi = [],
    statistik = {
        rata_rata_pengetahuan: 0,
        rata_rata_keterampilan: 0,
        total_absensi: 0,
        persentase_kehadiran: 0,
        total_prestasi: 0,
    },
}: Props) {
    const [activeTab, setActiveTab] = useState('pengetahuan');

    const getStatusBadge = (status: string) => {
        const statusMap = {
            hadir: { label: 'Hadir', variant: 'default' as const, icon: CheckCircle },
            sakit: { label: 'Sakit', variant: 'secondary' as const, icon: AlertCircle },
            izin: { label: 'Izin', variant: 'outline' as const, icon: Clock },
            alpha: { label: 'Alpha', variant: 'destructive' as const, icon: AlertCircle },
        };
        
        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.alpha;
        const Icon = statusInfo.icon;
        
        return (
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {statusInfo.label}
            </Badge>
        );
    };

    const getTingkatPrestasiBadge = (tingkat: string) => {
        const tingkatMap = {
            sekolah: { label: 'Sekolah', variant: 'secondary' as const },
            kecamatan: { label: 'Kecamatan', variant: 'outline' as const },
            kabupaten: { label: 'Kabupaten', variant: 'default' as const },
            provinsi: { label: 'Provinsi', variant: 'secondary' as const },
            nasional: { label: 'Nasional', variant: 'destructive' as const },
            internasional: { label: 'Internasional', variant: 'destructive' as const },
        };
        
        const tingkatInfo = tingkatMap[tingkat as keyof typeof tingkatMap] || tingkatMap.sekolah;
        
        return (
            <Badge variant={tingkatInfo.variant}>
                {tingkatInfo.label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Akademik Saya" />
            
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Akademik Saya</h1>
                        <p className="text-muted-foreground">
                            Pantau perkembangan akademik dan prestasi Anda
                        </p>
                    </div>
                </div>

                {/* Statistik Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata Pengetahuan</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistik.rata_rata_pengetahuan.toFixed(1)}</div>
                            <p className="text-xs text-muted-foreground">Nilai rata-rata</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata Keterampilan</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistik.rata_rata_keterampilan.toFixed(1)}</div>
                            <p className="text-xs text-muted-foreground">Nilai rata-rata</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Persentase Kehadiran</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistik.persentase_kehadiran.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">{statistik.total_absensi} total absensi</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Prestasi</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistik.total_prestasi}</div>
                            <p className="text-xs text-muted-foreground">Prestasi yang diraih</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Progress Akademik</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {((statistik.rata_rata_pengetahuan + statistik.rata_rata_keterampilan) / 2).toFixed(1)}
                            </div>
                            <p className="text-xs text-muted-foreground">Rata-rata keseluruhan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="pengetahuan" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Pengetahuan
                        </TabsTrigger>
                        <TabsTrigger value="keterampilan" className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Keterampilan
                        </TabsTrigger>
                        <TabsTrigger value="sikap" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Sikap
                        </TabsTrigger>
                        <TabsTrigger value="ekstrakurikuler" className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Ekstrakurikuler
                        </TabsTrigger>
                        <TabsTrigger value="absensi" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Absensi
                        </TabsTrigger>
                        <TabsTrigger value="prestasi" className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            Prestasi
                        </TabsTrigger>
                    </TabsList>

                    {/* Nilai Pengetahuan Tab */}
                    <TabsContent value="pengetahuan" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Nilai Pengetahuan
                                </CardTitle>
                                <CardDescription>
                                    Daftar nilai pengetahuan yang telah Anda peroleh
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mata Pelajaran</TableHead>
                                                <TableHead>Komponen Nilai</TableHead>
                                                <TableHead className="text-center">Nilai</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {nilaiPengetahuan.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data nilai pengetahuan
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                nilaiPengetahuan.map((nilai) => (
                                                    <TableRow key={nilai.id}>
                                                        <TableCell className="font-medium">
                                                            {nilai.mata_pelajaran.nama_mapel}
                                                        </TableCell>
                                                        <TableCell>{nilai.komponen_nilai.nama_komponen}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge 
                                                                variant={nilai.nilai >= 75 ? "default" : "destructive"}
                                                                className="font-bold"
                                                            >
                                                                {nilai.nilai}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(nilai.created_at).toLocaleDateString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Nilai Keterampilan Tab */}
                    <TabsContent value="keterampilan" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    Nilai Keterampilan
                                </CardTitle>
                                <CardDescription>
                                    Daftar nilai keterampilan yang telah Anda peroleh
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mata Pelajaran</TableHead>
                                                <TableHead>Komponen Nilai</TableHead>
                                                <TableHead className="text-center">Nilai</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {nilaiKeterampilan.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data nilai keterampilan
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                nilaiKeterampilan.map((nilai) => (
                                                    <TableRow key={nilai.id}>
                                                        <TableCell className="font-medium">
                                                            {nilai.mata_pelajaran.nama_mapel}
                                                        </TableCell>
                                                        <TableCell>{nilai.komponen_nilai.nama_komponen}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge 
                                                                variant={nilai.nilai >= 75 ? "default" : "destructive"}
                                                                className="font-bold"
                                                            >
                                                                {nilai.nilai}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(nilai.created_at).toLocaleDateString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Nilai Sikap Tab */}
                    <TabsContent value="sikap" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Nilai Sikap
                                </CardTitle>
                                <CardDescription>
                                    Penilaian sikap dan karakter Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Guru</TableHead>
                                                <TableHead className="text-center">Nilai Sosial</TableHead>
                                                <TableHead>Deskripsi Sosial</TableHead>
                                                <TableHead className="text-center">Nilai Spiritual</TableHead>
                                                <TableHead>Deskripsi Spiritual</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {nilaiSikap.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data nilai sikap
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                nilaiSikap.map((nilai) => (
                                                    <TableRow key={nilai.id}>
                                                        <TableCell className="font-medium">
                                                            {nilai.guru?.user?.name || 'Tidak diketahui'}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="default">
                                                                {nilai.nilai_sosial}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate" title={nilai.deskripsi_sosial}>
                                                            {nilai.deskripsi_sosial}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="default">
                                                                {nilai.nilai_spiritual}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate" title={nilai.deskripsi_spiritual}>
                                                            {nilai.deskripsi_spiritual}
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(nilai.created_at).toLocaleDateString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Nilai Ekstrakurikuler Tab */}
                    <TabsContent value="ekstrakurikuler" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Nilai Ekstrakurikuler
                                </CardTitle>
                                <CardDescription>
                                    Penilaian kegiatan ekstrakurikuler yang Anda ikuti
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ekstrakurikuler</TableHead>
                                                <TableHead className="text-center">Nilai</TableHead>
                                                <TableHead>Deskripsi</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {nilaiEkstrakurikuler.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data nilai ekstrakurikuler
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                nilaiEkstrakurikuler.map((nilai) => (
                                                    <TableRow key={nilai.id}>
                                                        <TableCell className="font-medium">
                                                            {nilai.ekstrakurikuler.nama_ekstrakurikuler}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="default">
                                                                {nilai.nilai}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate" title={nilai.deskripsi}>
                                                            {nilai.deskripsi}
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(nilai.created_at).toLocaleDateString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Absensi Tab */}
                    <TabsContent value="absensi" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Riwayat Absensi
                                </CardTitle>
                                <CardDescription>
                                    Catatan kehadiran Anda di setiap mata pelajaran
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Semester</TableHead>
                                                <TableHead className="text-center">Sakit</TableHead>
                                                <TableHead className="text-center">Izin</TableHead>
                                                <TableHead className="text-center">Tanpa Keterangan</TableHead>
                                                <TableHead className="text-center">Total</TableHead>
                                                <TableHead>Tanggal Input</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {absensi.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data absensi
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                absensi.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {item.semester?.nama_semester} - {item.semester?.tahunAjaran?.nama_tahun_ajaran}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={item.jumlah_sakit > 0 ? "secondary" : "outline"}>
                                                                {item.jumlah_sakit}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={item.jumlah_izin > 0 ? "secondary" : "outline"}>
                                                                {item.jumlah_izin}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={item.jumlah_tanpa_keterangan > 0 ? "destructive" : "outline"}>
                                                                {item.jumlah_tanpa_keterangan}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="default" className="font-bold">
                                                                {item.jumlah_sakit + item.jumlah_izin + item.jumlah_tanpa_keterangan}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Prestasi Tab */}
                    <TabsContent value="prestasi" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5" />
                                    Prestasi Saya
                                </CardTitle>
                                <CardDescription>
                                    Daftar prestasi dan penghargaan yang telah Anda raih
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama Prestasi</TableHead>
                                                <TableHead>Jenis</TableHead>
                                                <TableHead className="text-center">Tingkat</TableHead>
                                                <TableHead className="text-center">Peringkat</TableHead>
                                                <TableHead>Deskripsi</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {prestasi.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data prestasi
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                prestasi.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {item.nama_prestasi}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {item.jenis_prestasi}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {getTingkatPrestasiBadge(item.tingkat)}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="default" className="font-bold">
                                                                {item.peringkat}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate" title={item.deskripsi}>
                                                            {item.deskripsi}
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
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
