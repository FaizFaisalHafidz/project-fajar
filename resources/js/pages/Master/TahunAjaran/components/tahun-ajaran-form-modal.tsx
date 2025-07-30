import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean;
}

interface TahunAjaranFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    tahunAjaran?: TahunAjaran | null;
}

interface TahunAjaranFormData {
    nama_tahun_ajaran: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean;
    [key: string]: string | boolean;
}

export function TahunAjaranFormModal({
    isOpen,
    onClose,
    tahunAjaran,
}: TahunAjaranFormModalProps) {
    const isEdit = !!tahunAjaran;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<TahunAjaranFormData>({
        nama_tahun_ajaran: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status_aktif: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (isEdit && tahunAjaran) {
                setFormData({
                    nama_tahun_ajaran: tahunAjaran.nama_tahun_ajaran,
                    tanggal_mulai: tahunAjaran.tanggal_mulai,
                    tanggal_selesai: tahunAjaran.tanggal_selesai,
                    status_aktif: tahunAjaran.status_aktif,
                });
            } else {
                setFormData({
                    nama_tahun_ajaran: '',
                    tanggal_mulai: '',
                    tanggal_selesai: '',
                    status_aktif: false,
                });
            }
            setErrors({});
        }
    }, [isOpen, isEdit, tahunAjaran]);

    const handleInputChange = (field: keyof TahunAjaranFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nama_tahun_ajaran.trim()) {
            newErrors.nama_tahun_ajaran = 'Nama tahun ajaran harus diisi';
        }

        if (!formData.tanggal_mulai) {
            newErrors.tanggal_mulai = 'Tanggal mulai harus diisi';
        }

        if (!formData.tanggal_selesai) {
            newErrors.tanggal_selesai = 'Tanggal selesai harus diisi';
        }

        if (formData.tanggal_mulai && formData.tanggal_selesai) {
            if (new Date(formData.tanggal_selesai) <= new Date(formData.tanggal_mulai)) {
                newErrors.tanggal_selesai = 'Tanggal selesai harus setelah tanggal mulai';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        if (isEdit && tahunAjaran) {
            router.put(`/master/tahun-akademik/${tahunAjaran.id}`, formData, {
                onSuccess: () => {
                    toast.success('Data tahun ajaran berhasil diperbarui');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                    toast.error('Gagal memperbarui data tahun ajaran');
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/master/tahun-akademik', formData, {
                onSuccess: () => {
                    toast.success('Data tahun ajaran berhasil ditambahkan');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                    toast.error('Gagal menambahkan data tahun ajaran');
                },
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Perbarui informasi tahun ajaran'
                            : 'Tambahkan tahun ajaran baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama_tahun_ajaran">Nama Tahun Ajaran</Label>
                        <Input
                            id="nama_tahun_ajaran"
                            placeholder="Contoh: 2023/2024"
                            value={formData.nama_tahun_ajaran}
                            onChange={(e) => handleInputChange('nama_tahun_ajaran', e.target.value)}
                            className={errors.nama_tahun_ajaran ? 'border-red-500' : ''}
                        />
                        {errors.nama_tahun_ajaran && (
                            <p className="text-sm text-red-500">{errors.nama_tahun_ajaran}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                        <Input
                            id="tanggal_mulai"
                            type="date"
                            value={formData.tanggal_mulai}
                            onChange={(e) => handleInputChange('tanggal_mulai', e.target.value)}
                            className={errors.tanggal_mulai ? 'border-red-500' : ''}
                        />
                        {errors.tanggal_mulai && (
                            <p className="text-sm text-red-500">{errors.tanggal_mulai}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                        <Input
                            id="tanggal_selesai"
                            type="date"
                            value={formData.tanggal_selesai}
                            onChange={(e) => handleInputChange('tanggal_selesai', e.target.value)}
                            className={errors.tanggal_selesai ? 'border-red-500' : ''}
                        />
                        {errors.tanggal_selesai && (
                            <p className="text-sm text-red-500">{errors.tanggal_selesai}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <input
                            id="status_aktif"
                            type="checkbox"
                            checked={formData.status_aktif}
                            onChange={(e) => handleInputChange('status_aktif', e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="status_aktif" className="text-base font-medium">
                                Status Aktif
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Tahun ajaran yang sedang berjalan
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
