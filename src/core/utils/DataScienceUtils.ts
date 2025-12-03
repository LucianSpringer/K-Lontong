/**
 * [LUMEN STRATEGY] High-Performance Statistical Library
 * Provides foundational math for Forensics and Market Prediction engines.
 */

export class DataScienceUtils {

    /**
     * Calculates the Arithmetic Mean
     */
    public static mean(data: number[]): number {
        if (data.length === 0) return 0;
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    /**
     * Calculates Population Variance
     */
    public static variance(data: number[]): number {
        if (data.length === 0) return 0;
        const mu = this.mean(data);
        return data.reduce((acc, val) => acc + Math.pow(val - mu, 2), 0) / data.length;
    }

    /**
     * Calculates Standard Deviation (Sigma)
     */
    public static stdDev(data: number[]): number {
        return Math.sqrt(this.variance(data));
    }

    /**
     * Calculates Z-Score for outlier detection
     * Returns array of Z-Scores corresponding to input data
     */
    public static zScores(data: number[]): number[] {
        const mu = this.mean(data);
        const sigma = this.stdDev(data);
        if (sigma === 0) return data.map(() => 0);
        return data.map(val => (val - mu) / sigma);
    }

    /**
     * Calculates Pearson Correlation Coefficient (r)
     * Measures linear correlation between two sets of data
     */
    public static correlation(x: number[], y: number[]): number {
        if (x.length !== y.length || x.length === 0) return 0;

        const muX = this.mean(x);
        const muY = this.mean(y);

        let numerator = 0;
        let sumSqDiffX = 0;
        let sumSqDiffY = 0;

        for (let i = 0; i < x.length; i++) {
            const diffX = x[i] - muX;
            const diffY = y[i] - muY;
            numerator += diffX * diffY;
            sumSqDiffX += diffX ** 2;
            sumSqDiffY += diffY ** 2;
        }

        const denominator = Math.sqrt(sumSqDiffX * sumSqDiffY);
        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Generates Moving Average (Smoothing)
     */
    public static movingAverage(data: number[], windowSize: number): number[] {
        const result: number[] = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const window = data.slice(start, i + 1);
            result.push(this.mean(window));
        }
        return result;
    }

    /**
     * Calculates Percentile Rank
     */
    public static percentileRank(data: number[], value: number): number {
        const sorted = [...data].sort((a, b) => a - b);
        const index = sorted.findIndex(v => v >= value);
        return index === -1 ? 100 : (index / sorted.length) * 100;
    }
}
