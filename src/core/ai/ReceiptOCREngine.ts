import { InventoryItem, StockStatus } from '../types/InventoryTypes';

export interface ScannedReceipt {
    merchant: string;
    date: string;
    items: { name: string; qty: number; price: number }[];
    total: number;
    confidence: number;
}

export class ReceiptOCREngine {

    public static async processImage(file: File): Promise<ScannedReceipt> {
        console.log("Processing receipt image:", file.name);
        // Simulate Processing Time (Heavy Compute)
        await new Promise(r => setTimeout(r, 2500));

        // Mock Result (In a real app, Tesseract.js would go here)
        // We return randomized "Real" looking data
        return {
            merchant: "INDOGROSIR SURABAYA",
            date: new Date().toLocaleDateString(),
            items: [
                { name: "Minyak Goreng Sania 2L", qty: 12, price: 32500 },
                { name: "Indomie Goreng Karton", qty: 5, price: 112000 },
                { name: "Gula Pasir Gulaku 1kg", qty: 24, price: 13500 },
                { name: "Teh Pucuk Harum 350ml", qty: 48, price: 2800 }
            ],
            total: 1428000,
            confidence: 0.98
        };
    }

    public static convertToInventory(receipt: ScannedReceipt): Partial<InventoryItem>[] {
        return receipt.items.map((item, i) => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sku: `SCAN-${Date.now()}-${i}` as any,
            name: item.name,
            currentStock: item.qty,
            purchasePrice: item.price,
            retailPrice: item.price * 1.15, // Auto markup 15%
            status: StockStatus.HEALTHY,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supplierId: 'SUP-OCR' as any
        }));
    }
}
