import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Brain, Download, Eye, Target, TrendingUp, Users } from 'lucide-react';

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Semester {
    id: number;
    nama_semester: string;
}

interface ConfigClustering {
    id: number;
    jumlah_cluster: number;
    akurasi: number;
    tanggal_eksekusi: string;
}

interface ProfilCluster {
    id: number;
    cluster_id: number;
    label_cluster: string;
    deskripsi: string;
    jumlah_siswa: number;
    nilai_rata_rata: number;
    karakteristik_parsed: {
        rentang_nilai: {
            min: number;
            max: number;
        };
        standar_deviasi: number;
    };
    siswa_list: Array<{
        id: number;
        nama_siswa: string;
        nis: string;
        kelas: string;
        nilai_rata_rata: number;
        jarak_centroid: number;
    }>;
}

interface StatistikGlobal {
    total_siswa: number;
    jumlah_cluster: number;
    akurasi_clustering: number;
    distribusi_cluster: Array<{
        cluster_id: number;
        label: string;
        jumlah_siswa: number;
        persentase: number;
        nilai_rata_rata: number;
    }>;
    range_nilai: {
        min: number;
        max: number;
        rata_rata_global: number;
    };
}

interface RiwayatClustering {
    id: number;
    tanggal_eksekusi: string;
    akurasi: number;
    jumlah_cluster: number;
    tahunAjaran: TahunAjaran;
    semester: Semester;
}

interface Props {
    tahunAjaranAktif: TahunAjaran | null;
    semesterAktif: Semester | null;
    config: ConfigClustering | null;
    profilClusters: ProfilCluster[];
    statistikGlobal: StatistikGlobal | null;
    riwayatClustering: RiwayatClustering[];
}

export default function Index({ 
    tahunAjaranAktif, 
    semesterAktif, 
    config, 
    profilClusters, 
    statistikGlobal,
    riwayatClustering 
}: Props) {
    const getClusterColor = (clusterId: number) => {
        const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-red-100 text-red-800', 'bg-purple-100 text-purple-800'];
        return colors[(clusterId - 1) % colors.length];
    };

    const getPerformanceLevel = (nilai: number) => {
        if (nilai >= 85) return { label: 'Sangat Baik', color: 'text-green-600' };
        if (nilai >= 75) return { label: 'Baik', color: 'text-blue-600' };
        if (nilai >= 65) return { label: 'Cukup', color: 'text-yellow-600' };
        return { label: 'Perlu Perhatian', color: 'text-red-600' };
    };

    return (
        <AppLayout>
            <Head title="Profil Cluster" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Profil Cluster Siswa
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Analisis profil cluster untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - {semesterAktif?.nama_semester}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" asChild>
                                    <Link href={route('clustering.analisis.index')}>
                                        <Brain className="w-4 h-4 mr-2" />
                                        Analisis Clustering
                                    </Link>
                                </Button>
                                {config && (
                                    <Button variant="outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Data
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {config && statistikGlobal ? (
                        <div className="space-y-6">
                            {/* Global Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statistikGlobal.total_siswa}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Jumlah Cluster</CardTitle>
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statistikGlobal.jumlah_cluster}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Akurasi</CardTitle>
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statistikGlobal.akurasi_clustering}%</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Rata-rata Global</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statistikGlobal.range_nilai.rata_rata_global}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Cluster Distribution Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Overview Distribusi Cluster</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {statistikGlobal.distribusi_cluster.map((cluster) => (
                                            <div key={cluster.cluster_id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClusterColor(cluster.cluster_id)}`}>
                                                        {cluster.label}
                                                    </span>
                                                    <Badge variant="outline">{cluster.persentase}%</Badge>
                                                </div>
                                                <div className="text-lg font-bold">{cluster.jumlah_siswa} siswa</div>
                                                <div className="text-sm text-gray-500">
                                                    Rata-rata: {cluster.nilai_rata_rata}
                                                </div>
                                                <div className={`text-sm font-medium ${getPerformanceLevel(cluster.nilai_rata_rata).color}`}>
                                                    {getPerformanceLevel(cluster.nilai_rata_rata).label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Detailed Cluster Profiles */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Profil Detail Cluster</h3>
                                {profilClusters.map((profil) => (
                                    <Card key={profil.id}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getClusterColor(profil.cluster_id)}`}>
                                                        Cluster {profil.cluster_id}
                                                    </span>
                                                    <CardTitle className="text-lg">{profil.label_cluster}</CardTitle>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('clustering.profil.show', profil.cluster_id)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Detail
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <div className="text-sm text-gray-500">Jumlah Siswa</div>
                                                    <div className="text-xl font-bold">{profil.jumlah_siswa}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Rata-rata Nilai</div>
                                                    <div className="text-xl font-bold">{profil.nilai_rata_rata}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Rentang Nilai</div>
                                                    <div className="text-sm">
                                                        {profil.karakteristik_parsed.rentang_nilai.min.toFixed(1)} - {profil.karakteristik_parsed.rentang_nilai.max.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Standar Deviasi</div>
                                                    <div className="text-sm">{profil.karakteristik_parsed.standar_deviasi}</div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-sm text-gray-500 mb-2">Deskripsi:</div>
                                                <p className="text-sm">{profil.deskripsi}</p>
                                            </div>

                                            {/* Preview Siswa */}
                                            <div>
                                                <div className="text-sm text-gray-500 mb-2">Preview Siswa ({profil.siswa_list.length > 5 ? '5 dari ' + profil.siswa_list.length : profil.siswa_list.length}):</div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {profil.siswa_list.slice(0, 5).map((siswa) => (
                                                        <div key={siswa.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                            <div>
                                                                <div className="text-sm font-medium">{siswa.nama_siswa}</div>
                                                                <div className="text-xs text-gray-500">{siswa.kelas}</div>
                                                            </div>
                                                            <div className="text-sm font-medium">
                                                                {siswa.nilai_rata_rata.toFixed(1)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {profil.siswa_list.length > 5 && (
                                                    <div className="mt-2 text-center">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('clustering.profil.show', profil.cluster_id)}>
                                                                Lihat Semua ({profil.siswa_list.length} siswa)
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Riwayat Clustering */}
                            {riwayatClustering.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Riwayat Clustering</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Tanggal
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Periode
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Cluster
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Akurasi
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {riwayatClustering.map((riwayat) => (
                                                        <tr key={riwayat.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {new Date(riwayat.tanggal_eksekusi).toLocaleDateString('id-ID')}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {riwayat.tahunAjaran.nama_tahun_ajaran} - {riwayat.semester.nama_semester}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {riwayat.jumlah_cluster} cluster
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {riwayat.akurasi}%
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : (
                        /* No Clustering Data */
                        <Card>
                            <CardContent className="text-center py-12">
                                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium mb-2">Belum Ada Hasil Clustering</h3>
                                <p className="text-gray-500 mb-4">
                                    Belum ada hasil clustering yang tersedia untuk periode ini.
                                </p>
                                <Button asChild>
                                    <Link href={route('clustering.analisis.index')}>
                                        <Brain className="w-4 h-4 mr-2" />
                                        Mulai Analisis Clustering
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
