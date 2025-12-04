import { AuditLogger } from '../security/AuditLogger';

export interface IPOSimulation {
    valuation: number;
    sharePrice: number;
    totalShares: number;
    sharesAvailable: number;
    dividendYield: number; // Annual %
    monthlyDividendPerShare: number;
    investorCount: number;
}

export class WarungIPOEngine {

    public static valuate(monthlyRevenue: number, monthlyProfit: number, growthRate: number): IPOSimulation {
        // Simple Valuation Model: Annual Profit * Multiple
        const annualProfit = monthlyProfit * 12;
        // Multiple based on growth (High growth = high multiple)
        const multiple = growthRate > 20 ? 5 : 3;

        const valuation = annualProfit * multiple;
        const totalShares = 100000; // Standard lot
        const sharePrice = Math.floor(valuation / totalShares);

        // Dividend Policy: 50% of profit distributed
        const totalMonthlyDividend = monthlyProfit * 0.5;
        const dividendPerShare = totalMonthlyDividend / totalShares;
        const annualYield = ((dividendPerShare * 12) / sharePrice) * 100;

        AuditLogger.log('IPO_VALUATION', `REV:${monthlyRevenue} VAL:${valuation} PRICE:${sharePrice} YIELD:${annualYield.toFixed(2)}%`, 'INFO');

        return {
            valuation,
            sharePrice,
            totalShares,
            sharesAvailable: Math.floor(totalShares * 0.4), // 40% public float
            dividendYield: parseFloat(annualYield.toFixed(2)),
            monthlyDividendPerShare: Math.floor(dividendPerShare),
            investorCount: Math.floor(Math.random() * 500) + 50
        };
    }
}
