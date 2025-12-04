/**
 * Simulates a pre-loaded database of common Indonesian retail items.
 */
import { SKU } from '../core/types/InventoryTypes';

export const GLOBAL_CATALOG = [
    { sku: 'ID-001' as SKU, name: 'Indomie Goreng Original 85g', category: 'FOOD', price: 3100, barcode: '89988662001' },
    { sku: 'ID-002' as SKU, name: 'Indomie Soto Mie 70g', category: 'FOOD', price: 3000, barcode: '89988662002' },
    { sku: 'ID-003' as SKU, name: 'Indomie Ayam Bawang 69g', category: 'FOOD', price: 3000, barcode: '89988662003' },
    { sku: 'ID-004' as SKU, name: 'Indomie Kari Ayam 72g', category: 'FOOD', price: 3200, barcode: '89988662004' },
    { sku: 'ID-005' as SKU, name: 'Indomie Rendang 90g', category: 'FOOD', price: 3500, barcode: '89988662005' },
    { sku: 'ID-006' as SKU, name: 'Sedap Goreng 90g', category: 'FOOD', price: 3000, barcode: '89988662006' },
    { sku: 'ID-007' as SKU, name: 'Sedap Soto 75g', category: 'FOOD', price: 2900, barcode: '89988662007' },
    { sku: 'BV-001' as SKU, name: 'Aqua Botol 600ml', category: 'BEVERAGE', price: 4000, barcode: '89988663001' },
    { sku: 'BV-002' as SKU, name: 'Aqua Botol 1500ml', category: 'BEVERAGE', price: 7000, barcode: '89988663002' },
    { sku: 'BV-003' as SKU, name: 'Le Minerale 600ml', category: 'BEVERAGE', price: 3500, barcode: '89988663003' },
    { sku: 'BV-004' as SKU, name: 'Teh Pucuk Harum 350ml', category: 'BEVERAGE', price: 4000, barcode: '89988663004' },
    { sku: 'BV-005' as SKU, name: 'Floridina Orange 350ml', category: 'BEVERAGE', price: 3500, barcode: '89988663005' },
    { sku: 'HC-001' as SKU, name: 'Pepsodent Herbal 190g', category: 'HEALTH', price: 21000, barcode: '89988664001' },
    { sku: 'HC-002' as SKU, name: 'Ciptadent Fresh 190g', category: 'HEALTH', price: 12000, barcode: '89988664002' },
    { sku: 'HC-003' as SKU, name: 'Lifebuoy Total 10 80g', category: 'HEALTH', price: 4500, barcode: '89988664003' },
    { sku: 'HC-004' as SKU, name: 'Lux Botanicals 80g', category: 'HEALTH', price: 5000, barcode: '89988664004' }
];
