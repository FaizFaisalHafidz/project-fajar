import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Award,
    ClipboardList,
    Database,
    Download,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    RefreshCw,
    UserCheck,
    Users
} from 'lucide-react';
import { useState } from 'react';
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

interface NilaiSiswa {
    id: number;
    siswa: {
        user: {
            name: string;
        };
    };
    mataPelajaran: {
        nama_mapel: string;
    };
    komponenNilai: {
        nama_komponen: string;
    };
    nilai: number;
}

interface PrestasiSiswa {
    id: number;
    siswa: {
        user: {
            name: string;
        };
    };
    nama_prestasi: string;
    jenis_prestasi: string;
    tingkat: string;
}

interface Props {
    tahunAjaranAktif?: TahunAjaran;
    semesterAktif?: Semester;
    kelasList?: Kelas[];
    mataPelajaranList?: MataPelajaran[];
    summary?: {
        total_siswa: number;
        total_guru: number;
        total_kelas: number;
        total_mata_pelajaran: number;
        total_nilai: number;
        total_absensi: number;
        total_prestasi: number;
    };
    recentData?: {
        nilai_terbaru: NilaiSiswa[];
        prestasi_terbaru: PrestasiSiswa[];
    };
}

export default function ExportData({ 
    tahunAjaranAktif, 
    semesterAktif, 
    kelasList = [], 
    mataPelajaranList = [], 
    summary = {
        total_siswa: 0,
        total_guru: 0,
        total_kelas: 0,
        total_mata_pelajaran: 0,
        total_nilai: 0,
        total_absensi: 0,
        total_prestasi: 0,
    }, 
    recentData = {
        nilai_terbaru: [],
        prestasi_terbaru: [],
    }
}: Props) {
    const [selectedExportType, setSelectedExportType] = useState<string>('siswa');
    const [selectedFormat, setSelectedFormat] = useState<string>('excel');
    const [selectedKelas, setSelectedKelas] = useState<string>('');
    const [selectedMataPelajaran, setSelectedMataPelajaran] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const exportTypes = [
        { value: 'siswa', label: 'Data Siswa', icon: Users, description: 'Export data lengkap siswa aktif' },
        { value: 'guru', label: 'Data Guru', icon: GraduationCap, description: 'Export data guru dan pengajar' },
        { value: 'nilai', label: 'Data Nilai', icon: ClipboardList, description: 'Export nilai siswa per semester' },
        { value: 'absensi', label: 'Data Absensi', icon: UserCheck, description: 'Export rekap absensi siswa' },
        { value: 'prestasi', label: 'Data Prestasi', icon: Award, description: 'Export prestasi siswa' },
        { value: 'semua', label: 'Semua Data', icon: Database, description: 'Export semua data dalam satu file' },
    ];

    const formatTypes = [
        { value: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
        { value: 'csv', label: 'CSV (.csv)', icon: FileText },
        { value: 'pdf', label: 'PDF (.pdf)', icon: FileText },
    ];

    const handleExport = () => {
        if (!selectedExportType || !selectedFormat) {
            toast.error('Pilih jenis data dan format export');
            return;
        }

        setLoading(true);

        const exportData = {
            export_type: selectedExportType,
            format: selectedFormat,
            kelas_id: selectedKelas || null,
            mata_pelajaran_id: selectedMataPelajaran || null,
        };

        router.post('/laporan/export/data', exportData, {
            onSuccess: () => {
                toast.success('Data berhasil di-export');
                setLoading(false);
            },
            onError: (errors) => {
                console.error('Export error:', errors);
                toast.error('Gagal export data');
                setLoading(false);
            },
        });
    };

    const resetFilters = () => {
        setSelectedKelas('');
        setSelectedMataPelajaran('');
    };

    const summaryCards = [
        { title: 'Total Siswa', value: summary?.total_siswa || 0, icon: Users, color: 'text-blue-600' },
        { title: 'Total Guru', value: summary?.total_guru || 0, icon: GraduationCap, color: 'text-green-600' },
        { title: 'Total Kelas', value: summary?.total_kelas || 0, icon: Database, color: 'text-purple-600' },
        { title: 'Total Mata Pelajaran', value: summary?.total_mata_pelajaran || 0, icon: ClipboardList, color: 'text-orange-600' },
        { title: 'Total Nilai', value: summary?.total_nilai || 0, icon: FileText, color: 'text-red-600' },
        { title: 'Total Absensi', value: summary?.total_absensi || 0, icon: UserCheck, color: 'text-teal-600' },
        { title: 'Total Prestasi', value: summary?.total_prestasi || 0, icon: Award, color: 'text-yellow-600' },
    ];

    return (
        <AppLayout>
            <Head title="Export Data" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Export Data</h1>
                        <p className="text-muted-foreground">
                            Export berbagai jenis data sekolah - {tahunAjaranAktif?.nama_tahun_ajaran} | {semesterAktif?.nama_semester}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {summaryCards.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <IconComponent className={`h-5 w-5 ${card.color}`} />
                                        <div>
                                            <p className="text-xs text-muted-foreground">{card.title}</p>
                                            <p className="text-lg font-semibold">{card.value}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Export Configuration */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Konfigurasi Export
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Export Type Selection */}
                                <div>
                                    <h3 className="font-medium mb-3">Pilih Jenis Data</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {exportTypes.map((type) => {
                                            const IconComponent = type.icon;
                                            return (
                                                <div
                                                    key={type.value}
                                                    className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                                                        selectedExportType === type.value 
                                                            ? 'border-primary bg-primary/10' 
                                                            : 'border-muted'
                                                    }`}
                                                    onClick={() => setSelectedExportType(type.value)}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <IconComponent className="h-5 w-5 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium text-sm">{type.label}</p>
                                                            <p className="text-xs text-muted-foreground">{type.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Format Selection */}
                                <div>
                                    <h3 className="font-medium mb-3">Pilih Format Export</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {formatTypes.map((format) => {
                                            const IconComponent = format.icon;
                                            return (
                                                <div
                                                    key={format.value}
                                                    className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                                                        selectedFormat === format.value 
                                                            ? 'border-primary bg-primary/10' 
                                                            : 'border-muted'
                                                    }`}
                                                    onClick={() => setSelectedFormat(format.value)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{format.label}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Filters */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium">Filter Data</h3>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={resetFilters}
                                            className="text-xs"
                                        >
                                            <RefreshCw className="h-3 w-3 mr-1" />
                                            Reset
                                        </Button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Kelas</label>
                                            <select
                                                value={selectedKelas}
                                                onChange={(e) => setSelectedKelas(e.target.value)}
                                                className="w-full p-2 border rounded-md text-sm"
                                            >
                                                <option value="">Semua Kelas</option>
                                                {kelasList?.map((kelas) => (
                                                    <option key={kelas.id} value={kelas.id}>
                                                        {kelas.nama_kelas} - {kelas.jurusan?.nama_jurusan || 'N/A'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Mata Pelajaran</label>
                                            <select
                                                value={selectedMataPelajaran}
                                                onChange={(e) => setSelectedMataPelajaran(e.target.value)}
                                                className="w-full p-2 border rounded-md text-sm"
                                                disabled={selectedExportType !== 'nilai'}
                                            >
                                                <option value="">Semua Mata Pelajaran</option>
                                                {mataPelajaranList?.map((mapel) => (
                                                    <option key={mapel.id} value={mapel.id}>
                                                        {mapel.kode_mapel} - {mapel.nama_mapel}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Export Button */}
                                <div className="pt-4 border-t">
                                    <Button 
                                        onClick={handleExport} 
                                        disabled={loading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Memproses Export...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4 mr-2" />
                                                Export Data
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Data Preview */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Data Terkini</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="nilai" className="space-y-4">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="nilai" className="text-xs">Nilai</TabsTrigger>
                                        <TabsTrigger value="prestasi" className="text-xs">Prestasi</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="nilai" className="space-y-2">
                                        <h4 className="font-medium text-sm mb-2">5 Nilai Terbaru</h4>
                                        <div className="space-y-2">
                                            {recentData?.nilai_terbaru?.length > 0 ? recentData.nilai_terbaru.map((nilai, index) => (
                                                <div key={index} className="p-2 border rounded text-xs">
                                                    <p className="font-medium">{nilai.siswa?.user?.name || 'N/A'}</p>
                                                    <p className="text-muted-foreground">
                                                        {nilai.mataPelajaran?.nama_mapel || 'N/A'} - {nilai.komponenNilai?.nama_komponen || 'N/A'}
                                                    </p>
                                                    <Badge variant="secondary" className="text-xs">{nilai.nilai}</Badge>
                                                </div>
                                            )) : (
                                                <div className="p-2 text-center text-muted-foreground text-xs">
                                                    Tidak ada data nilai terbaru
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="prestasi" className="space-y-2">
                                        <h4 className="font-medium text-sm mb-2">5 Prestasi Terbaru</h4>
                                        <div className="space-y-2">
                                            {recentData?.prestasi_terbaru?.length > 0 ? recentData.prestasi_terbaru.map((prestasi, index) => (
                                                <div key={index} className="p-2 border rounded text-xs">
                                                    <p className="font-medium">{prestasi.siswa?.user?.name || 'N/A'}</p>
                                                    <p className="text-muted-foreground">{prestasi.nama_prestasi || 'N/A'}</p>
                                                    <Badge variant="outline" className="text-xs">{prestasi.tingkat || 'N/A'}</Badge>
                                                </div>
                                            )) : (
                                                <div className="p-2 text-center text-muted-foreground text-xs">
                                                    Tidak ada data prestasi terbaru
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
