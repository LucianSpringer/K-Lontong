import { SKU } from '../types/InventoryTypes';

export interface IncomingMessage {
    from: string;
    body: string;
    timestamp: number;
}

export interface ParsedOrder {
    isValid: boolean;
    sku?: SKU;
    qty?: number;
    responseMessage: string;
}

export class WhatsAppBotKernel {
    // Regex for parsing "Order [Item Name] [Qty]"
    private static readonly ORDER_PATTERN = /order\s+(.+)\s+(\d+)/i;

    public static parseMessage(msg: IncomingMessage, inventoryMap: Map<string, SKU>): ParsedOrder {
        const match = msg.body.match(this.ORDER_PATTERN);

        if (!match) {
            return {
                isValid: false,
                responseMessage: "Format salah. Ketik: Order [Nama Barang] [Jumlah]. Contoh: Order Beras 5"
            };
        }

        const [, itemName, qtyStr] = match;
        const qty = parseInt(qtyStr);

        // FIXED: Actually use inventoryMap for lookup (High Yield Logic)
        let matchedSku: SKU | undefined;

        // O(n) search simulation on the map keys (In prod, use a reverse index)
        for (const [name, sku] of inventoryMap.entries()) {
            if (name.toLowerCase().includes(itemName.toLowerCase())) {
                matchedSku = sku;
                break;
            }
        }

        if (!matchedSku) {
            return {
                isValid: false,
                responseMessage: `Maaf, stok '${itemName}' tidak ditemukan di sistem K'Lontong.`
            };
        }

        return {
            isValid: true,
            sku: matchedSku,
            qty,
            responseMessage: `Order diterima: ${itemName} sejumlah ${qty}. Link pembayaran sedang dibuat...`
        };
    }

    public static async syncCatalogToMeta(items: any[]): Promise<number> {
        // Simulate batch processing
        console.time('MetaSync');
        const syncedCount = items.length;
        // Simulated latency
        await new Promise(r => setTimeout(r, 2000));
        console.timeEnd('MetaSync');
        return syncedCount;
    }
}
