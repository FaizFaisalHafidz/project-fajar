import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle,
    Star,
    Target,
    TrendingUp,
    Trophy,
} from 'lucide-react';

interface RataRataMapel {
    mata_pelajaran: {
        id: number;
        nama_mapel: string;
        kode_mapel: string;
    };
    rata_rata_pengetahuan: number;
    rata_rata_keterampilan: number;
    rata_rata_keseluruhan: number;
    status_kkm: string;
    nilai_kkm: number;
}

interface StatistikBulanan {
    bulan: string;
    rata_rata: number;
    jumlah_nilai: number;
}

interface PrestasiTerbaru {
    id: number;
    nama_prestasi: string;
    jenis_prestasi: string;
    tingkat: string;
    peringkat: string;
    tanggal_prestasi: string;
}

interface RekomendasiAktif {
    id: number;
    jenis_rekomendasi: string;
    isi_rekomendasi: string;
    prioritas: string;
    status: string;
    created_at: string;
}

interface Props {
    siswa: {
        id: number;
        nis: string;
        nisn: string;
        user: {
            name: string;
            email: string;
        };
        kelas: {
            id: number;
            nama_kelas: string;
            jurusan: {
                nama_jurusan: string;
            };
        };
    };
    rataRataMapel: RataRataMapel[];
    statistikBulanan: StatistikBulanan[];
    prestasiTerbaru: PrestasiTerbaru[];
    rekomendasiAktif: RekomendasiAktif[];
    statistikUmum: {
        rata_rata_keseluruhan: number;
        peringkat_kelas: number;
        total_siswa_kelas: number;
        mata_pelajaran_tuntas: number;
        mata_pelajaran_belum_tuntas: number;
        total_mata_pelajaran: number;
        persentase_ketuntasan: number;
        trend_nilai: 'naik' | 'turun' | 'stabil';
    };
}

export default function ProfilAkademik({
    siswa,
    rataRataMapel = [],
    statistikBulanan = [],
    prestasiTerbaru = [],
    rekomendasiAktif = [],
    statistikUmum,
}: Props) {
    const getStatusKKMBadge = (status: string) => {
        const statusMap = {
            'tuntas': { label: 'Tuntas', variant: 'default' as const, icon: CheckCircle },
            'belum_tuntas': { label: 'Belum Tuntas', variant: 'destructive' as const, icon: AlertCircle },
        };
        
        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.belum_tuntas;
        const Icon = statusInfo.icon;
        
        return (
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {statusInfo.label}
            </Badge>
        );
    };

    const getTrendIcon = (trend: string) => {
        const trendMap = {
            'naik': { icon: TrendingUp, color: 'text-green-500' },
            'turun': { icon: TrendingUp, color: 'text-red-500 rotate-180' },
            'stabil': { icon: Target, color: 'text-blue-500' },
        };
        
        const trendInfo = trendMap[trend as keyof typeof trendMap] || trendMap.stabil;
        const Icon = trendInfo.icon;
        
        return <Icon className={`h-4 w-4 ${trendInfo.color}`} />;
    };

    const getPrioritasBadge = (prioritas: string) => {
        const prioritasMap = {
            'tinggi': { label: 'Tinggi', variant: 'destructive' as const },
            'sedang': { label: 'Sedang', variant: 'secondary' as const },
            'rendah': { label: 'Rendah', variant: 'outline' as const },
        };
        
        const prioritasInfo = prioritasMap[prioritas as keyof typeof prioritasMap] || prioritasMap.rendah;
        
        return (
            <Badge variant={prioritasInfo.variant}>
                {prioritasInfo.label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Profil Akademik" />
            
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Profil Akademik</h1>
                        <p className="text-muted-foreground">
                            Ringkasan lengkap performa akademik Anda
                        </p>
                    </div>
                </div>

                {/* Informasi Siswa */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Informasi Akademik
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Siswa</p>
                                <p className="font-semibold">{siswa.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">NIS / NISN</p>
                                <p className="font-semibold">{siswa.nis} / {siswa.nisn}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Kelas</p>
                                <p className="font-semibold">{siswa.kelas.nama_kelas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jurusan</p>
                                <p className="font-semibold">{siswa.kelas.jurusan.nama_jurusan}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistik Umum */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata Keseluruhan</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistikUmum.rata_rata_keseluruhan.toFixed(1)}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getTrendIcon(statistikUmum.trend_nilai)}
                                Trend {statistikUmum.trend_nilai}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Peringkat Kelas</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">#{statistikUmum.peringkat_kelas}</div>
                            <p className="text-xs text-muted-foreground">dari {statistikUmum.total_siswa_kelas} siswa</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ketuntasan Belajar</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistikUmum.persentase_ketuntasan.toFixed(1)}%</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{statistikUmum.mata_pelajaran_tuntas} tuntas</span>
                                <span>•</span>
                                <span>{statistikUmum.mata_pelajaran_belum_tuntas} belum tuntas</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Prestasi</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{prestasiTerbaru.length}</div>
                            <p className="text-xs text-muted-foreground">prestasi diraih</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress per Mata Pelajaran */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Performa per Mata Pelajaran
                        </CardTitle>
                        <CardDescription>
                            Rata-rata nilai dan status ketuntasan setiap mata pelajaran
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mata Pelajaran</TableHead>
                                        <TableHead className="text-center">Pengetahuan</TableHead>
                                        <TableHead className="text-center">Keterampilan</TableHead>
                                        <TableHead className="text-center">Rata-rata</TableHead>
                                        <TableHead className="text-center">KKM</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="w-[200px]">Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rataRataMapel.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Belum ada data nilai
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rataRataMapel.map((mapel, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {mapel.mata_pelajaran.nama_mapel}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">
                                                        {mapel.rata_rata_pengetahuan.toFixed(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">
                                                        {mapel.rata_rata_keterampilan.toFixed(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge 
                                                        variant={mapel.rata_rata_keseluruhan >= mapel.nilai_kkm ? "default" : "destructive"}
                                                        className="font-bold"
                                                    >
                                                        {mapel.rata_rata_keseluruhan.toFixed(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {mapel.nilai_kkm.toFixed(0)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {getStatusKKMBadge(mapel.status_kkm)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress 
                                                            value={(mapel.rata_rata_keseluruhan / 100) * 100} 
                                                            className="flex-1"
                                                        />
                                                        <span className="text-xs text-muted-foreground w-10">
                                                            {((mapel.rata_rata_keseluruhan / 100) * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Prestasi Terbaru & Rekomendasi */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Prestasi Terbaru */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Prestasi Terbaru
                            </CardTitle>
                            <CardDescription>
                                5 prestasi terbaru yang Anda raih
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {prestasiTerbaru.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Belum ada prestasi yang tercatat
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {prestasiTerbaru.slice(0, 5).map((prestasi) => (
                                        <div key={prestasi.id} className="flex items-center gap-3 p-3 rounded-lg border">
                                            <Award className="h-8 w-8 text-yellow-500" />
                                            <div className="flex-1">
                                                <p className="font-medium">{prestasi.nama_prestasi}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Badge variant="outline">{prestasi.jenis_prestasi}</Badge>
                                                    <Badge variant="secondary">{prestasi.tingkat}</Badge>
                                                    <span>Peringkat {prestasi.peringkat}</span>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">
                                                {new Date(prestasi.tanggal_prestasi).toLocaleDateString('id-ID')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Rekomendasi Aktif */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Rekomendasi Belajar
                            </CardTitle>
                            <CardDescription>
                                Saran berdasarkan analisis K-Means
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {rekomendasiAktif.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Belum ada rekomendasi yang tersedia
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {rekomendasiAktif.slice(0, 5).map((rekomendasi) => (
                                        <div key={rekomendasi.id} className="p-3 rounded-lg border">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="outline">{rekomendasi.jenis_rekomendasi}</Badge>
                                                {getPrioritasBadge(rekomendasi.prioritas)}
                                            </div>
                                            <p className="text-sm">{rekomendasi.isi_rekomendasi}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Trend Nilai Bulanan */}
                {statistikBulanan.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Trend Nilai Bulanan
                            </CardTitle>
                            <CardDescription>
                                Perkembangan rata-rata nilai dalam 6 bulan terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {statistikBulanan.map((stat, index) => (
                                    <div key={index} className="text-center p-3 rounded-lg border">
                                        <p className="text-sm text-muted-foreground">{stat.bulan}</p>
                                        <p className="text-2xl font-bold">{stat.rata_rata.toFixed(1)}</p>
                                        <p className="text-xs text-muted-foreground">{stat.jumlah_nilai} nilai</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
