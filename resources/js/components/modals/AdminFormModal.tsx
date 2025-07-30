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

interface AdminFormData {
    [key: string]: any;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: string;
}

interface AdminFormModalProps {
    children: React.ReactNode;
    admin?: any;
    mode?: 'create' | 'edit';
}

export function AdminFormModal({ children, admin, mode = 'create' }: AdminFormModalProps) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm<AdminFormData>({
        name: admin?.name || '',
        email: admin?.email || '',
        password: '',
        password_confirmation: '',
        role: admin?.roles?.[0]?.name || 'admin',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitAction = mode === 'create' ? post : put;
        const url = mode === 'create' ? '/pengguna/admin' : `/pengguna/admin/${admin.id}`;
        
        submitAction(url, {
            onSuccess: () => {
                toast.success(
                    mode === 'create' 
                        ? 'Data admin berhasil ditambahkan' 
                        : 'Data admin berhasil diperbarui'
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Tambah Admin Baru' : 'Edit Data Admin'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' 
                            ? 'Masukkan data admin baru. Klik simpan untuk menambahkan data.'
                            : 'Ubah data admin. Klik simpan untuk menyimpan perubahan.'
                        }
                    </DialogDescription>
                </DialogHeader>
                
                <Form onSubmit={handleSubmit}>
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
                            <FormLabel htmlFor="role">Role *</FormLabel>
                            <FormControl>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super-admin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            {errors.role && <FormMessage>{errors.role}</FormMessage>}
                        </FormField>
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
