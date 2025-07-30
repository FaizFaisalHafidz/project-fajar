import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Brain,
    CheckCircle,
    Copy,
    Edit,
    Eye,
    Play,
    Plus,
    Settings,
    Target,
    Trash2,
    Users
} from 'lucide-react';
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
    configurations: ConfigClustering[];
    mataPelajaran: MataPelajaran[];
    activeConfig: ConfigClustering | null;
}

export default function Index({
    tahunAjaranAktif,
    semesterAktif,
    configurations,
    mataPelajaran,
    activeConfig
}: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editingConfig, setEditingConfig] = useState<ConfigClustering | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        jumlah_cluster: 3,
        mata_pelajaran_ids: [] as number[],
        max_iterations: 100,
        tolerance: 0.01,
        bobot_pengetahuan: 40,
        bobot_keterampilan: 40,
        bobot_sikap: 20,
        initialization_method: 'k-means++',
        distance_metric: 'euclidean',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingConfig) {
            put(route('clustering.konfigurasi.update', editingConfig.id), {
                onSuccess: () => {
                    setShowForm(false);
                    setEditingConfig(null);
                    reset();
                }
            });
        } else {
            post(route('clustering.konfigurasi.store'), {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (config: ConfigClustering) => {
        setEditingConfig(config);
        setData({
            jumlah_cluster: config.jumlah_cluster,
            mata_pelajaran_ids: config.fitur_yang_digunakan_parsed,
            max_iterations: config.parameter_algoritma_parsed.max_iterations,
            tolerance: config.parameter_algoritma_parsed.tolerance,
            bobot_pengetahuan: config.parameter_algoritma_parsed.bobot.pengetahuan,
            bobot_keterampilan: config.parameter_algoritma_parsed.bobot.keterampilan,
            bobot_sikap: config.parameter_algoritma_parsed.bobot.sikap,
            initialization_method: config.parameter_algoritma_parsed.initialization_method,
            distance_metric: config.parameter_algoritma_parsed.distance_metric,
        });
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus konfigurasi ini? Semua data terkait akan ikut terhapus.')) {
            router.delete(route('clustering.konfigurasi.destroy', id));
        }
    };

    const handleActivate = (id: number) => {
        router.post(route('clustering.konfigurasi.activate', id));
    };

    const handleDuplicate = (id: number) => {
        router.post(route('clustering.konfigurasi.duplicate', id));
    };

    const totalBobot = data.bobot_pengetahuan + data.bobot_keterampilan + data.bobot_sikap;
    const isBobotValid = totalBobot === 100;

    const getStatusBadge = (config: ConfigClustering) => {
        if (config.status_aktif) {
            return <Badge variant="default">Aktif</Badge>;
        } else if (config.jumlah_hasil > 0) {
            return <Badge variant="secondary">Tidak Aktif</Badge>;
        } else {
            return <Badge variant="outline">Draft</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Konfigurasi Clustering" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Konfigurasi Clustering
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Kelola konfigurasi K-Means clustering untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - {semesterAktif?.nama_semester}
                                </p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingConfig(null);
                                    reset();
                                    setShowForm(true);
                                }}
                                disabled={processing}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Konfigurasi
                            </Button>
                        </div>

                        {/* Active Configuration Info */}
                        {activeConfig && (
                            <Card className="mb-6 border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-blue-800">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Konfigurasi Aktif
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <div className="text-blue-600">Jumlah Cluster</div>
                                            <div className="font-semibold text-blue-800">{activeConfig.jumlah_cluster}</div>
                                        </div>
                                        <div>
                                            <div className="text-blue-600">Mata Pelajaran</div>
                                            <div className="font-semibold text-blue-800">{activeConfig.fitur_yang_digunakan_parsed.length} mapel</div>
                                        </div>
                                        <div>
                                            <div className="text-blue-600">Hasil Clustering</div>
                                            <div className="font-semibold text-blue-800">{activeConfig.jumlah_hasil} siswa</div>
                                        </div>
                                        <div>
                                            <div className="text-blue-600">Dibuat</div>
                                            <div className="font-semibold text-blue-800">
                                                {new Date(activeConfig.created_at).toLocaleDateString('id-ID')}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Configuration Form */}
                    {showForm && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="w-5 h-5 mr-2" />
                                    {editingConfig ? 'Edit Konfigurasi' : 'Tambah Konfigurasi Baru'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Jumlah Cluster
                                            </label>
                                            <select
                                                value={data.jumlah_cluster}
                                                onChange={(e) => setData('jumlah_cluster', parseInt(e.target.value))}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                                    <option key={num} value={num}>{num} Cluster</option>
                                                ))}
                                            </select>
                                            {errors.jumlah_cluster && (
                                                <p className="mt-1 text-sm text-red-600">{errors.jumlah_cluster}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Iterations
                                            </label>
                                            <input
                                                type="number"
                                                min="10"
                                                max="1000"
                                                value={data.max_iterations}
                                                onChange={(e) => setData('max_iterations', parseInt(e.target.value))}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.max_iterations && (
                                                <p className="mt-1 text-sm text-red-600">{errors.max_iterations}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tolerance
                                            </label>
                                            <input
                                                type="number"
                                                step="0.001"
                                                min="0.001"
                                                max="1"
                                                value={data.tolerance}
                                                onChange={(e) => setData('tolerance', parseFloat(e.target.value))}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.tolerance && (
                                                <p className="mt-1 text-sm text-red-600">{errors.tolerance}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Initialization Method
                                            </label>
                                            <select
                                                value={data.initialization_method}
                                                onChange={(e) => setData('initialization_method', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="k-means++">K-means++</option>
                                                <option value="random">Random</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mata Pelajaran yang Dianalisis
                                        </label>
                                        <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
                                            {mataPelajaran.map((mapel) => (
                                                <label key={mapel.id} className="flex items-center space-x-2 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.mata_pelajaran_ids.includes(mapel.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setData('mata_pelajaran_ids', [...data.mata_pelajaran_ids, mapel.id]);
                                                            } else {
                                                                setData('mata_pelajaran_ids', data.mata_pelajaran_ids.filter(id => id !== mapel.id));
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
                                        {(errors as any).bobot && (
                                            <p className="mt-1 text-sm text-red-600">{(errors as any).bobot}</p>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button 
                                            type="submit" 
                                            disabled={processing || !isBobotValid || data.mata_pelajaran_ids.length === 0}
                                        >
                                            {editingConfig ? 'Update' : 'Simpan'} Konfigurasi
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingConfig(null);
                                                reset();
                                            }}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Configurations List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Brain className="w-5 h-5 mr-2" />
                                Daftar Konfigurasi ({configurations.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {configurations.length === 0 ? (
                                <div className="text-center py-8">
                                    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Belum Ada Konfigurasi
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Buat konfigurasi clustering pertama Anda untuk memulai analisis.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setEditingConfig(null);
                                            reset();
                                            setShowForm(true);
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Konfigurasi
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Konfigurasi
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Parameter
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hasil
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {configurations.map((config) => (
                                                <tr key={config.id} className={config.status_aktif ? 'bg-blue-50' : ''}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {config.jumlah_cluster} Cluster
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {config.fitur_yang_digunakan_parsed.length} mata pelajaran
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            Max Iter: {config.parameter_algoritma_parsed.max_iterations}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Tolerance: {config.parameter_algoritma_parsed.tolerance}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(config)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Users className="w-4 h-4 mr-1" />
                                                            {config.jumlah_hasil}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Target className="w-4 h-4 mr-1" />
                                                            {config.jumlah_profil} profil
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(config.created_at).toLocaleDateString('id-ID')}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(config.created_at).toLocaleTimeString('id-ID')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => router.get(route('clustering.konfigurasi.show', config.id))}
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEdit(config)}
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDuplicate(config.id)}
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </Button>
                                                            {!config.status_aktif && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleActivate(config.id)}
                                                                >
                                                                    <Play className="w-3 h-3" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDelete(config.id)}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
