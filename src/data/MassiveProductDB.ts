import { SKU } from '../core/types/InventoryTypes';

export const MASSIVE_PRODUCT_DB = [
    // ==== SNACKS (200 items) ====
    ...Array.from({ length: 200 }).map((_, i) => ({
        sku: `SNK-${1000 + i}` as SKU,
        name: `Snack Item Variant ${i + 1}`,
        category: 'SNACK',
        price: 5000 + (i * 100),
        barcode: `8991001${1000 + i}`
    })),

    // ==== DRINKS (200 items) ====
    ...Array.from({ length: 200 }).map((_, i) => ({
        sku: `DRK-${2000 + i}` as SKU,
        name: `Drink Item Variant ${i + 1}`,
        category: 'DRINK',
        price: 3000 + (i * 50),
        barcode: `8992002${2000 + i}`
    })),

    // ==== HOUSEHOLD (200 items) ====
    ...Array.from({ length: 200 }).map((_, i) => ({
        sku: `HSD-${3000 + i}` as SKU,
        name: `Household Item Variant ${i + 1}`,
        category: 'HOUSEHOLD',
        price: 15000 + (i * 500),
        barcode: `8993003${3000 + i}`
    })),

    // ==== HEALTH (200 items) ====
    ...Array.from({ length: 200 }).map((_, i) => ({
        sku: `HLT-${4000 + i}` as SKU,
        name: `Health Item Variant ${i + 1}`,
        category: 'HEALTH',
        price: 20000 + (i * 200),
        barcode: `8994004${4000 + i}`
    })),

    // ==== STATIONERY (200 items) ====
    ...Array.from({ length: 200 }).map((_, i) => ({
        sku: `STY-${5000 + i}` as SKU,
        name: `Stationery Item Variant ${i + 1}`,
        category: 'STATIONERY',
        price: 2000 + (i * 50),
        barcode: `8995005${5000 + i}`
    })),
];
