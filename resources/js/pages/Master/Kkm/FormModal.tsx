import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface MataPelajaran {
    id: number;
    nama_mapel: string;
    kode_mapel: string;
}

interface Jurusan {
    id: number;
    nama_jurusan: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat_kelas: number;
    jurusan: Jurusan;
}

interface TahunAjaran {
    id: number;
    nama_tahun_ajaran: string;
}

interface Semester {
    id: number;
    nama_semester: string;
    tahun_ajaran: TahunAjaran;
}

interface Kkm {
    id: number;
    mata_pelajaran_id: number;
    kelas_id: number;
    semester_id: number;
    nilai_kkm: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    kkm?: Kkm | null;
    mataPelajarans: MataPelajaran[];
    kelas: Kelas[];
    semesters: Semester[];
}

export default function FormModal({ isOpen, onClose, kkm, mataPelajarans, kelas, semesters }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        mata_pelajaran_id: '',
        kelas_id: '',
        semester_id: '',
        nilai_kkm: '',
    });

    useEffect(() => {
        if (kkm) {
            setData({
                mata_pelajaran_id: kkm.mata_pelajaran_id.toString(),
                kelas_id: kkm.kelas_id.toString(),
                semester_id: kkm.semester_id.toString(),
                nilai_kkm: kkm.nilai_kkm.toString(),
            });
        } else {
            reset();
        }
    }, [kkm, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            toast.success(
                kkm ? 'Data KKM berhasil diperbarui' : 'Data KKM berhasil ditambahkan',
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

        if (kkm) {
            put(route('master.kkm.update', kkm.id), {
                onSuccess,
                onError,
            });
        } else {
            post(route('master.kkm.store'), {
                onSuccess,
                onError,
            });
        }
    };

    const handleDelete = () => {
        if (!kkm) return;

        if (confirm('Apakah Anda yakin ingin menghapus data KKM ini?')) {
            const deleteForm = useForm();
            deleteForm.delete(route('master.kkm.destroy', kkm.id), {
                onSuccess: () => {
                    toast.success('Data KKM berhasil dihapus', {
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
                        {kkm ? 'Edit KKM' : 'Tambah KKM'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="mata_pelajaran_id">Mata Pelajaran</Label>
                        <Select
                            value={data.mata_pelajaran_id}
                            onValueChange={(value) => setData('mata_pelajaran_id', value)}
                        >
                            <SelectTrigger className={errors.mata_pelajaran_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih mata pelajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {mataPelajarans.map((mapel) => (
                                    <SelectItem key={mapel.id} value={mapel.id.toString()}>
                                        {mapel.kode_mapel} - {mapel.nama_mapel}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.mata_pelajaran_id && (
                            <p className="text-sm text-red-500">{errors.mata_pelajaran_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="kelas_id">Kelas</Label>
                        <Select
                            value={data.kelas_id}
                            onValueChange={(value) => setData('kelas_id', value)}
                        >
                            <SelectTrigger className={errors.kelas_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                {kelas.map((k) => (
                                    <SelectItem key={k.id} value={k.id.toString()}>
                                        {k.tingkat_kelas} {k.nama_kelas} - {k.jurusan.nama_jurusan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.kelas_id && (
                            <p className="text-sm text-red-500">{errors.kelas_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="semester_id">Semester</Label>
                        <Select
                            value={data.semester_id}
                            onValueChange={(value) => setData('semester_id', value)}
                        >
                            <SelectTrigger className={errors.semester_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((semester) => (
                                    <SelectItem key={semester.id} value={semester.id.toString()}>
                                        {semester.nama_semester} - {semester.tahun_ajaran.nama_tahun_ajaran}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.semester_id && (
                            <p className="text-sm text-red-500">{errors.semester_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nilai_kkm">Nilai KKM</Label>
                        <Input
                            id="nilai_kkm"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={data.nilai_kkm}
                            onChange={(e) => setData('nilai_kkm', e.target.value)}
                            className={errors.nilai_kkm ? 'border-red-500' : ''}
                            placeholder="Contoh: 75.00"
                        />
                        {errors.nilai_kkm && (
                            <p className="text-sm text-red-500">{errors.nilai_kkm}</p>
                        )}
                    </div>

                    <div className="flex justify-between pt-4">
                        <div>
                            {kkm && (
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
