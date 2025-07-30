import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    Clock,
    GraduationCap,
    MapPin,
    School,
    Timer,
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

interface JadwalItem {
    jam: string;
    mata_pelajaran: string;
    kelas: string;
    jurusan: string;
    ruang: string;
}

interface JadwalMinggu {
    [key: string]: JadwalItem[];
}

interface StatistikJadwal {
    total_jam_mengajar: number;
    total_kelas: number;
    total_mata_pelajaran: number;
}

interface Props {
    guru: Guru;
    tahunAjaranAktif: TahunAjaran;
    semesterAktif: Semester;
    jadwalMinggu: JadwalMinggu;
    statistikJadwal: StatistikJadwal;
}

export default function JadwalMengajar({ 
    guru, 
    tahunAjaranAktif, 
    semesterAktif, 
    jadwalMinggu,
    statistikJadwal
}: Props) {
    
    const hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const currentDay = new Date().toLocaleDateString('id-ID', { weekday: 'long' });

    const getColorForMapel = (mapel: string) => {
        const colors = [
            'bg-blue-100 text-blue-700 border-blue-200',
            'bg-green-100 text-green-700 border-green-200',
            'bg-purple-100 text-purple-700 border-purple-200',
            'bg-orange-100 text-orange-700 border-orange-200',
            'bg-pink-100 text-pink-700 border-pink-200',
            'bg-indigo-100 text-indigo-700 border-indigo-200',
        ];
        const hash = mapel.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    return (
        <AppLayout>
            <Head title="Jadwal Mengajar" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Jadwal Mengajar</h1>
                        <p className="text-muted-foreground">
                            Jadwal mengajar mingguan - {tahunAjaranAktif?.nama_tahun_ajaran} ({semesterAktif?.nama_semester})
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            {tahunAjaranAktif?.nama_tahun_ajaran}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                            <Timer className="h-4 w-4 mr-2" />
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

                {/* Statistik Jadwal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Jam Mengajar</p>
                                    <p className="text-2xl font-bold text-blue-600">{statistikJadwal.total_jam_mengajar}</p>
                                    <p className="text-xs text-muted-foreground">jam per minggu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <School className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Kelas</p>
                                    <p className="text-2xl font-bold text-green-600">{statistikJadwal.total_kelas}</p>
                                    <p className="text-xs text-muted-foreground">kelas diampu</p>
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
                                    <p className="text-2xl font-bold text-purple-600">{statistikJadwal.total_mata_pelajaran}</p>
                                    <p className="text-xs text-muted-foreground">mapel diajar</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Jadwal Mingguan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Jadwal Mingguan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {hari.map((namaHari) => (
                                <div key={namaHari} className={`border rounded-lg p-4 ${currentDay === namaHari ? 'border-blue-300 bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        <h3 className={`font-semibold ${currentDay === namaHari ? 'text-blue-700' : ''}`}>
                                            {namaHari}
                                        </h3>
                                        {currentDay === namaHari && (
                                            <Badge variant="default" className="text-xs">Hari Ini</Badge>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {jadwalMinggu[namaHari]?.length > 0 ? (
                                            jadwalMinggu[namaHari].map((jadwal, index) => (
                                                <div key={index} className={`p-3 rounded-lg border ${getColorForMapel(jadwal.mata_pelajaran)}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{jadwal.jam}</span>
                                                    </div>
                                                    <h4 className="font-semibold text-sm mb-1">{jadwal.mata_pelajaran}</h4>
                                                    <div className="flex items-center gap-1 text-xs mb-1">
                                                        <Users className="h-3 w-3" />
                                                        <span>{jadwal.kelas} - {jadwal.jurusan}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{jadwal.ruang}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-muted-foreground">
                                                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">Tidak ada jadwal</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Jadwal Hari Ini */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Jadwal Hari Ini ({currentDay})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {jadwalMinggu[currentDay]?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {jadwalMinggu[currentDay].map((jadwal, index) => (
                                    <div key={index} className={`p-4 rounded-lg border-2 ${getColorForMapel(jadwal.mata_pelajaran)}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge variant="outline" className="text-xs font-medium">
                                                {jadwal.jam}
                                            </Badge>
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">{jadwal.mata_pelajaran}</h4>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <School className="h-4 w-4" />
                                                <span>{jadwal.kelas} - {jadwal.jurusan}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4" />
                                                <span>{jadwal.ruang}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Clock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                    Tidak Ada Jadwal Hari Ini
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Anda tidak memiliki jadwal mengajar pada hari {currentDay}.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Ringkasan Beban Mengajar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Distribusi Jam per Hari</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {hari.map((namaHari) => {
                                    const jamHari = jadwalMinggu[namaHari]?.length || 0;
                                    const maxJam = Math.max(...hari.map(h => jadwalMinggu[h]?.length || 0));
                                    const percentage = maxJam > 0 ? (jamHari / maxJam) * 100 : 0;
                                    
                                    return (
                                        <div key={namaHari} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${currentDay === namaHari ? 'text-blue-600' : ''}`}>
                                                    {namaHari}
                                                </span>
                                                {currentDay === namaHari && (
                                                    <Badge variant="default" className="text-xs">Today</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium w-8 text-right">{jamHari}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Info Tambahan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Timer className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Jam Tersibuk</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">
                                            {hari.reduce((max, h) => 
                                                (jadwalMinggu[h]?.length || 0) > (jadwalMinggu[max]?.length || 0) ? h : max
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {Math.max(...hari.map(h => jadwalMinggu[h]?.length || 0))} jam
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-green-600" />
                                        <span className="font-medium">Rata-rata per Hari</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">
                                            {(statistikJadwal.total_jam_mengajar / 6).toFixed(1)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">jam</p>
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
