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

interface SiswaFormData {
    [key: string]: any;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    nisn: string;
    nis: string;
    nomor_telepon: string;
    alamat: string;
    tanggal_lahir: string;
    tempat_lahir: string;
    jenis_kelamin: string;
    id_kelas: string;
    role: string;
}

interface SiswaFormModalProps {
    children: React.ReactNode;
    siswa?: any;
    mode?: 'create' | 'edit';
    kelasList?: Array<{ id: number; nama_kelas: string; jurusan: { nama_jurusan: string } }>;
}

export function SiswaFormModal({ children, siswa, mode = 'create', kelasList = [] }: SiswaFormModalProps) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm<SiswaFormData>({
        name: siswa?.name || '',
        email: siswa?.email || '',
        password: '',
        password_confirmation: '',
        nisn: siswa?.siswa?.nisn || '',
        nis: siswa?.siswa?.nis || '',
        nomor_telepon: siswa?.siswa?.telepon_orangtua || '',
        alamat: siswa?.siswa?.alamat || '',
        tanggal_lahir: siswa?.siswa?.tanggal_lahir || '',
        tempat_lahir: siswa?.siswa?.tempat_lahir || '',
        jenis_kelamin: siswa?.siswa?.jenis_kelamin || '',
        id_kelas: siswa?.siswa?.kelas_id?.toString() || '',
        role: 'siswa',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitAction = mode === 'create' ? post : put;
        const url = mode === 'create' ? '/pengguna/siswa' : `/pengguna/siswa/${siswa.id}`;
        
        submitAction(url, {
            onSuccess: () => {
                toast.success(
                    mode === 'create' 
                        ? 'Data siswa berhasil ditambahkan' 
                        : 'Data siswa berhasil diperbarui'
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
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Tambah Siswa Baru' : 'Edit Data Siswa'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' 
                            ? 'Masukkan data siswa baru. Klik simpan untuk menambahkan data.'
                            : 'Ubah data siswa. Klik simpan untuk menyimpan perubahan.'
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

                            <div className="grid grid-cols-2 gap-2">
                                <FormField>
                                    <FormLabel htmlFor="nisn">NISN *</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="nisn"
                                            type="text"
                                            value={data.nisn}
                                            onChange={(e) => setData('nisn', e.target.value)}
                                            placeholder="NISN"
                                        />
                                    </FormControl>
                                    {errors.nisn && <FormMessage>{errors.nisn}</FormMessage>}
                                </FormField>

                                <FormField>
                                    <FormLabel htmlFor="nis">NIS *</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="nis"
                                            type="text"
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                            placeholder="NIS"
                                        />
                                    </FormControl>
                                    {errors.nis && <FormMessage>{errors.nis}</FormMessage>}
                                </FormField>
                            </div>

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

                            <div className="grid grid-cols-2 gap-2">
                                <FormField>
                                    <FormLabel htmlFor="tempat_lahir">Tempat Lahir</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="tempat_lahir"
                                            type="text"
                                            value={data.tempat_lahir}
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            placeholder="Tempat lahir"
                                        />
                                    </FormControl>
                                    {errors.tempat_lahir && <FormMessage>{errors.tempat_lahir}</FormMessage>}
                                </FormField>

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
                            </div>
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
                                <FormLabel htmlFor="jenis_kelamin">Jenis Kelamin *</FormLabel>
                                <FormControl>
                                    <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                {errors.jenis_kelamin && <FormMessage>{errors.jenis_kelamin}</FormMessage>}
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="id_kelas">Kelas *</FormLabel>
                                <FormControl>
                                    <Select value={data.id_kelas} onValueChange={(value) => setData('id_kelas', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelasList.map((kelas) => (
                                                <SelectItem key={kelas.id} value={kelas.id.toString()}>
                                                    {kelas.nama_kelas} - {kelas.jurusan.nama_jurusan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                {errors.id_kelas && <FormMessage>{errors.id_kelas}</FormMessage>}
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
