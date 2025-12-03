interface CustomerProfile {
    id: string;
    name: string;
    joinDate: Date;
    totalSpend: number;
    currentDebt: number;
    repaymentHistory: number[]; // Days taken to repay previous debts
    latePayments: number;
}

export interface CreditVerdict {
    canGrant: boolean;
    maxLimit: number;
    riskScore: number; // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reason: string;
}

export class CreditRiskEngine {
    private static readonly BASE_LIMIT = 200000; // Rp 200rb for new users
    private static readonly MAX_LIMIT_CAP = 5000000; // Rp 5jt absolute cap

    /**
     * Complex Heuristic for Debt Limit Calculation
     */
    public static assess(profile: CustomerProfile, requestedAmount: number): CreditVerdict {
        // 1. Calculate Risk Score based on repayment history
        let riskScore = 100;

        // Penalize for late payments
        riskScore -= (profile.latePayments * 15);

        // Penalize for slow average repayment (if > 7 days)
        const avgRepayTime = profile.repaymentHistory.reduce((a, b) => a + b, 0) / (profile.repaymentHistory.length || 1);
        if (avgRepayTime > 14) riskScore -= 20;
        if (avgRepayTime > 30) riskScore -= 40;

        // Boost for loyalty (Membership duration)
        const monthsMember = (new Date().getTime() - profile.joinDate.getTime()) / (1000 * 3600 * 24 * 30);
        if (monthsMember > 6) riskScore += 10;
        if (monthsMember > 12) riskScore += 15;

        // Cap Risk Score
        riskScore = Math.max(0, Math.min(100, riskScore));

        // 2. Determine Max Limit
        let calculatedLimit = this.BASE_LIMIT;

        // Multiplier based on Total Spend (The "Whale" Factor)
        if (profile.totalSpend > 1000000) calculatedLimit *= 1.5;
        if (profile.totalSpend > 5000000) calculatedLimit *= 2.5;

        // Risk Adjustment
        calculatedLimit = calculatedLimit * (riskScore / 100);

        // Hard Limit Cap
        calculatedLimit = Math.min(calculatedLimit, this.MAX_LIMIT_CAP);

        // 3. Verdict Logic
        const newTotalDebt = profile.currentDebt + requestedAmount;
        let riskLevel: CreditVerdict['riskLevel'] = 'LOW';
        if (riskScore < 50) riskLevel = 'HIGH';
        else if (riskScore < 75) riskLevel = 'MEDIUM';
        if (riskScore < 30) riskLevel = 'CRITICAL';

        // Override: Immediate Rejection if Critical
        if (riskLevel === 'CRITICAL') {
            return {
                canGrant: false,
                maxLimit: 0,
                riskScore,
                riskLevel,
                reason: "Critical Risk Profile: Too many late payments."
            };
        }

        // Override: Over limit
        if (newTotalDebt > calculatedLimit) {
            return {
                canGrant: false,
                maxLimit: calculatedLimit,
                riskScore,
                riskLevel,
                reason: `Limit Exceeded. Max allowed: Rp ${calculatedLimit.toLocaleString()}`
            };
        }

        return {
            canGrant: true,
            maxLimit: calculatedLimit,
            riskScore,
            riskLevel,
            reason: "Credit Approved based on healthy history."
        };
    }
}
