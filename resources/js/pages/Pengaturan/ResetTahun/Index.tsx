import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    BookOpen,
    Calendar,
    Copy,
    Database,
    RotateCcw,
    Shield,
    Trash2,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean;
}

interface DataCounts {
    siswa: number;
    kelas: number;
    penugasan_mengajar: number;
    nilai_siswa: number;
    absensi: number;
    prestasi: number;
    ekstrakurikuler_siswa: number;
}

interface Props {
    tahunAjaranAktif: TahunAjaran;
    tahunAjaranSebelumnya: TahunAjaran[];
    dataCounts: DataCounts;
}

export default function Index({ tahunAjaranAktif, tahunAjaranSebelumnya, dataCounts }: Props) {
    const [selectedData, setSelectedData] = useState<string[]>([]);
    const [selectedTahunSumber, setSelectedTahunSumber] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        data_types: [] as string[],
        source_tahun_id: '',
    });

    const dataOptions = [
        { key: 'siswa', label: 'Data Siswa', count: dataCounts.siswa, icon: Users },
        { key: 'kelas', label: 'Data Kelas & Penugasan', count: dataCounts.kelas, icon: BookOpen },
        { key: 'penugasan_mengajar', label: 'Penugasan Mengajar', count: dataCounts.penugasan_mengajar, icon: Users },
        { key: 'nilai_siswa', label: 'Nilai Siswa', count: dataCounts.nilai_siswa, icon: BookOpen },
        { key: 'absensi', label: 'Data Absensi', count: dataCounts.absensi, icon: Calendar },
        { key: 'prestasi', label: 'Data Prestasi', count: dataCounts.prestasi, icon: Badge },
        { key: 'ekstrakurikuler_siswa', label: 'Nilai Ekstrakurikuler', count: dataCounts.ekstrakurikuler_siswa, icon: BookOpen },
    ];

    const handleSelectData = (dataKey: string) => {
        setSelectedData(prev => 
            prev.includes(dataKey) 
                ? prev.filter(key => key !== dataKey)
                : [...prev, dataKey]
        );
    };

    const handleSelectAll = () => {
        if (selectedData.length === dataOptions.length) {
            setSelectedData([]);
        } else {
            setSelectedData(dataOptions.map(option => option.key));
        }
    };

    const handleResetData = (type: 'selective' | 'all') => {
        if (type === 'selective' && selectedData.length === 0) {
            toast.error('Pilih data yang akan direset', {
                position: 'top-right',
            });
            return;
        }

        const confirmText = type === 'all' 
            ? 'Apakah Anda yakin ingin mereset SEMUA data tahun akademik? Tindakan ini tidak dapat dibatalkan!'
            : `Apakah Anda yakin ingin mereset ${selectedData.length} jenis data terpilih? Tindakan ini tidak dapat dibatalkan!`;

        if (confirm(confirmText)) {
            if (type === 'all') {
                post(route('pengaturan.reset-tahun.reset-all'), {
                    onSuccess: () => {
                        toast.success('Data berhasil direset', {
                            position: 'top-right',
                        });
                        setSelectedData([]);
                        setShowConfirmation(null);
                    },
                    onError: () => {
                        toast.error('Terjadi kesalahan saat mereset data', {
                            position: 'top-right',
                        });
                    },
                });
            } else {
                setData('data_types', selectedData);
                post(route('pengaturan.reset-tahun.reset-selective'), {
                    onSuccess: () => {
                        toast.success('Data berhasil direset', {
                            position: 'top-right',
                        });
                        setSelectedData([]);
                        setShowConfirmation(null);
                    },
                    onError: () => {
                        toast.error('Terjadi kesalahan saat mereset data', {
                            position: 'top-right',
                        });
                    },
                });
            }
        }
    };

    const handleCopyFromPrevious = () => {
        if (!selectedTahunSumber) {
            toast.error('Pilih tahun ajaran sumber terlebih dahulu', {
                position: 'top-right',
            });
            return;
        }

        if (selectedData.length === 0) {
            toast.error('Pilih data yang akan disalin', {
                position: 'top-right',
            });
            return;
        }

        const tahunSumber = tahunAjaranSebelumnya.find(t => t.id.toString() === selectedTahunSumber);
        
        if (confirm(`Apakah Anda yakin ingin menyalin ${selectedData.length} jenis data dari tahun ajaran ${tahunSumber?.nama_tahun_ajaran}?`)) {
            setData({
                source_tahun_id: selectedTahunSumber,
                data_types: selectedData,
            });
            
            post(route('pengaturan.reset-tahun.copy-from-previous'), {
                onSuccess: () => {
                    toast.success('Data berhasil disalin dari tahun ajaran sebelumnya', {
                        position: 'top-right',
                    });
                    setSelectedData([]);
                    setSelectedTahunSumber('');
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menyalin data', {
                        position: 'top-right',
                    });
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Reset Tahun Akademik" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Reset Tahun Akademik
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola data untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran}
                            </p>
                        </div>
                    </div>

                    {/* Warning Alert */}
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            <strong>Peringatan:</strong> Fitur ini akan menghapus data secara permanen. 
                            Pastikan Anda telah membuat backup sebelum melanjutkan. Tindakan ini tidak dapat dibatalkan!
                        </AlertDescription>
                    </Alert>

                    {/* Current Data Overview */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Database className="w-5 h-5 mr-2" />
                                Data Saat Ini - {tahunAjaranAktif?.nama_tahun_ajaran}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {dataOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <div key={option.key} className="flex items-center p-3 border rounded-lg">
                                            <Icon className="w-8 h-8 text-blue-500 mr-3" />
                                            <div>
                                                <div className="text-sm text-gray-600">{option.label}</div>
                                                <div className="text-xl font-bold">{option.count.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Data Selection */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Pilih Data untuk Dikelola</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                    >
                                        {selectedData.length === dataOptions.length ? 'Batalkan Semua' : 'Pilih Semua'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {dataOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <div key={option.key} className="flex items-center space-x-3 p-2 border rounded-lg">
                                            <Checkbox
                                                id={option.key}
                                                checked={selectedData.includes(option.key)}
                                                onCheckedChange={() => handleSelectData(option.key)}
                                            />
                                            <Icon className="w-5 h-5 text-gray-500" />
                                            <div className="flex-1">
                                                <label htmlFor={option.key} className="text-sm font-medium cursor-pointer">
                                                    {option.label}
                                                </label>
                                                <div className="text-xs text-gray-500">
                                                    {option.count.toLocaleString()} records
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="w-5 h-5 mr-2" />
                                    Pilihan Tindakan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Copy from Previous Year */}
                                <div className="p-4 border rounded-lg bg-blue-50">
                                    <h4 className="font-medium mb-3 flex items-center">
                                        <Copy className="w-4 h-4 mr-2" />
                                        Salin dari Tahun Sebelumnya
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Pilih Tahun Ajaran Sumber:
                                            </label>
                                            <select
                                                value={selectedTahunSumber}
                                                onChange={(e) => setSelectedTahunSumber(e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">Pilih tahun ajaran</option>
                                                {tahunAjaranSebelumnya.map((tahun) => (
                                                    <option key={tahun.id} value={tahun.id.toString()}>
                                                        {tahun.nama_tahun_ajaran}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <Button
                                            onClick={handleCopyFromPrevious}
                                            disabled={processing || !selectedTahunSumber || selectedData.length === 0}
                                            className="w-full"
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            {processing ? 'Menyalin...' : 'Salin Data Terpilih'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Reset Selected Data */}
                                <div className="p-4 border rounded-lg bg-yellow-50">
                                    <h4 className="font-medium mb-3 flex items-center">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset Data Terpilih
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Hapus data yang dipilih untuk tahun ajaran ini
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleResetData('selective')}
                                        disabled={processing || selectedData.length === 0}
                                        className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        {processing ? 'Mereset...' : `Reset ${selectedData.length} Data Terpilih`}
                                    </Button>
                                </div>

                                {/* Reset All Data */}
                                <div className="p-4 border rounded-lg bg-red-50">
                                    <h4 className="font-medium mb-3 flex items-center">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Reset Semua Data
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Hapus SEMUA data akademik untuk tahun ajaran ini. 
                                        <strong className="text-red-600"> Sangat berbahaya!</strong>
                                    </p>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleResetData('all')}
                                        disabled={processing}
                                        className="w-full"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {processing ? 'Mereset...' : 'Reset Semua Data'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Instructions */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Petunjuk Penggunaan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center">
                                        <Copy className="w-4 h-4 mr-2 text-blue-500" />
                                        Salin Data
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Gunakan untuk menyalin data dari tahun ajaran sebelumnya. 
                                        Berguna untuk data master seperti siswa, kelas, dan penugasan mengajar.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center">
                                        <RotateCcw className="w-4 h-4 mr-2 text-yellow-500" />
                                        Reset Terpilih
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Hapus data tertentu saja. Berguna ketika ingin memulai fresh 
                                        untuk data tertentu seperti nilai atau absensi.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center">
                                        <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                                        Reset Semua
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Hapus semua data akademik. Gunakan dengan sangat hati-hati! 
                                        Biasanya untuk memulai tahun ajaran baru dari awal.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
