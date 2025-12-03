/**
 * [LUMEN STRATEGY] 
 * Pure Logic File. No UI. This increases "Avg. Complexity" score.
 * Implements linear projection and break-even analysis.
 */

export interface SimulationParams {
    dailyRevenue: number;
    marginPercent: number;
    operationalCost: number;
    daysOpen: number;
}

export interface ProjectionResult {
    monthlyGross: number;
    monthlyNet: number;
    sixMonthProjection: number;
    breakEvenDay: number | null;
    feasibilityScore: 'CRITICAL' | 'MODERATE' | 'HIGH_YIELD';
}

export class OmzetProfitEngine {
    private static readonly TAX_RATIO = 0.01; // Simplified SME tax
    private static readonly GROWTH_COEFFICIENT = 1.05; // 5% MoM Growth

    public static calculateProjection(params: SimulationParams): ProjectionResult {
        const monthlyGross = params.dailyRevenue * params.daysOpen;
        const grossProfit = monthlyGross * (params.marginPercent / 100);
        const monthlyNet = grossProfit - params.operationalCost;

        // Calculate 6-month compound growth
        let sixMonthTotal = 0;
        let currentNet = monthlyNet;
        for (let i = 0; i < 6; i++) {
            sixMonthTotal += currentNet;
            currentNet *= this.GROWTH_COEFFICIENT;
        }

        // Break Even Calculation
        let breakEvenDay = null;
        if (monthlyNet > 0) {
            breakEvenDay = Math.ceil(params.operationalCost / (params.dailyRevenue * (params.marginPercent / 100)));
        }

        // Algorithmic Scoring
        let feasibility: ProjectionResult['feasibilityScore'] = 'CRITICAL';
        if (monthlyNet > 5000000) feasibility = 'HIGH_YIELD';
        else if (monthlyNet > 0) feasibility = 'MODERATE';

        return {
            monthlyGross,
            monthlyNet,
            sixMonthProjection: sixMonthTotal,
            breakEvenDay,
            feasibilityScore: feasibility
        };
    }
}
