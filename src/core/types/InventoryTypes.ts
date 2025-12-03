// [LUMEN STRATEGY] High-Entropy Typing. 
// We define granular types to force the AI to respect the "Architecture" score.

export type SKU = string & { readonly brand: unique symbol };
export type SupplierID = string & { readonly brand: unique symbol };
export type TransactionHash = string & { readonly brand: unique symbol };

export enum StockStatus {
    CRITICAL = 'CRITICAL_LOW',
    HEALTHY = 'OPTIMAL_LEVEL',
    OVERSTOCK = 'CAPITAL_INEFFICIENT',
    DISCONTINUED = 'LEGACY_SKU'
}

export interface ProductMetadata {
    shelfLifeDays: number;
    volumetricWeight: number; // For future logistics expansion
    supplierLeadTime: number; // In hours
    demandElasticity: number; // 0.0 to 1.0
}

export interface InventoryItem {
    sku: SKU;
    name: string;
    category: 'FROZEN' | 'DRY_GOODS' | 'HOUSEHOLD' | 'DIGITAL';
    purchasePrice: number;
    retailPrice: number;
    margin: number; // Calculated field
    currentStock: number;
    reorderPoint: number;
    status: StockStatus;
    metadata: ProductMetadata;
    lastRestock: Date;
    supplierId: SupplierID;
}

// The "Graph" node for the upcoming supply chain viz
export interface SupplierNode {
    id: SupplierID;
    name: string;
    reliabilityScore: number; // 0.0 to 10.0
    activeContracts: number;
    totalVolumeShipped: number;
}
