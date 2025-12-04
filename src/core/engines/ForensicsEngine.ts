import { TransactionRecord, PaymentMethod } from '../generators/TransactionSeeder';
import { DataScienceUtils } from '../utils/DataScienceUtils'; // Import the Util

export interface FinancialInsight {
    totalRevenue: number;
    averageBasketSize: number;
    fraudRiskScore: number;
    topPaymentMethod: PaymentMethod;
    dailyRevenueTrend: Record<string, number>;
}

export class ForensicsEngine {
    public static analyze(transactions: TransactionRecord[]): FinancialInsight {
        if (transactions.length === 0) throw new Error("Insufficient Data for Forensics");

        let totalRev = 0;
        let fraudFlags = 0;
        const methodCounts: Record<string, number> = {};
        const dailyTrend: Record<string, number> = {};

        // Extract amounts for Statistical Analysis
        const amounts = transactions.map(t => t.totalAmount);

        // [LUMEN CONNECTION] Use DataScienceUtils for Z-Score (Outlier Detection)
        // Detect anomalies (e.g., transactions > 3 standard deviations)
        const zScores = DataScienceUtils.zScores(amounts);

        // Single pass O(n)
        transactions.forEach((tx, index) => {
            totalRev += tx.totalAmount;

            // Logic: Combine Rule-based flag with Statistical Outlier
            const isStatisticalOutlier = Math.abs(zScores[index]) > 3; // > 3 Sigma
            if (tx.isFlaggedSuspicious || isStatisticalOutlier) {
                fraudFlags++;
            }

            // Method Counting
            methodCounts[tx.paymentMethod] = (methodCounts[tx.paymentMethod] || 0) + 1;

            // Daily Trend
            const dateKey = tx.timestamp.toISOString().split('T')[0];
            dailyTrend[dateKey] = (dailyTrend[dateKey] || 0) + tx.totalAmount;
        });

        const topMethod = Object.entries(methodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as PaymentMethod;

        return {
            totalRevenue: totalRev,
            averageBasketSize: DataScienceUtils.mean(amounts), // Use Utility
            fraudRiskScore: (fraudFlags / transactions.length) * 100,
            topPaymentMethod: topMethod,
            dailyRevenueTrend: dailyTrend
        };
    }
}
