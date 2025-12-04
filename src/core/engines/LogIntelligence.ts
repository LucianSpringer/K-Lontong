import { AuditLog } from '../security/AuditLogger';

export interface LogInsight {
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    summary: string;
    count: number;
    recommendation: string;
}

export class LogIntelligence {
    public static analyzeLogs(logs: AuditLog[]): LogInsight[] {
        const insights: LogInsight[] = [];
        const last24h = logs.filter(l => new Date(l.timestamp).getTime() > Date.now() - 86400000);

        // 1. Detect Auth Failures (Brute Force?)
        const authFailures = last24h.filter(l => l.action.includes('AUTH_FAIL') || l.action.includes('SUSPENDED')).length;
        if (authFailures > 3) {
            insights.push({
                severity: 'CRITICAL',
                summary: `${authFailures} Security alerts detected in 24h.`,
                count: authFailures,
                recommendation: "Review Access Control logs. Potential intrusion attempt."
            });
        }

        // 2. Detect Inventory High Velocity
        const restockEvents = last24h.filter(l => l.action === 'RESTOCK').length;
        if (restockEvents > 5) {
            insights.push({
                severity: 'INFO',
                summary: `High restock activity (${restockEvents} POs).`,
                count: restockEvents,
                recommendation: "Demand is spiking. Consider increasing AutoPilot order quantity."
            });
        }

        // 3. System Stability
        const errors = last24h.filter(l => l.severity === 'CRITICAL').length;
        if (errors > 0) {
            insights.push({
                severity: 'WARNING',
                summary: `${errors} System errors recorded.`,
                count: errors,
                recommendation: "Check Developer Console for stack traces."
            });
        }

        if (insights.length === 0) {
            insights.push({
                severity: 'INFO',
                summary: "System operating normally.",
                count: 0,
                recommendation: "No action needed."
            });
        }

        return insights;
    }
}
