import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Download, FileText, Filter, Users } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
}

interface Guru {
    id: number;
    user: User;
    nip: string;
}

interface Jurusan {
    id: number;
    nama_jurusan: string;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    jurusan: Jurusan;
    wali_kelas?: Guru;
    jumlah_siswa: number;
}

interface LaporanData {
    guru: Guru;
    kelas_wali: Kelas[];
    total_siswa: number;
    summary: {
        kelas_per_tingkat: { [key: string]: number };
        siswa_per_jurusan: { [key: string]: number };
        rata_rata_siswa_per_kelas: number;
    };
}

interface Props {
    laporanData: LaporanData[];
    tahunAjaranAktif: TahunAjaran;
    totalStats: {
        total_guru_wali: number;
        total_kelas: number;
        total_siswa: number;
        rata_rata_siswa: number;
    };
    filters: {
        tingkat_kelas?: string;
        jurusan_id?: string;
    };
    jurusanOptions: Jurusan[];
}

export default function Laporan({ 
    laporanData, 
    tahunAjaranAktif, 
    totalStats, 
    filters,
    jurusanOptions 
}: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const { data, setData, get } = useForm({
        tingkat_kelas: filters.tingkat_kelas || '',
        jurusan_id: filters.jurusan_id || '',
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('pengaturan.wali-kelas.laporan'), {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilter = () => {
        setData({
            tingkat_kelas: '',
            jurusan_id: '',
        });
        get(route('pengaturan.wali-kelas.laporan'), {
            preserveState: true,
            replace: true,
        });
    };

    const exportLaporan = () => {
        const params = new URLSearchParams();
        if (data.tingkat_kelas) params.append('tingkat_kelas', data.tingkat_kelas);
        if (data.jurusan_id) params.append('jurusan_id', data.jurusan_id);
        params.append('export', 'excel');
        
        window.open(`${route('pengaturan.wali-kelas.laporan')}?${params.toString()}`);
    };

    return (
        <AppLayout>
            <Head title="Laporan Wali Kelas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('pengaturan.wali-kelas.index')}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Link>
                                </Button>
                                <div>
                                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                        Laporan Wali Kelas
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Laporan lengkap wali kelas untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                                <Button onClick={exportLaporan}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Excel
                                </Button>
                            </div>
                        </div>

                        {/* Filter Form */}
                        {showFilters && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Filter Laporan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tingkat Kelas
                                            </label>
                                            <select
                                                value={data.tingkat_kelas}
                                                onChange={(e) => setData('tingkat_kelas', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Semua Tingkat</option>
                                                <option value="10">Kelas 10</option>
                                                <option value="11">Kelas 11</option>
                                                <option value="12">Kelas 12</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Jurusan
                                            </label>
                                            <select
                                                value={data.jurusan_id}
                                                onChange={(e) => setData('jurusan_id', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Semua Jurusan</option>
                                                {jurusanOptions.map((jurusan) => (
                                                    <option key={jurusan.id} value={jurusan.id.toString()}>
                                                        {jurusan.nama_jurusan}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-end space-x-2">
                                            <Button type="submit">
                                                Terapkan Filter
                                            </Button>
                                            <Button type="button" variant="outline" onClick={resetFilter}>
                                                Reset
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Guru Wali
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalStats.total_guru_wali}</div>
                                <p className="text-xs text-muted-foreground">
                                    Guru yang menjadi wali kelas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Kelas
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalStats.total_kelas}</div>
                                <p className="text-xs text-muted-foreground">
                                    Kelas yang memiliki wali
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Siswa
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalStats.total_siswa}</div>
                                <p className="text-xs text-muted-foreground">
                                    Siswa yang dibimbing
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Rata-rata Siswa
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalStats.rata_rata_siswa}</div>
                                <p className="text-xs text-muted-foreground">
                                    Siswa per kelas
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Laporan Detail */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Detail Laporan Wali Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {laporanData.length > 0 ? (
                                <div className="space-y-6">
                                    {laporanData.map((data, index) => (
                                        <div key={data.guru.id} className="border rounded-lg p-6">
                                            {/* Guru Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{data.guru.user.name}</h3>
                                                    <p className="text-sm text-gray-500">NIP: {data.guru.nip}</p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="mr-2">
                                                        {data.kelas_wali.length} Kelas
                                                    </Badge>
                                                    <Badge variant="secondary">
                                                        {data.total_siswa} Siswa
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Kelas yang Diampu */}
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-2">Kelas yang Diampu:</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {data.kelas_wali.map((kelas) => (
                                                        <div key={kelas.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div>
                                                                <div className="font-medium">
                                                                    {kelas.tingkat_kelas} {kelas.nama_kelas}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {kelas.jurusan.nama_jurusan}
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {kelas.jumlah_siswa} siswa
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Summary Statistics */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                                                <div className="text-center">
                                                    <div className="text-sm text-blue-800">Distribusi Tingkat</div>
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        {Object.entries(data.summary.kelas_per_tingkat).map(([tingkat, jumlah]) => (
                                                            <span key={tingkat} className="mr-2">
                                                                Kelas {tingkat}: {jumlah}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-blue-800">Distribusi Jurusan</div>
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        {Object.entries(data.summary.siswa_per_jurusan).map(([jurusan, jumlah]) => (
                                                            <div key={jurusan}>{jurusan.substring(0, 10)}: {jumlah}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-blue-800">Rata-rata Siswa</div>
                                                    <div className="text-lg font-bold text-blue-900">
                                                        {data.summary.rata_rata_siswa_per_kelas}
                                                    </div>
                                                    <div className="text-xs text-blue-600">siswa per kelas</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-medium mb-2">Tidak Ada Data</h3>
                                    <p>Belum ada data wali kelas untuk ditampilkan dalam laporan</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
