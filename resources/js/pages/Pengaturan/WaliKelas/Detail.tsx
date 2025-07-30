import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, UserCheck, Users } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email?: string;
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

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    jurusan: Jurusan;
    jumlah_siswa: number;
}

interface MataPelajaran {
    id: number;
    nama_mapel: string;
    kode_mapel: string;
}

interface PenugasanMengajar {
    id: number;
    mata_pelajaran: MataPelajaran;
    kelas: Kelas;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Props {
    guru: Guru;
    kelasWali: Kelas[];
    penugasanMengajar: PenugasanMengajar[];
    tahunAjaranAktif: TahunAjaran;
    stats: {
        total_kelas_wali: number;
        total_siswa_wali: number;
        total_mata_pelajaran: number;
        total_penugasan: number;
    };
}

export default function Detail({ 
    guru, 
    kelasWali, 
    penugasanMengajar, 
    tahunAjaranAktif, 
    stats 
}: Props) {
    return (
        <AppLayout>
            <Head title={`Detail Wali Kelas - ${guru.user.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('pengaturan.wali-kelas.index')}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Detail Wali Kelas
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Informasi lengkap wali kelas untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Guru Info Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Informasi Guru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{guru.user.name}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">NIP:</span> {guru.nip}
                                        </div>
                                        <div>
                                            <span className="font-medium">Email:</span> {guru.user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{stats.total_kelas_wali}</div>
                                        <div className="text-sm text-blue-800">Kelas Wali</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{stats.total_siswa_wali}</div>
                                        <div className="text-sm text-green-800">Total Siswa</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Kelas Wali
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_kelas_wali}</div>
                                <p className="text-xs text-muted-foreground">
                                    Kelas yang diampu
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
                                <div className="text-2xl font-bold">{stats.total_siswa_wali}</div>
                                <p className="text-xs text-muted-foreground">
                                    Siswa yang dibimbing
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Mata Pelajaran
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_mata_pelajaran}</div>
                                <p className="text-xs text-muted-foreground">
                                    Mapel yang diajar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Penugasan
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_penugasan}</div>
                                <p className="text-xs text-muted-foreground">
                                    Penugasan mengajar
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Kelas Wali */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <UserCheck className="w-5 h-5 mr-2" />
                                    Kelas Wali
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {kelasWali.length > 0 ? (
                                    <div className="space-y-4">
                                        {kelasWali.map((kelas) => (
                                            <div key={kelas.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <div className="font-medium">
                                                        {kelas.tingkat_kelas} {kelas.nama_kelas}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {kelas.jurusan.nama_jurusan}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline">
                                                        {kelas.jumlah_siswa} siswa
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>Belum ada kelas wali yang ditugaskan</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Penugasan Mengajar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Penugasan Mengajar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {penugasanMengajar.length > 0 ? (
                                    <div className="space-y-4">
                                        {penugasanMengajar.map((penugasan) => (
                                            <div key={penugasan.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <div className="font-medium">
                                                        {penugasan.mata_pelajaran.nama_mapel}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {penugasan.mata_pelajaran.kode_mapel}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="secondary">
                                                        {penugasan.kelas.tingkat_kelas} {penugasan.kelas.nama_kelas}
                                                    </Badge>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {penugasan.kelas.jurusan.nama_jurusan}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>Belum ada penugasan mengajar</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
