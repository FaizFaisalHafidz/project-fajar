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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

interface Semester {
    id: number;
    tahun_ajaran_id: number;
    nama_semester: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean;
    tahun_ajaran: TahunAjaran;
}

interface SemesterFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    semester?: Semester | null;
    tahunAjaranList: TahunAjaran[];
}

interface SemesterFormData {
    tahun_ajaran_id: string;
    nama_semester: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean;
    [key: string]: string | boolean;
}

export function SemesterFormModal({
    isOpen,
    onClose,
    semester,
    tahunAjaranList,
}: SemesterFormModalProps) {
    const isEdit = !!semester;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<SemesterFormData>({
        tahun_ajaran_id: '',
        nama_semester: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status_aktif: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (isEdit && semester) {
                setFormData({
                    tahun_ajaran_id: semester.tahun_ajaran_id.toString(),
                    nama_semester: semester.nama_semester,
                    tanggal_mulai: semester.tanggal_mulai,
                    tanggal_selesai: semester.tanggal_selesai,
                    status_aktif: semester.status_aktif,
                });
            } else {
                setFormData({
                    tahun_ajaran_id: '',
                    nama_semester: '',
                    tanggal_mulai: '',
                    tanggal_selesai: '',
                    status_aktif: false,
                });
            }
            setErrors({});
        }
    }, [isOpen, isEdit, semester]);

    const handleInputChange = (field: keyof SemesterFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.tahun_ajaran_id) {
            newErrors.tahun_ajaran_id = 'Tahun ajaran harus dipilih';
        }

        if (!formData.nama_semester.trim()) {
            newErrors.nama_semester = 'Nama semester harus diisi';
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

        const submitData = {
            ...formData,
            tahun_ajaran_id: parseInt(formData.tahun_ajaran_id),
        };

        if (isEdit && semester) {
            router.put(`/master/semester/${semester.id}`, submitData, {
                onSuccess: () => {
                    toast.success('Data semester berhasil diperbarui');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                    toast.error('Gagal memperbarui data semester');
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/master/semester', submitData, {
                onSuccess: () => {
                    toast.success('Data semester berhasil ditambahkan');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                    toast.error('Gagal menambahkan data semester');
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
                        {isEdit ? 'Edit Semester' : 'Tambah Semester'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Perbarui informasi semester'
                            : 'Tambahkan semester baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tahun_ajaran_id">Tahun Ajaran</Label>
                        <Select
                            value={formData.tahun_ajaran_id}
                            onValueChange={(value) => handleInputChange('tahun_ajaran_id', value)}
                        >
                            <SelectTrigger className={errors.tahun_ajaran_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih Tahun Ajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {tahunAjaranList.map((tahunAjaran) => (
                                    <SelectItem key={tahunAjaran.id} value={tahunAjaran.id.toString()}>
                                        {tahunAjaran.nama_tahun_ajaran}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.tahun_ajaran_id && (
                            <p className="text-sm text-red-500">{errors.tahun_ajaran_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_semester">Nama Semester</Label>
                        <Select
                            value={formData.nama_semester}
                            onValueChange={(value) => handleInputChange('nama_semester', value)}
                        >
                            <SelectTrigger className={errors.nama_semester ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Semester 1">Semester 1</SelectItem>
                                <SelectItem value="Semester 2">Semester 2</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.nama_semester && (
                            <p className="text-sm text-red-500">{errors.nama_semester}</p>
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
                                Semester yang sedang berjalan
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
