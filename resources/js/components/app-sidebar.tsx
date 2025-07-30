import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    BookMarked,
    Brain,
    ClipboardList,
    Database,
    FileText,
    GraduationCap,
    LayoutGrid,
    Settings,
    TrendingUp,
    UserCheck,
    Users
} from 'lucide-react';
import AppLogo from './app-logo';

interface CustomUser extends User {
    roles: { name: string }[]; // Array of roles with name property
}

interface CustomProps {
    auth: {
        user: CustomUser;
    };
    [key: string]: unknown;
}

export function AppSidebar() {
    const { auth } = usePage<CustomProps>().props;
    const roles = auth.user?.roles?.map(role => role.name) || [];

    // console.log('User Roles:', roles);
    
    // Menu dasar untuk semua pengguna
    const dashboardMenu: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];
    
    // Menu untuk Super Admin & Admin Sekolah
    const adminMenu: NavItem[] = [
        {
            title: 'Manajemen Pengguna',
            href: '/pengguna',
            icon: Users,
        },
        {
            title: 'Data Master',
            href: '/master',
            icon: Database,
            items: [
                { title: 'Tahun Akademik', href: '/master/tahun-akademik' },
                { title: 'Semester', href: '/master/semester' },
                { title: 'Jurusan', href: '/master/jurusan' },
                { title: 'Kelas', href: '/master/kelas' },
                { title: 'Mata Pelajaran', href: '/master/mata-pelajaran' },
                { title: 'Ekstrakurikuler', href: '/master/ekstrakurikuler' },
                { title: 'KKM', href: '/master/kkm' },
            ]
        },
        {
            title: 'Pengaturan Sistem',
            href: '/pengaturan',
            icon: Settings,
            items: [
                { title: 'Pengaturan Kelas', href: '/pengaturan/kelas' },
                { title: 'Pengaturan Wali Kelas', href: '/pengaturan/wali-kelas' },
                { title: 'Pengaturan Mata Pelajaran', href: '/pengaturan/mata-pelajaran' },
                { title: 'Reset Tahun Akademik', href: '/pengaturan/reset-tahun' },
            ]
        },
    ];
    
    // Menu untuk Kepala Sekolah
    const kepalaSekolahMenu: NavItem[] = [
        {
            title: 'Monitoring Sekolah',
            href: '/monitoring',
            icon: BarChart3,
            items: [
                { title: 'Overview Akademik', href: '/monitoring/overview' },
                { title: 'Statistik Nilai', href: '/monitoring/statistik' },
                { title: 'Laporan Bulanan', href: '/monitoring/laporan' },
                { title: 'Data Prestasi', href: '/monitoring/prestasi' },
            ]
        },
        {
            title: 'Statistik & Monitoring',
            href: '/statistik',
            icon: BarChart3,
            items: [
                { title: 'Overview Sekolah', href: '/statistik/overview' },
                { title: 'Trend Nilai', href: '/statistik/trend' },
                { title: 'Analisis Performa', href: '/statistik/performa' },
                { title: 'Monitoring Real-time', href: '/statistik/monitoring' },
            ]
        },
    ];
    
    // Menu untuk Guru
    const guruMenu: NavItem[] = [
        {
            title: 'Pengajaran',
            href: '/pengajaran',
            icon: GraduationCap,
            items: [
                { title: 'Kelas Mengajar', href: '/pengajaran/kelas' },
                { title: 'Jadwal Mengajar', href: '/pengajaran/jadwal' },
                { title: 'Penugasan', href: '/pengajaran/penugasan' },
            ]
        },
        {
            title: 'Input Penilaian',
            href: '/penilaian',
            icon: ClipboardList,
        },
    ];

    // Menu untuk Wali Kelas (guru + wali kelas specific)
    const waliKelasMenu: NavItem[] = [
        ...guruMenu,
        {
            title: 'Wali Kelas',
            href: '/wali-kelas',
            icon: UserCheck,
            items: [
                { title: 'Siswa Kelas', href: '/wali-kelas/siswa' },
                { title: 'Rekap Nilai Kelas', href: '/wali-kelas/rekap-nilai' },
                { title: 'Monitoring Absensi', href: '/wali-kelas/monitoring-absensi' },
                { title: 'Catatan Wali Kelas', href: '/wali-kelas/catatan' },
            ]
        },
    ];
    
    // Menu untuk Siswa
    const siswaMenu: NavItem[] = [
        {
            title: 'Akademik Saya',
            href: '/siswa',
            icon: BookMarked,
        },
        {
            title: 'Profil Akademik',
            href: '/siswa/profil',
            icon: Award,
            items: [
                { title: 'Analisis Nilai', href: '/siswa/analisis' },
                { title: 'Rekomendasi K-Means', href: '/siswa/rekomendasi' },
                { title: 'Progress Belajar', href: '/siswa/progress' },
            ]
        },
    ];

    // Menu untuk Wali Murid
    const waliMuridMenu: NavItem[] = [
        {
            title: 'Pantau Anak',
            href: '/wali-murid',
            icon: TrendingUp,
            items: [
                { title: 'Dashboard Nilai Anak', href: '/wali-murid/dashboard' },
                { title: 'Nilai Pengetahuan', href: '/wali-murid/nilai-pengetahuan' },
                { title: 'Nilai Keterampilan', href: '/wali-murid/nilai-keterampilan' },
                { title: 'Nilai Sikap', href: '/wali-murid/nilai-sikap' },
                { title: 'Nilai Ekstrakurikuler', href: '/wali-murid/nilai-ekstrakurikuler' },
                { title: 'Absensi Anak', href: '/wali-murid/absensi' },
                { title: 'Prestasi Anak', href: '/wali-murid/prestasi' },
                { title: 'Progress Akademik', href: '/wali-murid/progress' },
            ]
        },
    ];

    // Menu K-Means Clustering (untuk role tertentu)
    const clusteringMenu: NavItem[] = [
        {
            title: 'Analisis K-Means',
            href: '/clustering',
            icon: Brain,
            items: [
                { title: 'Clustering Siswa', href: '/clustering/analisis' },
                { title: 'Profil Cluster', href: '/clustering/profil' },
                { title: 'Visualisasi Data', href: '/clustering/visualisasi' },
                { title: 'Konfigurasi Clustering', href: '/clustering/konfigurasi' },
            ]
        },
    ];

    // Menu Laporan (untuk role tertentu)
    const laporanMenu: NavItem[] = [
        {
            title: 'Laporan & Raport',
            href: '/laporan',
            icon: FileText,
            items: [
                { title: 'Cetak Raport', href: '/raport' },
                { title: 'Rekap Nilai', href: '/laporan/rekap-nilai' },
                { title: 'Laporan Prestasi Siswa', href: '/laporan/prestasi' },
                { title: 'Laporan Absensi', href: '/laporan/absensi' },
                { title: 'Export Data', href: '/laporan/export' },
            ]
        },
    ];
    
    // Menentukan menu yang akan ditampilkan berdasarkan role
    let mainNavItems = [...dashboardMenu];
    
    if (roles.includes('super-admin') || roles.includes('admin-sekolah')) {
        mainNavItems = [...mainNavItems, ...adminMenu, ...clusteringMenu, ...laporanMenu];
        
        // Tambah menu statistik untuk admin
        if (roles.includes('super-admin') || roles.includes('admin-sekolah')) {
            mainNavItems.push({
                title: 'Statistik & Monitoring',
                href: '/statistik',
                icon: BarChart3,
                items: [
                    { title: 'Overview Sekolah', href: '/statistik/overview' },
                    { title: 'Trend Nilai', href: '/statistik/trend' },
                    { title: 'Analisis Performa', href: '/statistik/performa' },
                    { title: 'Monitoring Real-time', href: '/statistik/monitoring' },
                ]
            });
        }
    } else if (roles.includes('kepala-sekolah')) {
        mainNavItems = [...mainNavItems, ...kepalaSekolahMenu, ...clusteringMenu, ...laporanMenu];
    } else if (roles.includes('wali-kelas')) {
        mainNavItems = [...mainNavItems, ...waliKelasMenu, ...clusteringMenu, ...laporanMenu];
    } else if (roles.includes('guru')) {
        mainNavItems = [...mainNavItems, ...guruMenu, ...clusteringMenu, ...laporanMenu];
    } else if (roles.includes('siswa')) {
        mainNavItems = [...mainNavItems, ...siswaMenu];
    } else if (roles.includes('wali-murid')) {
        mainNavItems = [...mainNavItems, ...waliMuridMenu];
    }

    const footerNavItems: NavItem[] = [
        // {
        //     title: 'Bantuan',
        //     href: '/help',
        //     icon: BookOpen,
        // },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
