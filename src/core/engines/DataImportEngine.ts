import { SKU, InventoryItem, StockStatus } from '../types/InventoryTypes';

export interface ImportResult {
    success: boolean;
    data: Partial<InventoryItem>[];
    errors: string[];
    mappedColumns: Record<string, string>;
}

export class DataImportEngine {
    private static readonly COLUMN_KEYWORDS = {
        name: ['nama', 'barang', 'produk', 'item', 'name', 'product'],
        sku: ['sku', 'kode', 'id', 'code'],
        price: ['harga', 'price', 'cost', 'modal', 'beli'],
        stock: ['stok', 'stock', 'qty', 'jumlah', 'quantity']
    };

    /**
     * Smartly maps user CSV headers to system internal fields using fuzzy matching
     */
    public static autoMapColumns(headers: string[]): Record<string, string> {
        const mapping: Record<string, string> = {};

        headers.forEach(header => {
            const h = header.toLowerCase();

            // Heuristic Matching
            if (this.COLUMN_KEYWORDS.name.some(k => h.includes(k))) mapping['name'] = header;
            else if (this.COLUMN_KEYWORDS.sku.some(k => h.includes(k))) mapping['sku'] = header;
            else if (this.COLUMN_KEYWORDS.price.some(k => h.includes(k))) mapping['purchasePrice'] = header;
            else if (this.COLUMN_KEYWORDS.stock.some(k => h.includes(k))) mapping['currentStock'] = header;
        });

        return mapping;
    }

    public static parseCSV(rawText: string): ImportResult {
        const lines = rawText.split('\n').filter(l => l.trim().length > 0);
        if (lines.length < 2) return { success: false, data: [], errors: ['File kosong atau format salah'], mappedColumns: {} };

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const columnMap = this.autoMapColumns(headers);
        const results: Partial<InventoryItem>[] = [];
        const errors: string[] = [];

        // Validate mandatory columns
        if (!columnMap['name'] || !columnMap['price']) {
            return { success: false, data: [], errors: ['Kolom Nama atau Harga tidak terdeteksi otomatis. Silakan mapping manual.'], mappedColumns: columnMap };
        }

        // Parse Rows
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length !== headers.length) continue;

            const item: any = {
                metadata: { shelfLifeDays: 365, volumetricWeight: 1, supplierLeadTime: 2, demandElasticity: 1 },
                status: StockStatus.HEALTHY,
                lastRestock: new Date(),
                supplierId: 'SUP-IMPORT' as any
            };

            try {
                // Map values
                if (columnMap['sku']) {
                    item.sku = values[headers.indexOf(columnMap['sku'])] as SKU;
                } else {
                    item.sku = `IMP-${Date.now()}-${i}` as SKU; // Auto-gen SKU
                }

                item.name = values[headers.indexOf(columnMap['name'])];
                item.purchasePrice = parseFloat(values[headers.indexOf(columnMap['purchasePrice'])]) || 0;
                item.retailPrice = item.purchasePrice * 1.2; // Default 20% margin
                item.currentStock = parseInt(values[headers.indexOf(columnMap['currentStock'])]) || 0;

                results.push(item as InventoryItem);
            } catch (e) {
                errors.push(`Baris ${i + 1}: Gagal parsing data`);
            }
        }

        return {
            success: true,
            data: results,
            errors,
            mappedColumns: columnMap
        };
    }
}
