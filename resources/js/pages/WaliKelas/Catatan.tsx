import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Textarea } from '@/components/ui/textarea';
import { Textarea } from '@/components/ui/textarea'; // Update this path if Textarea is located elsewhere, e.g. '@/components/Textarea'
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, Award, BookOpen, FileText, MessageSquare, Plus, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
    guru: any;
    kelas: any;
    catatanList: any;
    tahunAjaranAktif: any;
    semesterAktif: any;
}

interface CatatanForm {
    siswa_id: string;
    judul: string;
    isi_catatan: string;
    kategori_catatan: string;
    [key: string]: any;
}

export default function WaliKelasCatatan({ 
    guru, 
    kelas, 
    catatanList, 
    tahunAjaranAktif, 
    semesterAktif 
}: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<CatatanForm>({
        siswa_id: '',
        judul: '',
        isi_catatan: '',
        kategori_catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/wali-kelas/catatan', {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
            router.delete(`/wali-kelas/catatan/${id}`);
        }
    };

    const getKategoriIcon = (kategori: string) => {
        switch (kategori) {
            case 'prestasi':
                return <Award className="h-4 w-4" />;
            case 'peringatan':
                return <AlertCircle className="h-4 w-4" />;
            case 'konseling':
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getKategoriColor = (kategori: string) => {
        switch (kategori) {
            case 'prestasi':
                return 'bg-green-500';
            case 'peringatan':
                return 'bg-red-500';
            case 'konseling':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getKategoriVariant = (kategori: string): "default" | "destructive" | "outline" | "secondary" => {
        switch (kategori) {
            case 'prestasi':
                return 'default';
            case 'peringatan':
                return 'destructive';
            case 'konseling':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout>
            <Head title="Catatan Wali Kelas" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Catatan Wali Kelas</h2>
                        <p className="text-muted-foreground">
                            Kelola catatan untuk siswa kelas {kelas?.nama_kelas} {kelas?.jurusan?.nama_jurusan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tahun Ajaran {tahunAjaranAktif?.nama_tahun_ajaran} • Semester {semesterAktif?.nama_semester}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Catatan</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{catatanList.data?.length || 0}</div>
                                <p className="text-xs text-muted-foreground">Catatan tercatat</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Prestasi</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {catatanList.data?.filter((c: any) => c.data_baru?.kategori_catatan === 'prestasi').length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">Catatan positif</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Peringatan</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {catatanList.data?.filter((c: any) => c.data_baru?.kategori_catatan === 'peringatan').length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">Perlu perhatian</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Konseling</CardTitle>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {catatanList.data?.filter((c: any) => c.data_baru?.kategori_catatan === 'konseling').length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">Sesi konseling</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserCheck className="h-5 w-5" />
                                        Catatan Siswa
                                    </CardTitle>
                                    <CardDescription>
                                        Riwayat catatan dan observasi siswa
                                    </CardDescription>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Tambah Catatan
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle>Tambah Catatan Baru</DialogTitle>
                                            <DialogDescription>
                                                Buat catatan untuk siswa di kelas Anda
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="siswa_id" className="text-right">
                                                        Siswa
                                                    </Label>
                                                    <div className="col-span-3">
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            value={data.siswa_id}
                                                            onChange={(e) => setData('siswa_id', e.target.value)}
                                                        >
                                                            <option value="">Semua siswa</option>
                                                            {kelas?.siswa?.map((siswa: any) => (
                                                                <option key={siswa.id} value={siswa.id.toString()}>
                                                                    {siswa.user?.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.siswa_id && <p className="text-sm text-red-500 mt-1">{errors.siswa_id}</p>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="kategori_catatan" className="text-right">
                                                        Kategori
                                                    </Label>
                                                    <div className="col-span-3">
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            value={data.kategori_catatan}
                                                            onChange={(e) => setData('kategori_catatan', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Pilih kategori catatan</option>
                                                            <option value="prestasi">Prestasi</option>
                                                            <option value="peringatan">Peringatan</option>
                                                            <option value="konseling">Konseling</option>
                                                            <option value="umum">Umum</option>
                                                        </select>
                                                        {errors.kategori_catatan && <p className="text-sm text-red-500 mt-1">{errors.kategori_catatan}</p>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="judul" className="text-right">
                                                        Judul
                                                    </Label>
                                                    <div className="col-span-3">
                                                        <Input
                                                            id="judul"
                                                            value={data.judul}
                                                            onChange={(e) => setData('judul', e.target.value)}
                                                            placeholder="Masukkan judul catatan"
                                                        />
                                                        {errors.judul && <p className="text-sm text-red-500 mt-1">{errors.judul}</p>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 items-start gap-4">
                                                    <Label htmlFor="isi_catatan" className="text-right pt-2">
                                                        Isi Catatan
                                                    </Label>
                                                    <div className="col-span-3">
                                                        <Textarea
                                                            id="isi_catatan"
                                                            value={data.isi_catatan}
                                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('isi_catatan', e.target.value)}
                                                            placeholder="Tulis catatan detail..."
                                                            rows={4}
                                                        />
                                                        {errors.isi_catatan && <p className="text-sm text-red-500 mt-1">{errors.isi_catatan}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                    Batal
                                                </Button>
                                                <Button type="submit" disabled={processing}>
                                                    {processing ? 'Menyimpan...' : 'Simpan Catatan'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Siswa</TableHead>
                                            <TableHead>Isi Catatan</TableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {catatanList.data && catatanList.data.length > 0 ? (
                                            catatanList.data.map((catatan: any) => (
                                                <TableRow key={catatan.id}>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {new Date(catatan.created_at).toLocaleDateString('id-ID')}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(catatan.created_at).toLocaleTimeString('id-ID')}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getKategoriVariant(catatan.data?.kategori_catatan || 'umum')} className="flex items-center gap-1 w-fit">
                                                            {getKategoriIcon(catatan.data?.kategori_catatan || 'umum')}
                                                            {catatan.data?.kategori_catatan || 'Umum'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {catatan.data?.judul}
                                                    </TableCell>
                                                    <TableCell>
                                                        {catatan.data?.siswa_id ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${getKategoriColor(catatan.data?.kategori_catatan || 'umum')}`}></div>
                                                                Siswa Tertentu
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">Semua siswa</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-xs truncate">
                                                            {catatan.data?.isi_catatan}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button size="sm" variant="outline">
                                                                <BookOpen className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="destructive" 
                                                                onClick={() => handleDelete(catatan.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FileText className="h-8 w-8 text-muted-foreground" />
                                                        <p className="text-muted-foreground">Belum ada catatan</p>
                                                        <p className="text-sm text-muted-foreground">Klik "Tambah Catatan" untuk membuat catatan baru</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {catatanList.links && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {catatanList.from} hingga {catatanList.to} dari {catatanList.total} catatan
                                    </div>
                                    <div className="flex gap-2">
                                        {catatanList.links.map((link: any, index: number) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.get(link.url);
                                                    }
                                                }}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
