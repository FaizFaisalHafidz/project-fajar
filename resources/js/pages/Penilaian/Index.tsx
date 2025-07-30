import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BookOpen, Calendar, Heart, Star, Target, Trophy, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    guru: any;
    tahunAjaranAktif: any;
    semesterAktif: any;
    penugasanMengajar: any[];
    komponenNilai: any[];
    data: {
        pengetahuan: any[];
        keterampilan: any[];
        absensi: any[];
        sosial: any[];
        spiritual: any[];
        ekstrakurikuler: any[];
        prestasi: any[];
    };
}

export default function PenilaianIndex({ 
    guru, 
    tahunAjaranAktif, 
    semesterAktif, 
    penugasanMengajar,
    komponenNilai,
    data 
}: Props) {
    const [activeTab, setActiveTab] = useState('pengetahuan');
    const [selectedPenugasan, setSelectedPenugasan] = useState<string>('all');

    const tabs = [
        { id: 'pengetahuan', label: 'Nilai Pengetahuan', icon: BookOpen, color: 'bg-blue-500' },
        { id: 'keterampilan', label: 'Nilai Keterampilan', icon: Target, color: 'bg-green-500' },
        { id: 'absensi', label: 'Nilai Absensi', icon: Calendar, color: 'bg-orange-500' },
        { id: 'sosial', label: 'Nilai Sosial', icon: Users, color: 'bg-purple-500' },
        { id: 'spiritual', label: 'Nilai Spiritual', icon: Heart, color: 'bg-pink-500' },
        { id: 'ekstrakurikuler', label: 'Nilai Ekstrakurikuler', icon: Star, color: 'bg-yellow-500' },
        { id: 'prestasi', label: 'Input Prestasi', icon: Trophy, color: 'bg-red-500' },
    ];

    const renderPengetahuanTab = () => (
        <div className="space-y-6">
            {(data.pengetahuan || []).map((item, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            {item.penugasan?.mataPelajaran?.nama_mapel || 'Mata Pelajaran Tidak Diketahui'}
                        </CardTitle>
                        <CardDescription>
                            Kelas: {item.penugasan?.kelas?.nama_kelas || '-'} • 
                            Jurusan: {item.penugasan?.kelas?.jurusan?.nama_jurusan || '-'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        {Array.isArray(item.komponen) ? item.komponen.map((komponen: any) => (
                                            <TableHead key={komponen.id} className="text-center">
                                                {komponen.nama_komponen}
                                                <br />
                                                <span className="text-xs text-muted-foreground">
                                                    Bobot: {komponen.bobot_persen}%
                                                </span>
                                            </TableHead>
                                        )) : null}
                                        <TableHead className="text-center">Rata-rata</TableHead>
                                        <TableHead className="text-center">Huruf</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(item.siswa_nilai || []).map((siswa: any, siswaIndex: number) => (
                                        <TableRow key={siswa.siswa?.id || siswaIndex}>
                                            <TableCell>{siswaIndex + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {siswa.siswa?.user?.name || 'Nama tidak tersedia'}
                                            </TableCell>
                                            {Array.isArray(item.komponen) ? item.komponen.map((komponen: any) => (
                                                <TableCell key={komponen.id} className="text-center">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="w-20 text-center"
                                                        defaultValue={siswa.nilai?.[komponen.id]?.nilai || ''}
                                                        placeholder="0-100"
                                                    />
                                                </TableCell>
                                            )) : null}
                                            <TableCell className="text-center font-semibold">
                                                {(siswa.rata_rata || 0).toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={
                                                    (siswa.rata_rata || 0) >= 90 ? 'default' :
                                                    (siswa.rata_rata || 0) >= 80 ? 'secondary' :
                                                    (siswa.rata_rata || 0) >= 70 ? 'outline' : 'destructive'
                                                }>
                                                    {(siswa.rata_rata || 0) >= 90 ? 'A' :
                                                     (siswa.rata_rata || 0) >= 80 ? 'B' :
                                                     (siswa.rata_rata || 0) >= 70 ? 'C' : 'D'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button>Simpan Nilai Pengetahuan</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderKeterampilanTab = () => (
        <div className="space-y-6">
            {(data.keterampilan || []).map((item, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            {item.penugasan?.mataPelajaran?.nama_mapel || 'Mata Pelajaran Tidak Diketahui'}
                        </CardTitle>
                        <CardDescription>
                            Kelas: {item.penugasan?.kelas?.nama_kelas || '-'} • 
                            Jurusan: {item.penugasan?.kelas?.jurusan?.nama_jurusan || '-'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        {Array.isArray(item.komponen) ? item.komponen.map((komponen: any) => (
                                            <TableHead key={komponen.id} className="text-center">
                                                {komponen.nama_komponen}
                                                <br />
                                                <span className="text-xs text-muted-foreground">
                                                    Bobot: {komponen.bobot_persen}%
                                                </span>
                                            </TableHead>
                                        )) : null}
                                        <TableHead className="text-center">Rata-rata</TableHead>
                                        <TableHead className="text-center">Huruf</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(item.siswa_nilai || []).map((siswa: any, siswaIndex: number) => (
                                        <TableRow key={siswa.siswa?.id || siswaIndex}>
                                            <TableCell>{siswaIndex + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {siswa.siswa?.user?.name || 'Nama tidak tersedia'}
                                            </TableCell>
                                            {(item.komponen || []).map((komponen: any) => (
                                                <TableCell key={komponen.id} className="text-center">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="w-20 text-center"
                                                        defaultValue={siswa.nilai?.[komponen.id]?.nilai || ''}
                                                        placeholder="0-100"
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center font-semibold">
                                                {(siswa.rata_rata || 0).toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={
                                                    (siswa.rata_rata || 0) >= 90 ? 'default' :
                                                    (siswa.rata_rata || 0) >= 80 ? 'secondary' :
                                                    (siswa.rata_rata || 0) >= 70 ? 'outline' : 'destructive'
                                                }>
                                                    {(siswa.rata_rata || 0) >= 90 ? 'A' :
                                                     (siswa.rata_rata || 0) >= 80 ? 'B' :
                                                     (siswa.rata_rata || 0) >= 70 ? 'C' : 'D'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button>Simpan Nilai Keterampilan</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderAbsensiTab = () => (
        <div className="space-y-6">
            {(data.absensi || []).map((item, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {item.penugasan?.mataPelajaran?.nama_mapel || 'Mata Pelajaran Tidak Diketahui'}
                        </CardTitle>
                        <CardDescription>
                            Kelas: {item.penugasan?.kelas?.nama_kelas || '-'} • 
                            Jurusan: {item.penugasan?.kelas?.jurusan?.nama_jurusan || '-'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead className="text-center">Total Pertemuan</TableHead>
                                        <TableHead className="text-center">Hadir</TableHead>
                                        <TableHead className="text-center">Sakit</TableHead>
                                        <TableHead className="text-center">Izin</TableHead>
                                        <TableHead className="text-center">Alpa</TableHead>
                                        <TableHead className="text-center">Persentase Kehadiran</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(item.siswa_absensi || []).map((siswa: any, siswaIndex: number) => (
                                        <TableRow key={siswa.siswa?.id || siswaIndex}>
                                            <TableCell>{siswaIndex + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {siswa.siswa?.user?.name || 'Nama tidak tersedia'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                0
                                            </TableCell>
                                            <TableCell className="text-center text-green-600">
                                                0
                                            </TableCell>
                                            <TableCell className="text-center text-yellow-600">
                                                {siswa.jumlah_sakit || 0}
                                            </TableCell>
                                            <TableCell className="text-center text-blue-600">
                                                {siswa.jumlah_izin || 0}
                                            </TableCell>
                                            <TableCell className="text-center text-red-600">
                                                {siswa.jumlah_tanpa_keterangan || 0}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    N/A
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderSikapTab = (jenisSikap: 'sosial' | 'spiritual') => (
        <div className="space-y-6">
            {(data[jenisSikap] || []).map((item, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {jenisSikap === 'sosial' ? <Users className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                            {item.penugasan?.mataPelajaran?.nama_mapel || 'Mata Pelajaran Tidak Diketahui'}
                        </CardTitle>
                        <CardDescription>
                            Kelas: {item.penugasan?.kelas?.nama_kelas || '-'} • 
                            Jurusan: {item.penugasan?.kelas?.jurusan?.nama_jurusan || '-'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead className="text-center">Nilai</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(item.siswa_nilai || []).map((siswa: any, siswaIndex: number) => (
                                        <TableRow key={siswa.siswa?.id || siswaIndex}>
                                            <TableCell>{siswaIndex + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {siswa.siswa?.user?.name || 'Nama tidak tersedia'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Select defaultValue={
                                                    jenisSikap === 'sosial' 
                                                        ? (siswa.nilai_sosial || '') 
                                                        : (siswa.nilai_spiritual || '')
                                                }>
                                                    <SelectTrigger className="w-20">
                                                        <SelectValue placeholder="Pilih" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="A">A</SelectItem>
                                                        <SelectItem value="B">B</SelectItem>
                                                        <SelectItem value="C">C</SelectItem>
                                                        <SelectItem value="D">D</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="w-full"
                                                    defaultValue={
                                                        jenisSikap === 'sosial' 
                                                            ? (siswa.deskripsi_sosial || '') 
                                                            : (siswa.deskripsi_spiritual || '')
                                                    }
                                                    placeholder="Deskripsi nilai sikap..."
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button size="sm">Simpan</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderEkstrakurikulerTab = () => (
        <div className="space-y-6">
            {(data.ekstrakurikuler || []).map((item, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Kelas {item.kelas.nama_kelas}
                        </CardTitle>
                        <CardDescription>
                            Jurusan: {item.kelas.jurusan?.nama_jurusan || '-'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Ekstrakurikuler</TableHead>
                                        <TableHead className="text-center">Nilai</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(item.siswa_nilai || []).map((siswa: any, siswaIndex: number) => (
                                        <TableRow key={siswa.siswa?.id || siswaIndex}>
                                            <TableCell>{siswaIndex + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {siswa.siswa?.user?.name || 'Nama tidak tersedia'}
                                            </TableCell>
                                            <TableCell>
                                                {(siswa.nilai_ekstrakurikuler || []).map((nilai: any, nilaiIndex: number) => (
                                                    <div key={nilaiIndex} className="mb-2">
                                                        <Badge variant="outline">
                                                            {nilai.ekstrakurikuler?.nama_ekstrakurikuler || 'Ekstrakurikuler'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                                {(!siswa.nilai_ekstrakurikuler || siswa.nilai_ekstrakurikuler.length === 0) && (
                                                    <span className="text-muted-foreground">Belum ada ekstrakurikuler</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {(siswa.nilai_ekstrakurikuler || []).map((nilai: any, nilaiIndex: number) => (
                                                    <div key={nilaiIndex} className="mb-2">
                                                        <Badge variant={
                                                            nilai.nilai === 'A' ? 'default' :
                                                            nilai.nilai === 'B' ? 'secondary' :
                                                            nilai.nilai === 'C' ? 'outline' : 'destructive'
                                                        }>
                                                            {nilai.nilai || '-'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                {(siswa.nilai_ekstrakurikuler || []).map((nilai: any, nilaiIndex: number) => (
                                                    <div key={nilaiIndex} className="mb-2 text-sm text-muted-foreground">
                                                        {nilai.deskripsi || '-'}
                                                    </div>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderPrestasiTab = () => (
        <div className="space-y-6">
            {(data.prestasi || []).map((item, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Kelas {item.kelas.nama_kelas}
                        </CardTitle>
                        <CardDescription>
                            Jurusan: {item.kelas.jurusan?.nama_jurusan || '-'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead className="text-center">Total Prestasi</TableHead>
                                        <TableHead>Prestasi Terbaru</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(item.siswa_prestasi || []).map((siswa: any, siswaIndex: number) => (
                                        <TableRow key={siswa.siswa?.id || siswaIndex}>
                                            <TableCell>{siswaIndex + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {siswa.siswa?.user?.name || 'Nama tidak tersedia'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">
                                                    {siswa.total_prestasi || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {siswa.prestasi && siswa.prestasi.length > 0 ? (
                                                    <div>
                                                        <div className="font-medium">
                                                            {siswa.prestasi[0].nama_prestasi}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {siswa.prestasi[0].jenis_prestasi} • 
                                                            {new Date(siswa.prestasi[0].tanggal_prestasi).toLocaleDateString('id-ID')}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">Belum ada prestasi</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button size="sm" variant="outline">
                                                    Input Prestasi
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <AppLayout>
            <Head title="Input Penilaian" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Input Penilaian</h2>
                        <p className="text-muted-foreground">
                            Kelola penilaian siswa untuk tahun ajaran {tahunAjaranAktif?.nama_tahun_ajaran} 
                            semester {semesterAktif?.nama_semester}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{penugasanMengajar.length}</div>
                                <p className="text-xs text-muted-foreground">Kelas yang diampu</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Mata Pelajaran</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {new Set(penugasanMengajar.map(p => p.mata_pelajaran_id)).size}
                                </div>
                                <p className="text-xs text-muted-foreground">Mapel yang diampu</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Komponen Nilai</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{komponenNilai.length}</div>
                                <p className="text-xs text-muted-foreground">Komponen penilaian</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Periode Aktif</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {semesterAktif?.nama_semester.charAt(0)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {semesterAktif?.nama_semester}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <Card>
                        <CardContent className="p-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-7">
                                    {tabs.map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <TabsTrigger
                                                key={tab.id}
                                                value={tab.id}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>

                                <TabsContent value="pengetahuan" className="mt-6">
                                    {renderPengetahuanTab()}
                                </TabsContent>

                                <TabsContent value="keterampilan" className="mt-6">
                                    {renderKeterampilanTab()}
                                </TabsContent>

                                <TabsContent value="absensi" className="mt-6">
                                    {renderAbsensiTab()}
                                </TabsContent>

                                <TabsContent value="sosial" className="mt-6">
                                    {renderSikapTab('sosial')}
                                </TabsContent>

                                <TabsContent value="spiritual" className="mt-6">
                                    {renderSikapTab('spiritual')}
                                </TabsContent>

                                <TabsContent value="ekstrakurikuler" className="mt-6">
                                    {renderEkstrakurikulerTab()}
                                </TabsContent>

                                <TabsContent value="prestasi" className="mt-6">
                                    {renderPrestasiTab()}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
