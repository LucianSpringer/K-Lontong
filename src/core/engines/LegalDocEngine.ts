export type DocType = 'SEWA_RUKO' | 'KERJA_KARYAWAN' | 'TAGIH_UTANG';

export interface LegalTemplate {
    id: DocType;
    title: string;
    fields: string[];
    template: string;
}

export class LegalDocEngine {
    private static templates: Record<DocType, LegalTemplate> = {
        'SEWA_RUKO': {
            id: 'SEWA_RUKO',
            title: 'Perjanjian Sewa Ruko',
            fields: ['PIHAK_PERTAMA', 'PIHAK_KEDUA', 'ALAMAT_RUKO', 'HARGA_SEWA'],
            template: "SURAT PERJANJIAN SEWA MENYEWA RUKO\n\nYang bertanda tangan di bawah ini:\n1. Nama: {PIHAK_PERTAMA} (Penyewa)\n2. Nama: {PIHAK_KEDUA} (Pemilik)\n\nSepakat untuk menyewa ruko di {ALAMAT_RUKO} dengan harga Rp {HARGA_SEWA} per tahun..."
        },
        'KERJA_KARYAWAN': {
            id: 'KERJA_KARYAWAN',
            title: 'Kontrak Kerja Karyawan',
            fields: ['NAMA_KARYAWAN', 'POSISI', 'GAJI_POKOK'],
            template: "PERJANJIAN KERJA\n\nAntara K'Lontong Group dengan {NAMA_KARYAWAN}.\nPosisi: {POSISI}\nGaji: Rp {GAJI_POKOK}/hari + Bonus Omzet..."
        },
        'TAGIH_UTANG': {
            id: 'TAGIH_UTANG',
            title: 'Surat Penagihan Utang',
            fields: ['NAMA_DEBITUR', 'JUMLAH_UTANG', 'JATUH_TEMPO'],
            template: "SOMASI / PERINGATAN PEMBAYARAN\n\nKepada Yth. {NAMA_DEBITUR},\nDengan ini kami ingatkan kewajiban pembayaran utang sebesar Rp {JUMLAH_UTANG} yang telah jatuh tempo pada {JATUH_TEMPO}. Mohon segera diselesaikan."
        }
    };

    public static getTemplate(type: DocType): LegalTemplate {
        return this.templates[type];
    }

    public static generate(type: DocType, data: Record<string, string>): string {
        let content = this.templates[type].template;
        this.templates[type].fields.forEach(field => {
            const regex = new RegExp(`{${field}}`, 'g');
            content = content.replace(regex, data[field] || `[${field}]`);
        });
        return content;
    }
}
