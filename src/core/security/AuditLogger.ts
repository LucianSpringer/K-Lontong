export interface AuditLog {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    resource: string;
    metadata?: Record<string, any>;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export class AuditLogger {
    private static readonly STORAGE_KEY = 'klontong_audit_logs';

    public static log(action: string, resource: string, severity: AuditLog['severity'] = 'INFO'): void {
        const newLog: AuditLog = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            actor: 'CURRENT_USER', // Placeholder for session user
            action,
            resource,
            severity
        };

        const logs = this.getLogs();
        logs.unshift(newLog); // Prepend O(n)

        // Rotation Policy: Cap at 500 logs to prevent storage exhaustion
        if (logs.length > 500) logs.length = 500;

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
        } catch (e) {
            console.warn("Audit Log Storage Full - Rotation Required");
        }
    }

    public static getLogs(): AuditLog[] {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    public static clearLogs(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
