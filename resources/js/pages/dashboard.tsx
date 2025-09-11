import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    BookOpen,
    Crown,
    GraduationCap,
    School,
    Settings,
    UserCheck,
    UserCog,
    Users
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const roles = user?.roles?.map(role => role.name) || [];

    const getRoleInfo = () => {
        if (roles.includes('super-admin')) {
            return {
                title: 'Super Administrator',
                greeting: 'Selamat datang di panel Super Admin',
                description: 'Kelola seluruh sistem sekolah dengan akses penuh ke semua fitur',
                icon: Crown,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                features: [
                    'Manajemen semua pengguna',
                    'Konfigurasi sistem global',
                    'Monitoring seluruh sekolah',
                    'Backup & maintenance'
                ]
            };
        } else if (roles.includes('admin-sekolah')) {
            return {
                title: 'Administrator Sekolah',
                greeting: 'Selamat datang di panel Admin Sekolah',
                description: 'Kelola data sekolah, pengguna, dan pantau statistik akademik',
                icon: Settings,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                features: [
                    'Manajemen pengguna sekolah',
                    'Pengaturan master data',
                    'Statistik & monitoring real-time',
                    'Laporan akademik lengkap'
                ]
            };
        } else if (roles.includes('kepala-sekolah')) {
            return {
                title: 'Kepala Sekolah',
                greeting: 'Selamat datang di dashboard Kepala Sekolah',
                description: 'Pantau perkembangan sekolah dan buat keputusan strategis',
                icon: School,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                borderColor: 'border-indigo-200',
                features: [
                    'Laporan eksekutif',
                    'Trend performa sekolah',
                    'Analisis prediktif',
                    'Dashboard strategis'
                ]
            };
        } else if (roles.includes('wali-kelas')) {
            return {
                title: 'Wali Kelas',
                greeting: 'Selamat datang, Wali Kelas',
                description: 'Kelola dan pantau perkembangan siswa di kelas Anda',
                icon: UserCheck,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                features: [
                    'Data siswa kelas',
                    'Monitoring akademik',
                    'Komunikasi wali murid',
                    'Laporan progress'
                ]
            };
        } else if (roles.includes('guru')) {
            return {
                title: 'Guru',
                greeting: 'Selamat datang, Bapak/Ibu Guru',
                description: 'Kelola pembelajaran dan nilai siswa',
                icon: BookOpen,
                color: 'text-teal-600',
                bgColor: 'bg-teal-50',
                borderColor: 'border-teal-200',
                features: [
                    'Input nilai siswa',
                    'Manajemen penugasan',
                    'Laporan pembelajaran',
                    'Progress mata pelajaran'
                ]
            };
        } else if (roles.includes('siswa')) {
            return {
                title: 'Siswa',
                greeting: `Selamat datang, ${user.name}`,
                description: 'Pantau perkembangan akademik dan prestasi Anda',
                icon: GraduationCap,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                features: [
                    'Profil akademik',
                    'Analisis nilai',
                    'Rekomendasi K-Means',
                    'Progress belajar'
                ]
            };
        } else if (roles.includes('wali-murid')) {
            return {
                title: 'Wali Murid',
                greeting: 'Selamat datang, Wali Murid',
                description: 'Pantau perkembangan akademik putra/putri Anda',
                icon: Users,
                color: 'text-pink-600',
                bgColor: 'bg-pink-50',
                borderColor: 'border-pink-200',
                features: [
                    'Raport anak',
                    'Progress akademik',
                    'Komunikasi sekolah',
                    'Jadwal kegiatan'
                ]
            };
        } else {
            return {
                title: 'Pengguna',
                greeting: 'Selamat datang',
                description: 'Akses dashboard sesuai dengan hak akses Anda',
                icon: UserCog,
                color: 'text-gray-600',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                features: []
            };
        }
    };

    const roleInfo = getRoleInfo();
    const Icon = roleInfo.icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Card */}
                <Card className={`${roleInfo.borderColor} border-l-4`}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-lg ${roleInfo.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${roleInfo.color}`} />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{roleInfo.greeting}</CardTitle>
                                    <CardDescription className="text-base mt-1">
                                        {roleInfo.description}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className={`${roleInfo.color} ${roleInfo.bgColor} border-current`}>
                                {roleInfo.title}
                            </Badge>
                        </div>
                    </CardHeader>
                    {roleInfo.features.length > 0 && (
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {roleInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className={`w-2 h-2 rounded-full ${roleInfo.bgColor} ${roleInfo.color.replace('text-', 'bg-')}`}></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    <h3 className="font-semibold">
                                        {roles.includes('admin-sekolah') ? 'Rata-rata Akademik' : 'Statistik Akademik'}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {roles.includes('admin-sekolah') ? 'Performa seluruh siswa' : 'Data performa dan pencapaian'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">
                                    {roles.includes('admin-sekolah') ? '83.2%' : 
                                     roles.includes('kepala-sekolah') ? '89.4%' : '85%'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {roles.includes('admin-sekolah') ? 'Ketuntasan KKM' : 
                                     roles.includes('kepala-sekolah') ? 'Target Akademik' : 'Rata-rata'}
                                </p>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10 -z-10" />
                    </div>
                    
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-5 w-5 text-green-600" />
                                    <h3 className="font-semibold">
                                        {roles.includes('admin-sekolah') ? 'Total Siswa' : 
                                         roles.includes('kepala-sekolah') ? 'Efektivitas' : 'Prestasi'}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {roles.includes('admin-sekolah') ? 'Siswa aktif sekolah' : 
                                     roles.includes('kepala-sekolah') ? 'Program pembelajaran' : 'Pencapaian dan penghargaan'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                    {roles.includes('admin-sekolah') ? '1,247' : 
                                     roles.includes('kepala-sekolah') ? '94.1%' : '24'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {roles.includes('admin-sekolah') ? 'Siswa' : 
                                     roles.includes('kepala-sekolah') ? 'Efektif' : 'Total'}
                                </p>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10 -z-10" />
                    </div>
                    
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-5 w-5 text-purple-600" />
                                    <h3 className="font-semibold">
                                        {roles.includes('admin-sekolah') ? 'Total Guru' : 
                                         roles.includes('kepala-sekolah') ? 'Satisfaction' : 'Aktivitas'}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {roles.includes('admin-sekolah') ? 'Tenaga pendidik aktif' : 
                                     roles.includes('kepala-sekolah') ? 'Kepuasan stakeholder' : 'Kegiatan dan partisipasi'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-purple-600">
                                    {roles.includes('admin-sekolah') ? '87' : 
                                     roles.includes('kepala-sekolah') ? '4.7★' : '98%'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {roles.includes('admin-sekolah') ? 'Guru' : 
                                     roles.includes('kepala-sekolah') ? 'Rating' : 'Kehadiran'}
                                </p>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10 -z-10" />
                    </div>
                </div>

                {/* Main Content Area - Admin khusus */}
                {roles.includes('admin-sekolah') ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Distribusi Siswa per Jurusan */}
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    <h3 className="font-semibold">Distribusi Siswa per Jurusan</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Teknik Komputer Jaringan</span>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-200 rounded-full h-2 w-32">
                                                <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                                            </div>
                                            <span className="text-sm font-medium">487 (78%)</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Multimedia</span>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-200 rounded-full h-2 w-32">
                                                <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                                            </div>
                                            <span className="text-sm font-medium">325 (65%)</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Otomatisasi Industri</span>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-200 rounded-full h-2 w-32">
                                                <div className="bg-purple-600 h-2 rounded-full" style={{width: '42%'}}></div>
                                            </div>
                                            <span className="text-sm font-medium">435 (87%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prestasi per Tingkat */}
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="h-5 w-5 text-green-600" />
                                    <h3 className="font-semibold">Prestasi per Tingkat</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                        <span className="text-sm font-medium">Internasional</span>
                                        <span className="text-lg font-bold text-yellow-600">3</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium">Nasional</span>
                                        <span className="text-lg font-bold text-blue-600">12</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">Provinsi</span>
                                        <span className="text-lg font-bold text-green-600">28</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm font-medium">Kabupaten/Kota</span>
                                        <span className="text-lg font-bold text-purple-600">45</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : roles.includes('kepala-sekolah') ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Key Performance Indicators */}
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <School className="h-5 w-5 text-indigo-600" />
                                    <h3 className="font-semibold">Key Performance Indicators</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Ketuntasan Akademik</span>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-indigo-200 rounded-full h-2 w-24">
                                                <div className="bg-indigo-600 h-2 rounded-full" style={{width: '89%'}}></div>
                                            </div>
                                            <span className="text-sm font-bold text-indigo-600">89%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Tingkat Kehadiran</span>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-200 rounded-full h-2 w-24">
                                                <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                                            </div>
                                            <span className="text-sm font-bold text-green-600">94%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Kepuasan Stakeholder</span>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-200 rounded-full h-2 w-24">
                                                <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                                            </div>
                                            <span className="text-sm font-bold text-blue-600">87%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Pencapaian Target</span>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-200 rounded-full h-2 w-24">
                                                <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}}></div>
                                            </div>
                                            <span className="text-sm font-bold text-purple-600">92%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trend Performa Bulanan */}
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    <h3 className="font-semibold">Trend Performa 6 Bulan</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 border-l-4 border-green-500 bg-green-50">
                                        <span className="text-sm font-medium">Januari</span>
                                        <span className="text-sm font-bold text-green-600">85.2% ↗</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 border-l-4 border-green-500 bg-green-50">
                                        <span className="text-sm font-medium">Februari</span>
                                        <span className="text-sm font-bold text-green-600">86.7% ↗</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 border-l-4 border-yellow-500 bg-yellow-50">
                                        <span className="text-sm font-medium">Maret</span>
                                        <span className="text-sm font-bold text-yellow-600">84.1% ↘</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 border-l-4 border-green-500 bg-green-50">
                                        <span className="text-sm font-medium">April</span>
                                        <span className="text-sm font-bold text-green-600">87.9% ↗</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Main Content Area */
                    <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                            <div className="max-w-md mx-auto">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${roleInfo.bgColor} flex items-center justify-center`}>
                                    <Icon className={`h-8 w-8 ${roleInfo.color}`} />
                                </div>
                                <h2 className="text-xl font-semibold mb-2">Area Konten Utama</h2>
                                <p className="text-muted-foreground">
                                    Konten dashboard spesifik untuk role {roleInfo.title} akan ditampilkan di sini.
                                    Navigasi ke menu yang tersedia untuk mengakses fitur lengkap.
                                </p>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5 -z-10" />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
