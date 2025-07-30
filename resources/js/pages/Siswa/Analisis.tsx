import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Award,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle,
    Eye,
    Target,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface AnalisisMataPelajaran {
    mata_pelajaran: {
        id: number;
        nama_mapel: string;
        kode_mapel: string;
    };
    rata_rata_pengetahuan: number;
    rata_rata_keterampilan: number;
    rata_rata_keseluruhan: number;
    nilai_tertinggi: number;
    nilai_terendah: number;
    jumlah_nilai: number;
    trend: 'naik' | 'turun' | 'stabil';
    persentase_perubahan: number;
    status_kkm: string;
    nilai_kkm: number;
    gap_kkm: number;
    kategori_performa: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
}

interface AnalisisPeriode {
    periode: string;
    rata_rata: number;
    jumlah_nilai: number;
    mata_pelajaran_tuntas: number;
    mata_pelajaran_total: number;
    persentase_ketuntasan: number;
}

interface RekomendaisiAnalisis {
    mata_pelajaran_id: number;
    mata_pelajaran: string;
    jenis_rekomendasi: string;
    rekomendasi: string;
    prioritas: 'tinggi' | 'sedang' | 'rendah';
    target_perbaikan: number;
}

interface Props {
    siswa: {
        id: number;
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
    analisisMataPelajaran: AnalisisMataPelajaran[];
    analisisPeriode: AnalisisPeriode[];
    rekomendasiAnalisis: RekomendaisiAnalisis[];
    statistikKeseluruhan: {
        rata_rata_semester: number;
        peringkat_kelas: number;
        total_siswa_kelas: number;
        mata_pelajaran_unggul: number;
        mata_pelajaran_perlu_perbaikan: number;
        konsistensi_nilai: number; // 0-100
        potensi_peningkatan: number; // 0-100
    };
}

export default function AnalisisNilai({
    siswa,
    analisisMataPelajaran = [],
    analisisPeriode = [],
    rekomendasiAnalisis = [],
    statistikKeseluruhan = {
        rata_rata_semester: 0,
        peringkat_kelas: 0,
        total_siswa_kelas: 0,
        mata_pelajaran_unggul: 0,
        mata_pelajaran_perlu_perbaikan: 0,
        konsistensi_nilai: 0,
        potensi_peningkatan: 0,
    },
}: Props) {
    const [selectedMapel, setSelectedMapel] = useState<number | null>(null);

    const getPerformaColor = (kategori: string) => {
        const colorMap = {
            'excellent': 'text-green-600 bg-green-50 border-green-200',
            'good': 'text-blue-600 bg-blue-50 border-blue-200',
            'average': 'text-yellow-600 bg-yellow-50 border-yellow-200',
            'below_average': 'text-orange-600 bg-orange-50 border-orange-200',
            'poor': 'text-red-600 bg-red-50 border-red-200',
        };
        return colorMap[kategori as keyof typeof colorMap] || colorMap.average;
    };

    const getPerformaLabel = (kategori: string) => {
        const labelMap = {
            'excellent': 'Sangat Baik',
            'good': 'Baik',
            'average': 'Cukup',
            'below_average': 'Kurang',
            'poor': 'Sangat Kurang',
        };
        return labelMap[kategori as keyof typeof labelMap] || 'Cukup';
    };

    const getTrendIcon = (trend: string, persentase: number) => {
        if (trend === 'naik') {
            return <TrendingUp className="h-4 w-4 text-green-500" />;
        } else if (trend === 'turun') {
            return <TrendingDown className="h-4 w-4 text-red-500" />;
        }
        return <Target className="h-4 w-4 text-blue-500" />;
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
            <Head title="Analisis Nilai" />
            
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Analisis Nilai</h1>
                        <p className="text-muted-foreground">
                            Analisis mendalam performa akademik Anda
                        </p>
                    </div>
                </div>

                {/* Statistik Keseluruhan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata Semester</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistikKeseluruhan.rata_rata_semester.toFixed(1)}</div>
                            <p className="text-xs text-muted-foreground">
                                Peringkat #{statistikKeseluruhan.peringkat_kelas} dari {statistikKeseluruhan.total_siswa_kelas}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mata Pelajaran Unggul</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistikKeseluruhan.mata_pelajaran_unggul}</div>
                            <p className="text-xs text-muted-foreground">mapel di atas rata-rata</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perlu Perbaikan</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistikKeseluruhan.mata_pelajaran_perlu_perbaikan}</div>
                            <p className="text-xs text-muted-foreground">mapel perlu ditingkatkan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Konsistensi</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistikKeseluruhan.konsistensi_nilai}%</div>
                            <p className="text-xs text-muted-foreground">stabilitas performa</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="mata-pelajaran" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="mata-pelajaran">Analisis per Mata Pelajaran</TabsTrigger>
                        <TabsTrigger value="periode">Analisis Periode</TabsTrigger>
                        <TabsTrigger value="rekomendasi">Rekomendasi</TabsTrigger>
                    </TabsList>

                    {/* Analisis per Mata Pelajaran */}
                    <TabsContent value="mata-pelajaran" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Performa per Mata Pelajaran
                                </CardTitle>
                                <CardDescription>
                                    Analisis detail setiap mata pelajaran dengan trend dan rekomendasi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mata Pelajaran</TableHead>
                                                <TableHead className="text-center">Rata-rata</TableHead>
                                                <TableHead className="text-center">Range Nilai</TableHead>
                                                <TableHead className="text-center">Trend</TableHead>
                                                <TableHead className="text-center">Status KKM</TableHead>
                                                <TableHead className="text-center">Kategori</TableHead>
                                                <TableHead className="text-center">Progress</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {analisisMataPelajaran.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data untuk dianalisis
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                analisisMataPelajaran.map((analisis) => (
                                                    <TableRow key={analisis.mata_pelajaran.id}>
                                                        <TableCell className="font-medium">
                                                            {analisis.mata_pelajaran.nama_mapel}
                                                            <div className="text-xs text-muted-foreground">
                                                                {analisis.jumlah_nilai} nilai
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div>
                                                                <Badge 
                                                                    variant={analisis.rata_rata_keseluruhan >= analisis.nilai_kkm ? "default" : "destructive"}
                                                                    className="font-bold"
                                                                >
                                                                    {analisis.rata_rata_keseluruhan.toFixed(1)}
                                                                </Badge>
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    P: {analisis.rata_rata_pengetahuan.toFixed(1)} | 
                                                                    K: {analisis.rata_rata_keterampilan.toFixed(1)}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="text-sm">
                                                                <span className="text-green-600">{analisis.nilai_tertinggi}</span>
                                                                <span className="mx-1">-</span>
                                                                <span className="text-red-600">{analisis.nilai_terendah}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {getTrendIcon(analisis.trend, analisis.persentase_perubahan)}
                                                                <span className="text-xs">
                                                                    {analisis.persentase_perubahan > 0 ? '+' : ''}
                                                                    {analisis.persentase_perubahan.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div>
                                                                <Badge 
                                                                    variant={analisis.status_kkm === 'tuntas' ? "default" : "destructive"}
                                                                >
                                                                    {analisis.status_kkm === 'tuntas' ? 'Tuntas' : 'Belum Tuntas'}
                                                                </Badge>
                                                                {analisis.gap_kkm !== 0 && (
                                                                    <div className="text-xs text-muted-foreground mt-1">
                                                                        Gap: {analisis.gap_kkm > 0 ? '+' : ''}{analisis.gap_kkm.toFixed(1)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge 
                                                                className={getPerformaColor(analisis.kategori_performa)}
                                                                variant="outline"
                                                            >
                                                                {getPerformaLabel(analisis.kategori_performa)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="w-20">
                                                                <Progress 
                                                                    value={(analisis.rata_rata_keseluruhan / 100) * 100} 
                                                                    className="h-2"
                                                                />
                                                                <div className="text-xs text-center mt-1">
                                                                    {analisis.rata_rata_keseluruhan.toFixed(0)}%
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setSelectedMapel(analisis.mata_pelajaran.id)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                Detail
                                                            </Button>
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

                    {/* Analisis Periode */}
                    <TabsContent value="periode" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Perkembangan per Periode
                                </CardTitle>
                                <CardDescription>
                                    Analisis perkembangan nilai dari waktu ke waktu
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analisisPeriode.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Belum ada data periode untuk dianalisis
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {analisisPeriode.map((periode, index) => (
                                            <Card key={index}>
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-lg">{periode.periode}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Rata-rata</span>
                                                        <Badge variant="outline" className="font-bold">
                                                            {periode.rata_rata.toFixed(1)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Total Nilai</span>
                                                        <span className="font-medium">{periode.jumlah_nilai}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Ketuntasan</span>
                                                        <span className="font-medium">
                                                            {periode.persentase_ketuntasan.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="pt-2">
                                                        <Progress value={periode.persentase_ketuntasan} className="h-2" />
                                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                            <span>{periode.mata_pelajaran_tuntas} tuntas</span>
                                                            <span>{periode.mata_pelajaran_total} total</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Rekomendasi */}
                    <TabsContent value="rekomendasi" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Rekomendasi Perbaikan
                                </CardTitle>
                                <CardDescription>
                                    Saran perbaikan berdasarkan analisis performa Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {rekomendasiAnalisis.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Tidak ada rekomendasi khusus saat ini. Pertahankan performa yang baik!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {rekomendasiAnalisis.map((rekomendasi, index) => (
                                            <Card key={index} className="border-l-4 border-l-blue-500">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold">{rekomendasi.mata_pelajaran}</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {rekomendasi.jenis_rekomendasi}
                                                            </p>
                                                        </div>
                                                        {getPrioritasBadge(rekomendasi.prioritas)}
                                                    </div>
                                                    <p className="text-sm mb-3">{rekomendasi.rekomendasi}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Target className="h-3 w-3" />
                                                        <span>Target perbaikan: {rekomendasi.target_perbaikan} poin</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
