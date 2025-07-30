import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    Brain,
    Download,
    PieChart,
    ScatterChart,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart as RechartsPieChart,
    ScatterChart as RechartsScatterChart,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

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
    status_aktif: boolean;
    created_at: string;
}

interface VisualisasiData {
    scatter_data: Array<{
        id: number;
        nama: string;
        kelas: string;
        cluster_id: number;
        nilai_rata_rata: number;
        jarak_centroid: number;
        x: number;
        y: number;
    }>;
    distribusi_cluster: Array<{
        cluster_id: number;
        label: string;
        jumlah_siswa: number;
        rata_rata_nilai: number;
        color: string;
    }>;
    pie_chart_data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    histogram_data: Array<{
        range: string;
        count: number;
    }>;
    centroids: Array<{
        cluster_id: number;
        label: string;
        centroid_x: number;
        centroid_y: number;
        jumlah_siswa: number;
        color: string;
    }>;
    box_plot_data: Array<{
        cluster_id: number;
        label: string;
        min: number;
        q1: number;
        median: number;
        q3: number;
        max: number;
        outliers: number[];
    }>;
    summary_stats: {
        total_siswa: number;
        jumlah_cluster: number;
        nilai_tertinggi: number;
        nilai_terendah: number;
        rata_rata_global: number;
        standar_deviasi: number;
    };
}

interface Props {
    tahunAjaranAktif: TahunAjaran | null;
    semesterAktif: Semester | null;
    config: ConfigClustering | null;
    visualisasiData: VisualisasiData | null;
}

export default function Index({
    tahunAjaranAktif,
    semesterAktif,
    config,
    visualisasiData
}: Props) {
    const [selectedVisualization, setSelectedVisualization] = useState<string>('scatter');

    const handleExport = (format: string = 'json') => {
        router.get(route('clustering.visualisasi.export'), { format });
    };

    if (!config || !visualisasiData) {
        return (
            <AppLayout>
                <Head title="Visualisasi Data Clustering" />
                
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Visualisasi Data Clustering
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - {semesterAktif?.nama_semester}
                            </p>
                        </div>

                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Brain className="w-16 h-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum Ada Data Clustering
                                </h3>
                                <p className="text-gray-500 text-center mb-4">
                                    Silakan jalankan clustering terlebih dahulu untuk melihat visualisasi data.
                                </p>
                                <Button 
                                    onClick={() => router.visit(route('clustering.analisis.index'))}
                                >
                                    Ke Halaman Analisis
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const renderVisualization = () => {
        switch (selectedVisualization) {
            case 'scatter':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <ScatterChart className="w-5 h-5 mr-2" />
                                Scatter Plot - Distribusi Siswa per Cluster
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        type="number" 
                                        dataKey="x" 
                                        name="Nilai Rata-rata"
                                        domain={['dataMin - 5', 'dataMax + 5']}
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="y" 
                                        name="Jarak ke Centroid"
                                    />
                                    <Tooltip 
                                        cursor={{ strokeDasharray: '3 3' }}
                                        content={({ active, payload }: any) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-3 border rounded shadow">
                                                        <p className="font-medium">{data.nama}</p>
                                                        <p className="text-sm text-gray-600">Kelas: {data.kelas}</p>
                                                        <p className="text-sm">Cluster: {data.cluster_id}</p>
                                                        <p className="text-sm">Nilai: {data.nilai_rata_rata}</p>
                                                        <p className="text-sm">Jarak: {data.jarak_centroid.toFixed(4)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    {visualisasiData.centroids.map((centroid) => (
                                        <Scatter
                                            key={centroid.cluster_id}
                                            name={centroid.label}
                                            data={visualisasiData.scatter_data.filter(d => d.cluster_id === centroid.cluster_id)}
                                            fill={centroid.color}
                                        />
                                    ))}
                                </RechartsScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                );

            case 'bar':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Distribusi Cluster
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={visualisasiData.distribusi_cluster}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="label" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar 
                                        dataKey="jumlah_siswa" 
                                        fill="#3B82F6" 
                                        name="Jumlah Siswa"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                );

            case 'pie':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PieChart className="w-5 h-5 mr-2" />
                                Proporsi Cluster
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsPieChart>
                                    <Pie
                                        data={visualisasiData.pie_chart_data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {visualisasiData.pie_chart_data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                );

            case 'histogram':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="w-5 h-5 mr-2" />
                                Distribusi Nilai
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={visualisasiData.histogram_data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#10B981" 
                                        name="Jumlah Siswa"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title="Visualisasi Data Clustering" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Visualisasi Data Clustering
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Visualisasi hasil clustering untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - {semesterAktif?.nama_semester}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleExport('json')}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data
                                </Button>
                            </div>
                        </div>

                        {/* Configuration Info */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Target className="w-5 h-5 mr-2" />
                                    Informasi Clustering Aktif
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Jumlah Cluster</div>
                                        <div className="text-lg font-semibold">{config.jumlah_cluster}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Status</div>
                                        <Badge variant="default">
                                            {config.status_aktif ? 'Aktif' : 'Tidak Aktif'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Total Siswa</div>
                                        <div className="text-lg font-semibold">{visualisasiData.summary_stats.total_siswa}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Tanggal Clustering</div>
                                        <div className="text-sm">{new Date(config.created_at).toLocaleDateString('id-ID')}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{visualisasiData.summary_stats.total_siswa}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rata-rata Global</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{visualisasiData.summary_stats.rata_rata_global}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Nilai Tertinggi</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{visualisasiData.summary_stats.nilai_tertinggi}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Standar Deviasi</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{visualisasiData.summary_stats.standar_deviasi}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Visualization Controls */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Pilih Jenis Visualisasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={selectedVisualization === 'scatter' ? 'default' : 'outline'}
                                    onClick={() => setSelectedVisualization('scatter')}
                                >
                                    <ScatterChart className="w-4 h-4 mr-2" />
                                    Scatter Plot
                                </Button>
                                <Button
                                    variant={selectedVisualization === 'bar' ? 'default' : 'outline'}
                                    onClick={() => setSelectedVisualization('bar')}
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Bar Chart
                                </Button>
                                <Button
                                    variant={selectedVisualization === 'pie' ? 'default' : 'outline'}
                                    onClick={() => setSelectedVisualization('pie')}
                                >
                                    <PieChart className="w-4 h-4 mr-2" />
                                    Pie Chart
                                </Button>
                                <Button
                                    variant={selectedVisualization === 'histogram' ? 'default' : 'outline'}
                                    onClick={() => setSelectedVisualization('histogram')}
                                >
                                    <Activity className="w-4 h-4 mr-2" />
                                    Histogram
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visualization Display */}
                    {renderVisualization()}

                    {/* Cluster Summary */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Ringkasan Cluster</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {visualisasiData.distribusi_cluster.map((cluster) => (
                                    <div key={cluster.cluster_id} className="border rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <div 
                                                className="w-4 h-4 rounded mr-2" 
                                                style={{ backgroundColor: cluster.color }}
                                            ></div>
                                            <h3 className="font-semibold">{cluster.label}</h3>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span>Jumlah Siswa:</span>
                                                <span className="font-medium">{cluster.jumlah_siswa}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Rata-rata Nilai:</span>
                                                <span className="font-medium">{cluster.rata_rata_nilai}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Persentase:</span>
                                                <span className="font-medium">
                                                    {((cluster.jumlah_siswa / visualisasiData.summary_stats.total_siswa) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
