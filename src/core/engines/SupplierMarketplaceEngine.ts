import { SKU } from '../types/InventoryTypes';

export interface MarketOffer {
    id: string;
    supplierName: string;
    price: number;
    moq: number; // Minimum Order Qty
    deliverySLA: string; // e.g. "24 Hours"
    rating: number; // 4.5
    verified: boolean;
}

export interface MarketRequest {
    id: string;
    sku: SKU;
    qty: number;
    status: 'OPEN' | 'CLOSED';
    bids: MarketOffer[];
    bestBidId?: string;
}

export class SupplierMarketplaceEngine {
    private static requests: Map<string, MarketRequest> = new Map();

    // Mock Suppliers Database
    private static SUPPLIERS = [
        { name: "Grosir Induk Jaya", baseRating: 4.8, sla: "24h", verified: false },
        { name: "CV. Maju Mundur", baseRating: 4.2, sla: "48h", verified: false },
        { name: "Agen Sembako Murah", baseRating: 4.5, sla: "12h", verified: false },
        { name: "Distributor Resmi", baseRating: 4.9, sla: "24h", verified: true }
    ];

    public static postRequest(sku: SKU, qty: number): string {
        const id = crypto.randomUUID();
        const req: MarketRequest = {
            id, sku, qty, status: 'OPEN', bids: []
        };

        this.requests.set(id, req);

        // Simulate Incoming Bids (Async)
        this.simulateBiddingWar(id);

        return id;
    }

    private static simulateBiddingWar(reqId: string) {
        const req = this.requests.get(reqId);
        if (!req) return;

        // Generate 3-6 random bids
        const bidCount = Math.floor(Math.random() * 4) + 3;
        const basePrice = 25000; // Mock base price

        for (let i = 0; i < bidCount; i++) {
            const supplier = this.SUPPLIERS[Math.floor(Math.random() * this.SUPPLIERS.length)];
            const variance = (Math.random() * 0.2) - 0.1; // +/- 10% price

            req.bids.push({
                id: crypto.randomUUID(),
                supplierName: supplier.name,
                price: Math.floor(basePrice * (1 + variance)),
                moq: Math.floor(Math.random() * 5) * 10, // 0, 10, 20...
                deliverySLA: supplier.sla,
                rating: supplier.baseRating,
                verified: supplier.verified || false
            });
        }

        // Auto-sort by price
        req.bids.sort((a, b) => a.price - b.price);
        req.bestBidId = req.bids[0].id;
    }

    public static getRequest(id: string) {
        return this.requests.get(id);
    }
}
