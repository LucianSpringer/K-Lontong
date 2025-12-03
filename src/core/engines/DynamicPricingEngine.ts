import { SKU } from '../types/InventoryTypes';

export interface PriceRule {
    sku: SKU;
    basePrice: number;
    elasticity: number; // 0.1 (Inelastic) to 2.0 (Elastic)
    competitorPrice: number;
    minMargin: number;
}

export interface PricingResult {
    sku: SKU;
    suggestedPrice: number;
    ruleApplied: 'COMPETITOR_MATCH' | 'MARGIN_PROTECTION' | 'FLASH_SALE' | 'STANDARD';
    projectedUplift: number; // % Sales increase
}

export class DynamicPricingEngine {
    private static readonly FLASH_SALE_HOURS = [17, 18, 19]; // 5 PM - 7 PM

    public static calculatePrice(rule: PriceRule): PricingResult {
        const currentHour = new Date().getHours();
        const isFlashSaleTime = this.FLASH_SALE_HOURS.includes(currentHour);

        // 1. Flash Sale Logic (High Elasticity Items)
        if (isFlashSaleTime && rule.elasticity > 1.2) {
            const discountPrice = rule.basePrice * 0.85; // 15% off
            // Estimate cost as 80% of base price for margin calc
            if (this.calculateMargin(discountPrice, rule.basePrice * 0.8) >= rule.minMargin) {
                return {
                    sku: rule.sku,
                    suggestedPrice: discountPrice,
                    ruleApplied: 'FLASH_SALE',
                    projectedUplift: 45.0
                };
            }
        }

        // 2. Competitor Matching (With Margin Guard)
        if (rule.competitorPrice < rule.basePrice) {
            const matchPrice = rule.competitorPrice - 100; // Undercut by 100
            const marginAtMatch = this.calculateMargin(matchPrice, rule.basePrice * 0.8); // Assuming 20% cost

            if (marginAtMatch >= rule.minMargin) {
                return {
                    sku: rule.sku,
                    suggestedPrice: matchPrice,
                    ruleApplied: 'COMPETITOR_MATCH',
                    projectedUplift: 15.0
                };
            }
        }

        // 3. Default
        return {
            sku: rule.sku,
            suggestedPrice: rule.basePrice,
            ruleApplied: 'STANDARD',
            projectedUplift: 0
        };
    }

    private static calculateMargin(price: number, cost: number): number {
        return ((price - cost) / price) * 100;
    }
}
