import { AuditLogger } from '../security/AuditLogger';

export interface Policy {
    id: string;
    type: 'FIRE' | 'FLOOD' | 'THEFT' | 'SPOILAGE';
    coverage: number; // Limit
    dailyPremium: number; // Rp 200 - 500
    active: boolean;
    provider: 'ALLIANZ' | 'QOALA' | 'AXA';
}

export class MicroInsuranceEngine {
    private static policies: Policy[] = [
        { id: 'POL-001', type: 'FIRE', coverage: 50000000, dailyPremium: 200, active: true, provider: 'ALLIANZ' },
        { id: 'POL-002', type: 'THEFT', coverage: 10000000, dailyPremium: 150, active: false, provider: 'QOALA' }
    ];

    private static balanceDeductionLog: { date: string, amount: number }[] = [];

    public static getActivePolicies() {
        return this.policies;
    }

    public static togglePolicy(id: string) {
        const p = this.policies.find(x => x.id === id);
        if (p) p.active = !p.active;
    }

    public static processDailyDeduction(currentBalance: number): number {
        const totalPremium = this.policies
            .filter(p => p.active)
            .reduce((sum, p) => sum + p.dailyPremium, 0);

        if (totalPremium > 0) {
            this.balanceDeductionLog.push({
                date: new Date().toISOString(),
                amount: totalPremium
            });
            AuditLogger.log('INSURANCE_DEBIT', `DAILY_PREMIUM: Rp${totalPremium}`, 'INFO');
        }

        return currentBalance - totalPremium;
    }

    public static fileClaim(policyId: string, evidence: File): Promise<string> {
        console.log("Filing claim for policy:", policyId, "with evidence:", evidence.name);
        return new Promise(resolve => {
            setTimeout(() => {
                AuditLogger.log('INSURANCE_CLAIM', `CLAIM_FILED: ${policyId}`, 'WARNING');
                resolve("CLAIM_ACCEPTED_AUTO_24H");
            }, 2000);
        });
    }
}
