import { InventoryItem, SKU } from '../types/InventoryTypes';
import { NotificationOrchestrator } from '../services/NotificationOrchestrator';
import { AuditLogger } from '../security/AuditLogger';

export interface ExpiryRisk {
    sku: SKU;
    daysRemaining: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    suggestedAction: string;
    discountRate: number;
    potentialLoss: number;
}

export class ExpiryIntelEngine {
    // Config: Thresholds for alerts
    private static readonly CRITICAL_DAYS = 7;
    private static readonly HIGH_DAYS = 30;

    public static analyze(inventory: InventoryItem[]): ExpiryRisk[] {
        const risks: ExpiryRisk[] = [];
        const today = new Date();

        inventory.forEach(item => {
            // Mocking Expiry Date (In real app, this is a field in InventoryItem)
            // Randomize expiry for demo purposes: some close, some far
            const daysOffset = Math.floor(Math.random() * 60) - 5; // -5 to 55 days
            const expiryDate = new Date(today);
            expiryDate.setDate(today.getDate() + daysOffset);

            const diffTime = expiryDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let riskLevel: ExpiryRisk['riskLevel'] = 'LOW';
            let discountRate = 0;
            let action = "Keep Price";

            if (daysRemaining <= 0) {
                riskLevel = 'CRITICAL';
                action = "DISPOSE / DONATE";
                discountRate = 1.0; // Write-off
            } else if (daysRemaining <= this.CRITICAL_DAYS) {
                riskLevel = 'HIGH';
                action = "FLASH SALE 50%";
                discountRate = 0.5;
                // Trigger Auto-Notif
                NotificationOrchestrator.notify('WARNING', `EXPIRY ALERT: ${item.name} expires in ${daysRemaining} days!`);
            } else if (daysRemaining <= this.HIGH_DAYS) {
                riskLevel = 'MEDIUM';
                action = "BUNDLE PROMO";
                discountRate = 0.2;
            }

            if (riskLevel !== 'LOW') {
                const potentialLoss = item.purchasePrice * item.currentStock;
                risks.push({
                    sku: item.sku,
                    daysRemaining,
                    riskLevel,
                    suggestedAction: action,
                    discountRate,
                    potentialLoss
                });

                if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
                    AuditLogger.log('EXPIRY_RISK', `SKU:${item.sku} DAYS:${daysRemaining} ACTION:${action}`, 'WARNING');
                }
            }
        });

        return risks.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }
}
