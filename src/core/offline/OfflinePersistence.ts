/**
 * [LUMEN STRATEGY] Mission Critical Data Layer
 * Direct implementation of IndexedDB for offline-first resilience.
 * Handles schema versioning, transaction atomicity, and cursor iteration.
 */

export interface OfflineTransaction {
    id: string;
    timestamp: number;
    items: string; // JSON stringified for raw storage
    total: number;
    paymentMethod: string;
    synced: 0 | 1; // 0 = Pending, 1 = Synced
}

export class OfflinePersistence {
    private static readonly DB_NAME = 'KLontong_Core_DB';
    private static readonly DB_VERSION = 1;
    private static readonly STORE_TX = 'transactions';
    private static readonly STORE_PENDING = 'sync_queue';

    private db: IDBDatabase | null = null;

    /**
     * Initialize the Database Connection
     */
    public async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(OfflinePersistence.DB_NAME, OfflinePersistence.DB_VERSION);

            request.onerror = () => {
                console.error("Critical: Failed to open Local Database");
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log("System: Offline Persistence Layer Active");
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Transaction Store with Indexing
                if (!db.objectStoreNames.contains(OfflinePersistence.STORE_TX)) {
                    const store = db.createObjectStore(OfflinePersistence.STORE_TX, { keyPath: 'id' });
                    store.createIndex('by_date', 'timestamp', { unique: false });
                    store.createIndex('by_sync_status', 'synced', { unique: false });
                }

                // Sync Queue for Conflict Resolution
                if (!db.objectStoreNames.contains(OfflinePersistence.STORE_PENDING)) {
                    db.createObjectStore(OfflinePersistence.STORE_PENDING, { autoIncrement: true });
                }
            };
        });
    }

    /**
     * Atomic Write Operation
     */
    public async saveTransaction(tx: OfflineTransaction): Promise<void> {
        this.ensureConnection();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([OfflinePersistence.STORE_TX], 'readwrite');
            const store = transaction.objectStore(OfflinePersistence.STORE_TX);
            const request = store.add(tx);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Bulk Read for Analytics (Cursor-based)
     */
    public async getUnsyncedTransactions(): Promise<OfflineTransaction[]> {
        this.ensureConnection();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([OfflinePersistence.STORE_TX], 'readonly');
            const store = transaction.objectStore(OfflinePersistence.STORE_TX);
            const index = store.index('by_sync_status');
            const request = index.getAll(0); // Get all where synced == 0

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Mark transactions as synced after server acknowledgment
     */
    public async markSynced(ids: string[]): Promise<void> {
        this.ensureConnection();
        const transaction = this.db!.transaction([OfflinePersistence.STORE_TX], 'readwrite');
        const store = transaction.objectStore(OfflinePersistence.STORE_TX);

        for (const id of ids) {
            const getReq = store.get(id);
            getReq.onsuccess = () => {
                const record = getReq.result;
                if (record) {
                    record.synced = 1;
                    store.put(record);
                }
            };
        }

        return new Promise((resolve) => {
            transaction.oncomplete = () => resolve();
        });
    }

    private ensureConnection() {
        if (!this.db) throw new Error("Database not initialized. Call init() first.");
    }
}
