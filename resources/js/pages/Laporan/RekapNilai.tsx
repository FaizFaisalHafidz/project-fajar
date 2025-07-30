import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Menggunakan select native untuk menghindari error Radix UI
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Download, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Kelas {
    id: number;
    nama_kelas: string;
    jurusan: {
        nama_jurusan: string;
    };
}

interface MataPelajaran {
    id: number;
    nama_mapel: string;
    kode_mapel: string;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Semester {
    id: number;
    nama_semester: string;
}

interface Props {
    tahunAjaranAktif: TahunAjaran;
    semesterAktif: Semester;
    kelasList: Kelas[];
    mataPelajaranList: MataPelajaran[];
}

interface NilaiPengetahuan {
    siswa: {
        id: number;
        nama: string;
        nis: string;
        kelas: string;
    };
    nilai_per_mapel: Array<{
        mata_pelajaran: string;
        rata_rata: number;
        jumlah_nilai: number;
    }>;
    rata_rata_keseluruhan: number;
}

interface NilaiSikap {
    siswa: {
        id: number;
        nama: string;
        nis: string;
        kelas: string;
    };
    nilai_sosial: string;
    deskripsi_sosial: string;
    nilai_spiritual: string;
    deskripsi_spiritual: string;
}

export default function RekapNilai({ tahunAjaranAktif, semesterAktif, kelasList, mataPelajaranList }: Props) {
    const [activeTab, setActiveTab] = useState('pengetahuan');
    const [selectedKelas, setSelectedKelas] = useState<string>('');
    const [selectedMapel, setSelectedMapel] = useState<string>('');
    const [dataPengetahuan, setDataPengetahuan] = useState<NilaiPengetahuan[]>([]);
    const [dataKeterampilan, setDataKeterampilan] = useState<NilaiPengetahuan[]>([]);
    const [dataSikap, setDataSikap] = useState<NilaiSikap[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>({});

    const fetchData = async (type: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedKelas) params.append('kelas_id', selectedKelas);
            if (selectedMapel && type !== 'sikap') params.append('mata_pelajaran_id', selectedMapel);

            const response = await fetch(`/laporan/rekap-${type}?${params}`);
            const result = await response.json();

            if (type === 'pengetahuan') {
                setDataPengetahuan(result.data);
            } else if (type === 'keterampilan') {
                setDataKeterampilan(result.data);
            } else if (type === 'sikap') {
                setDataSikap(result.data);
            }
            
            setSummary(result.summary);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Gagal memuat data rekap nilai');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab, selectedKelas, selectedMapel]);

    const handleExport = (format: 'excel' | 'pdf') => {
        const params = {
            type: activeTab,
            format: format,
            kelas_id: selectedKelas || undefined,
            mata_pelajaran_id: selectedMapel || undefined,
        };

        router.post('/laporan/rekap-nilai/export', params, {
            onSuccess: (page) => {
                toast.success(`Export ${format.toUpperCase()} berhasil diproses`);
            },
            onError: (errors) => {
                toast.error('Gagal melakukan export');
            }
        });
    };

    const getGradeColor = (nilai: number) => {
        if (nilai >= 90) return 'bg-green-100 text-green-800';
        if (nilai >= 80) return 'bg-blue-100 text-blue-800';
        if (nilai >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getGradeLetter = (nilai: number) => {
        if (nilai >= 90) return 'A';
        if (nilai >= 80) return 'B';
        if (nilai >= 70) return 'C';
        return 'D';
    };

    return (
        <AppLayout>
            <Head title="Rekap Nilai Siswa" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Rekap Nilai Siswa</h1>
                        <p className="text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} - Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Filter Data</span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchData(activeTab)}
                                    disabled={loading}
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExport('excel')}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Excel
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExport('pdf')}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    PDF
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <label htmlFor="kelas" className="block text-sm font-medium mb-2">
                                    Filter Kelas
                                </label>
                                <select
                                    id="kelas"
                                    value={selectedKelas}
                                    onChange={(e) => setSelectedKelas(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasList.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id.toString()}>
                                            {kelas.nama_kelas} - {kelas.jurusan.nama_jurusan}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {activeTab !== 'sikap' && (
                                <div className="flex-1">
                                    <label htmlFor="mapel" className="block text-sm font-medium mb-2">
                                        Filter Mata Pelajaran
                                    </label>
                                    <select
                                        id="mapel"
                                        value={selectedMapel}
                                        onChange={(e) => setSelectedMapel(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Semua Mata Pelajaran</option>
                                        {mataPelajaranList.map((mapel) => (
                                            <option key={mapel.id} value={mapel.id.toString()}>
                                                {mapel.nama_mapel}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="pengetahuan">Nilai Pengetahuan</TabsTrigger>
                                <TabsTrigger value="keterampilan">Nilai Keterampilan</TabsTrigger>
                                <TabsTrigger value="sikap">Nilai Sikap</TabsTrigger>
                            </TabsList>

                            <TabsContent value="pengetahuan" className="space-y-4">
                                {summary && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">{summary.total_siswa || 0}</div>
                                                <p className="text-sm text-muted-foreground">Total Siswa</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">{summary.rata_rata_kelas?.toFixed(1) || 0}</div>
                                                <p className="text-sm text-muted-foreground">Rata-rata Kelas</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold text-green-600">{summary.nilai_tertinggi?.toFixed(1) || 0}</div>
                                                <p className="text-sm text-muted-foreground">Nilai Tertinggi</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold text-red-600">{summary.nilai_terendah?.toFixed(1) || 0}</div>
                                                <p className="text-sm text-muted-foreground">Nilai Terendah</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>NIS</TableHead>
                                                <TableHead>Nama Siswa</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Rata-rata</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Jumlah Nilai</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8">
                                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                                        Memuat data...
                                                    </TableCell>
                                                </TableRow>
                                            ) : dataPengetahuan.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                        Tidak ada data nilai pengetahuan
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                dataPengetahuan.map((item, index) => (
                                                    <TableRow key={item.siswa.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.siswa.nis}</TableCell>
                                                        <TableCell className="font-medium">{item.siswa.nama}</TableCell>
                                                        <TableCell>{item.siswa.kelas}</TableCell>
                                                        <TableCell>{item.rata_rata_keseluruhan?.toFixed(1) || 0}</TableCell>
                                                        <TableCell>
                                                            <Badge className={getGradeColor(item.rata_rata_keseluruhan || 0)}>
                                                                {getGradeLetter(item.rata_rata_keseluruhan || 0)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{item.nilai_per_mapel?.length || 0}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="keterampilan" className="space-y-4">
                                {/* Similar structure to pengetahuan */}
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>NIS</TableHead>
                                                <TableHead>Nama Siswa</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Rata-rata</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Jumlah Nilai</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8">
                                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                                        Memuat data...
                                                    </TableCell>
                                                </TableRow>
                                            ) : dataKeterampilan.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                        Tidak ada data nilai keterampilan
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                dataKeterampilan.map((item, index) => (
                                                    <TableRow key={item.siswa.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.siswa.nis}</TableCell>
                                                        <TableCell className="font-medium">{item.siswa.nama}</TableCell>
                                                        <TableCell>{item.siswa.kelas}</TableCell>
                                                        <TableCell>{item.rata_rata_keseluruhan?.toFixed(1) || 0}</TableCell>
                                                        <TableCell>
                                                            <Badge className={getGradeColor(item.rata_rata_keseluruhan || 0)}>
                                                                {getGradeLetter(item.rata_rata_keseluruhan || 0)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{item.nilai_per_mapel?.length || 0}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="sikap" className="space-y-4">
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>NIS</TableHead>
                                                <TableHead>Nama Siswa</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Nilai Sosial</TableHead>
                                                <TableHead>Nilai Spiritual</TableHead>
                                                <TableHead>Deskripsi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8">
                                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                                        Memuat data...
                                                    </TableCell>
                                                </TableRow>
                                            ) : dataSikap.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                        Tidak ada data nilai sikap
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                dataSikap.map((item, index) => (
                                                    <TableRow key={item.siswa.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.siswa.nis}</TableCell>
                                                        <TableCell className="font-medium">{item.siswa.nama}</TableCell>
                                                        <TableCell>{item.siswa.kelas}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{item.nilai_sosial}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{item.nilai_spiritual}</Badge>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate">
                                                            {item.deskripsi_sosial || item.deskripsi_spiritual || '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
