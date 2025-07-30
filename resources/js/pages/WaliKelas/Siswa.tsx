import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { GraduationCap, Mail, MapPin, Phone, Search, User, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    guru: any;
    kelas: any;
    siswaList: any[];
    tahunAjaranAktif: any;
    semesterAktif: any;
}

export default function WaliKelasSiswa({ 
    guru, 
    kelas, 
    siswaList, 
    tahunAjaranAktif, 
    semesterAktif 
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSiswa = siswaList.filter(siswa =>
        siswa.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        siswa.nis?.includes(searchTerm) ||
        siswa.nisn?.includes(searchTerm)
    );

    const getNilaiColor = (nilai: number) => {
        if (nilai >= 90) return 'bg-green-500';
        if (nilai >= 80) return 'bg-blue-500';
        if (nilai >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getNilaiGrade = (nilai: number) => {
        if (nilai >= 90) return 'A';
        if (nilai >= 80) return 'B';
        if (nilai >= 70) return 'C';
        return 'D';
    };

    return (
        <AppLayout>
            <Head title="Data Siswa Kelas" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Data Siswa Kelas</h2>
                        <p className="text-muted-foreground">
                            Data siswa kelas {kelas?.nama_kelas} {kelas?.jurusan?.nama_jurusan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} • Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Ringkasan Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{siswaList.length}</div>
                                        <p className="text-sm text-muted-foreground">Total Siswa</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {siswaList.filter(s => s.user?.jenis_kelamin === 'L').length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Laki-laki</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-pink-600">
                                            {siswaList.filter(s => s.user?.jenis_kelamin === 'P').length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Perempuan</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {siswaList.length > 0 ? (siswaList.reduce((sum, s) => sum + s.rata_rata_nilai, 0) / siswaList.length).toFixed(1) : '0'}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Rata-rata Kelas</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari siswa berdasarkan nama, NIS, atau NISN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Siswa Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Daftar Siswa ({filteredSiswa.length})
                            </CardTitle>
                            <CardDescription>
                                Data lengkap siswa kelas {kelas?.nama_kelas}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Foto</TableHead>
                                            <TableHead>Nama Siswa</TableHead>
                                            <TableHead>NIS/NISN</TableHead>
                                            <TableHead>Tempat, Tanggal Lahir</TableHead>
                                            <TableHead>Jenis Kelamin</TableHead>
                                            <TableHead>Alamat</TableHead>
                                            <TableHead>Rata-rata Nilai</TableHead>
                                            <TableHead>Orang Tua</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSiswa.map((siswa, index) => (
                                            <TableRow key={siswa.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold">{siswa.user?.name}</div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {siswa.user?.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">NIS: {siswa.nis || '-'}</div>
                                                        <div className="text-sm text-muted-foreground">NISN: {siswa.nisn || '-'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {siswa.tempat_lahir && siswa.tanggal_lahir ? (
                                                            <>
                                                                <div>{siswa.tempat_lahir},</div>
                                                                <div>{new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID')}</div>
                                                            </>
                                                        ) : '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={siswa.user?.jenis_kelamin === 'L' ? 'default' : 'secondary'}>
                                                        {siswa.user?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <MapPin className="h-3 w-3" />
                                                        {siswa.alamat || '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${getNilaiColor(siswa.rata_rata_nilai)}`}></div>
                                                        <span className="font-medium">{siswa.rata_rata_nilai}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {getNilaiGrade(siswa.rata_rata_nilai)}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {siswa.orang_tua ? (
                                                        <div className="text-sm">
                                                            <div className="font-medium">{siswa.orang_tua.nama_ayah}</div>
                                                            <div className="text-muted-foreground flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {siswa.orang_tua.no_hp_ayah}
                                                            </div>
                                                        </div>  
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="outline">
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
