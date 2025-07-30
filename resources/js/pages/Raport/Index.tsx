import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Download,
    FileText,
    GraduationCap,
    User,
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

interface Jurusan {
    id: number;
    nama_jurusan: string;
    kode_jurusan: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    jurusan: Jurusan;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Siswa {
    id: number;
    nama_siswa: string;
    nisn: string;
    user: User;
    kelas: Kelas;
}

interface Props {
    tahunAjaranAktif: TahunAjaran | null;
    semesterAktif: Semester | null;
    kelasList: Kelas[];
    siswaList: Siswa[];
}

export default function Index({
    tahunAjaranAktif,
    semesterAktif,
    kelasList,
    siswaList
}: Props) {
    const [activeTab, setActiveTab] = useState('lengkap');
    const [isLoading, setIsLoading] = useState(false);

    // Form untuk raport lengkap
    const { data: dataLengkap, setData: setDataLengkap, post: postLengkap, processing: processingLengkap } = useForm({
        format: 'pdf',
        include_prestasi: true,
        include_ekstrakurikuler: true,
        include_absensi: true,
    });

    // Form untuk raport per siswa
    const { data: dataPerSiswa, setData: setDataPerSiswa, post: postPerSiswa, processing: processingPerSiswa } = useForm({
        siswa_id: '',
        format: 'pdf',
        include_prestasi: true,
        include_ekstrakurikuler: true,
        include_absensi: true,
    });

    // Form untuk raport per kelas
    const { data: dataPerKelas, setData: setDataPerKelas, post: postPerKelas, processing: processingPerKelas } = useForm({
        kelas_id: '',
        format: 'pdf',
        include_prestasi: true,
        include_ekstrakurikuler: true,
        include_absensi: true,
    });

    const handleGenerateLengkap = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        postLengkap(route('raport.generate-lengkap'), {
            onFinish: () => setIsLoading(false)
        });
    };

    const handleGeneratePerSiswa = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dataPerSiswa.siswa_id) {
            alert('Pilih siswa terlebih dahulu');
            return;
        }
        setIsLoading(true);
        postPerSiswa(route('raport.generate-per-siswa'), {
            onFinish: () => setIsLoading(false)
        });
    };

    const handleGeneratePerKelas = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dataPerKelas.kelas_id) {
            alert('Pilih kelas terlebih dahulu');
            return;
        }
        setIsLoading(true);
        postPerKelas(route('raport.generate-per-kelas'), {
            onFinish: () => setIsLoading(false)
        });
    };

    const getSiswaByKelas = (kelasId: string) => {
        return siswaList.filter(siswa => siswa.kelas.id.toString() === kelasId);
    };

    const selectedKelas = kelasList.find(k => k.id.toString() === dataPerKelas.kelas_id);
    const siswaInSelectedKelas = selectedKelas ? getSiswaByKelas(dataPerKelas.kelas_id) : [];

    return (
        <AppLayout>
            <Head title="Cetak Raport" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Cetak Raport
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Cetak raport siswa untuk {tahunAjaranAktif?.nama_tahun_ajaran} - {semesterAktif?.nama_semester}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {tahunAjaranAktif?.nama_tahun_ajaran}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {semesterAktif?.nama_semester}
                                </Badge>
                            </div>
                        </div>

                        {!tahunAjaranAktif || !semesterAktif ? (
                            <Card className="border-amber-200 bg-amber-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-center">
                                        <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                                        <span className="text-amber-800">
                                            Tahun ajaran atau semester aktif belum diatur. Silakan hubungi administrator.
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>

                    {/* Tabs Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Pilih Jenis Raport
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="lengkap" className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Raport Lengkap
                                    </TabsTrigger>
                                    <TabsTrigger value="per-siswa" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Per Siswa
                                    </TabsTrigger>
                                    <TabsTrigger value="per-kelas" className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />
                                        Per Kelas
                                    </TabsTrigger>
                                </TabsList>

                                {/* Tab: Raport Lengkap */}
                                <TabsContent value="lengkap" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Cetak Raport Lengkap</CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Cetak raport untuk semua siswa di sekolah
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleGenerateLengkap} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Format Output
                                                        </label>
                                                        <select
                                                            value={dataLengkap.format}
                                                            onChange={(e) => setDataLengkap('format', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        >
                                                            <option value="pdf">PDF</option>
                                                            <option value="excel">Excel</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Komponen yang Disertakan
                                                    </label>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataLengkap.include_prestasi}
                                                                onChange={(e) => setDataLengkap('include_prestasi', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Prestasi Siswa</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataLengkap.include_ekstrakurikuler}
                                                                onChange={(e) => setDataLengkap('include_ekstrakurikuler', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Nilai Ekstrakurikuler</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataLengkap.include_absensi}
                                                                onChange={(e) => setDataLengkap('include_absensi', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Data Absensi</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <Button 
                                                    type="submit" 
                                                    disabled={processingLengkap || isLoading || !tahunAjaranAktif || !semesterAktif}
                                                    className="w-full"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    {processingLengkap || isLoading ? 'Generating...' : 'Generate Raport Lengkap'}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Tab: Per Siswa */}
                                <TabsContent value="per-siswa" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Cetak Raport Per Siswa</CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Pilih siswa individual untuk dicetak raportnya
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleGeneratePerSiswa} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Pilih Siswa
                                                        </label>
                                                        <select
                                                            value={dataPerSiswa.siswa_id}
                                                            onChange={(e) => setDataPerSiswa('siswa_id', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            required
                                                        >
                                                            <option value="">Pilih Siswa</option>
                                                            {siswaList.map((siswa) => (
                                                                <option key={siswa.id} value={siswa.id}>
                                                                    {siswa.user.name} - {siswa.kelas.nama_kelas}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Format Output
                                                        </label>
                                                        <select
                                                            value={dataPerSiswa.format}
                                                            onChange={(e) => setDataPerSiswa('format', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        >
                                                            <option value="pdf">PDF</option>
                                                            <option value="excel">Excel</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Komponen yang Disertakan
                                                    </label>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataPerSiswa.include_prestasi}
                                                                onChange={(e) => setDataPerSiswa('include_prestasi', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Prestasi Siswa</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataPerSiswa.include_ekstrakurikuler}
                                                                onChange={(e) => setDataPerSiswa('include_ekstrakurikuler', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Nilai Ekstrakurikuler</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataPerSiswa.include_absensi}
                                                                onChange={(e) => setDataPerSiswa('include_absensi', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Data Absensi</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <Button 
                                                    type="submit" 
                                                    disabled={processingPerSiswa || isLoading || !dataPerSiswa.siswa_id || !tahunAjaranAktif || !semesterAktif}
                                                    className="w-full"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    {processingPerSiswa || isLoading ? 'Generating...' : 'Generate Raport Siswa'}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Tab: Per Kelas */}
                                <TabsContent value="per-kelas" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Cetak Raport Per Kelas</CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Pilih kelas untuk mencetak raport semua siswa dalam kelas tersebut
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleGeneratePerKelas} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Pilih Kelas
                                                        </label>
                                                        <select
                                                            value={dataPerKelas.kelas_id}
                                                            onChange={(e) => setDataPerKelas('kelas_id', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            required
                                                        >
                                                            <option value="">Pilih Kelas</option>
                                                            {kelasList.map((kelas) => (
                                                                <option key={kelas.id} value={kelas.id}>
                                                                    {kelas.nama_kelas} - {kelas.jurusan.nama_jurusan}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Format Output
                                                        </label>
                                                        <select
                                                            value={dataPerKelas.format}
                                                            onChange={(e) => setDataPerKelas('format', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        >
                                                            <option value="pdf">PDF</option>
                                                            <option value="excel">Excel</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {selectedKelas && (
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-gray-900 mb-2">
                                                            Preview Kelas: {selectedKelas.nama_kelas}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            Jurusan: {selectedKelas.jurusan.nama_jurusan}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Jumlah Siswa: {siswaInSelectedKelas.length} siswa
                                                        </p>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Komponen yang Disertakan
                                                    </label>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataPerKelas.include_prestasi}
                                                                onChange={(e) => setDataPerKelas('include_prestasi', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Prestasi Siswa</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataPerKelas.include_ekstrakurikuler}
                                                                onChange={(e) => setDataPerKelas('include_ekstrakurikuler', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Nilai Ekstrakurikuler</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={dataPerKelas.include_absensi}
                                                                onChange={(e) => setDataPerKelas('include_absensi', e.target.checked as any)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-707">Data Absensi</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <Button 
                                                    type="submit" 
                                                    disabled={processingPerKelas || isLoading || !dataPerKelas.kelas_id || !tahunAjaranAktif || !semesterAktif}
                                                    className="w-full"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    {processingPerKelas || isLoading ? 'Generating...' : `Generate Raport Kelas (${siswaInSelectedKelas.length} siswa)`}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
