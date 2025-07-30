import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    BarChart3,
    Brain,
    Calendar,
    CheckCircle,
    Clock,
    Copy,
    Edit,
    PieChart,
    Play,
    Settings,
    Target,
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

interface MataPelajaran {
    id: number;
    nama_mapel: string;
    kode_mapel: string;
    deskripsi: string;
    jam_pelajaran: number;
}

interface ConfigClustering {
    id: number;
    semester_id: number;
    jumlah_cluster: number;
    fitur_yang_digunakan: string;
    fitur_yang_digunakan_parsed: number[];
    parameter_algoritma: string;
    parameter_algoritma_parsed: {
        max_iterations: number;
        tolerance: number;
        bobot: {
            pengetahuan: number;
            keterampilan: number;
            sikap: number;
        };
        initialization_method: string;
        distance_metric: string;
    };
    status_aktif: boolean;
    jumlah_hasil: number;
    jumlah_profil: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    tahunAjaranAktif: TahunAjaran | null;
    semesterAktif: Semester | null;
    configuration: ConfigClustering;
    mataPelajaran: MataPelajaran[];
    selectedMataPelajaran: MataPelajaran[];
}

export default function Show({
    tahunAjaranAktif,
    semesterAktif,
    configuration,
    mataPelajaran,
    selectedMataPelajaran
}: Props) {
    const handleEdit = () => {
        router.get(route('clustering.konfigurasi.edit', configuration.id));
    };

    const handleActivate = () => {
        router.post(route('clustering.konfigurasi.activate', configuration.id));
    };

    const handleDuplicate = () => {
        router.post(route('clustering.konfigurasi.duplicate', configuration.id));
    };

    const getStatusBadge = () => {
        if (configuration.status_aktif) {
            return <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Aktif
            </Badge>;
        } else if (configuration.jumlah_hasil > 0) {
            return <Badge variant="secondary">Tidak Aktif</Badge>;
        } else {
            return <Badge variant="outline">Draft</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title={`Konfigurasi Clustering - ${configuration.jumlah_cluster} Cluster`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => router.get(route('clustering.konfigurasi.index'))}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                                <div>
                                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                        Detail Konfigurasi Clustering
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {tahunAjaranAktif?.nama_tahun_ajaran} - {semesterAktif?.nama_semester}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" onClick={handleEdit}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button variant="outline" onClick={handleDuplicate}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplikasi
                                </Button>
                                {!configuration.status_aktif && (
                                    <Button onClick={handleActivate}>
                                        <Play className="w-4 h-4 mr-2" />
                                        Aktifkan
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Configuration Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Settings className="w-5 h-5 mr-2" />
                                            Informasi Konfigurasi
                                        </div>
                                        {getStatusBadge()}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Jumlah Cluster</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900 flex items-center">
                                                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                                                {configuration.jumlah_cluster} Cluster
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Mata Pelajaran</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900 flex items-center">
                                                <Target className="w-5 h-5 mr-2 text-green-600" />
                                                {selectedMataPelajaran.length} Mapel
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Hasil Clustering</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900 flex items-center">
                                                <Users className="w-5 h-5 mr-2 text-purple-600" />
                                                {configuration.jumlah_hasil} Siswa
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Profil Cluster</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900 flex items-center">
                                                <PieChart className="w-5 h-5 mr-2 text-orange-600" />
                                                {configuration.jumlah_profil} Profil
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Algorithm Parameters */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Activity className="w-5 h-5 mr-2" />
                                        Parameter Algoritma
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Max Iterations</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900">
                                                {configuration.parameter_algoritma_parsed.max_iterations}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Tolerance</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900">
                                                {configuration.parameter_algoritma_parsed.tolerance}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Initialization Method</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                                                {configuration.parameter_algoritma_parsed.initialization_method}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Distance Metric</div>
                                            <div className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                                                {configuration.parameter_algoritma_parsed.distance_metric}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Weight Configuration */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <BarChart3 className="w-5 h-5 mr-2" />
                                        Bobot Penilaian
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Pengetahuan</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${configuration.parameter_algoritma_parsed.bobot.pengetahuan}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                                                    {configuration.parameter_algoritma_parsed.bobot.pengetahuan}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Keterampilan</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-600 h-2 rounded-full" 
                                                        style={{ width: `${configuration.parameter_algoritma_parsed.bobot.keterampilan}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                                                    {configuration.parameter_algoritma_parsed.bobot.keterampilan}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Sikap</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-purple-600 h-2 rounded-full" 
                                                        style={{ width: `${configuration.parameter_algoritma_parsed.bobot.sikap}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                                                    {configuration.parameter_algoritma_parsed.bobot.sikap}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Selected Subjects */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Target className="w-5 h-5 mr-2" />
                                        Mata Pelajaran yang Dianalisis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedMataPelajaran.map((mapel) => (
                                            <div 
                                                key={mapel.id} 
                                                className="flex items-center p-3 bg-gray-50 rounded-lg border"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-blue-600">
                                                            {mapel.kode_mapel}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {mapel.nama_mapel}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {mapel.kode_mapel}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Timestamps */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Informasi Waktu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Dibuat
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {new Date(configuration.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(configuration.created_at).toLocaleTimeString('id-ID')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Diperbarui
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {new Date(configuration.updated_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(configuration.updated_at).toLocaleTimeString('id-ID')}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Aksi Cepat</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start"
                                        onClick={() => router.get(route('clustering.index'))}
                                    >
                                        <Brain className="w-4 h-4 mr-2" />
                                        Lihat Hasil Clustering
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start"
                                        onClick={() => router.get(route('clustering.profil-cluster.index'))}
                                    >
                                        <PieChart className="w-4 h-4 mr-2" />
                                        Profil Cluster
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start"
                                        onClick={() => router.get(route('clustering.visualisasi.index'))}
                                    >
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Visualisasi Data
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Statistics */}
                            {configuration.status_aktif && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Statistik</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Total Siswa</span>
                                            <span className="font-semibold">{configuration.jumlah_hasil}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Rata-rata per Cluster</span>
                                            <span className="font-semibold">
                                                {Math.round(configuration.jumlah_hasil / configuration.jumlah_cluster)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Jumlah Profil</span>
                                            <span className="font-semibold">{configuration.jumlah_profil}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
