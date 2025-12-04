import { AuditLogger } from '../security/AuditLogger';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
    private state: CircuitState = 'CLOSED';
    private failures = 0;
    private lastFailureTime = 0;

    // Configuration
    private readonly threshold = 5; // 5 failures to open
    private readonly timeout = 10000; // 10s cooldown

    public async execute<T>(action: () => Promise<T>, serviceId: string): Promise<T> {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.timeout) {
                this.state = 'HALF_OPEN';
                AuditLogger.log('NET_CIRCUIT', `${serviceId}: Attempting Recovery`, 'WARNING');
            } else {
                throw new Error(`Circuit OPEN for ${serviceId}. Request blocked.`);
            }
        }

        try {
            const result = await action();
            this.success();
            return result;
        } catch (e) {
            this.failure(serviceId);
            throw e;
        }
    }

    private success() {
        this.failures = 0;
        this.state = 'CLOSED';
    }

    private failure(serviceId: string) {
        this.failures++;
        if (this.failures >= this.threshold) {
            this.state = 'OPEN';
            this.lastFailureTime = Date.now();
            AuditLogger.log('NET_CIRCUIT', `${serviceId}: THRESHOLD REACHED. CIRCUIT OPEN.`, 'CRITICAL');
        }
    }
}
