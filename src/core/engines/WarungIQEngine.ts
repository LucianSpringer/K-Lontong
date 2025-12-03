import { AuditLogger } from '../security/AuditLogger';

export interface WarungMetrics {
    inventoryTurnover: number; // e.g., 4.5 times/year
    marginStability: number; // Standard deviation of margin
    transactionFreq: number; // Avg daily transactions
    fraudRatio: number; // % of flagged transactions
}

export interface IQResult {
    score: number; // 0-200
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    breakdown: Record<string, number>;
    recommendation: string;
}

export class WarungIQEngine {
    // Weights for composite score
    private static readonly W_TURNOVER = 40;
    private static readonly W_MARGIN = 30;
    private static readonly W_TRAFFIC = 20;
    private static readonly W_SECURITY = 10;

    public static calculate(metrics: WarungMetrics): IQResult {
        // 1. Normalize Scores (0-1 scale)
        const sTurnover = Math.min(metrics.inventoryTurnover / 12, 1); // Target: 12x turnover
        const sMargin = Math.max(0, 1 - (metrics.marginStability / 20)); // Lower std dev is better
        const sTraffic = Math.min(metrics.transactionFreq / 100, 1); // Target: 100 tx/day
        const sSecurity = Math.max(0, 1 - (metrics.fraudRatio * 10)); // 10% fraud = 0 score

        // 2. Calculate Weighted Components (Scale to 200 max total)
        const cTurnover = sTurnover * this.W_TURNOVER * 2;
        const cMargin = sMargin * this.W_MARGIN * 2;
        const cTraffic = sTraffic * this.W_TRAFFIC * 2;
        const cSecurity = sSecurity * this.W_SECURITY * 2;

        const totalScore = Math.floor(cTurnover + cMargin + cTraffic + cSecurity);

        // 3. Determine Tier
        let tier: IQResult['tier'] = 'BRONZE';
        if (totalScore > 160) tier = 'PLATINUM';
        else if (totalScore > 120) tier = 'GOLD';
        else if (totalScore > 80) tier = 'SILVER';

        // 4. Generate Insight
        let recommendation = "Pertahankan kinerja Anda!";
        if (sTurnover < 0.5) recommendation = "Perputaran stok lambat. Cek barang mati (Dead Stock).";
        if (sSecurity < 0.5) recommendation = "Risiko kecurangan tinggi! Perketat akses kasir.";

        AuditLogger.log('IQ_CALC', `SCORE:${totalScore} TIER:${tier}`, 'INFO');

        return {
            score: totalScore,
            tier,
            breakdown: {
                'Inventory Health': cTurnover,
                'Profit Stability': cMargin,
                'Traffic Volume': cTraffic,
                'Security Score': cSecurity
            },
            recommendation
        };
    }
}
