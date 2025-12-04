import { SKU } from '../types/InventoryTypes';

export interface CompetitorPricePoint {
    source: 'INDOMARET' | 'ALFAMART' | 'WARUNG_MADURA' | 'GROSIR';
    price: number;
    distance: number; // meters
    lastUpdated: Date;
    reporterCount: number; // Reliability score
}

export interface PriceInsight {
    sku: string;
    marketAvg: number;
    lowestPrice: number;
    recommendedPrice: number;
    heatmapIntensity: number; // 0-100 (Competition density)
    points: CompetitorPricePoint[];
}

export class CrowdPriceEngine {

    public static getMarketInsight(sku: SKU, myPrice: number): PriceInsight {
        // Simulate Crowdsourced Data
        const basePrice = myPrice * 0.95; // Market slightly cheaper usually

        const points: CompetitorPricePoint[] = [
            { source: 'INDOMARET', price: basePrice * 1.1, distance: 150, lastUpdated: new Date(), reporterCount: 42 },
            { source: 'ALFAMART', price: basePrice * 1.08, distance: 300, lastUpdated: new Date(), reporterCount: 28 },
            { source: 'WARUNG_MADURA', price: basePrice * 0.98, distance: 50, lastUpdated: new Date(), reporterCount: 15 },
            { source: 'GROSIR', price: basePrice * 0.85, distance: 2000, lastUpdated: new Date(), reporterCount: 5 } // Far away
        ];

        // Logic: Ignore Grosir for Retail Pricing, Weight by Distance & Recency
        const retailCompetitors = points.filter(p => p.source !== 'GROSIR');
        const avgPrice = retailCompetitors.reduce((a, b) => a + b.price, 0) / retailCompetitors.length;

        // Recommendation: Be cheaper than Indomaret/Alfa, but can be slightly more than Madura due to "Modern" service
        const target = Math.min(points[0].price, points[1].price) - 100;

        return {
            sku,
            marketAvg: Math.floor(avgPrice),
            lowestPrice: Math.min(...points.map(p => p.price)),
            recommendedPrice: Math.floor(target),
            heatmapIntensity: 85, // High competition
            points
        };
    }
}
