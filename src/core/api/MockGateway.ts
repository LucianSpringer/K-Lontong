export class MockGateway {
    private static readonly BASE_LATENCY = 300; // ms

    public static async fetch(endpoint: string, _options: any = {}): Promise<any> {
        const latency = this.BASE_LATENCY + Math.random() * 500; // Jitter

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Router Logic
                if (endpoint.includes('/inventory')) {
                    resolve({ status: 200, data: { items: 50, lastSync: new Date() } });
                } else if (endpoint.includes('/analytics')) {
                    resolve({ status: 200, data: { dailyRevenue: 1500000 } });
                } else if (endpoint.includes('/auth')) {
                    resolve({ status: 200, token: 'mock_jwt_token_xyz' });
                } else {
                    reject({ status: 404, error: 'Endpoint not found' });
                }
            }, latency);
        });
    }
}
