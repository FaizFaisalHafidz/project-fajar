import { Head, useForm } from '@inertiajs/react';
import { GraduationCap, LoaderCircle, School } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <Head title="Log in" />
            
            <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
                    <div className="text-center space-y-6">
                        {/* Logo SMK */}
                        <div className="flex justify-center">
                            <img 
                                src="https://neoflash.sgp1.cdn.digitaloceanspaces.com/logo-smk-mohammad-toha.png" 
                                alt="Logo SMK Mohammad Toha" 
                                className="w-32 h-32 object-contain drop-shadow-lg"
                            />
                        </div>
                        
                        {/* School Info */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-800">SMK Mohammad Toha</h1>
                            <p className="text-lg text-gray-600">Sistem Informasi Akademik</p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <School className="h-4 w-4" />
                                <span>Portal Akademik Digital</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mt-8">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <GraduationCap className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-800">Manajemen Akademik</p>
                                    <p className="text-xs text-gray-600">Kelola nilai dan prestasi siswa</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <School className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-800">Analisis K-Means</p>
                                    <p className="text-xs text-gray-600">Clustering dan rekomendasi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full max-w-md mx-auto">
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center space-y-4">
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex justify-center">
                                <img 
                                    src="https://neoflash.sgp1.cdn.digitaloceanspaces.com/logo-smk-mohammad-toha.png" 
                                    alt="Logo SMK Mohammad Toha" 
                                    className="w-20 h-20 object-contain"
                                />
                            </div>
                            
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-800">
                                    Masuk ke Akun Anda
                                </CardTitle>
                                <CardDescription className="text-gray-600 mt-2">
                                    Masukkan email dan password untuk mengakses sistem
                                </CardDescription>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-800">{status}</p>
                                </div>
                            )}
                        </CardHeader>
                        
                        <CardContent>
                            <form className="space-y-6" onSubmit={submit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="nama@smk-mohammadtoha.sch.id"
                                            className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-gray-700 font-medium">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink 
                                                    href={route('password.request')} 
                                                    className="text-sm text-blue-600 hover:text-blue-800" 
                                                    tabIndex={5}
                                                >
                                                    Lupa password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Masukkan password Anda"
                                            className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onClick={() => setData('remember', !data.remember)}
                                            tabIndex={3}
                                            className="border-gray-300"
                                        />
                                        <Label htmlFor="remember" className="text-gray-700 text-sm">
                                            Ingat saya
                                        </Label>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors" 
                                    tabIndex={4} 
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    {processing ? 'Masuk...' : 'Masuk'}
                                </Button>
                            </form>

                            {/* Footer Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center space-y-2">
                                    <p className="text-xs text-gray-500">
                                        Akun diberikan oleh pihak sekolah
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Hubungi admin sekolah jika mengalami kendala
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
