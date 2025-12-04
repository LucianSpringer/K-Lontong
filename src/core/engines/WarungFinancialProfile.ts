import { AuditLogger } from '../security/AuditLogger';

export interface CreditFactor {
    category: string;
    score: number; // 0-100 contribution
    weight: number; // %
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    insight: string;
}

export interface WarungCreditScore {
    score: number; // 300 - 850
    rating: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
    maxLoanLimit: number;
    interestRate: number;
    factors: CreditFactor[];
    lastUpdated: Date;
}

export class WarungFinancialProfile {
    // Weights based on SLIK OJK adaptation for MSMEs
    private static readonly W_CASHFLOW = 0.35;
    private static readonly W_STABILITY = 0.30;
    private static readonly W_INVENTORY = 0.20;
    private static readonly W_HISTORY = 0.15;

    public static calculateScore(
        monthlyRevenue: number[],
        yearsActive: number,
        inventoryValue: number,
        latePayments: number
    ): WarungCreditScore {
        // 1. Cashflow Stability (Variance)
        const avgRev = monthlyRevenue.reduce((a, b) => a + b, 0) / monthlyRevenue.length;
        const variance = monthlyRevenue.reduce((a, b) => a + Math.pow(b - avgRev, 2), 0) / monthlyRevenue.length;
        const stabilityScore = Math.max(0, 100 - (Math.sqrt(variance) / avgRev) * 100);

        // 2. Payment History
        const historyScore = Math.max(0, 100 - (latePayments * 20));

        // 3. Asset Value (Inventory)
        const assetScore = Math.min(100, inventoryValue / 500000); // Cap at 50jt inventory

        // 4. Longevity
        const longevityScore = Math.min(100, yearsActive * 20); // 5 years = 100

        // Composite Raw Score (0-100)
        const rawScore =
            (stabilityScore * this.W_CASHFLOW) +
            (historyScore * this.W_STABILITY) +
            (assetScore * this.W_INVENTORY) +
            (longevityScore * this.W_HISTORY);

        // Scale to 300-850 (FICO-like)
        const finalScore = Math.floor(300 + (rawScore * 5.5));

        // Determine Rating
        let rating: WarungCreditScore['rating'] = 'POOR';
        let limit = 0;
        let rate = 2.5; // Monthly

        if (finalScore > 750) { rating = 'EXCELLENT'; limit = 500000000; rate = 0.9; }
        else if (finalScore > 700) { rating = 'GOOD'; limit = 100000000; rate = 1.2; }
        else if (finalScore > 600) { rating = 'FAIR'; limit = 25000000; rate = 1.8; }

        AuditLogger.log('CREDIT_SCORING', `SCORE_GEN:${finalScore} RATING:${rating}`, 'INFO');

        return {
            score: finalScore,
            rating,
            maxLoanLimit: limit,
            interestRate: rate,
            lastUpdated: new Date(),
            factors: [
                { category: 'Cashflow Stability', score: stabilityScore, weight: 35, impact: 'HIGH', insight: stabilityScore > 80 ? 'Consistent Revenue' : 'Volatile Earnings' },
                { category: 'Payment History', score: historyScore, weight: 30, impact: 'HIGH', insight: `${latePayments} late payments recorded` },
                { category: 'Collateral (Stock)', score: assetScore, weight: 20, impact: 'MEDIUM', insight: `Inventory Value: Rp ${(inventoryValue / 1000000).toFixed(1)}jt` }
            ]
        };
    }
}
