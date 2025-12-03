import { InventoryItem, SKU } from '../types/InventoryTypes';
import { AuditLogger } from '../security/AuditLogger';

export interface Supplier {
    id: string;
    name: string;
    leadTimeDays: number;
    minOrderQty: number;
    reliability: number; // 0-1.0
    contact: string;
}

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    items: { sku: SKU; qty: number; cost: number }[];
    totalCost: number;
    status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED';
    generatedAt: Date;
    expectedDelivery: Date;
}

export class SupplyChainBrain {
    // Standard EOQ Constants
    private static readonly HOLDING_COST_PERCENTAGE = 0.20; // 20% of value per year
    private static readonly ORDERING_COST = 15000; // Rp 15k admin/transport cost per order

    private static suppliers: Supplier[] = [
        { id: 'SUP-001', name: 'Grosir Jaya Abadi', leadTimeDays: 2, minOrderQty: 10, reliability: 0.95, contact: '08123...' },
        { id: 'SUP-002', name: 'Indomarco Distribution', leadTimeDays: 4, minOrderQty: 50, reliability: 0.99, contact: '021...' },
        { id: 'SUP-003', name: 'Agen Telur "Berkah"', leadTimeDays: 1, minOrderQty: 5, reliability: 0.85, contact: '0856...' }
    ];

    /**
     * Calculate Economic Order Quantity (EOQ)
     * Formula: sqrt( (2 * Demand * OrderCost) / HoldingCost )
     */
    public static calculateEOQ(annualDemand: number, unitCost: number): number {
        const holdingCost = unitCost * this.HOLDING_COST_PERCENTAGE;
        if (holdingCost === 0) return 0;

        const eoq = Math.sqrt((2 * annualDemand * this.ORDERING_COST) / holdingCost);
        return Math.ceil(eoq);
    }

    /**
     * Calculate Reorder Point (ROP)
     * Formula: (DailyUsage * LeadTime) + SafetyStock
     */
    public static calculateROP(dailyUsage: number, leadTimeDays: number, safetyStock: number): number {
        return Math.ceil((dailyUsage * leadTimeDays) + safetyStock);
    }

    /**
     * Generate Auto-Restock Recommendations
     */
    public static generateSmartPO(inventory: InventoryItem[]): PurchaseOrder[] {
        const drafts: PurchaseOrder[] = [];
        const supplierGroups: Record<string, PurchaseOrder['items']> = {};

        // 1. Analyze Stock
        inventory.forEach(item => {
            // Mocking demand data (In real app, analyze TransactionHistory)
            const mockDailyDemand = Math.ceil(Math.random() * 5);
            const mockSafetyStock = 10;

            // Get Supplier Info
            const supplier = this.suppliers.find(s => s.id === item.supplierId) || this.suppliers[0];

            const rop = this.calculateROP(mockDailyDemand, supplier.leadTimeDays, mockSafetyStock);

            if (item.currentStock <= rop) {
                // Trigger Restock
                const annualDemand = mockDailyDemand * 365;
                let qtyToOrder = this.calculateEOQ(annualDemand, item.purchasePrice);

                // Enforce MOQ
                if (qtyToOrder < supplier.minOrderQty) qtyToOrder = supplier.minOrderQty;

                if (!supplierGroups[supplier.id]) supplierGroups[supplier.id] = [];
                supplierGroups[supplier.id].push({
                    sku: item.sku,
                    qty: qtyToOrder,
                    cost: item.purchasePrice * qtyToOrder
                });

                AuditLogger.log('AUTO_PO_TRIGGER', `SKU:${item.sku} STOCK:${item.currentStock} ROP:${rop}`, 'INFO');
            }
        });

        // 2. Build PO Objects
        Object.entries(supplierGroups).forEach(([supId, items]) => {
            const supplier = this.suppliers.find(s => s.id === supId)!;
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + supplier.leadTimeDays);

            drafts.push({
                id: `PO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
                supplierId: supId,
                items,
                totalCost: items.reduce((sum, i) => sum + i.cost, 0),
                status: 'DRAFT',
                generatedAt: new Date(),
                expectedDelivery: deliveryDate
            });
        });

        return drafts;
    }

    public static getSupplierName(id: string): string {
        return this.suppliers.find(s => s.id === id)?.name || 'Unknown Supplier';
    }
}
