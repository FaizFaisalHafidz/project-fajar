import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    BookOpen,
    Database,
    GraduationCap,
    TrendingUp,
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

interface TopSiswa {
    siswa_id: number;
    rata_rata: number;
    siswa: {
        user: {
            name: string;
        };
        kelas: {
            nama_kelas: string;
            jurusan: {
                nama_jurusan: string;
            };
        };
    };
}

interface Props {
    tahunAjaranAktif: TahunAjaran;
    semesterAktif: Semester;
    statistikUmum: {
        total_siswa: number;
        total_guru: number;
        total_kelas: number;
        total_mata_pelajaran: number;
    };
    siswaPerJurusan: Record<string, number>;
    rataRataNilai: Array<{
        mata_pelajaran: string;
        rata_rata: number;
    }>;
    distribusiNilai: {
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
    };
    statistikAbsensi: {
        total_sakit: number;
        total_izin: number;
        total_alpha: number;
    };
    prestasiPerTingkat: Record<string, number>;
    topSiswa: TopSiswa[];
}

export default function StatistikOverview({ 
    tahunAjaranAktif, 
    semesterAktif, 
    statistikUmum,
    siswaPerJurusan,
    rataRataNilai,
    distribusiNilai,
    statistikAbsensi,
    prestasiPerTingkat,
    topSiswa
}: Props) {
    
        const summaryData = [
        {
            title: "Total Siswa",
            value: statistikUmum?.total_siswa || 0, 
            icon: Users,
            color: "text-blue-600 bg-blue-50",
            description: "Siswa terdaftar"
        },
        {
            title: "Total Guru", 
            value: statistikUmum?.total_guru || 0, 
            icon: GraduationCap,
            color: "text-green-600 bg-green-50",
            description: "Guru aktif"
        },
        {
            title: "Total Kelas",
            value: statistikUmum?.total_kelas || 0, 
            icon: BookOpen,
            color: "text-purple-600 bg-purple-50", 
            description: "Kelas tersedia"
        },
        {
            title: "Mata Pelajaran",
            value: statistikUmum?.total_mata_pelajaran || 0, 
            icon: Database,
            color: "text-orange-600 bg-orange-50",
            description: "Mapel tersedia"
        }
    ];    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return 'bg-green-100 text-green-800';
            case 'B': return 'bg-blue-100 text-blue-800';
            case 'C': return 'bg-yellow-100 text-yellow-800';
            case 'D': return 'bg-orange-100 text-orange-800';
            case 'E': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTingkatColor = (tingkat: string) => {
        switch (tingkat.toLowerCase()) {
            case 'internasional': return 'bg-purple-100 text-purple-800';
            case 'nasional': return 'bg-red-100 text-red-800';
            case 'provinsi': return 'bg-blue-100 text-blue-800';
            case 'kabupaten': return 'bg-green-100 text-green-800';
            case 'kecamatan': return 'bg-yellow-100 text-yellow-800';
            case 'sekolah': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="Overview Sekolah" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Overview Sekolah</h1>
                        <p className="text-muted-foreground">
                            Statistik umum sekolah - {tahunAjaranAktif?.nama_tahun_ajaran} | {semesterAktif?.nama_semester}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaryData.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-full ${card.color}`}>
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{card.title}</p>
                                            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{card.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Siswa per Jurusan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Distribusi Siswa per Jurusan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(siswaPerJurusan).map(([jurusan, jumlah]) => (
                                    <div key={jurusan} className="flex items-center justify-between">
                                        <span className="font-medium">{jurusan}</span>
                                        <Badge variant="secondary">{jumlah} siswa</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Distribusi Nilai */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Distribusi Nilai
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(distribusiNilai).map(([grade, count]) => (
                                    <div key={grade} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getGradeColor(grade)}>
                                                {grade}
                                            </Badge>
                                            <span className="text-sm">
                                                {grade === 'A' && '90-100'}
                                                {grade === 'B' && '80-89'}
                                                {grade === 'C' && '70-79'}
                                                {grade === 'D' && '60-69'}
                                                {grade === 'E' && '<60'}
                                            </span>
                                        </div>
                                        <span className="font-semibold">{count} siswa</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rata-rata Nilai per Mata Pelajaran */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Rata-rata Nilai per Mata Pelajaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {rataRataNilai.slice(0, 8).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium truncate flex-1 mr-2">
                                            {item.mata_pelajaran}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                variant={item.rata_rata >= 80 ? 'default' : item.rata_rata >= 70 ? 'secondary' : 'destructive'}
                                            >
                                                {item.rata_rata}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistik Absensi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Statistik Absensi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Total Sakit</span>
                                    <Badge variant="secondary">{statistikAbsensi.total_sakit} hari</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Total Izin</span>
                                    <Badge variant="secondary">{statistikAbsensi.total_izin} hari</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Total Alpha</span>
                                    <Badge variant="destructive">{statistikAbsensi.total_alpha} hari</Badge>
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between font-semibold">
                                        <span>Total Absensi</span>
                                        <span>{statistikAbsensi.total_sakit + statistikAbsensi.total_izin + statistikAbsensi.total_alpha} hari</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Prestasi per Tingkat */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Prestasi per Tingkat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(prestasiPerTingkat).map(([tingkat, jumlah]) => (
                                    <div key={tingkat} className="flex items-center justify-between">
                                        <Badge className={getTingkatColor(tingkat)}>
                                            {tingkat}
                                        </Badge>
                                        <span className="font-semibold">{jumlah} prestasi</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top 10 Siswa */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Top 10 Siswa Berprestasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topSiswa?.slice(0, 10).map((siswa, index) => (
                                    <div key={siswa.siswa_id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{siswa.siswa?.user?.name || 'N/A'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {siswa.siswa?.kelas?.nama_kelas || 'N/A'} - {siswa.siswa?.kelas?.jurusan?.nama_jurusan || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge 
                                            variant={siswa.rata_rata >= 90 ? 'default' : siswa.rata_rata >= 80 ? 'secondary' : 'outline'}
                                        >
                                            {siswa.rata_rata}
                                        </Badge>
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
