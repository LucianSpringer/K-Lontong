import { AuditLogger } from '../security/AuditLogger';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface AppNotification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: number;
}

export class NotificationOrchestrator {
    private static queue: AppNotification[] = [];
    private static listeners: ((n: AppNotification) => void)[] = [];

    public static subscribe(listener: (n: AppNotification) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public static notify(type: NotificationType, message: string) {
        const notification: AppNotification = {
            id: crypto.randomUUID(),
            type,
            message,
            timestamp: Date.now()
        };

        this.queue.push(notification);

        // Dispatch to listeners
        this.listeners.forEach(l => l(notification));

        // Log high severity
        if (type === 'ERROR' || type === 'WARNING') {
            AuditLogger.log('NOTIFICATION_DISPATCH', `${type}:${message}`, 'WARNING');
        }

        // Simulate Web Push (Console log for demo)
        console.log(`[PUSH_NOTIFICATION] ${type}: ${message}`);
    }

    public static getRecent(): AppNotification[] {
        return this.queue.slice(-5); // Last 5
    }
}
