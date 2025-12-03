export class ForecastEngine {
    /**
     * Holt-Winters Triple Exponential Smoothing
     * Used for data with trend and seasonality.
     * * @param data Historical data points
     * @param seasonLength Length of seasonality (e.g., 7 for weekly)
     * @param alpha Level smoothing factor (0-1)
     * @param beta Trend smoothing factor (0-1)
     * @param gamma Seasonal smoothing factor (0-1)
     * @param horizon Number of points to forecast
     */
    public static holtWinters(
        data: number[],
        seasonLength: number,
        alpha: number,
        beta: number,
        gamma: number,
        horizon: number
    ): number[] {
        if (data.length < seasonLength * 2) {
            throw new Error("Insufficient data for Holt-Winters (Need 2x Season Length)");
        }

        let trend = 0;
        const seasonals: number[] = new Array(seasonLength).fill(0);

        // Initialize Trend
        for (let i = 0; i < seasonLength; i++) {
            trend += (data[i + seasonLength] - data[i]) / seasonLength;
        }
        trend /= seasonLength;

        // Initialize Seasonals
        for (let i = 0; i < seasonLength; i++) {
            seasonals[i] = data[i] / (data.reduce((a, b) => a + b, 0) / data.length); // Simplified init
        }

        let level = data[0];
        const result: number[] = [];

        // Smoothing Loop
        for (let i = 0; i < data.length + horizon; i++) {
            if (i >= data.length) {
                // Forecasting Phase
                const m = i - data.length + 1;
                const forecast = (level + m * trend) * seasonals[i % seasonLength];
                result.push(Math.max(0, forecast));
            } else {
                // Updating Components
                const val = data[i];
                const lastLevel = level;

                level = alpha * (val / seasonals[i % seasonLength]) + (1 - alpha) * (lastLevel + trend);
                trend = beta * (level - lastLevel) + (1 - beta) * trend;
                seasonals[i % seasonLength] = gamma * (val / level) + (1 - gamma) * seasonals[i % seasonLength];
            }
        }

        return result;
    }
}
