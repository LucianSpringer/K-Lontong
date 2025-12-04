import { InventoryItem } from '../types/InventoryTypes';
import { TransactionRecord } from '../generators/TransactionSeeder';

export interface GPTResponse {
    text: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any[];
    action?: string;
}

export class WarungGPTEngine {
    private static readonly INTENTS = {
        HIGH_MARGIN: /margin.*(tinggi|besar|>\s*\d+)/i,
        LOW_STOCK: /stok.*(dikit|habis|kurang)/i,
        REVENUE_DROP: /(omzet|penjualan).*(turun|anjlok|sepi)/i,
        SUPPLIER_LATE: /supplier.*(telat|lambat)/i,
        EXPANSION: /modal.*(cabang|buka)/i
    };

    public static async query(
        prompt: string,
        context: { inventory: InventoryItem[], transactions: TransactionRecord[] }
    ): Promise<GPTResponse> {
        // Simulate "Thinking" Latency
        await new Promise(r => setTimeout(r, 1200));

        const p = prompt.toLowerCase();

        // 1. High Margin Query
        if (this.INTENTS.HIGH_MARGIN.test(p)) {
            const thresholdMatch = p.match(/>\s*(\d+)/);
            const threshold = thresholdMatch ? parseInt(thresholdMatch[1]) : 30;

            const items = context.inventory
                .map(i => ({ ...i, margin: ((i.retailPrice - i.purchasePrice) / i.retailPrice) * 100 }))
                .filter(i => i.margin > threshold)
                .sort((a, b) => b.margin - a.margin)
                .slice(0, 5);

            return {
                text: `Saya menemukan ${items.length} barang dengan margin di atas ${threshold}% yang laku keras di area Anda:`,
                data: items.map(i => ({ name: i.name, margin: `${i.margin.toFixed(1)}%` })),
                action: "RESTOCK_SUGGESTION"
            };
        }

        // 2. Revenue Analysis
        if (this.INTENTS.REVENUE_DROP.test(p)) {
            // Mock causal analysis
            return {
                text: "Analisa saya menunjukkan penurunan omzet 12% disebabkan oleh: 1. Stok 'Minyak Goreng' kosong selama 2 hari (Lost Sales). 2. Hujan deras di hari Selasa & Rabu mengurangi traffic.",
                action: "VIEW_ANALYTICS"
            };
        }

        // 3. Supplier Performance
        if (this.INTENTS.SUPPLIER_LATE.test(p)) {
            return {
                text: "Berdasarkan data 3 bulan terakhir, 'Grosir Jaya Abadi' memiliki rata-rata keterlambatan 48 jam. Saya sarankan beralih ke 'Indomarco DC' untuk item Fast Moving.",
                action: "OPEN_SUPPLIER_HUB"
            };
        }

        // 4. Expansion / Capital
        if (this.INTENTS.EXPANSION.test(p)) {
            return {
                text: "Untuk lokasi Suburban tipe 4x6m, estimasi modal yang dibutuhkan adalah Rp 35.000.000 (Sewa + Renovasi + Stok Awal). ROI diprediksi dalam 8 bulan.",
                action: "OPEN_CALCULATOR"
            };
        }

        // Default Fallback
        return {
            text: "Maaf Juragan, saya masih belajar. Coba tanya tentang 'stok', 'margin', atau 'supplier'.",
        };
    }
}
