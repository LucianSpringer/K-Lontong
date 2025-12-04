import { ForecastEngine } from './ForecastEngine';
import { DataScienceUtils } from '../utils/DataScienceUtils';

export interface CashflowProjection {
    dates: string[];
    revenue: number[];
    expenses: number[];
    netCash: number[];
    runwayMonths: number;
    burnRate: number;
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export class CashflowEngine {
    private static readonly FIXED_COSTS = 5000000; // Rent, Salaries
    private static readonly VAR_COST_RATIO = 0.6; // COGS

    public static generateProjection(
        historicalRevenue: number[],
        currentBalance: number,
        days: number = 30
    ): CashflowProjection {
        // 1. Forecast Revenue (Holt-Winters)
        // Pad history if needed to satisfy HW requirements
        const safeHistory = historicalRevenue.length < 14
            ? [...Array(14 - historicalRevenue.length).fill(DataScienceUtils.mean(historicalRevenue)), ...historicalRevenue]
            : historicalRevenue;

        const revForecast = ForecastEngine.holtWinters(safeHistory, 7, 0.5, 0.3, 0.3, days);

        // 2. Project Expenses & Net Cash
        const dates: string[] = [];
        const expenses: number[] = [];
        const netCash: number[] = [];
        let runningBalance = currentBalance;
        let totalBurn = 0;

        const today = new Date();

        revForecast.forEach((rev, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i + 1);
            dates.push(date.toISOString().split('T')[0]);

            // Expense Model: Fixed / 30 + Variable * Revenue
            const dailyFixed = this.FIXED_COSTS / 30;
            const dailyVariable = rev * this.VAR_COST_RATIO;
            const totalDailyExpense = dailyFixed + dailyVariable;

            // Add Random "Shock" (Unexpected Expense)
            const shock = Math.random() > 0.95 ? 500000 : 0;

            const dayExpense = totalDailyExpense + shock;
            expenses.push(dayExpense);

            const dayNet = rev - dayExpense;
            netCash.push(dayNet);

            runningBalance += dayNet;
            if (dayNet < 0) totalBurn += Math.abs(dayNet);
        });

        // 3. Calculate Runway
        const avgMonthlyBurn = (totalBurn / days) * 30;
        const runway = avgMonthlyBurn > 0 ? currentBalance / avgMonthlyBurn : 999;

        return {
            dates,
            revenue: revForecast,
            expenses,
            netCash,
            runwayMonths: parseFloat(runway.toFixed(1)),
            burnRate: parseFloat(avgMonthlyBurn.toFixed(0)),
            status: runway < 3 ? 'CRITICAL' : runway < 6 ? 'WARNING' : 'HEALTHY'
        };
    }
}
