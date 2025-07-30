import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Calendar, GraduationCap, TrendingUp, UserCheck, Users } from 'lucide-react';

interface Props {
    guru: any;
    kelas: any;
    tahunAjaranAktif: any;
    semesterAktif: any;
    statistik: {
        total_siswa: number;
        siswa_laki_laki: number;
        siswa_perempuan: number;
        rata_rata_nilai: number;
        rata_rata_kehadiran: number;
        total_pertemuan: number;
    };
}

export default function WaliKelasIndex({ 
    guru, 
    kelas, 
    tahunAjaranAktif, 
    semesterAktif, 
    statistik 
}: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard Wali Kelas" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard Wali Kelas</h2>
                        <p className="text-muted-foreground">
                            Selamat datang, {guru?.user?.name} - Wali Kelas {kelas?.nama_kelas} {kelas?.jurusan?.nama_jurusan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} • Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistik.total_siswa}</div>
                                <p className="text-xs text-muted-foreground">
                                    L: {statistik.siswa_laki_laki}, P: {statistik.siswa_perempuan}
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistik.rata_rata_nilai}</div>
                                <Progress value={statistik.rata_rata_nilai} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistik.rata_rata_kehadiran}%</div>
                                <Progress value={statistik.rata_rata_kehadiran} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pertemuan</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistik.total_pertemuan}</div>
                                <p className="text-xs text-muted-foreground">Total pertemuan</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kelas Info Card */}
                    <div className="mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Informasi Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-sm font-medium">Nama Kelas</p>
                                        <p className="text-2xl font-bold">{kelas?.nama_kelas}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Jurusan</p>
                                        <p className="text-2xl font-bold">{kelas?.jurusan?.nama_jurusan}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Tingkat</p>
                                        <p className="text-2xl font-bold">Kelas {kelas?.tingkat}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Data Siswa
                                </CardTitle>
                                <CardDescription>
                                    Kelola data dan profil siswa kelas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href="/wali-kelas/siswa">
                                        Lihat Data Siswa
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Rekap Nilai
                                </CardTitle>
                                <CardDescription>
                                    Lihat rekap nilai seluruh mata pelajaran
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href="/wali-kelas/rekap-nilai">
                                        Lihat Rekap Nilai
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5 text-orange-500" />
                                    Monitoring Absensi
                                </CardTitle>
                                <CardDescription>
                                    Monitor kehadiran siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href="/wali-kelas/monitoring-absensi">
                                        Lihat Absensi
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserCheck className="h-5 w-5 text-purple-500" />
                                    Catatan Wali Kelas
                                </CardTitle>
                                <CardDescription>
                                    Buat dan kelola catatan siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href="/wali-kelas/catatan">
                                        Kelola Catatan
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
