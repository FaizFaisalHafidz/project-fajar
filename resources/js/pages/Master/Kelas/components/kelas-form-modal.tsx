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

interface Jurusan {
    id: number;
    kode_jurusan: string;
    nama_jurusan: string;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Guru {
    id: number;
    nama_guru: string;
    nip: string;
}

interface Kelas {
    id: number;
    jurusan_id: number;
    tahun_ajaran_id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    wali_kelas_id: number | null;
    siswa_count: number;
    jurusan: Jurusan;
    tahun_ajaran: TahunAjaran;
    wali_kelas: Guru | null;
}

interface KelasFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    kelas?: Kelas | null;
    jurusanList: Jurusan[];
    tahunAjaranList: TahunAjaran[];
    guruList: Guru[];
}

interface KelasFormData {
    jurusan_id: string;
    tahun_ajaran_id: string;
    nama_kelas: string;
    tingkat_kelas: string;
    wali_kelas_id: string;
    [key: string]: string;
}

const tingkatKelasOptions = [
    { value: '1', label: 'Kelas X' },
    { value: '2', label: 'Kelas XI' },
    { value: '3', label: 'Kelas XII' },
];

export function KelasFormModal({
    isOpen,
    onClose,
    kelas,
    jurusanList,
    tahunAjaranList,
    guruList,
}: KelasFormModalProps) {
    const isEdit = !!kelas;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<KelasFormData>({
        jurusan_id: '',
        tahun_ajaran_id: '',
        nama_kelas: '',
        tingkat_kelas: '',
        wali_kelas_id: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (isEdit && kelas) {
                setFormData({
                    jurusan_id: kelas.jurusan_id.toString(),
                    tahun_ajaran_id: kelas.tahun_ajaran_id.toString(),
                    nama_kelas: kelas.nama_kelas,
                    tingkat_kelas: kelas.tingkat_kelas.toString(),
                    wali_kelas_id: kelas.wali_kelas_id?.toString() || '',
                });
            } else {
                setFormData({
                    jurusan_id: '',
                    tahun_ajaran_id: '',
                    nama_kelas: '',
                    tingkat_kelas: '',
                    wali_kelas_id: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, isEdit, kelas]);

    const handleInputChange = (field: keyof KelasFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.jurusan_id) {
            newErrors.jurusan_id = 'Jurusan harus dipilih';
        }

        if (!formData.tahun_ajaran_id) {
            newErrors.tahun_ajaran_id = 'Tahun ajaran harus dipilih';
        }

        if (!formData.nama_kelas.trim()) {
            newErrors.nama_kelas = 'Nama kelas harus diisi';
        }

        if (!formData.tingkat_kelas) {
            newErrors.tingkat_kelas = 'Tingkat kelas harus dipilih';
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
            jurusan_id: parseInt(formData.jurusan_id),
            tahun_ajaran_id: parseInt(formData.tahun_ajaran_id),
            nama_kelas: formData.nama_kelas,
            tingkat_kelas: parseInt(formData.tingkat_kelas),
            wali_kelas_id: formData.wali_kelas_id ? parseInt(formData.wali_kelas_id) : null,
        };

        if (isEdit && kelas) {
            router.put(`/master/kelas/${kelas.id}`, submitData, {
                onSuccess: () => {
                    toast.success('Data kelas berhasil diperbarui');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                    toast.error('Gagal memperbarui data kelas');
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/master/kelas', submitData, {
                onSuccess: () => {
                    toast.success('Data kelas berhasil ditambahkan');
                    onClose();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                    toast.error('Gagal menambahkan data kelas');
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
                        {isEdit ? 'Edit Kelas' : 'Tambah Kelas'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Perbarui informasi kelas'
                            : 'Tambahkan kelas baru'}
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
                        <Label htmlFor="jurusan_id">Jurusan</Label>
                        <Select
                            value={formData.jurusan_id}
                            onValueChange={(value) => handleInputChange('jurusan_id', value)}
                        >
                            <SelectTrigger className={errors.jurusan_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih Jurusan" />
                            </SelectTrigger>
                            <SelectContent>
                                {jurusanList.map((jurusan) => (
                                    <SelectItem key={jurusan.id} value={jurusan.id.toString()}>
                                        {jurusan.kode_jurusan} - {jurusan.nama_jurusan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.jurusan_id && (
                            <p className="text-sm text-red-500">{errors.jurusan_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tingkat_kelas">Tingkat Kelas</Label>
                        <Select
                            value={formData.tingkat_kelas}
                            onValueChange={(value) => handleInputChange('tingkat_kelas', value)}
                        >
                            <SelectTrigger className={errors.tingkat_kelas ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih Tingkat Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                {tingkatKelasOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.tingkat_kelas && (
                            <p className="text-sm text-red-500">{errors.tingkat_kelas}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_kelas">Nama Kelas</Label>
                        <Input
                            id="nama_kelas"
                            placeholder="Contoh: A, B, C"
                            value={formData.nama_kelas}
                            onChange={(e) => handleInputChange('nama_kelas', e.target.value)}
                            className={errors.nama_kelas ? 'border-red-500' : ''}
                        />
                        {errors.nama_kelas && (
                            <p className="text-sm text-red-500">{errors.nama_kelas}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wali_kelas_id">Wali Kelas (Opsional)</Label>
                        <select
                            value={formData.wali_kelas_id}
                            onChange={(e) => handleInputChange('wali_kelas_id', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Belum ditentukan</option>
                            {guruList.map((guru) => (
                                <option key={guru.id} value={guru.id.toString()}>
                                    {guru.nama_guru} ({guru.nip})
                                </option>
                            ))}
                        </select>
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
