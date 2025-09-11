import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Calendar,
    Heart,
    Star,
    Target,
    TrendingUp,
    Trophy,
    User
} from 'lucide-react';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: { name: string }[];
        };
    };
    anak?: {
        id: number;
        nama: string;
        nis: string;
        kelas: {
            nama_kelas: string;
            jurusan: {
                nama_jurusan: string;
            };
        };
    };
    nilai?: {
        pengetahuan: any[];
        keterampilan: any[];
        sikap: any[];
        ekstrakurikuler: any[];
    };
    absensi?: {
        hadir: number;
        sakit: number;
        izin: number;
        alpha: number;
        total_hari: number;
    };
    prestasi?: any[];
}

export default function PantauAnak({ 
    auth,
    anak,
    nilai,
    absensi,
    prestasi
}: Props) {
    const tabs = [
        { id: 'overview', label: 'Ringkasan', icon: TrendingUp },
        { id: 'nilai-pengetahuan', label: 'Nilai Pengetahuan', icon: BookOpen },
        { id: 'nilai-keterampilan', label: 'Nilai Keterampilan', icon: Target },
        { id: 'nilai-sikap', label: 'Nilai Sikap', icon: Heart },
        { id: 'ekstrakurikuler', label: 'Ekstrakurikuler', icon: Star },
        { id: 'absensi', label: 'Absensi', icon: Calendar },
        { id: 'prestasi', label: 'Prestasi', icon: Trophy },
    ];

    const getGradeColor = (grade: string) => {
        switch (grade?.toUpperCase()) {
            case 'A': return 'bg-green-500';
            case 'B': return 'bg-blue-500';
            case 'C': return 'bg-yellow-500';
            case 'D': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Info Siswa */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informasi Siswa
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                            <p className="text-lg font-semibold">{anak?.nama || 'Data tidak tersedia'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">NIS</label>
                            <p className="text-lg font-semibold">{anak?.nis || 'Data tidak tersedia'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Kelas</label>
                            <p className="text-lg font-semibold">
                                {anak?.kelas ? `${anak.kelas.nama_kelas} - ${anak.kelas.jurusan.nama_jurusan}` : 'Data tidak tersedia'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ringkasan Prestasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Rata-rata Pengetahuan</p>
                                <p className="text-2xl font-bold">
                                    {nilai?.pengetahuan?.length ? 
                                        (nilai.pengetahuan.reduce((acc, n) => acc + (n.rata_rata || 0), 0) / nilai.pengetahuan.length).toFixed(1) 
                                        : '0.0'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Target className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Rata-rata Keterampilan</p>
                                <p className="text-2xl font-bold">
                                    {nilai?.keterampilan?.length ? 
                                        (nilai.keterampilan.reduce((acc, n) => acc + (n.rata_rata || 0), 0) / nilai.keterampilan.length).toFixed(1) 
                                        : '0.0'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-8 h-8 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tingkat Kehadiran</p>
                                <p className="text-2xl font-bold">
                                    {absensi?.total_hari ? 
                                        ((absensi.hadir / absensi.total_hari) * 100).toFixed(1) + '%'
                                        : '0%'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-8 h-8 text-yellow-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Prestasi</p>
                                <p className="text-2xl font-bold">{prestasi?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Progress Akademik</CardTitle>
                    <CardDescription>Perkembangan nilai akademik anak sepanjang semester</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Pengetahuan</span>
                                <span className="text-sm text-muted-foreground">
                                    {nilai?.pengetahuan?.length ? 
                                        (nilai.pengetahuan.reduce((acc, n) => acc + (n.rata_rata || 0), 0) / nilai.pengetahuan.length).toFixed(1) 
                                        : '0.0'
                                    }/100
                                </span>
                            </div>
                            <Progress 
                                value={nilai?.pengetahuan?.length ? 
                                    (nilai.pengetahuan.reduce((acc, n) => acc + (n.rata_rata || 0), 0) / nilai.pengetahuan.length) 
                                    : 0
                                } 
                                className="h-2"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Keterampilan</span>
                                <span className="text-sm text-muted-foreground">
                                    {nilai?.keterampilan?.length ? 
                                        (nilai.keterampilan.reduce((acc, n) => acc + (n.rata_rata || 0), 0) / nilai.keterampilan.length).toFixed(1) 
                                        : '0.0'
                                    }/100
                                </span>
                            </div>
                            <Progress 
                                value={nilai?.keterampilan?.length ? 
                                    (nilai.keterampilan.reduce((acc, n) => acc + (n.rata_rata || 0), 0) / nilai.keterampilan.length) 
                                    : 0
                                } 
                                className="h-2"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Kehadiran</span>
                                <span className="text-sm text-muted-foreground">
                                    {absensi?.total_hari ? 
                                        ((absensi.hadir / absensi.total_hari) * 100).toFixed(1) + '%'
                                        : '0%'
                                    }
                                </span>
                            </div>
                            <Progress 
                                value={absensi?.total_hari ? 
                                    (absensi.hadir / absensi.total_hari) * 100 
                                    : 0
                                } 
                                className="h-2"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderNilaiTab = (type: string) => {
        const data = nilai?.[type as keyof typeof nilai] || [];
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Nilai {type.charAt(0).toUpperCase() + type.slice(1)}</CardTitle>
                    <CardDescription>Detail nilai {type} per mata pelajaran</CardDescription>
                </CardHeader>
                <CardContent>
                    {data.length > 0 ? (
                        <div className="space-y-4">
                            {data.map((item: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold">{item.mata_pelajaran?.nama_mata_pelajaran || 'Mata Pelajaran'}</h4>
                                        <Badge variant={
                                            (item.rata_rata || 0) >= 90 ? 'default' :
                                            (item.rata_rata || 0) >= 80 ? 'secondary' :
                                            (item.rata_rata || 0) >= 70 ? 'outline' : 'destructive'
                                        }>
                                            {(item.rata_rata || 0) >= 90 ? 'A' :
                                             (item.rata_rata || 0) >= 80 ? 'B' :
                                             (item.rata_rata || 0) >= 70 ? 'C' : 'D'}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Rata-rata: </span>
                                            <span className="font-medium">{(item.rata_rata || 0).toFixed(1)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Guru: </span>
                                            <span className="font-medium">{item.guru?.user?.name || 'Data tidak tersedia'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">Data nilai belum tersedia</p>
                    )}
                </CardContent>
            </Card>
        );
    };

    const renderAbsensiTab = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Rekap Absensi
                </CardTitle>
                <CardDescription>Data kehadiran anak selama semester ini</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{absensi?.hadir || 0}</div>
                        <div className="text-sm text-muted-foreground">Hadir</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{absensi?.sakit || 0}</div>
                        <div className="text-sm text-muted-foreground">Sakit</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{absensi?.izin || 0}</div>
                        <div className="text-sm text-muted-foreground">Izin</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{absensi?.alpha || 0}</div>
                        <div className="text-sm text-muted-foreground">Alpha</div>
                    </div>
                </div>
                
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Tingkat Kehadiran</span>
                        <span className="text-sm text-muted-foreground">
                            {absensi?.hadir || 0} dari {absensi?.total_hari || 0} hari
                        </span>
                    </div>
                    <Progress 
                        value={absensi?.total_hari ? 
                            (absensi.hadir / absensi.total_hari) * 100 
                            : 0
                        } 
                        className="h-3"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                        Persentase kehadiran: {absensi?.total_hari ? 
                            ((absensi.hadir / absensi.total_hari) * 100).toFixed(1) 
                            : '0'
                        }%
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    const renderPrestasiTab = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Prestasi Anak
                </CardTitle>
                <CardDescription>Daftar prestasi yang telah diraih anak</CardDescription>
            </CardHeader>
            <CardContent>
                {prestasi && prestasi.length > 0 ? (
                    <div className="space-y-4">
                        {prestasi.map((item: any, index: number) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-8 h-8 text-yellow-500" />
                                        <div>
                                            <h4 className="font-semibold">{item.nama_prestasi || 'Prestasi'}</h4>
                                            <p className="text-sm text-muted-foreground">{item.jenis_prestasi || 'Akademik'}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">
                                        {item.tingkat_prestasi || 'Sekolah'}
                                    </Badge>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Tanggal: </span>
                                        <span className="font-medium">
                                            {item.tanggal_prestasi ? 
                                                new Date(item.tanggal_prestasi).toLocaleDateString('id-ID') 
                                                : 'Data tidak tersedia'
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Penyelenggara: </span>
                                        <span className="font-medium">{item.penyelenggara || 'Data tidak tersedia'}</span>
                                    </div>
                                </div>
                                {item.deskripsi && (
                                    <p className="text-sm text-muted-foreground mt-2">{item.deskripsi}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Belum ada prestasi yang tercatat</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <AppLayout>
            <Head title="Pantau Anak" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Pantau Anak</h2>
                        <p className="text-muted-foreground">
                            Monitor perkembangan akademik dan prestasi anak Anda
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-7">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="overview">
                        {renderOverviewTab()}
                    </TabsContent>

                    <TabsContent value="nilai-pengetahuan">
                        {renderNilaiTab('pengetahuan')}
                    </TabsContent>

                    <TabsContent value="nilai-keterampilan">
                        {renderNilaiTab('keterampilan')}
                    </TabsContent>

                    <TabsContent value="nilai-sikap">
                        {renderNilaiTab('sikap')}
                    </TabsContent>

                    <TabsContent value="ekstrakurikuler">
                        {renderNilaiTab('ekstrakurikuler')}
                    </TabsContent>

                    <TabsContent value="absensi">
                        {renderAbsensiTab()}
                    </TabsContent>

                    <TabsContent value="prestasi">
                        {renderPrestasiTab()}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
