import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    ArrowDown,
    ArrowUp,
    Award,
    BarChart3,
    Calendar,
    Minus,
    TrendingUp,
    Users
} from 'lucide-react';

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Semester {
    id: number;
    nama_semester: string;
}

interface TrendData {
    semester: string;
    rata_rata?: number;
    jumlah?: number;
    total?: number;
}

interface Comparison {
    nilai_sekarang: number;
    nilai_sebelumnya: number;
    perubahan: number;
    persentase_perubahan: number;
}

interface Props {
    tahunAjaranAktif: TahunAjaran;
    allSemesters: Semester[];
    trendNilai: TrendData[];
    trendSiswa: TrendData[];
    trendPrestasi: TrendData[];
    trendAbsensi: TrendData[];
    comparison: Comparison | Record<string, never>;
}

export default function StatistikTrend({ 
    tahunAjaranAktif, 
    allSemesters,
    trendNilai,
    trendSiswa,
    trendPrestasi,
    trendAbsensi,
    comparison
}: Props) {
    
    const hasComparison = Object.keys(comparison).length > 0;
    
    const getChangeIcon = (change: number) => {
        if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
        if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
        return <Minus className="h-4 w-4 text-gray-600" />;
    };
    
    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getChangeBackground = (change: number) => {
        if (change > 0) return 'bg-green-50';
        if (change < 0) return 'bg-red-50';
        return 'bg-gray-50';
    };

    const formatPercentage = (percentage: number) => {
        const abs = Math.abs(percentage);
        const sign = percentage > 0 ? '+' : percentage < 0 ? '-' : '';
        return `${sign}${abs.toFixed(1)}%`;
    };

    return (
        <AppLayout>
            <Head title="Trend Nilai" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Trend Nilai</h1>
                        <p className="text-muted-foreground">
                            Analisis tren dan perubahan nilai - {tahunAjaranAktif?.nama_tahun_ajaran}
                        </p>
                    </div>
                </div>

                {/* Comparison Card */}
                {hasComparison && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Perbandingan Semester
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Semester Sekarang</p>
                                    <p className="text-2xl font-bold text-blue-600">{comparison.nilai_sekarang}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Semester Sebelumnya</p>
                                    <p className="text-2xl font-bold text-gray-600">{comparison.nilai_sebelumnya}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Perubahan</p>
                                    <div className="flex items-center justify-center gap-1">
                                        {getChangeIcon(comparison.perubahan)}
                                        <span className={`text-2xl font-bold ${getChangeColor(comparison.perubahan)}`}>
                                            {Math.abs(comparison.perubahan)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Persentase</p>
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${getChangeBackground(comparison.persentase_perubahan)}`}>
                                        {getChangeIcon(comparison.persentase_perubahan)}
                                        <span className={`font-bold ${getChangeColor(comparison.persentase_perubahan)}`}>
                                            {formatPercentage(comparison.persentase_perubahan)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Trend Rata-rata Nilai */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Trend Rata-rata Nilai
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {trendNilai?.map((item, index) => {
                                    const isLatest = index === trendNilai.length - 1;
                                    const prevValue = index > 0 ? trendNilai[index - 1].rata_rata : item.rata_rata;
                                    const change = (item.rata_rata || 0) - (prevValue || 0);
                                    
                                    return (
                                        <div key={item.semester} className={`flex items-center justify-between p-3 rounded-lg ${isLatest ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className={`font-medium ${isLatest ? 'text-blue-900' : ''}`}>
                                                    {item.semester}
                                                </span>
                                                {isLatest && (
                                                    <Badge variant="default" className="text-xs">Aktif</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isLatest ? 'text-blue-900' : ''}`}>
                                                    {item.rata_rata}
                                                </span>
                                                {index > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {getChangeIcon(change)}
                                                        <span className={`text-xs ${getChangeColor(change)}`}>
                                                            {Math.abs(change).toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trend Jumlah Siswa */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Trend Jumlah Siswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {trendSiswa?.map((item, index) => {
                                    const isLatest = index === trendSiswa.length - 1;
                                    const prevValue = index > 0 ? trendSiswa[index - 1].jumlah : item.jumlah;
                                    const change = (item.jumlah || 0) - (prevValue || 0);
                                    
                                    return (
                                        <div key={item.semester} className={`flex items-center justify-between p-3 rounded-lg ${isLatest ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className={`font-medium ${isLatest ? 'text-green-900' : ''}`}>
                                                    {item.semester}
                                                </span>
                                                {isLatest && (
                                                    <Badge variant="secondary" className="text-xs">Aktif</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isLatest ? 'text-green-900' : ''}`}>
                                                    {item.jumlah}
                                                </span>
                                                {index > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {getChangeIcon(change)}
                                                        <span className={`text-xs ${getChangeColor(change)}`}>
                                                            {Math.abs(change)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trend Prestasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Trend Prestasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {trendPrestasi?.map((item, index) => {
                                    const isLatest = index === trendPrestasi.length - 1;
                                    const prevValue = index > 0 ? trendPrestasi[index - 1].jumlah : item.jumlah;
                                    const change = (item.jumlah || 0) - (prevValue || 0);
                                    
                                    return (
                                        <div key={item.semester} className={`flex items-center justify-between p-3 rounded-lg ${isLatest ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className={`font-medium ${isLatest ? 'text-purple-900' : ''}`}>
                                                    {item.semester}
                                                </span>
                                                {isLatest && (
                                                    <Badge variant="outline" className="text-xs">Aktif</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isLatest ? 'text-purple-900' : ''}`}>
                                                    {item.jumlah}
                                                </span>
                                                {index > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {getChangeIcon(change)}
                                                        <span className={`text-xs ${getChangeColor(change)}`}>
                                                            {Math.abs(change)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trend Absensi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Trend Absensi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {trendAbsensi?.map((item, index) => {
                                    const isLatest = index === trendAbsensi.length - 1;
                                    const prevValue = index > 0 ? trendAbsensi[index - 1].total : item.total;
                                    const change = (item.total || 0) - (prevValue || 0);
                                    
                                    return (
                                        <div key={item.semester} className={`flex items-center justify-between p-3 rounded-lg ${isLatest ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className={`font-medium ${isLatest ? 'text-orange-900' : ''}`}>
                                                    {item.semester}
                                                </span>
                                                {isLatest && (
                                                    <Badge variant="destructive" className="text-xs">Aktif</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isLatest ? 'text-orange-900' : ''}`}>
                                                    {item.total} hari
                                                </span>
                                                {index > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {/* For absensi, increase is bad, so we reverse the color logic */}
                                                        {change > 0 && <ArrowUp className="h-4 w-4 text-red-600" />}
                                                        {change < 0 && <ArrowDown className="h-4 w-4 text-green-600" />}
                                                        {change === 0 && <Minus className="h-4 w-4 text-gray-600" />}
                                                        <span className={`text-xs ${change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                                            {Math.abs(change)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Insight & Rekomendasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Performa Akademik</h4>
                                <p className="text-sm text-blue-700">
                                    {hasComparison && comparison.perubahan > 0 
                                        ? "Tren nilai menunjukkan peningkatan positif" 
                                        : hasComparison && comparison.perubahan < 0
                                        ? "Perlu perhatian khusus untuk peningkatan nilai"
                                        : "Performa stabil, pertahankan kualitas pembelajaran"
                                    }
                                </p>
                            </div>
                            
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-900 mb-2">Populasi Siswa</h4>
                                <p className="text-sm text-green-700">
                                    Jumlah siswa menunjukkan tren yang {trendSiswa && trendSiswa.length > 1 && (trendSiswa[trendSiswa.length - 1].jumlah || 0) >= (trendSiswa[trendSiswa.length - 2].jumlah || 0) ? 'stabil/meningkat' : 'menurun'}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h4 className="font-semibold text-purple-900 mb-2">Pencapaian Prestasi</h4>
                                <p className="text-sm text-purple-700">
                                    Program pengembangan bakat siswa menunjukkan hasil yang {
                                        trendPrestasi && trendPrestasi.some(item => (item.jumlah || 0) > 0) ? 'positif' : 'perlu ditingkatkan'
                                    }
                                </p>
                            </div>
                            
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <h4 className="font-semibold text-orange-900 mb-2">Kehadiran Siswa</h4>
                                <p className="text-sm text-orange-700">
                                    Tingkat absensi perlu {
                                        trendAbsensi && trendAbsensi.some(item => (item.total || 0) > 0) ? 'monitoring dan intervensi' : 'dipertahankan'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
