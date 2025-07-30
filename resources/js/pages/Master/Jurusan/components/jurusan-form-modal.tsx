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

interface Jurusan {
    id: number;
    kode_jurusan: string;
    nama_jurusan: string;
    deskripsi: string | null;
    kelas_count: number;
}

interface JurusanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    jurusan?: Jurusan | null;
}

interface JurusanFormData {
    kode_jurusan: string;
    nama_jurusan: string;
    deskripsi: string;
    [key: string]: string;
}

export function JurusanFormModal({
    isOpen,
    onClose,
    jurusan,
}: JurusanFormModalProps) {
    const isEdit = !!jurusan;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<JurusanFormData>({
        kode_jurusan: '',
        nama_jurusan: '',
        deskripsi: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (isEdit && jurusan) {
                setFormData({
                    kode_jurusan: jurusan.kode_jurusan,
                    nama_jurusan: jurusan.nama_jurusan,
                    deskripsi: jurusan.deskripsi || '',
                });
            } else {
                setFormData({
                    kode_jurusan: '',
                    nama_jurusan: '',
                    deskripsi: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, isEdit, jurusan]);

    const handleInputChange = (field: keyof JurusanFormData, value: string) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: field === 'kode_jurusan' ? value.toUpperCase() : value 
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.kode_jurusan.trim()) {
            newErrors.kode_jurusan = 'Kode jurusan harus diisi';
        } else if (formData.kode_jurusan.length > 10) {
            newErrors.kode_jurusan = 'Kode jurusan maksimal 10 karakter';
        }

        if (!formData.nama_jurusan.trim()) {
            newErrors.nama_jurusan = 'Nama jurusan harus diisi';
        } else if (formData.nama_jurusan.length > 255) {
            newErrors.nama_jurusan = 'Nama jurusan maksimal 255 karakter';
        }

        if (formData.deskripsi && formData.deskripsi.length > 1000) {
            newErrors.deskripsi = 'Deskripsi maksimal 1000 karakter';
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

        const submitData = {
            ...formData,
            deskripsi: formData.deskripsi || null,
        };

        if (isEdit && jurusan) {
            router.put(`/master/jurusan/${jurusan.id}`, submitData, {
                onSuccess: () => {
                    toast.success('Data jurusan berhasil diperbarui');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                    toast.error('Gagal memperbarui data jurusan');
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/master/jurusan', submitData, {
                onSuccess: () => {
                    toast.success('Data jurusan berhasil ditambahkan');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                    toast.error('Gagal menambahkan data jurusan');
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
                        {isEdit ? 'Edit Jurusan' : 'Tambah Jurusan'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Perbarui informasi jurusan'
                            : 'Tambahkan jurusan baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="kode_jurusan">Kode Jurusan</Label>
                        <Input
                            id="kode_jurusan"
                            placeholder="Contoh: TKJ, RPL, MM"
                            value={formData.kode_jurusan}
                            onChange={(e) => handleInputChange('kode_jurusan', e.target.value)}
                            className={errors.kode_jurusan ? 'border-red-500' : ''}
                            maxLength={10}
                        />
                        {errors.kode_jurusan && (
                            <p className="text-sm text-red-500">{errors.kode_jurusan}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_jurusan">Nama Jurusan</Label>
                        <Input
                            id="nama_jurusan"
                            placeholder="Contoh: Teknik Komputer dan Jaringan"
                            value={formData.nama_jurusan}
                            onChange={(e) => handleInputChange('nama_jurusan', e.target.value)}
                            className={errors.nama_jurusan ? 'border-red-500' : ''}
                            maxLength={255}
                        />
                        {errors.nama_jurusan && (
                            <p className="text-sm text-red-500">{errors.nama_jurusan}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                        <textarea
                            id="deskripsi"
                            placeholder="Deskripsi singkat tentang jurusan..."
                            value={formData.deskripsi}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('deskripsi', e.target.value)}
                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.deskripsi ? 'border-red-500' : ''}`}
                            rows={3}
                            maxLength={1000}
                        />
                        <div className="flex justify-between items-center">
                            {errors.deskripsi && (
                                <p className="text-sm text-red-500">{errors.deskripsi}</p>
                            )}
                            <p className="text-xs text-muted-foreground ml-auto">
                                {formData.deskripsi.length}/1000
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
