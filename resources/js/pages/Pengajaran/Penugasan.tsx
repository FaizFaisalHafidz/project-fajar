import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    GraduationCap,
    School,
    TrendingUp,
    Users,
    XCircle
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

interface PenugasanDetail {
    id: number;
    tahun_ajaran: string;
    semester: string;
    kelas: string;
    jurusan: string;
    mata_pelajaran: string;
    total_siswa: number;
    status: string;
    created_at: string;
}

interface StatistikPenugasan {
    total_penugasan: number;
    total_kelas_unik: number;
    total_mata_pelajaran_unik: number;
    penugasan_aktif: number;
}

interface Props {
    guru: Guru;
    tahunAjaranAktif: TahunAjaran;
    semesterAktif: Semester;
    penugasanGrouped: Record<string, any[]>;
    detailPenugasan: PenugasanDetail[];
    statistikPenugasan: StatistikPenugasan;
}

export default function Penugasan({ 
    guru, 
    tahunAjaranAktif, 
    semesterAktif, 
    penugasanGrouped,
    detailPenugasan,
    statistikPenugasan
}: Props) {
    
    const getStatusColor = (status: string) => {
        return status === 'Aktif' 
            ? 'bg-green-100 text-green-700 border-green-200' 
            : 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status: string) => {
        return status === 'Aktif' 
            ? <CheckCircle className="h-4 w-4 text-green-600" />
            : <XCircle className="h-4 w-4 text-gray-600" />;
    };

    return (
        <AppLayout>
            <Head title="Penugasan Mengajar" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Penugasan Mengajar</h1>
                        <p className="text-muted-foreground">
                            Riwayat dan detail penugasan mengajar Anda
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

                {/* Statistik Penugasan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Penugasan</p>
                                    <p className="text-2xl font-bold text-blue-600">{statistikPenugasan.total_penugasan}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <School className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Kelas Unik</p>
                                    <p className="text-2xl font-bold text-green-600">{statistikPenugasan.total_kelas_unik}</p>
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
                                    <p className="text-2xl font-bold text-purple-600">{statistikPenugasan.total_mata_pelajaran_unik}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-8 w-8 text-orange-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Penugasan Aktif</p>
                                    <p className="text-2xl font-bold text-orange-600">{statistikPenugasan.penugasan_aktif}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Penugasan Berdasarkan Periode */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Penugasan Berdasarkan Periode
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {Object.keys(penugasanGrouped).length > 0 ? (
                                Object.entries(penugasanGrouped).map(([periode, penugasanList]) => (
                                    <div key={periode} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-blue-600">{periode}</h3>
                                            <Badge variant="outline" className="text-sm">
                                                {penugasanList.length} penugasan
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {penugasanList.map((penugasan: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <School className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium">{penugasan.kelas?.nama_kelas}</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {penugasan.kelas?.jurusan?.nama_jurusan}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm font-medium text-blue-600 mb-1">
                                                        {penugasan.mata_pelajaran?.nama_mata_pelajaran}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Users className="h-3 w-3" />
                                                        <span>Siswa dalam kelas ini</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Tidak ada data penugasan</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Detail Semua Penugasan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Detail Semua Penugasan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {detailPenugasan.length > 0 ? (
                            <div className="space-y-4">
                                {detailPenugasan.map((penugasan) => (
                                    <div key={penugasan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold">{penugasan.mata_pelajaran}</h4>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`text-xs ${getStatusColor(penugasan.status)}`}
                                                        >
                                                            {getStatusIcon(penugasan.status)}
                                                            <span className="ml-1">{penugasan.status}</span>
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <School className="h-4 w-4" />
                                                            <span>{penugasan.kelas} - {penugasan.jurusan}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4" />
                                                            <span>{penugasan.total_siswa} siswa</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{penugasan.created_at}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-blue-600">
                                                    {penugasan.tahun_ajaran}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {penugasan.semester}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                    Belum Ada Penugasan
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Anda belum memiliki penugasan mengajar.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Analisis Penugasan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Distribusi Mata Pelajaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[...new Set(detailPenugasan.map(p => p.mata_pelajaran))].map((mapel) => {
                                    const jumlahPenugasan = detailPenugasan.filter(p => p.mata_pelajaran === mapel).length;
                                    const totalSiswa = detailPenugasan
                                        .filter(p => p.mata_pelajaran === mapel)
                                        .reduce((sum, p) => sum + p.total_siswa, 0);
                                    
                                    return (
                                        <div key={mapel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{mapel}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {jumlahPenugasan} penugasan
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-blue-600">{totalSiswa}</p>
                                                <p className="text-xs text-muted-foreground">total siswa</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Ringkasan Pengalaman
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Periode Mengajar</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">
                                            {Object.keys(penugasanGrouped).length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">periode</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-green-600" />
                                        <span className="font-medium">Total Siswa Diajar</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">
                                            {detailPenugasan.reduce((sum, p) => sum + p.total_siswa, 0)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">siswa</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-purple-600" />
                                        <span className="font-medium">Beban Aktif</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-purple-600">
                                            {((statistikPenugasan.penugasan_aktif / statistikPenugasan.total_penugasan) * 100).toFixed(0)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">dari total</p>
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
