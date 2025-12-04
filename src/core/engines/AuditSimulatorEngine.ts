import { InventoryItem } from '../types/InventoryTypes';
import { TransactionRecord } from '../generators/TransactionSeeder';

export interface AuditDiscrepancy {
    sku: string;
    name: string;
    expectedStock: number;
    actualStock: number;
    variance: number; // Amount lost
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    cause: 'THEFT' | 'SPOILAGE' | 'ADMIN_ERROR';
}

export interface AuditReport {
    id: string;
    date: Date;
    complianceScore: number; // 0-100
    totalVariance: number;
    discrepancies: AuditDiscrepancy[];
}

export class AuditSimulatorEngine {

    public static runAudit(inventory: InventoryItem[], _transactions: TransactionRecord[]): AuditReport {
        const discrepancies: AuditDiscrepancy[] = [];
        let totalVarianceValue = 0;
        let perfectItems = 0;

        inventory.forEach(item => {
            // 1. Calculate Expected Stock
            // Logic: Initial + Restock - Sales
            // Simplified for simulation: Compare recorded stock vs "Physical Count" (Simulated)

            const recordedStock = item.currentStock;

            // Simulate Physical Count with probability of error
            // Higher probability of error for "High Risk" items (e.g., small, expensive)
            const errorProb = item.purchasePrice > 50000 ? 0.3 : 0.1;
            let physicalStock = recordedStock;

            if (Math.random() < errorProb) {
                // Simulate shrinkage
                const shrinkage = Math.ceil(Math.random() * 3);
                physicalStock = Math.max(0, recordedStock - shrinkage);
            }

            if (physicalStock !== recordedStock) {
                const varianceQty = recordedStock - physicalStock;
                const varianceVal = varianceQty * item.purchasePrice;
                totalVarianceValue += varianceVal;

                discrepancies.push({
                    sku: item.sku,
                    name: item.name,
                    expectedStock: recordedStock,
                    actualStock: physicalStock,
                    variance: varianceVal,
                    severity: varianceVal > 500000 ? 'HIGH' : varianceVal > 100000 ? 'MEDIUM' : 'LOW',
                    cause: Math.random() > 0.7 ? 'THEFT' : Math.random() > 0.5 ? 'SPOILAGE' : 'ADMIN_ERROR'
                });
            } else {
                perfectItems++;
            }
        });

        // Calculate Score
        // 100 points - penalty per variance value
        const penalty = Math.min(100, (totalVarianceValue / 1000000) * 10); // 1jt loss = 10pt penalty
        const score = Math.max(0, 100 - penalty);

        return {
            id: `AUD-${Date.now()}`,
            date: new Date(),
            complianceScore: Math.floor(score),
            totalVariance: totalVarianceValue,
            discrepancies: discrepancies.sort((a, b) => b.variance - a.variance)
        };
    }
}
