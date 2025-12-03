export interface TaxReport {
    period: string;
    grossRevenue: number;
    pphFinal: number; // 0.5% for UMKM
    ppnCollected: number; // 11% if PKP
    taxableIncome: number;
    isPKP: boolean;
}

export class TaxComplianceEngine {
    private static readonly UMKM_RATE = 0.005; // 0.5% PP 23/2018
    private static readonly PPN_RATE = 0.11; // UU HPP
    private static readonly PTKP_THRESHOLD = 500000000; // Omzet < 500jt bebas pajak (for individuals)

    public static generateReport(transactions: any[], isPKP: boolean): TaxReport {
        const totalOmzet = transactions.reduce((acc, curr) => acc + curr.total, 0);

        let pph = 0;
        let ppn = 0;

        // PPh Final Calculation (UMKM)
        // If omzet > 500jt cumulative (simplified for monthly demo)
        if (totalOmzet > 0) {
            pph = totalOmzet * this.UMKM_RATE;
        }

        // PPN Calculation (If PKP)
        if (isPKP) {
            ppn = totalOmzet * this.PPN_RATE;
        }

        return {
            period: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            grossRevenue: totalOmzet,
            pphFinal: Math.floor(pph),
            ppnCollected: Math.floor(ppn),
            taxableIncome: totalOmzet, // Simplified
            isPKP
        };
    }

    public static generateEFakturCSV(transactions: any[]): string {
        // Mocking DJP Online CSV Format
        let csv = "FK,KD_JENIS_TRANSAKSI,FG_PENGGANTI,NOMOR_FAKTUR,MASA_PAJAK,TAHUN_PAJAK,TANGGAL_FAKTUR,NPWP,NAMA,ALAMAT_LENGKAP,JUMLAH_DPP,JUMLAH_PPN,JUMLAH_PPNBM,ID_KETERANGAN_TAMBAHAN,FG_UANG_MUKA,UANG_MUKA_DPP,UANG_MUKA_PPN,UANG_MUKA_PPNBM,REFERENSI\n";

        transactions.forEach(tx => {
            const dpp = Math.floor(tx.total / 1.11);
            const ppn = tx.total - dpp;
            csv += `FK,01,0,0000000000001,12,2025,${new Date().toLocaleDateString()},00.000.000.0-000.000,PEMBELI TUNAI,-,${dpp},${ppn},0,0,0,0,0,0,${tx.id}\n`;
        });

        return csv;
    }
}
