import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    Award,
    BarChart3,
    BookOpen,
    CheckCircle,
    Clock,
    Star,
    Target,
    TrendingUp,
    Users,
    XCircle
} from 'lucide-react';

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    rata_rata?: number;
    total_siswa?: number;
    lulus_kkm?: number;
    persentase_lulus?: number;
}

interface MataPelajaran {
    id: number;
    nama_mata_pelajaran: string;
    rata_rata?: number;
    total_siswa?: number;
    lulus_kkm?: number;
    persentase_lulus?: number;
    kkm?: number;
}

interface PerformaSiswa {
    nama: string;
    kelas: string;
    rata_rata: number;
    total_mapel: number;
    mapel_lulus: number;
    ranking?: number;
}

interface Summary {
    total_siswa: number;
    rata_rata_sekolah: number;
    total_lulus_kkm: number;
    persentase_lulus: number;
    kelas_terbaik: string;
    mapel_tersulit: string;
}

interface Props {
    tahunAjaranAktif: TahunAjaran;
    summary: Summary;
    performaKelas: Kelas[];
    performaMapel: MataPelajaran[];
    siswaTerbaik: PerformaSiswa[];
    siswaBermasalah: PerformaSiswa[];
}

export default function StatistikPerforma({ 
    tahunAjaranAktif, 
    summary,
    performaKelas,
    performaMapel,
    siswaTerbaik,
    siswaBermasalah
}: Props) {
    
    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-50';
        if (percentage >= 75) return 'text-blue-600 bg-blue-50';
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getPerformanceIcon = (percentage: number) => {
        if (percentage >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
        if (percentage >= 75) return <Target className="h-4 w-4 text-blue-600" />;
        if (percentage >= 60) return <Clock className="h-4 w-4 text-yellow-600" />;
        return <XCircle className="h-4 w-4 text-red-600" />;
    };

    const getGradeColor = (average: number) => {
        if (average >= 90) return 'text-green-600';
        if (average >= 80) return 'text-blue-600';
        if (average >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <AppLayout>
            <Head title="Analisis Performa" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Analisis Performa</h1>
                        <p className="text-muted-foreground">
                            Analisis mendalam performa akademik - {tahunAjaranAktif?.nama_tahun_ajaran}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Siswa</p>
                                    <p className="text-2xl font-bold">{summary?.total_siswa || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Target className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Rata-rata Sekolah</p>
                                    <p className={`text-2xl font-bold ${getGradeColor(summary?.rata_rata_sekolah || 0)}`}>
                                        {summary?.rata_rata_sekolah || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Lulus KKM</p>
                                    <p className="text-2xl font-bold">{summary?.total_lulus_kkm || 0}</p>
                                    <p className="text-xs text-muted-foreground">
                                        ({summary?.persentase_lulus || 0}%)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Award className="h-8 w-8 text-orange-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Kelas Terbaik</p>
                                    <p className="text-xl font-bold text-orange-600">
                                        {summary?.kelas_terbaik || '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performa Per Kelas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Performa Per Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {performaKelas?.map((kelas, index) => (
                                    <div key={kelas.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-blue-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{kelas.nama_kelas}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {kelas.total_siswa} siswa
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${getGradeColor(kelas.rata_rata || 0)}`}>
                                                    {kelas.rata_rata}
                                                </span>
                                                {getPerformanceIcon(kelas.persentase_lulus || 0)}
                                            </div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(kelas.persentase_lulus || 0)}`}>
                                                {kelas.persentase_lulus}% lulus KKM
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performa Per Mata Pelajaran */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Performa Per Mata Pelajaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {performaMapel?.map((mapel, index) => (
                                    <div key={mapel.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-green-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{mapel.nama_mata_pelajaran}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    KKM: {mapel.kkm} | {mapel.total_siswa} siswa
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${getGradeColor(mapel.rata_rata || 0)}`}>
                                                    {mapel.rata_rata}
                                                </span>
                                                {getPerformanceIcon(mapel.persentase_lulus || 0)}
                                            </div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(mapel.persentase_lulus || 0)}`}>
                                                {mapel.persentase_lulus}% lulus KKM
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Siswa Berprestasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Siswa Berprestasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {siswaTerbaik?.map((siswa, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                                {index === 0 && <Award className="h-5 w-5 text-white" />}
                                                {index === 1 && <Star className="h-5 w-5 text-white" />}
                                                {index === 2 && <TrendingUp className="h-5 w-5 text-white" />}
                                                {index > 2 && <span className="text-sm font-bold text-white">{index + 1}</span>}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-yellow-900">{siswa.nama}</h4>
                                                <p className="text-sm text-yellow-700">{siswa.kelas}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-yellow-900">
                                                {siswa.rata_rata}
                                            </div>
                                            <div className="text-xs text-yellow-700">
                                                {siswa.mapel_lulus}/{siswa.total_mapel} mapel lulus
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Siswa Memerlukan Perhatian */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Siswa Memerlukan Perhatian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {siswaBermasalah?.length > 0 ? (
                                    siswaBermasalah.map((siswa, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-red-900">{siswa.nama}</h4>
                                                    <p className="text-sm text-red-700">{siswa.kelas}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-red-900">
                                                    {siswa.rata_rata}
                                                </div>
                                                <div className="text-xs text-red-700">
                                                    {siswa.mapel_lulus}/{siswa.total_mapel} mapel lulus
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                        <h4 className="font-semibold text-green-900 mb-2">Semua Siswa Berkinerja Baik!</h4>
                                        <p className="text-sm">Tidak ada siswa yang memerlukan perhatian khusus saat ini.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analysis & Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Analisis & Rekomendasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-blue-900">Kelas</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <ArrowUp className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium">Kelas Terbaik</p>
                                            <p className="text-xs text-muted-foreground">
                                                {performaKelas?.[0]?.nama_kelas || '-'} dengan rata-rata {performaKelas?.[0]?.rata_rata || 0}
                                            </p>
                                        </div>
                                    </div>
                                    {performaKelas?.some(k => (k.persentase_lulus || 0) < 60) && (
                                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                            <ArrowDown className="h-4 w-4 text-red-600" />
                                            <div>
                                                <p className="text-sm font-medium">Perlu Perhatian</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Ada kelas dengan tingkat kelulusan rendah
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-green-900">Mata Pelajaran</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium">Mapel Terbaik</p>
                                            <p className="text-xs text-muted-foreground">
                                                {performaMapel?.[0]?.nama_mata_pelajaran || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-orange-600" />
                                        <div>
                                            <p className="text-sm font-medium">Perlu Peningkatan</p>
                                            <p className="text-xs text-muted-foreground">
                                                {summary?.mapel_tersulit || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-purple-900">Siswa</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                        <Star className="h-4 w-4 text-purple-600" />
                                        <div>
                                            <p className="text-sm font-medium">Berprestasi</p>
                                            <p className="text-xs text-muted-foreground">
                                                {siswaTerbaik?.length || 0} siswa berprestasi tinggi
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <div>
                                            <p className="text-sm font-medium">Butuh Bantuan</p>
                                            <p className="text-xs text-muted-foreground">
                                                {siswaBermasalah?.length || 0} siswa perlu perhatian khusus
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
