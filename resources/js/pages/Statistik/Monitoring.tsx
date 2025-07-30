import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    BarChart3,
    Bell,
    BookOpen,
    CheckCircle,
    Clock,
    Eye,
    Target,
    Timer,
    TrendingUp,
    UserCheck,
    Users,
    XCircle,
    Zap
} from 'lucide-react';

interface Alert {
    id: number;
    type: 'warning' | 'danger' | 'info';
    message: string;
    entity_type: string;
    entity_name: string;
    created_at: string;
}

interface ActivityLog {
    id: number;
    user_name: string;
    activity: string;
    entity_type: string;
    entity_name: string;
    timestamp: string;
}

interface RealtimeStats {
    siswa_hadir_hari_ini: number;
    siswa_tidak_hadir: number;
    persentase_kehadiran: number;
    guru_aktif: number;
    kelas_berlangsung: number;
    nilai_input_hari_ini: number;
    prestasi_hari_ini: number;
    rata_rata_nilai_terbaru: number;
}

interface SystemHealth {
    status: 'excellent' | 'good' | 'warning' | 'critical';
    uptime: string;
    active_users: number;
    data_sync: string;
    last_backup: string;
}

interface Props {
    realtimeStats: RealtimeStats;
    alerts: Alert[];
    recentActivities: ActivityLog[];
    systemHealth: SystemHealth;
}

export default function StatistikMonitoring({ 
    realtimeStats,
    alerts,
    recentActivities,
    systemHealth
}: Props) {

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'danger': return 'border-red-200 bg-red-50';
            case 'warning': return 'border-yellow-200 bg-yellow-50';
            case 'info': return 'border-blue-200 bg-blue-50';
            default: return 'border-gray-200 bg-gray-50';
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'danger': return <XCircle className="h-4 w-4 text-red-600" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            case 'info': return <AlertCircle className="h-4 w-4 text-blue-600" />;
            default: return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    const getHealthStatus = (status: string) => {
        switch (status) {
            case 'excellent': return { color: 'text-green-600 bg-green-50', icon: <CheckCircle className="h-4 w-4" /> };
            case 'good': return { color: 'text-blue-600 bg-blue-50', icon: <CheckCircle className="h-4 w-4" /> };
            case 'warning': return { color: 'text-yellow-600 bg-yellow-50', icon: <AlertTriangle className="h-4 w-4" /> };
            case 'critical': return { color: 'text-red-600 bg-red-50', icon: <XCircle className="h-4 w-4" /> };
            default: return { color: 'text-gray-600 bg-gray-50', icon: <Activity className="h-4 w-4" /> };
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDateTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title="Monitoring Real-time" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Monitoring Real-time</h1>
                        <p className="text-muted-foreground">
                            Dashboard monitoring sistem dan aktivitas sekolah secara real-time
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Live</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date().toLocaleTimeString('id-ID')}
                        </Badge>
                    </div>
                </div>

                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Status Sistem
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${getHealthStatus(systemHealth?.status || 'good').color}`}>
                                    {getHealthStatus(systemHealth?.status || 'good').icon}
                                    <span className="font-semibold capitalize">{systemHealth?.status || 'good'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Status Sistem</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">{systemHealth?.uptime || '0h'}</p>
                                <p className="text-xs text-muted-foreground">Uptime</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-green-600">{systemHealth?.active_users || 0}</p>
                                <p className="text-xs text-muted-foreground">Pengguna Aktif</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-purple-600">{systemHealth?.data_sync || 'Normal'}</p>
                                <p className="text-xs text-muted-foreground">Sinkronisasi Data</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-orange-600">{systemHealth?.last_backup || 'Tidak ada'}</p>
                                <p className="text-xs text-muted-foreground">Backup Terakhir</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Real-time Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <UserCheck className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Kehadiran Hari Ini</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {realtimeStats?.siswa_hadir_hari_ini || 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {realtimeStats?.persentase_kehadiran || 0}% siswa hadir
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Guru Aktif</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {realtimeStats?.guru_aktif || 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {realtimeStats?.kelas_berlangsung || 0} kelas berlangsung
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-8 w-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Input Nilai Hari Ini</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {realtimeStats?.nilai_input_hari_ini || 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Rata-rata: {realtimeStats?.rata_rata_nilai_terbaru || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Target className="h-8 w-8 text-orange-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Prestasi Hari Ini</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {realtimeStats?.prestasi_hari_ini || 0}
                                    </p>
                                    <p className="text-xs text-green-600">
                                        <TrendingUp className="h-3 w-3 inline mr-1" />
                                        Pencapaian baru
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Alerts & Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Alerts & Notifikasi
                                {alerts && alerts.length > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                        {alerts.length}
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {alerts?.length > 0 ? (
                                    alerts.map((alert) => (
                                        <div key={alert.id} className={`flex items-start gap-3 p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
                                            {getAlertIcon(alert.type)}
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{alert.message}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {alert.entity_type}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {alert.entity_name}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatDateTime(alert.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                        <h4 className="font-semibold text-green-900 mb-2">Semua Berjalan Normal</h4>
                                        <p className="text-sm">Tidak ada alert atau notifikasi yang perlu ditangani.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivities?.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">
                                                <span className="font-medium text-blue-600">{activity.user_name}</span>
                                                {' '}{activity.activity}{' '}
                                                <span className="font-medium">{activity.entity_name}</span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    {activity.entity_type}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTime(activity.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Performa Sistem
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">CPU Usage</span>
                                    <span className="text-sm font-medium">23%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Memory</span>
                                    <span className="text-sm font-medium">67%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Database</span>
                                    <span className="text-sm font-medium">45%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Response Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">142ms</div>
                                    <p className="text-sm text-muted-foreground">Rata-rata response time</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-semibold text-blue-600">89ms</div>
                                        <p className="text-xs text-muted-foreground">Database</p>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-purple-600">53ms</div>
                                        <p className="text-xs text-muted-foreground">API</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Timer className="h-5 w-5" />
                                Aktivitas Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Login Guru</span>
                                    <span className="text-sm font-medium">24</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Input Nilai</span>
                                    <span className="text-sm font-medium">{realtimeStats?.nilai_input_hari_ini || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Absensi Tercatat</span>
                                    <span className="text-sm font-medium">{realtimeStats?.siswa_hadir_hari_ini || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Export Data</span>
                                    <span className="text-sm font-medium">8</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                <div className="flex flex-col items-center gap-2">
                                    <Users className="h-6 w-6 text-blue-600" />
                                    <span className="text-sm font-medium">Cek Kehadiran</span>
                                </div>
                            </button>
                            <button className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                                <div className="flex flex-col items-center gap-2">
                                    <BookOpen className="h-6 w-6 text-green-600" />
                                    <span className="text-sm font-medium">Input Nilai</span>
                                </div>
                            </button>
                            <button className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                                <div className="flex flex-col items-center gap-2">
                                    <BarChart3 className="h-6 w-6 text-purple-600" />
                                    <span className="text-sm font-medium">Export Data</span>
                                </div>
                            </button>
                            <button className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                                <div className="flex flex-col items-center gap-2">
                                    <Bell className="h-6 w-6 text-orange-600" />
                                    <span className="text-sm font-medium">Send Alert</span>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
