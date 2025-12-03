export interface CustomerProfile {
    id: string;
    name: string;
    lastTransactionDate: Date;
    transactionCount: number;
    totalSpent: number;
}

export interface SegmentationResult {
    id: string;
    segment: 'WHALE' | 'LOYAL' | 'AT_RISK' | 'LOST' | 'NEW';
    score: number; // RFM Score
}

export class CustomerAnalyticsEngine {
    public static segmentCustomers(customers: CustomerProfile[]): SegmentationResult[] {
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        return customers.map(c => {
            // 1. Calculate R, F, M values
            const recencyDays = Math.floor((now - c.lastTransactionDate.getTime()) / oneDay);
            const frequency = c.transactionCount;
            const monetary = c.totalSpent;

            // 2. Assign Scores (1-5 scale logic)
            const rScore = recencyDays < 7 ? 5 : recencyDays < 30 ? 4 : recencyDays < 60 ? 3 : recencyDays < 90 ? 2 : 1;
            const fScore = frequency > 50 ? 5 : frequency > 20 ? 4 : frequency > 10 ? 3 : frequency > 5 ? 2 : 1;
            const mScore = monetary > 5000000 ? 5 : monetary > 2000000 ? 4 : monetary > 1000000 ? 3 : monetary > 500000 ? 2 : 1;

            // 3. Composite RFM
            const rfmScore = (rScore * 100) + (fScore * 10) + mScore;

            // 4. Segment Logic
            let segment: SegmentationResult['segment'] = 'NEW';
            if (rfmScore >= 540) segment = 'WHALE';
            else if (rScore >= 4 && fScore >= 3) segment = 'LOYAL';
            else if (rScore <= 2 && fScore >= 3) segment = 'AT_RISK';
            else if (rScore === 1) segment = 'LOST';

            return { id: c.id, segment, score: rfmScore };
        });
    }
}
