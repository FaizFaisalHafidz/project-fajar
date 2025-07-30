import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, School } from 'lucide-react';

export default function Register() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <Head title="Pendaftaran Tidak Tersedia" />
            
            <div className="w-full max-w-md mx-auto">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-4">
                        {/* Logo SMK */}
                        <div className="flex justify-center">
                            <img 
                                src="https://neoflash.sgp1.cdn.digitaloceanspaces.com/logo-smk-mohammad-toha.png" 
                                alt="Logo SMK Mohammad Toha" 
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                                <AlertTriangle className="h-6 w-6 text-amber-500" />
                                Pendaftaran Ditutup
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                SMK Mohammad Toha
                            </CardDescription>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <School className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div className="text-left">
                                        <h3 className="font-medium text-amber-800 mb-2">
                                            Akun Diberikan oleh Pihak Sekolah
                                        </h3>
                                        <p className="text-sm text-amber-700 leading-relaxed">
                                            Sistem ini tidak menyediakan pendaftaran mandiri. Setiap akun (siswa, guru, wali kelas, dan admin) akan diberikan langsung oleh pihak sekolah.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <p><strong>Untuk mendapatkan akun:</strong></p>
                                <ul className="text-left space-y-2 list-disc list-inside">
                                    <li>Siswa: Hubungi wali kelas atau tata usaha</li>
                                    <li>Guru: Hubungi admin sekolah atau kepala sekolah</li>
                                    <li>Orang tua: Hubungi wali kelas</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button 
                                onClick={() => window.location.href = route('login')}
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Halaman Login
                            </Button>
                        </div>

                        {/* Footer Info */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="text-center space-y-2">
                                <p className="text-xs text-gray-500">
                                    SMK Mohammad Toha - Sistem Informasi Akademik
                                </p>
                                <p className="text-xs text-gray-500">
                                    Hubungi: (021) xxx-xxxx atau email: admin@smk-mohammadtoha.sch.id
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
