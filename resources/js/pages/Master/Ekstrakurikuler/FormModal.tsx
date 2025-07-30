import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
}

interface Guru {
    id: number;
    user: User;
}

interface Ekstrakurikuler {
    id: number;
    nama_ekstrakurikuler: string;
    deskripsi?: string;
    pembina_id: number;
    status_aktif: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ekstrakurikuler?: Ekstrakurikuler | null;
    gurus: Guru[];
}

export default function FormModal({ isOpen, onClose, ekstrakurikuler, gurus }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_ekstrakurikuler: '',
        deskripsi: '',
        pembina_id: '',
        status_aktif: true as boolean,
    });

    useEffect(() => {
        if (ekstrakurikuler) {
            setData({
                nama_ekstrakurikuler: ekstrakurikuler.nama_ekstrakurikuler,
                deskripsi: ekstrakurikuler.deskripsi || '',
                pembina_id: ekstrakurikuler.pembina_id.toString(),
                status_aktif: ekstrakurikuler.status_aktif,
            });
        } else {
            reset();
        }
    }, [ekstrakurikuler, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            toast.success(
                ekstrakurikuler ? 'Data ekstrakurikuler berhasil diperbarui' : 'Data ekstrakurikuler berhasil ditambahkan',
                {
                    position: 'top-right',
                }
            );
            onClose();
        };

        const onError = () => {
            toast.error('Terjadi kesalahan saat menyimpan data', {
                position: 'top-right',
            });
        };

        if (ekstrakurikuler) {
            put(route('master.ekstrakurikuler.update', ekstrakurikuler.id), {
                onSuccess,
                onError,
            });
        } else {
            post(route('master.ekstrakurikuler.store'), {
                onSuccess,
                onError,
            });
        }
    };

    const handleDelete = () => {
        if (!ekstrakurikuler) return;

        if (confirm('Apakah Anda yakin ingin menghapus ekstrakurikuler ini?')) {
            const deleteForm = useForm();
            deleteForm.delete(route('master.ekstrakurikuler.destroy', ekstrakurikuler.id), {
                onSuccess: () => {
                    toast.success('Data ekstrakurikuler berhasil dihapus', {
                        position: 'top-right',
                    });
                    onClose();
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menghapus data', {
                        position: 'top-right',
                    });
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {ekstrakurikuler ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama_ekstrakurikuler">Nama Ekstrakurikuler</Label>
                        <Input
                            id="nama_ekstrakurikuler"
                            type="text"
                            value={data.nama_ekstrakurikuler}
                            onChange={(e) => setData('nama_ekstrakurikuler', e.target.value)}
                            className={errors.nama_ekstrakurikuler ? 'border-red-500' : ''}
                            placeholder="Contoh: Pramuka"
                        />
                        {errors.nama_ekstrakurikuler && (
                            <p className="text-sm text-red-500">{errors.nama_ekstrakurikuler}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pembina_id">Pembina</Label>
                        <Select
                            value={data.pembina_id}
                            onValueChange={(value) => setData('pembina_id', value)}
                        >
                            <SelectTrigger className={errors.pembina_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih pembina" />
                            </SelectTrigger>
                            <SelectContent>
                                {gurus.map((guru) => (
                                    <SelectItem key={guru.id} value={guru.id.toString()}>
                                        {guru.user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.pembina_id && (
                            <p className="text-sm text-red-500">{errors.pembina_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                        <textarea
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                errors.deskripsi ? 'border-red-500' : ''
                            }`}
                            placeholder="Deskripsi ekstrakurikuler..."
                            maxLength={1000}
                        />
                        {errors.deskripsi && (
                            <p className="text-sm text-red-500">{errors.deskripsi}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="status_aktif"
                            checked={data.status_aktif}
                            onCheckedChange={(checked) => setData('status_aktif', !!checked)}
                        />
                        <Label htmlFor="status_aktif">Status Aktif</Label>
                    </div>

                    <div className="flex justify-between pt-4">
                        <div>
                            {ekstrakurikuler && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={processing}
                                >
                                    Hapus
                                </Button>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
