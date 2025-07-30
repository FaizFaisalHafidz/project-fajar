import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface MataPelajaran {
    id: number;
    kode_mapel: string;
    nama_mapel: string;
    deskripsi?: string;
    jam_pelajaran: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mataPelajaran?: MataPelajaran | null;
}

interface MataPelajaranFormData {
    kode_mapel: string;
    nama_mapel: string;
    deskripsi: string;
    jam_pelajaran: number;
}

export default function FormModal({ isOpen, onClose, mataPelajaran }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        kode_mapel: '',
        nama_mapel: '',
        deskripsi: '',
        jam_pelajaran: 1,
    });

    useEffect(() => {
        if (mataPelajaran) {
            setData({
                kode_mapel: mataPelajaran.kode_mapel,
                nama_mapel: mataPelajaran.nama_mapel,
                deskripsi: mataPelajaran.deskripsi || '',
                jam_pelajaran: mataPelajaran.jam_pelajaran,
            });
        } else {
            reset();
        }
    }, [mataPelajaran, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            toast.success(
                mataPelajaran ? 'Data mata pelajaran berhasil diperbarui' : 'Data mata pelajaran berhasil ditambahkan',
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

        if (mataPelajaran) {
            put(route('master.mata-pelajaran.update', mataPelajaran.id), {
                onSuccess,
                onError,
            });
        } else {
            post(route('master.mata-pelajaran.store'), {
                onSuccess,
                onError,
            });
        }
    };

    const handleDelete = () => {
        if (!mataPelajaran) return;

        if (confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) {
            const deleteForm = useForm();
            deleteForm.delete(route('master.mata-pelajaran.destroy', mataPelajaran.id), {
                onSuccess: () => {
                    toast.success('Data mata pelajaran berhasil dihapus', {
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
                        {mataPelajaran ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="kode_mapel">Kode Mata Pelajaran</Label>
                        <Input
                            id="kode_mapel"
                            type="text"
                            value={data.kode_mapel}
                            onChange={(e) => setData('kode_mapel', e.target.value.toUpperCase())}
                            className={errors.kode_mapel ? 'border-red-500' : ''}
                            placeholder="Contoh: MAT"
                            maxLength={20}
                        />
                        {errors.kode_mapel && (
                            <p className="text-sm text-red-500">{errors.kode_mapel}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_mapel">Nama Mata Pelajaran</Label>
                        <Input
                            id="nama_mapel"
                            type="text"
                            value={data.nama_mapel}
                            onChange={(e) => setData('nama_mapel', e.target.value)}
                            className={errors.nama_mapel ? 'border-red-500' : ''}
                            placeholder="Contoh: Matematika"
                        />
                        {errors.nama_mapel && (
                            <p className="text-sm text-red-500">{errors.nama_mapel}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jam_pelajaran">Jam Pelajaran</Label>
                        <Input
                            id="jam_pelajaran"
                            type="number"
                            min="1"
                            max="10"
                            value={data.jam_pelajaran}
                            onChange={(e) => setData('jam_pelajaran', parseInt(e.target.value) || 1)}
                            className={errors.jam_pelajaran ? 'border-red-500' : ''}
                        />
                        {errors.jam_pelajaran && (
                            <p className="text-sm text-red-500">{errors.jam_pelajaran}</p>
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
                            placeholder="Deskripsi mata pelajaran..."
                            maxLength={1000}
                        />
                        {errors.deskripsi && (
                            <p className="text-sm text-red-500">{errors.deskripsi}</p>
                        )}
                    </div>

                    <div className="flex justify-between pt-4">
                        <div>
                            {mataPelajaran && (
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
