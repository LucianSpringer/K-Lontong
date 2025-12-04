import { AuditLogger } from '../security/AuditLogger';

export interface FranchisePackage {
    tier: 'STARTER' | 'GROWTH' | 'DOMINANCE';
    setupCost: number;
    royaltyFee: number; // %
    includes: string[];
    sopLink: string;
    roiMonths: number;
}

export class FranchiseHQEngine {

    public static generatePackage(tier: FranchisePackage['tier']): FranchisePackage {
        let pkg: FranchisePackage;

        switch (tier) {
            case 'STARTER':
                pkg = {
                    tier,
                    setupCost: 15000000,
                    royaltyFee: 5,
                    includes: ['Branding Kit', 'POS System', 'Basic SOP', 'Supply Chain Access'],
                    sopLink: '/docs/sop-lite-v2.pdf',
                    roiMonths: 12
                };
                break;
            case 'GROWTH':
                pkg = {
                    tier,
                    setupCost: 45000000,
                    royaltyFee: 7,
                    includes: ['Interior Design 3D', 'Full Staff Training', 'Marketing Blast', 'Dedicated Supervisor'],
                    sopLink: '/docs/sop-pro-v4.pdf',
                    roiMonths: 9
                };
                break;
            case 'DOMINANCE':
                pkg = {
                    tier,
                    setupCost: 100000000,
                    royaltyFee: 6, // Lower royalty for high initial investment
                    includes: ['Ruko Renovation', 'Grand Opening Event', 'Exclusive Area Rights', 'IPO Access'],
                    sopLink: '/docs/sop-master-v1.pdf',
                    roiMonths: 7
                };
                break;
        }
        return pkg;
    }

    public static calculateRoyalty(monthlyRevenue: number, tier: FranchisePackage['tier']): number {
        const pkg = this.generatePackage(tier);
        const royalty = monthlyRevenue * (pkg.royaltyFee / 100);
        AuditLogger.log('FRANCHISE_ROYALTY', `TIER:${tier} REV:${monthlyRevenue} FEE:${royalty}`, 'INFO');
        return royalty;
    }
}
