import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GuruFormData {
    [key: string]: any;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    nip: string;
    nomor_telepon: string;
    alamat: string;
    tanggal_lahir: string;
    spesialisasi_mapel: string;
    role: string;
}

interface GuruFormModalProps {
    children: React.ReactNode;
    guru?: any;
    mode?: 'create' | 'edit';
}

export function GuruFormModal({ children, guru, mode = 'create' }: GuruFormModalProps) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm<GuruFormData>({
        name: guru?.name || '',
        email: guru?.email || '',
        password: '',
        password_confirmation: '',
        nip: guru?.guru?.nip || '',
        nomor_telepon: guru?.guru?.nomor_telepon || '',
        alamat: guru?.guru?.alamat || '',
        tanggal_lahir: guru?.guru?.tanggal_lahir || '',
        spesialisasi_mapel: guru?.guru?.spesialisasi_mapel || '',
        role: guru?.roles?.[0]?.name || 'guru',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitAction = mode === 'create' ? post : put;
        const url = mode === 'create' ? '/pengguna/guru' : `/pengguna/guru/${guru.id}`;
        
        submitAction(url, {
            onSuccess: () => {
                toast.success(
                    mode === 'create' 
                        ? 'Data guru berhasil ditambahkan' 
                        : 'Data guru berhasil diperbarui'
                );
                setOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat menyimpan data');
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Tambah Guru Baru' : 'Edit Data Guru'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' 
                            ? 'Masukkan data guru baru. Klik simpan untuk menambahkan data.'
                            : 'Ubah data guru. Klik simpan untuk menyimpan perubahan.'
                        }
                    </DialogDescription>
                </DialogHeader>
                
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                            <FormField>
                                <FormLabel htmlFor="name">Nama Lengkap *</FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </FormControl>
                                {errors.name && <FormMessage>{errors.name}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="email">Email *</FormLabel>
                                <FormControl>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukkan email"
                                    />
                                </FormControl>
                                {errors.email && <FormMessage>{errors.email}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="nip">NIP *</FormLabel>
                                <FormControl>
                                    <Input
                                        id="nip"
                                        type="text"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                        placeholder="Masukkan NIP"
                                    />
                                </FormControl>
                                {errors.nip && <FormMessage>{errors.nip}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="nomor_telepon">No. Telepon</FormLabel>
                                <FormControl>
                                    <Input
                                        id="nomor_telepon"
                                        type="text"
                                        value={data.nomor_telepon}
                                        onChange={(e) => setData('nomor_telepon', e.target.value)}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </FormControl>
                                {errors.nomor_telepon && <FormMessage>{errors.nomor_telepon}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="role">Role *</FormLabel>
                                <FormControl>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="guru">Guru</SelectItem>
                                            <SelectItem value="wali-kelas">Wali Kelas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                {errors.role && <FormMessage>{errors.role}</FormMessage>}
                            </FormField>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">
                            {mode === 'create' && (
                                <>
                                    <FormField>
                                        <FormLabel htmlFor="password">Password *</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Masukkan password"
                                            />
                                        </FormControl>
                                        {errors.password && <FormMessage>{errors.password}</FormMessage>}
                                    </FormField>

                                    <FormField>
                                        <FormLabel htmlFor="password_confirmation">Konfirmasi Password *</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Konfirmasi password"
                                            />
                                        </FormControl>
                                        {errors.password_confirmation && <FormMessage>{errors.password_confirmation}</FormMessage>}
                                    </FormField>
                                </>
                            )}

                            <FormField>
                                <FormLabel htmlFor="tanggal_lahir">Tanggal Lahir</FormLabel>
                                <FormControl>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    />
                                </FormControl>
                                {errors.tanggal_lahir && <FormMessage>{errors.tanggal_lahir}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="spesialisasi_mapel">Spesialisasi Mata Pelajaran</FormLabel>
                                <FormControl>
                                    <Input
                                        id="spesialisasi_mapel"
                                        type="text"
                                        value={data.spesialisasi_mapel}
                                        onChange={(e) => setData('spesialisasi_mapel', e.target.value)}
                                        placeholder="Contoh: Matematika, Bahasa Indonesia"
                                    />
                                </FormControl>
                                {errors.spesialisasi_mapel && <FormMessage>{errors.spesialisasi_mapel}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="alamat">Alamat</FormLabel>
                                <FormControl>
                                    <textarea
                                        id="alamat"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Masukkan alamat lengkap"
                                    />
                                </FormControl>
                                {errors.alamat && <FormMessage>{errors.alamat}</FormMessage>}
                            </FormField>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
