import { AuditLogger } from '../security/AuditLogger';
import { NotificationOrchestrator } from '../services/NotificationOrchestrator';

export interface EmergencyStatus {
    isEmergency: boolean;
    revenueDrop: number; // percentage
    activeCountermeasures: string[];
}

export class EmergencyResponseEngine {
    // 7-day moving average check
    public static checkHealth(dailyRevenues: number[]): EmergencyStatus {
        if (dailyRevenues.length < 7) return { isEmergency: false, revenueDrop: 0, activeCountermeasures: [] };

        const thisWeek = dailyRevenues.slice(-7);
        const lastWeek = dailyRevenues.slice(-14, -7);

        const avgThis = thisWeek.reduce((a, b) => a + b, 0) / 7;
        const avgLast = lastWeek.reduce((a, b) => a + b, 0) / 7;

        const drop = ((avgLast - avgThis) / avgLast) * 100;

        if (drop > 40) {
            return {
                isEmergency: true,
                revenueDrop: parseFloat(drop.toFixed(1)),
                activeCountermeasures: []
            };
        }

        return { isEmergency: false, revenueDrop: Math.max(0, parseFloat(drop.toFixed(1))), activeCountermeasures: [] };
    }

    public static activateProtocol(): string[] {
        const actions = [
            "DISCOUNT_ALL_20_PERCENT",
            "BROADCAST_WA_L500", // Last 500 customers
            "RESTOCK_TOP_PARETO" // Restock top 20% items generating 80% revenue
        ];

        AuditLogger.log('EMERGENCY_PROTOCOL', 'DEFCON_1_ACTIVATED', 'CRITICAL');
        NotificationOrchestrator.notify('WARNING', '⚠️ DARURAT: Protokol Penyelamatan Omzet Diaktifkan!');

        return actions;
    }
}
