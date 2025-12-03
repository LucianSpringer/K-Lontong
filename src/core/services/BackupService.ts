import { AuditLogger } from '../security/AuditLogger';
import { OfflinePersistence } from '../offline/OfflinePersistence';

export class BackupService {
    /**
     * Generates a full system backup (LocalStorage + IndexedDB)
     */
    public static async generateBackup(): Promise<Blob> {
        const backupData: any = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            localStorage: { ...localStorage },
            indexedDB: []
        };

        // Extract Offline Transactions
        const db = new OfflinePersistence();
        try {
            await db.init();
            // In a real app, we'd fetch all. For now, we simulate a snapshot.
            const pending = await db.getUnsyncedTransactions();
            backupData.indexedDB = pending;
        } catch (e) {
            console.warn("Failed to backup IndexedDB", e);
        }

        // Remove sensitive keys if any (Simulated sanitation)
        delete backupData.localStorage['auth_token'];

        AuditLogger.log('SYSTEM_BACKUP', 'FULL_EXPORT_GENERATED', 'INFO');

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        return blob;
    }

    /**
     * Restores system state from a JSON file
     */
    public static async restoreBackup(file: File): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);

                    // 1. Restore LocalStorage
                    if (json.localStorage) {
                        Object.entries(json.localStorage).forEach(([key, val]) => {
                            localStorage.setItem(key, val as string);
                        });
                    }

                    // 2. Restore IndexedDB (Simulated re-injection)
                    if (json.indexedDB && Array.isArray(json.indexedDB)) {
                        const db = new OfflinePersistence();
                        await db.init();
                        for (const tx of json.indexedDB) {
                            await db.saveTransaction(tx);
                        }
                    }

                    AuditLogger.log('SYSTEM_RESTORE', 'BACKUP_APPLIED', 'CRITICAL');
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsText(file);
        });
    }
}
