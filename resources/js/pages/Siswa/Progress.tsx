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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Star,
    Target,
    TrendingDown,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

interface ProgressMataPelajaran {
    mata_pelajaran: {
        id: number;
        nama_mapel: string;
        kode_mapel: string;
    };
    progress_bulanan: {
        bulan: string;
        rata_rata: number;
        jumlah_nilai: number;
        trend: 'naik' | 'turun' | 'stabil';
        persentase_perubahan: number;
    }[];
    nilai_awal: number;
    nilai_terkini: number;
    peningkatan_total: number;
    target_semester: number;
    persentase_pencapaian: number;
    prediksi_akhir_semester: number;
    status_target: 'tercapai' | 'on_track' | 'perlu_usaha' | 'sulit_tercapai';
}

interface MilestoneAkademik {
    id: number;
    judul: string;
    deskripsi: string;
    target_nilai: number;
    nilai_tercapai?: number;
    tanggal_target: string;
    tanggal_tercapai?: string;
    status: 'completed' | 'in_progress' | 'pending' | 'overdue';
    kategori: 'nilai' | 'kompetensi' | 'ekstrakurikuler' | 'prestasi';
    mata_pelajaran?: string;
}

interface StatistikProgress {
    periode: string;
    total_nilai_input: number;
    rata_rata_periode: number;
    peningkatan_dari_periode_sebelumnya: number;
    mata_pelajaran_meningkat: number;
    mata_pelajaran_menurun: number;
    mata_pelajaran_stabil: number;
    konsistensi_nilai: number; // 0-100
}

interface PrediksiFuture {
    mata_pelajaran_id: number;
    mata_pelajaran: string;
    prediksi_nilai_akhir: number;
    confidence_level: number; // 0-100
    faktor_prediksi: string[];
    rekomendasi_pencapaian: string[];
}

interface Props {
    siswa: {
        id: number;
        user: {
            name: string;
        };
        kelas: {
            nama_kelas: string;
        };
    };
    progressMataPelajaran: ProgressMataPelajaran[];
    milestoneAkademik: MilestoneAkademik[];
    statistikProgress: StatistikProgress[];
    prediksiTarget: PrediksiFuture[];
    semesterAktif: {
        id: number;
        nama_semester: string;
    };
    overallProgress: {
        rata_rata_awal_semester: number;
        rata_rata_saat_ini: number;
        total_peningkatan: number;
        persentase_peningkatan: number;
        target_akhir_semester: number;
        estimasi_pencapaian: number;
        hari_tersisa_semester: number;
    };
}

export default function ProgressBelajar({
    siswa,
    progressMataPelajaran = [],
    milestoneAkademik = [],
    statistikProgress = [],
    prediksiTarget = [],
    semesterAktif,
    overallProgress,
}: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
    const [selectedMapel, setSelectedMapel] = useState<number | null>(null);

    const getTrendIcon = (trend: string, persentase: number) => {
        if (trend === 'naik') {
            return <TrendingUp className="h-4 w-4 text-green-500" />;
        } else if (trend === 'turun') {
            return <TrendingDown className="h-4 w-4 text-red-500" />;
        }
        return <Target className="h-4 w-4 text-blue-500" />;
    };

    const getStatusTargetBadge = (status: string) => {
        const statusMap = {
            'tercapai': { label: 'Tercapai', variant: 'default' as const, icon: CheckCircle },
            'on_track': { label: 'On Track', variant: 'secondary' as const, icon: TrendingUp },
            'perlu_usaha': { label: 'Perlu Usaha', variant: 'destructive' as const, icon: AlertCircle },
            'sulit_tercapai': { label: 'Sulit Tercapai', variant: 'destructive' as const, icon: AlertCircle },
        };
        
        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.perlu_usaha;
        const Icon = statusInfo.icon;
        
        return (
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {statusInfo.label}
            </Badge>
        );
    };

    const getMilestoneStatusBadge = (status: string) => {
        const statusMap = {
            'completed': { label: 'Selesai', variant: 'default' as const, icon: CheckCircle },
            'in_progress': { label: 'Dalam Progress', variant: 'secondary' as const, icon: Clock },
            'pending': { label: 'Menunggu', variant: 'outline' as const, icon: Clock },
            'overdue': { label: 'Terlambat', variant: 'destructive' as const, icon: AlertCircle },
        };
        
        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
        const Icon = statusInfo.icon;
        
        return (
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {statusInfo.label}
            </Badge>
        );
    };

    const getKategoriIcon = (kategori: string) => {
        const iconMap = {
            'nilai': BookOpen,
            'kompetensi': Target,
            'ekstrakurikuler': Star,
            'prestasi': Award,
        };
        
        const Icon = iconMap[kategori as keyof typeof iconMap] || BookOpen;
        return <Icon className="h-4 w-4" />;
    };

    return (
        <AppLayout>
            <Head title="Progress Belajar" />
            
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Progress Belajar</h1>
                        <p className="text-muted-foreground">
                            Pantau perkembangan dan pencapaian akademik Anda
                        </p>
                    </div>
                </div>

                {/* Overall Progress */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Progress Keseluruhan - {semesterAktif.nama_semester}
                        </CardTitle>
                        <CardDescription>
                            Ringkasan perkembangan akademik Anda semester ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-4 rounded-lg bg-blue-50">
                                <h4 className="text-sm font-medium text-blue-800">Nilai Awal</h4>
                                <p className="text-2xl font-bold text-blue-600">
                                    {Number(overallProgress.rata_rata_awal_semester || 0).toFixed(1)}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-green-50">
                                <h4 className="text-sm font-medium text-green-800">Nilai Saat Ini</h4>
                                <p className="text-2xl font-bold text-green-600">
                                    {Number(overallProgress.rata_rata_saat_ini || 0).toFixed(1)}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-purple-50">
                                <h4 className="text-sm font-medium text-purple-800">Peningkatan</h4>
                                <p className="text-2xl font-bold text-purple-600">
                                    +{Number(overallProgress.total_peningkatan || 0).toFixed(1)}
                                </p>
                                <p className="text-xs text-purple-600">
                                    ({Number(overallProgress.persentase_peningkatan || 0).toFixed(1)}%)
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-yellow-50">
                                <h4 className="text-sm font-medium text-yellow-800">Target Semester</h4>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {Number(overallProgress.target_akhir_semester || 0).toFixed(1)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Progress Menuju Target</span>
                                <span className="text-sm text-muted-foreground">
                                    {((Number(overallProgress.rata_rata_saat_ini || 0) / Number(overallProgress.target_akhir_semester || 1)) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <Progress 
                                value={(Number(overallProgress.rata_rata_saat_ini || 0) / Number(overallProgress.target_akhir_semester || 1)) * 100} 
                                className="h-3"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Estimasi akhir semester: {Number(overallProgress.estimasi_pencapaian || 0).toFixed(1)}</span>
                                <span>{Number(overallProgress.hari_tersisa_semester || 0)} hari tersisa</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="mata-pelajaran" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="mata-pelajaran">Progress per Mapel</TabsTrigger>
                        <TabsTrigger value="milestone">Milestone</TabsTrigger>
                        <TabsTrigger value="statistik">Statistik Periode</TabsTrigger>
                        <TabsTrigger value="prediksi">Prediksi & Target</TabsTrigger>
                    </TabsList>

                    {/* Progress per Mata Pelajaran */}
                    <TabsContent value="mata-pelajaran" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Progress per Mata Pelajaran
                                </CardTitle>
                                <CardDescription>
                                    Detail perkembangan setiap mata pelajaran
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mata Pelajaran</TableHead>
                                                <TableHead className="text-center">Nilai Awal</TableHead>
                                                <TableHead className="text-center">Nilai Terkini</TableHead>
                                                <TableHead className="text-center">Peningkatan</TableHead>
                                                <TableHead className="text-center">Target</TableHead>
                                                <TableHead className="text-center">Prediksi</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="w-[200px]">Progress</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {progressMataPelajaran.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                        Belum ada data progress
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                progressMataPelajaran.map((progress) => (
                                                    <TableRow key={progress.mata_pelajaran.id}>
                                                        <TableCell className="font-medium">
                                                            {progress.mata_pelajaran.nama_mapel}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline">
                                                                {Number(progress.nilai_awal || 0).toFixed(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="default">
                                                                {Number(progress.nilai_terkini || 0).toFixed(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {getTrendIcon(Number(progress.peningkatan_total || 0) > 0 ? 'naik' : Number(progress.peningkatan_total || 0) < 0 ? 'turun' : 'stabil', Number(progress.peningkatan_total || 0))}
                                                                <span className={`text-sm font-medium ${Number(progress.peningkatan_total || 0) > 0 ? 'text-green-600' : Number(progress.peningkatan_total || 0) < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                                                    {Number(progress.peningkatan_total || 0) > 0 ? '+' : ''}{Number(progress.peningkatan_total || 0).toFixed(1)}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="secondary">
                                                                {Number(progress.target_semester || 0).toFixed(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge 
                                                                variant={Number(progress.prediksi_akhir_semester || 0) >= Number(progress.target_semester || 0) ? "default" : "destructive"}
                                                            >
                                                                {Number(progress.prediksi_akhir_semester || 0).toFixed(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {getStatusTargetBadge(progress.status_target)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between items-center text-xs">
                                                                    <span>Progress</span>
                                                                    <span>{Number(progress.persentase_pencapaian || 0).toFixed(0)}%</span>
                                                                </div>
                                                                <Progress 
                                                                    value={Number(progress.persentase_pencapaian || 0)} 
                                                                    className="h-2"
                                                                />
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
                    </TabsContent>

                    {/* Milestone */}
                    <TabsContent value="milestone" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Milestone Akademik
                                </CardTitle>
                                <CardDescription>
                                    Target dan pencapaian penting dalam perjalanan akademik Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {milestoneAkademik.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Target className="h-12 w-12 mx-auto mb-4" />
                                        <p>Belum ada milestone yang ditetapkan</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {milestoneAkademik.map((milestone) => (
                                            <Card key={milestone.id} className="border-l-4 border-l-purple-500">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 rounded-lg bg-purple-100">
                                                                {getKategoriIcon(milestone.kategori)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">{milestone.judul}</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {milestone.deskripsi}
                                                                </p>
                                                                {milestone.mata_pelajaran && (
                                                                    <Badge variant="outline" className="mt-1 text-xs">
                                                                        {milestone.mata_pelajaran}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            {getMilestoneStatusBadge(milestone.status)}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                        <div className="text-center p-3 rounded-lg bg-muted/50">
                                                            <p className="text-xs text-muted-foreground">Target</p>
                                                            <p className="font-bold text-lg">{milestone.target_nilai}</p>
                                                        </div>
                                                        <div className="text-center p-3 rounded-lg bg-muted/50">
                                                            <p className="text-xs text-muted-foreground">Tercapai</p>
                                                            <p className="font-bold text-lg">
                                                                {milestone.nilai_tercapai?.toFixed(1) || '-'}
                                                            </p>
                                                        </div>
                                                        <div className="text-center p-3 rounded-lg bg-muted/50">
                                                            <p className="text-xs text-muted-foreground">Deadline</p>
                                                            <p className="font-bold text-sm">
                                                                {new Date(milestone.tanggal_target).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {milestone.nilai_tercapai && (
                                                        <div className="mt-4">
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span>Progress</span>
                                                                <span>{((milestone.nilai_tercapai / milestone.target_nilai) * 100).toFixed(0)}%</span>
                                                            </div>
                                                            <Progress 
                                                                value={(milestone.nilai_tercapai / milestone.target_nilai) * 100} 
                                                                className="h-2"
                                                            />
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Statistik Periode */}
                    <TabsContent value="statistik" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Statistik Progress per Periode
                                </CardTitle>
                                <CardDescription>
                                    Analisis perkembangan dari waktu ke waktu
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {statistikProgress.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Calendar className="h-12 w-12 mx-auto mb-4" />
                                        <p>Belum ada data statistik periode</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {statistikProgress.map((stat, index) => (
                                            <Card key={index}>
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-lg">{stat.periode}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="text-center p-3 rounded-lg bg-blue-50">
                                                        <p className="text-sm text-blue-800">Rata-rata Periode</p>
                                                        <p className="text-2xl font-bold text-blue-600">
                                                            {Number(stat.rata_rata_periode || 0).toFixed(1)}
                                                        </p>
                                                        <div className="flex items-center justify-center gap-1 mt-1">
                                                            {getTrendIcon(Number(stat.peningkatan_dari_periode_sebelumnya || 0) > 0 ? 'naik' : Number(stat.peningkatan_dari_periode_sebelumnya || 0) < 0 ? 'turun' : 'stabil', Number(stat.peningkatan_dari_periode_sebelumnya || 0))}
                                                            <span className="text-xs text-blue-600">
                                                                {Number(stat.peningkatan_dari_periode_sebelumnya || 0) > 0 ? '+' : ''}{Number(stat.peningkatan_dari_periode_sebelumnya || 0).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Total Nilai</span>
                                                            <span className="font-medium">{stat.total_nilai_input}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>Konsistensi</span>
                                                            <span className="font-medium">{stat.konsistensi_nilai}%</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm">Trend Mata Pelajaran</h4>
                                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                                            <div className="text-center p-2 rounded bg-green-50">
                                                                <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                                                                <p className="font-bold text-green-600">{stat.mata_pelajaran_meningkat}</p>
                                                                <p className="text-green-600">Naik</p>
                                                            </div>
                                                            <div className="text-center p-2 rounded bg-red-50">
                                                                <TrendingDown className="h-4 w-4 text-red-600 mx-auto mb-1" />
                                                                <p className="font-bold text-red-600">{stat.mata_pelajaran_menurun}</p>
                                                                <p className="text-red-600">Turun</p>
                                                            </div>
                                                            <div className="text-center p-2 rounded bg-blue-50">
                                                                <Target className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                                                                <p className="font-bold text-blue-600">{stat.mata_pelajaran_stabil}</p>
                                                                <p className="text-blue-600">Stabil</p>
                                                            </div>
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

                    {/* Prediksi & Target */}
                    <TabsContent value="prediksi" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Prediksi & Rekomendasi Target
                                </CardTitle>
                                <CardDescription>
                                    Prediksi pencapaian dan strategi untuk mencapai target
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {prediksiTarget.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Zap className="h-12 w-12 mx-auto mb-4" />
                                        <p>Prediksi target belum tersedia</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {prediksiTarget.map((prediksi) => (
                                            <Card key={prediksi.mata_pelajaran_id} className="border-l-4 border-l-yellow-500">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h4 className="font-semibold text-lg">{prediksi.mata_pelajaran}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="default">
                                                                    Prediksi: {Number(prediksi.prediksi_nilai_akhir || 0).toFixed(1)}
                                                                </Badge>
                                                                <Badge variant="outline">
                                                                    Confidence: {Number(prediksi.confidence_level || 0)}%
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Progress 
                                                                value={Number(prediksi.confidence_level || 0)} 
                                                                className="w-20 h-2"
                                                            />
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Akurasi prediksi
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h5 className="font-semibold mb-2">Faktor Prediksi:</h5>
                                                            <ul className="space-y-1">
                                                                {prediksi.faktor_prediksi.map((faktor, index) => (
                                                                    <li key={index} className="flex items-start gap-2 text-sm">
                                                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                        <span>{faktor}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <h5 className="font-semibold mb-2">Rekomendasi Pencapaian:</h5>
                                                            <ul className="space-y-1">
                                                                {prediksi.rekomendasi_pencapaian.map((rekomendasi, index) => (
                                                                    <li key={index} className="flex items-start gap-2 text-sm">
                                                                        <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                                        <span>{rekomendasi}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
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
                </Tabs>
            </div>
        </AppLayout>
    );
}
