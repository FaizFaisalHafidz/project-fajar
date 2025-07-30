import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BarChart3, BookOpen, Download, FileText, TrendingUp, Users } from 'lucide-react';

interface Props {
    guru: any;
    kelas: any;
    rekapNilai: any[];
    mataPelajaranList: any[];
    tahunAjaranAktif: any;
    semesterAktif: any;
}

export default function WaliKelasRekapNilai({ 
    guru, 
    kelas, 
    rekapNilai, 
    mataPelajaranList, 
    tahunAjaranAktif, 
    semesterAktif 
}: Props) {
    const getNilaiColor = (nilai: number) => {
        if (nilai >= 90) return 'text-green-600';
        if (nilai >= 80) return 'text-blue-600';
        if (nilai >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getNilaiGrade = (nilai: number) => {
        if (nilai >= 90) return 'A';
        if (nilai >= 80) return 'B';
        if (nilai >= 70) return 'C';
        return 'D';
    };

    const getGradeVariant = (nilai: number): "default" | "destructive" | "outline" | "secondary" => {
        if (nilai >= 90) return 'default';
        if (nilai >= 80) return 'secondary';
        if (nilai >= 70) return 'outline';
        return 'destructive';
    };

    // Hitung statistik kelas
    const rataRataKelas = rekapNilai.length > 0 
        ? rekapNilai.reduce((sum, siswa) => sum + siswa.rata_rata_keseluruhan, 0) / rekapNilai.length 
        : 0;

    const nilaiTertinggi = Math.max(...rekapNilai.map(siswa => siswa.rata_rata_keseluruhan));
    const nilaiTerendah = Math.min(...rekapNilai.map(siswa => siswa.rata_rata_keseluruhan));

    const siswaA = rekapNilai.filter(siswa => siswa.rata_rata_keseluruhan >= 90).length;
    const siswaB = rekapNilai.filter(siswa => siswa.rata_rata_keseluruhan >= 80 && siswa.rata_rata_keseluruhan < 90).length;
    const siswaC = rekapNilai.filter(siswa => siswa.rata_rata_keseluruhan >= 70 && siswa.rata_rata_keseluruhan < 80).length;
    const siswaD = rekapNilai.filter(siswa => siswa.rata_rata_keseluruhan < 70).length;

    return (
        <AppLayout>
            <Head title="Rekap Nilai Kelas" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Rekap Nilai Kelas</h2>
                        <p className="text-muted-foreground">
                            Rekap nilai seluruh mata pelajaran kelas {kelas?.nama_kelas} {kelas?.jurusan?.nama_jurusan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} • Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rata-rata Kelas</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{rataRataKelas.toFixed(1)}</div>
                                <Progress value={rataRataKelas} className="mt-2" />
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Nilai Tertinggi</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{nilaiTertinggi.toFixed(1)}</div>
                                <p className="text-xs text-muted-foreground">Prestasi terbaik kelas</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Nilai Terendah</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{nilaiTerendah.toFixed(1)}</div>
                                <p className="text-xs text-muted-foreground">Perlu perhatian khusus</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{rekapNilai.length}</div>
                                <p className="text-xs text-muted-foreground">Siswa dinilai</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grade Distribution */}
                    <div className="mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Distribusi Nilai
                                </CardTitle>
                                <CardDescription>
                                    Sebaran grade nilai siswa di kelas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="text-center p-4 rounded-lg bg-green-50">
                                        <div className="text-3xl font-bold text-green-600">{siswaA}</div>
                                        <p className="text-sm text-green-600 font-medium">Grade A (90-100)</p>
                                        <p className="text-xs text-muted-foreground">Sangat Baik</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-blue-50">
                                        <div className="text-3xl font-bold text-blue-600">{siswaB}</div>
                                        <p className="text-sm text-blue-600 font-medium">Grade B (80-89)</p>
                                        <p className="text-xs text-muted-foreground">Baik</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-yellow-50">
                                        <div className="text-3xl font-bold text-yellow-600">{siswaC}</div>
                                        <p className="text-sm text-yellow-600 font-medium">Grade C (70-79)</p>
                                        <p className="text-xs text-muted-foreground">Cukup</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-red-50">
                                        <div className="text-3xl font-bold text-red-600">{siswaD}</div>
                                        <p className="text-sm text-red-600 font-medium">Grade D (&lt;70)</p>
                                        <p className="text-xs text-muted-foreground">Perlu Perbaikan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Rekap Nilai Siswa
                                    </CardTitle>
                                    <CardDescription>
                                        Detail nilai per mata pelajaran dan rata-rata keseluruhan
                                    </CardDescription>
                                </div>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Export Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="detail">Detail per Mapel</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="mt-6">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>No</TableHead>
                                                    <TableHead>Nama Siswa</TableHead>
                                                    <TableHead className="text-center">Rata-rata</TableHead>
                                                    <TableHead className="text-center">Grade</TableHead>
                                                    <TableHead className="text-center">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {rekapNilai
                                                    .sort((a, b) => b.rata_rata_keseluruhan - a.rata_rata_keseluruhan)
                                                    .map((siswa, index) => (
                                                    <TableRow key={siswa.siswa.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell className="font-medium">
                                                            {siswa.siswa.user?.name}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`font-bold ${getNilaiColor(siswa.rata_rata_keseluruhan)}`}>
                                                                {siswa.rata_rata_keseluruhan.toFixed(1)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={getGradeVariant(siswa.rata_rata_keseluruhan)}>
                                                                {getNilaiGrade(siswa.rata_rata_keseluruhan)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {siswa.rata_rata_keseluruhan >= 70 ? (
                                                                <Badge variant="default" className="bg-green-500">
                                                                    Lulus
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="destructive">
                                                                    Perlu Perbaikan
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="detail" className="mt-6">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>No</TableHead>
                                                    <TableHead>Nama Siswa</TableHead>
                                                    {mataPelajaranList.map((mapel) => (
                                                        <TableHead key={mapel.id} className="text-center min-w-[100px]">
                                                            <div className="flex items-center gap-1">
                                                                <BookOpen className="h-3 w-3" />
                                                                <span className="text-xs">{mapel.nama_mapel}</span>
                                                            </div>
                                                        </TableHead>
                                                    ))}
                                                    <TableHead className="text-center">Rata-rata</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {rekapNilai.map((siswa, index) => (
                                                    <TableRow key={siswa.siswa.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell className="font-medium">
                                                            {siswa.siswa.user?.name}
                                                        </TableCell>
                                                        {mataPelajaranList.map((mapel) => {
                                                            const nilaiMapel = siswa.nilai_per_mapel[mapel.id];
                                                            return (
                                                                <TableCell key={mapel.id} className="text-center">
                                                                    {nilaiMapel ? (
                                                                        <span className={`font-medium ${getNilaiColor(nilaiMapel.rata_rata)}`}>
                                                                            {nilaiMapel.rata_rata}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-muted-foreground">-</span>
                                                                    )}
                                                                </TableCell>
                                                            );
                                                        })}
                                                        <TableCell className="text-center">
                                                            <span className={`font-bold ${getNilaiColor(siswa.rata_rata_keseluruhan)}`}>
                                                                {siswa.rata_rata_keseluruhan.toFixed(1)}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
