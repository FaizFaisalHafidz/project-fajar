import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { BarChart3, Brain, Play, RotateCcw, Settings, TrendingUp, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Semester {
    id: number;
    nama_semester: string;
}

interface MataPelajaran {
    id: number;
    nama_mapel: string;
    kode_mapel: string;
}

interface ConfigClustering {
    id: number;
    jumlah_cluster: number;
    mata_pelajaran_ids: string;
    bobot_pengetahuan: number;
    bobot_keterampilan: number;
    bobot_sikap: number;
    status: string;
    akurasi: number | null;
    tanggal_eksekusi: string | null;
}

interface HasilClustering {
    id: number;
    siswa_id: number;
    cluster_id: number;
    nilai_rata_rata: number;
    jarak_centroid: number;
    siswa: {
        user: {
            name: string;
        };
        nis: string;
    };
}

interface StatistikClustering {
    total_siswa: number;
    jumlah_cluster: number;
    distribusi_cluster: { [key: string]: number };
    akurasi_clustering: number;
}

interface SiswaData {
    id: number;
    nama_siswa: string;
    kelas: string;
    rata_rata_nilai: number;
    jumlah_mapel: number;
}

interface Props {
    tahunAjaranAktif: TahunAjaran | null;
    semesterAktif: Semester | null;
    config: ConfigClustering | null;
    mataPelajaran: MataPelajaran[];
    hasilClustering: HasilClustering[] | null;
    statistikClustering: StatistikClustering | null;
    siswaData: SiswaData[];
}

export default function Index({ 
    tahunAjaranAktif, 
    semesterAktif, 
    config, 
    mataPelajaran, 
    hasilClustering, 
    statistikClustering,
    siswaData 
}: Props) {
    const [showConfig, setShowConfig] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    // Debug student names
    console.log('hasilClustering:', hasilClustering);
    console.log('siswaData:', siswaData);

    const { data, setData, post, processing, errors, reset } = useForm({
        jumlah_cluster: config?.jumlah_cluster || 3,
        mata_pelajaran_ids: config ? JSON.parse(config.mata_pelajaran_ids) : [],
        bobot_pengetahuan: config?.bobot_pengetahuan || 40,
        bobot_keterampilan: config?.bobot_keterampilan || 40,
        bobot_sikap: config?.bobot_sikap || 20,
    });

    

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clustering.analisis.store-config'));
    };

    const handleExecuteClustering = () => {
        setIsExecuting(true);
        router.post(route('clustering.analisis.execute'), {
            config_id: config?.id,
        }, {
            onFinish: () => setIsExecuting(false),
        });
    };

    const handleResetClustering = () => {
        router.post(route('clustering.analisis.reset'), {
            config_id: config?.id,
        });
    };

    const totalBobot = data.bobot_pengetahuan + data.bobot_keterampilan + data.bobot_sikap;
    const isBobotValid = totalBobot === 100;

    const getClusterColor = (clusterId: number) => {
        const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-red-100 text-red-800', 'bg-purple-100 text-purple-800'];
        return colors[(clusterId - 1) % colors.length];
    };

    return (
        <AppLayout>
            <Head title="Analisis Clustering Siswa" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Analisis K-Means Clustering
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Analisis clustering siswa berdasarkan performa akademik untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - {semesterAktif?.nama_semester}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowConfig(!showConfig)}
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Konfigurasi
                                </Button>
                                {config && config.status === 'completed' && (
                                    <Button
                                        variant="outline"
                                        onClick={handleResetClustering}
                                        disabled={processing}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Configuration Form */}
                        {showConfig && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Konfigurasi Clustering</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSaveConfig} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jumlah Cluster
                                                </label>
                                                <select
                                                    value={data.jumlah_cluster}
                                                    onChange={(e) => setData('jumlah_cluster', parseInt(e.target.value))}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    {[2, 3, 4, 5].map(num => (
                                                        <option key={num} value={num}>{num} Cluster</option>
                                                    ))}
                                                </select>
                                                {errors.jumlah_cluster && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.jumlah_cluster}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Mata Pelajaran
                                                </label>
                                                <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                                                    {mataPelajaran.map((mapel) => (
                                                        <label key={mapel.id} className="flex items-center space-x-2 mb-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={data.mata_pelajaran_ids.includes(mapel.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setData('mata_pelajaran_ids', [...data.mata_pelajaran_ids, mapel.id]);
                                                                    } else {
                                                                        setData('mata_pelajaran_ids', data.mata_pelajaran_ids.filter((id: number) => id !== mapel.id));
                                                                    }
                                                                }}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-sm">{mapel.nama_mapel}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.mata_pelajaran_ids && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.mata_pelajaran_ids}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                Bobot Penilaian (Total: {totalBobot}%)
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Pengetahuan (%)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={data.bobot_pengetahuan}
                                                        onChange={(e) => setData('bobot_pengetahuan', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Keterampilan (%)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={data.bobot_keterampilan}
                                                        onChange={(e) => setData('bobot_keterampilan', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Sikap (%)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={data.bobot_sikap}
                                                        onChange={(e) => setData('bobot_sikap', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                            {!isBobotValid && (
                                                <p className="mt-2 text-sm text-red-600">Total bobot harus 100%</p>
                                            )}
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button 
                                                type="submit" 
                                                disabled={processing || !isBobotValid || data.mata_pelajaran_ids.length === 0}
                                            >
                                                Simpan Konfigurasi
                                            </Button>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={() => setShowConfig(false)}
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Current Configuration Display */}
                    {config && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Brain className="w-5 h-5 mr-2" />
                                    Konfigurasi Aktif
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
                                        <Badge variant={config.status === 'completed' ? 'default' : 'secondary'}>
                                            {config.status === 'completed' ? 'Selesai' : 'Draft'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Akurasi</div>
                                        <div className="text-lg font-semibold">
                                            {config.akurasi ? `${config.akurasi}%` : '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Mata Pelajaran</div>
                                        <div className="text-sm">
                                            {JSON.parse(config.mata_pelajaran_ids).length} mapel dipilih
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-sm text-gray-500 mb-2">Bobot Penilaian:</div>
                                    <div className="flex space-x-4 text-sm">
                                        <span>Pengetahuan: {config.bobot_pengetahuan}%</span>
                                        <span>Keterampilan: {config.bobot_keterampilan}%</span>
                                        <span>Sikap: {config.bobot_sikap}%</span>
                                    </div>
                                </div>

                                {config.status === 'draft' && (
                                    <div className="mt-4">
                                        <Button 
                                            onClick={handleExecuteClustering}
                                            disabled={isExecuting}
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {isExecuting ? 'Menjalankan...' : 'Jalankan Clustering'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Clustering Results */}
                    {statistikClustering && (
                        <div className="space-y-6">
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statistikClustering.total_siswa}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Jumlah Cluster</CardTitle>
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statistikClustering.jumlah_cluster}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Akurasi</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statistikClustering.akurasi_clustering}%</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                                        <Zap className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <Badge variant="default">Aktif</Badge>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Cluster Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Cluster</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {Object.entries(statistikClustering.distribusi_cluster).map(([clusterId, jumlah]) => (
                                            <div key={clusterId} className="text-center p-4 border rounded-lg">
                                                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${getClusterColor(parseInt(clusterId))}`}>
                                                    Cluster {clusterId}
                                                </div>
                                                <div className="text-2xl font-bold">{jumlah}</div>
                                                <div className="text-sm text-gray-500">
                                                    {((jumlah / statistikClustering.total_siswa) * 100).toFixed(1)}% siswa
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Clustering Results Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hasil Clustering</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Siswa
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cluster
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nilai Rata-rata
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Jarak Centroid
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {hasilClustering?.map((hasil) => (
                                                    <tr key={hasil.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {hasil.siswa.user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {hasil.siswa.nis}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClusterColor(hasil.cluster_id)}`}>
                                                                Cluster {hasil.cluster_id}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {hasil.nilai_rata_rata.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {hasil.jarak_centroid.toFixed(4)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Data Preview (when no clustering results) */}
                    {!statistikClustering && siswaData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview Data Siswa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 mb-4">
                                    Data siswa yang tersedia untuk clustering ({siswaData.length} siswa)
                                </p>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Siswa
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kelas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rata-rata Nilai
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jumlah Mapel
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {siswaData.slice(0, 10).map((siswa) => (
                                                <tr key={siswa.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {siswa.nama_siswa}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {siswa.kelas}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {siswa.rata_rata_nilai}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {siswa.jumlah_mapel}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {siswaData.length > 10 && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Dan {siswaData.length - 10} siswa lainnya...
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
