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

interface WaliMuridFormData {
    [key: string]: any;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    nomor_telepon: string;
    alamat: string;
    pekerjaan: string;
    id_siswa: string;
    role: string;
}

interface WaliMuridFormModalProps {
    children: React.ReactNode;
    waliMurid?: any;
    mode?: 'create' | 'edit';
    siswaList?: Array<{ id: number; name: string; siswa: { nisn: string } }>;
}

export function WaliMuridFormModal({ children, waliMurid, mode = 'create', siswaList = [] }: WaliMuridFormModalProps) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm<WaliMuridFormData>({
        name: waliMurid?.name || '',
        email: waliMurid?.email || '',
        password: '',
        password_confirmation: '',
        nomor_telepon: waliMurid?.orangTua?.nomor_telepon || '',
        alamat: waliMurid?.orangTua?.alamat || '',
        pekerjaan: waliMurid?.orangTua?.pekerjaan || '',
        id_siswa: waliMurid?.orangTua?.siswa_id?.toString() || '',
        role: 'wali-murid',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitAction = mode === 'create' ? post : put;
        const url = mode === 'create' ? '/pengguna/wali-murid' : `/pengguna/wali-murid/${waliMurid.id}`;
        
        submitAction(url, {
            onSuccess: () => {
                toast.success(
                    mode === 'create' 
                        ? 'Data wali murid berhasil ditambahkan' 
                        : 'Data wali murid berhasil diperbarui'
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
                        {mode === 'create' ? 'Tambah Wali Murid Baru' : 'Edit Data Wali Murid'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' 
                            ? 'Masukkan data wali murid baru. Klik simpan untuk menambahkan data.'
                            : 'Ubah data wali murid. Klik simpan untuk menyimpan perubahan.'
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
                                <FormLabel htmlFor="pekerjaan">Pekerjaan</FormLabel>
                                <FormControl>
                                    <Input
                                        id="pekerjaan"
                                        type="text"
                                        value={data.pekerjaan}
                                        onChange={(e) => setData('pekerjaan', e.target.value)}
                                        placeholder="Masukkan pekerjaan"
                                    />
                                </FormControl>
                                {errors.pekerjaan && <FormMessage>{errors.pekerjaan}</FormMessage>}
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
                                <FormLabel htmlFor="id_siswa">Siswa *</FormLabel>
                                <FormControl>
                                    <Select value={data.id_siswa} onValueChange={(value) => setData('id_siswa', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih siswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {siswaList.map((siswa) => (
                                                <SelectItem key={siswa.id} value={siswa.id.toString()}>
                                                    {siswa.name} - {siswa.siswa.nisn}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                {errors.id_siswa && <FormMessage>{errors.id_siswa}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="alamat">Alamat</FormLabel>
                                <FormControl>
                                    <textarea
                                        id="alamat"
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
