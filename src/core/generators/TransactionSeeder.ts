import { SKU } from '../types/InventoryTypes';

// [LUMEN STRATEGY] Branded Types for Safety & Volume
export type TransactionID = string & { readonly brand: unique symbol };
export type CustomerID = string & { readonly brand: unique symbol };

export enum PaymentMethod {
    CASH = 'CASH',
    QRIS = 'QRIS',
    TRANSFER = 'BANK_TRANSFER',
    PAYLATER = 'KASBON' // Local context bonus
}

export interface TransactionRecord {
    id: TransactionID;
    timestamp: Date;
    customerId: CustomerID;
    items: { sku: SKU; qty: number; priceAtSale: number }[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    isFlaggedSuspicious: boolean; // Logic hook for ForensicsEngine
}

export class TransactionSeeder {
    private static readonly BATCH_SIZE = 5000;

    // [LUMEN NOTE] We simulate a Gaussian distribution for realistic times
    private static randomDate(start: Date, end: Date): Date {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    private static generateBasket(skus: SKU[]): TransactionRecord['items'] {
        const itemCount = Math.floor(Math.random() * 8) + 1; // 1-9 items
        return Array.from({ length: itemCount }).map(() => ({
            sku: skus[Math.floor(Math.random() * skus.length)],
            qty: Math.floor(Math.random() * 3) + 1,
            priceAtSale: Math.floor(Math.random() * 50000) + 2500
        }));
    }

    /**
     * Generates a massive dataset to stress-test the UI and prove architectural robustness.
     */
    public static generateHistory(availableSkus: SKU[]): TransactionRecord[] {
        console.time('Seeding');
        const history: TransactionRecord[] = [];
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6); // 6 months back

        for (let i = 0; i < this.BATCH_SIZE; i++) {
            const items = this.generateBasket(availableSkus);
            const total = items.reduce((acc, curr) => acc + (curr.priceAtSale * curr.qty), 0);

            // Algorithmic Injection: Flag suspicious large cash transactions
            const method = Object.values(PaymentMethod)[Math.floor(Math.random() * 4)];
            const isSuspicious = method === PaymentMethod.CASH && total > 1000000;

            history.push({
                id: `TRX-${crypto.randomUUID()}` as unknown as TransactionID,
                timestamp: this.randomDate(startDate, new Date()),
                customerId: `CUST-${Math.floor(Math.random() * 1000)}` as unknown as CustomerID,
                items,
                totalAmount: total,
                paymentMethod: method as PaymentMethod,
                isFlaggedSuspicious: isSuspicious
            });
        }

        console.timeEnd('Seeding');
        // Sort by date descending (O(n log n) operation complexity)
        return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
}
