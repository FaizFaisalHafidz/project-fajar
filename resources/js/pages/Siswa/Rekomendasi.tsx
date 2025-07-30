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
    Brain,
    CheckCircle,
    Lightbulb,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface ClusterInfo {
    cluster_id: number;
    label_cluster: string;
    deskripsi: string;
    jumlah_siswa: number;
    nilai_rata_rata: number;
    karakteristik: string[];
    warna: string;
}

interface HasilClustering {
    siswa_cluster_id: number;
    jarak_centroid: number;
    probabilitas_cluster: number;
    tanggal_clustering: string;
    cluster_info: ClusterInfo;
}

interface RekomendasiKMeans {
    id: number;
    jenis_rekomendasi: string;
    isi_rekomendasi: string;
    prioritas: 'tinggi' | 'sedang' | 'rendah';
    status: 'aktif' | 'completed' | 'pending';
    target_improvement: number;
    timeline: string;
    mata_pelajaran?: string;
    created_at: string;
}

interface ClusterComparison {
    cluster_current: ClusterInfo;
    cluster_target?: ClusterInfo;
    gap_nilai: number;
    strategi_peningkatan: string[];
    estimasi_waktu: string;
    tingkat_kesulitan: 'mudah' | 'sedang' | 'sulit';
}

interface AnalisisTeman {
    siswa: {
        id: number;
        user: {
            name: string;
        };
        nis: string;
    };
    cluster_id: number;
    nilai_rata_rata: number;
    jarak_centroid: number;
    kesamaan_profil: number; // 0-100%
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
    hasilClustering: HasilClustering | null;
    rekomendasiKMeans: RekomendasiKMeans[];
    clusterComparison: ClusterComparison | null;
    analisisTeman: AnalisisTeman[];
    semesterAktif: {
        id: number;
        nama_semester: string;
    };
    statistikClustering: {
        total_siswa_cluster: number;
        posisi_dalam_cluster: number;
        persentase_peningkatan_diperlukan: number;
        cluster_terdekat: string;
        potensi_naik_cluster: number; // 0-100%
    };
}

export default function RekomendasiKMeans({
    siswa,
    hasilClustering,
    rekomendasiKMeans = [],
    clusterComparison,
    analisisTeman = [],
    semesterAktif,
    statistikClustering,
}: Props) {
    const [activeTab, setActiveTab] = useState('cluster-info');

    const getClusterColor = (clusterId: number) => {
        const colors = [
            'bg-red-100 text-red-800 border-red-300',
            'bg-yellow-100 text-yellow-800 border-yellow-300',
            'bg-green-100 text-green-800 border-green-300',
            'bg-blue-100 text-blue-800 border-blue-300',
            'bg-purple-100 text-purple-800 border-purple-300',
        ];
        return colors[clusterId % colors.length];
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

    const getStatusBadge = (status: string) => {
        const statusMap = {
            'aktif': { label: 'Aktif', variant: 'default' as const, icon: CheckCircle },
            'completed': { label: 'Selesai', variant: 'secondary' as const, icon: CheckCircle },
            'pending': { label: 'Menunggu', variant: 'outline' as const, icon: AlertCircle },
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

    const getTingkatKesulitanBadge = (tingkat: string) => {
        const tingkatMap = {
            'mudah': { label: 'Mudah', variant: 'default' as const },
            'sedang': { label: 'Sedang', variant: 'secondary' as const },
            'sulit': { label: 'Sulit', variant: 'destructive' as const },
        };
        
        const tingkatInfo = tingkatMap[tingkat as keyof typeof tingkatMap] || tingkatMap.sedang;
        
        return (
            <Badge variant={tingkatInfo.variant}>
                {tingkatInfo.label}
            </Badge>
        );
    };

    if (!hasilClustering) {
        return (
            <AppLayout>
                <Head title="Rekomendasi K-Means" />
                
                <div className="p-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Belum Ada Analisis K-Means</h3>
                                <p className="text-muted-foreground mb-4">
                                    Data Anda belum dianalisis menggunakan algoritma K-Means. 
                                    Silakan hubungi guru atau admin untuk melakukan analisis clustering.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Rekomendasi K-Means" />
            
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Rekomendasi K-Means</h1>
                        <p className="text-muted-foreground">
                            Rekomendasi belajar berdasarkan analisis clustering
                        </p>
                    </div>
                </div>

                {/* Informasi Cluster Siswa */}
                <Card className={`border-l-4 ${getClusterColor(hasilClustering.cluster_info.cluster_id)}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            Cluster Anda: {hasilClustering.cluster_info.label_cluster}
                        </CardTitle>
                        <CardDescription>
                            {hasilClustering.cluster_info.deskripsi}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-2xl font-bold">{hasilClustering.cluster_info.jumlah_siswa}</p>
                                <p className="text-xs text-muted-foreground">siswa dalam cluster</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-2xl font-bold">{hasilClustering.cluster_info.nilai_rata_rata.toFixed(1)}</p>
                                <p className="text-xs text-muted-foreground">rata-rata cluster</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <Target className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-2xl font-bold">#{statistikClustering.posisi_dalam_cluster}</p>
                                <p className="text-xs text-muted-foreground">posisi dalam cluster</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-2xl font-bold">{statistikClustering.potensi_naik_cluster}%</p>
                                <p className="text-xs text-muted-foreground">potensi naik cluster</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Karakteristik Cluster:</h4>
                            <div className="flex flex-wrap gap-2">
                                {hasilClustering.cluster_info.karakteristik.map((karakteristik, index) => (
                                    <Badge key={index} variant="outline">
                                        {karakteristik}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="cluster-info" className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Info Cluster
                        </TabsTrigger>
                        <TabsTrigger value="rekomendasi" className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Rekomendasi
                        </TabsTrigger>
                        <TabsTrigger value="strategi" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Strategi Peningkatan
                        </TabsTrigger>
                        <TabsTrigger value="teman-cluster" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Teman Se-Cluster
                        </TabsTrigger>
                    </TabsList>

                    {/* Info Cluster */}
                    <TabsContent value="cluster-info" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Statistik Posisi Anda
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Jarak dari Centroid</span>
                                        <Badge variant="outline">
                                            {hasilClustering.jarak_centroid.toFixed(2)}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Probabilitas Cluster</span>
                                        <Badge variant="default">
                                            {(hasilClustering.probabilitas_cluster * 100).toFixed(1)}%
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Peningkatan Diperlukan</span>
                                        <Badge variant="secondary">
                                            {statistikClustering.persentase_peningkatan_diperlukan.toFixed(1)}%
                                        </Badge>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Progress dalam Cluster</span>
                                            <span>{((statistikClustering.posisi_dalam_cluster / statistikClustering.total_siswa_cluster) * 100).toFixed(0)}%</span>
                                        </div>
                                        <Progress 
                                            value={(statistikClustering.posisi_dalam_cluster / statistikClustering.total_siswa_cluster) * 100} 
                                            className="h-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Potensi Peningkatan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                                        <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-blue-800">Cluster Terdekat</h4>
                                        <p className="text-sm text-blue-600">{statistikClustering.cluster_terdekat}</p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Potensi Naik Cluster</span>
                                            <span className="font-semibold">{statistikClustering.potensi_naik_cluster}%</span>
                                        </div>
                                        <Progress value={statistikClustering.potensi_naik_cluster} className="h-2" />
                                        <p className="text-xs text-muted-foreground">
                                            Berdasarkan trend nilai dan performa saat ini
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Rekomendasi */}
                    <TabsContent value="rekomendasi" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5" />
                                    Rekomendasi Personal
                                </CardTitle>
                                <CardDescription>
                                    Saran perbaikan berdasarkan analisis K-Means clustering
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {rekomendasiKMeans.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p>Belum ada rekomendasi khusus untuk Anda saat ini.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {rekomendasiKMeans.map((rekomendasi) => (
                                            <Card key={rekomendasi.id} className="border-l-4 border-l-blue-500">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold">{rekomendasi.jenis_rekomendasi}</h4>
                                                                {rekomendasi.mata_pelajaran && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {rekomendasi.mata_pelajaran}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                Target peningkatan: {rekomendasi.target_improvement} poin
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            {getPrioritasBadge(rekomendasi.prioritas)}
                                                            {getStatusBadge(rekomendasi.status)}
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-sm mb-3">{rekomendasi.isi_rekomendasi}</p>
                                                    
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>Timeline: {rekomendasi.timeline}</span>
                                                        <span>{new Date(rekomendasi.created_at).toLocaleDateString('id-ID')}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Strategi Peningkatan */}
                    <TabsContent value="strategi" className="space-y-4">
                        {clusterComparison ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Strategi Naik ke Cluster Lebih Tinggi
                                    </CardTitle>
                                    <CardDescription>
                                        Roadmap untuk mencapai cluster dengan performa lebih baik
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        {/* Cluster Saat Ini */}
                                        <div className="p-4 rounded-lg border">
                                            <h4 className="font-semibold mb-2">Cluster Saat Ini</h4>
                                            <div className={`p-3 rounded ${getClusterColor(clusterComparison.cluster_current.cluster_id)}`}>
                                                <p className="font-medium">{clusterComparison.cluster_current.label_cluster}</p>
                                                <p className="text-sm opacity-90">{clusterComparison.cluster_current.deskripsi}</p>
                                                <p className="text-lg font-bold mt-2">
                                                    Rata-rata: {clusterComparison.cluster_current.nilai_rata_rata.toFixed(1)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cluster Target */}
                                        {clusterComparison.cluster_target && (
                                            <div className="p-4 rounded-lg border">
                                                <h4 className="font-semibold mb-2">Cluster Target</h4>
                                                <div className={`p-3 rounded ${getClusterColor(clusterComparison.cluster_target.cluster_id)}`}>
                                                    <p className="font-medium">{clusterComparison.cluster_target.label_cluster}</p>
                                                    <p className="text-sm opacity-90">{clusterComparison.cluster_target.deskripsi}</p>
                                                    <p className="text-lg font-bold mt-2">
                                                        Rata-rata: {clusterComparison.cluster_target.nilai_rata_rata.toFixed(1)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-800">Gap Nilai</h4>
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {clusterComparison.gap_nilai.toFixed(1)} poin
                                            </p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                                            <h4 className="font-semibold text-blue-800">Estimasi Waktu</h4>
                                            <p className="text-lg font-bold text-blue-600">
                                                {clusterComparison.estimasi_waktu}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                                            <h4 className="font-semibold text-purple-800">Tingkat Kesulitan</h4>
                                            <div className="mt-2">
                                                {getTingkatKesulitanBadge(clusterComparison.tingkat_kesulitan)}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Strategi Peningkatan:</h4>
                                        <div className="space-y-2">
                                            {clusterComparison.strategi_peningkatan.map((strategi, index) => (
                                                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm">{strategi}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Target className="h-12 w-12 mx-auto mb-4" />
                                        <p>Analisis strategi peningkatan belum tersedia.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Teman Se-Cluster */}
                    <TabsContent value="teman-cluster" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Teman Se-Cluster
                                </CardTitle>
                                <CardDescription>
                                    Siswa lain yang memiliki profil pembelajaran serupa dengan Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analisisTeman.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="h-12 w-12 mx-auto mb-4" />
                                        <p>Tidak ada data teman se-cluster yang tersedia.</p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead>NIS</TableHead>
                                                    <TableHead className="text-center">Rata-rata Nilai</TableHead>
                                                    <TableHead className="text-center">Jarak Centroid</TableHead>
                                                    <TableHead className="text-center">Kesamaan Profil</TableHead>
                                                    <TableHead className="text-center">Posisi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {analisisTeman.map((teman) => (
                                                    <TableRow key={teman.siswa.id}>
                                                        <TableCell className="font-medium">
                                                            {teman.siswa.user.name}
                                                        </TableCell>
                                                        <TableCell>{teman.siswa.nis}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline">
                                                                {teman.nilai_rata_rata.toFixed(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {teman.jarak_centroid.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center gap-2">
                                                                <Progress 
                                                                    value={teman.kesamaan_profil} 
                                                                    className="flex-1 h-2"
                                                                />
                                                                <span className="text-xs text-muted-foreground w-10">
                                                                    {teman.kesamaan_profil.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge 
                                                                variant={teman.nilai_rata_rata > hasilClustering.cluster_info.nilai_rata_rata ? "default" : "secondary"}
                                                            >
                                                                {teman.nilai_rata_rata > hasilClustering.cluster_info.nilai_rata_rata ? 'Di atas rata-rata' : 'Di bawah rata-rata'}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
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
