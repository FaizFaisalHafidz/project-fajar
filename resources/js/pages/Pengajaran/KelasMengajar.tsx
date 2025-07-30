import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    GraduationCap,
    School,
    User,
    UserCheck,
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

interface Guru {
    id: number;
    nip?: string;
    user: {
        name: string;
        email: string;
    };
}

interface KelasDetail {
    id: number;
    kelas_id: number;
    nama_kelas: string;
    jurusan: string;
    mata_pelajaran: string;
    total_siswa: number;
    siswa_putra: number;
    siswa_putri: number;
    tahun_ajaran: string;
    semester: string;
}

interface Props {
    guru: Guru;
    tahunAjaranAktif: TahunAjaran;
    semesterAktif: Semester;
    kelasDetails: KelasDetail[];
}

export default function KelasMengajar({ 
    guru, 
    tahunAjaranAktif, 
    semesterAktif, 
    kelasDetails 
}: Props) {
    
    const totalSiswa = kelasDetails.reduce((sum, kelas) => sum + kelas.total_siswa, 0);
    const totalKelas = kelasDetails.length;
    const totalMataPelajaran = [...new Set(kelasDetails.map(k => k.mata_pelajaran))].length;

    return (
        <AppLayout>
            <Head title="Kelas Mengajar" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kelas Mengajar</h1>
                        <p className="text-muted-foreground">
                            Daftar kelas yang Anda ampu - {tahunAjaranAktif?.nama_tahun_ajaran} ({semesterAktif?.nama_semester})
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            {tahunAjaranAktif?.nama_tahun_ajaran}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                            <Clock className="h-4 w-4 mr-2" />
                            {semesterAktif?.nama_semester}
                        </Badge>
                    </div>
                </div>

                {/* Info Guru */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{guru?.user?.name}</h3>
                                <p className="text-muted-foreground">{guru?.user?.email}</p>
                                {guru?.nip && (
                                    <p className="text-sm text-muted-foreground">NIP: {guru.nip}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistik Ringkas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <School className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Kelas</p>
                                    <p className="text-2xl font-bold text-blue-600">{totalKelas}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Users className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Siswa</p>
                                    <p className="text-2xl font-bold text-green-600">{totalSiswa}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-8 w-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Mata Pelajaran</p>
                                    <p className="text-2xl font-bold text-purple-600">{totalMataPelajaran}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Daftar Kelas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <School className="h-5 w-5" />
                            Daftar Kelas Mengajar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {kelasDetails.length > 0 ? (
                            <div className="space-y-4">
                                {kelasDetails.map((kelas) => (
                                    <div key={kelas.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <School className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-lg font-semibold">{kelas.nama_kelas}</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            {kelas.jurusan}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm font-medium text-blue-600">
                                                        {kelas.mata_pelajaran}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {kelas.tahun_ajaran} - {kelas.semester}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-green-600">
                                                            {kelas.total_siswa}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Total Siswa</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <User className="h-4 w-4 text-blue-500" />
                                                            <span>{kelas.siswa_putra}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Putra</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <UserCheck className="h-4 w-4 text-pink-500" />
                                                            <span>{kelas.siswa_putri}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Putri</div>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <School className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                    Belum Ada Kelas Mengajar
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Anda belum memiliki penugasan mengajar untuk periode ini.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Informasi Tambahan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Distribusi Siswa per Mata Pelajaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[...new Set(kelasDetails.map(k => k.mata_pelajaran))].map((mapel) => {
                                    const siswaMapel = kelasDetails
                                        .filter(k => k.mata_pelajaran === mapel)
                                        .reduce((sum, k) => sum + k.total_siswa, 0);
                                    const kelasMapel = kelasDetails.filter(k => k.mata_pelajaran === mapel).length;
                                    
                                    return (
                                        <div key={mapel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{mapel}</p>
                                                <p className="text-sm text-muted-foreground">{kelasMapel} kelas</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-blue-600">{siswaMapel}</p>
                                                <p className="text-xs text-muted-foreground">siswa</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ringkasan Gender</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Siswa Putra</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-blue-600">
                                            {kelasDetails.reduce((sum, k) => sum + k.siswa_putra, 0)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {totalSiswa > 0 ? ((kelasDetails.reduce((sum, k) => sum + k.siswa_putra, 0) / totalSiswa) * 100).toFixed(1) : 0}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-5 w-5 text-pink-600" />
                                        <span className="font-medium">Siswa Putri</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-pink-600">
                                            {kelasDetails.reduce((sum, k) => sum + k.siswa_putri, 0)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {totalSiswa > 0 ? ((kelasDetails.reduce((sum, k) => sum + k.siswa_putri, 0) / totalSiswa) * 100).toFixed(1) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
