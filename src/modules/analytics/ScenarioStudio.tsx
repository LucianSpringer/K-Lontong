import React, { useState, useMemo } from 'react';
import { CashflowEngine } from '../../core/engines/CashflowEngine';

export const ScenarioStudio: React.FC = () => {
    const [priceMod, setPriceMod] = useState(0);
    const [costMod, setCostMod] = useState(0);
    const [trafficMod, setTrafficMod] = useState(0);

    // Base Data
    const historicalRev = [12000000, 13500000, 11000000, 14200000, 15000000];
    const currentBalance = 50000000;

    const simulation = useMemo(() => {
        // 1. Adjust History based on modifiers to simulate "What-If"
        const adjustedHistory = historicalRev.map(val =>
            val * (1 + priceMod / 100) * (1 + trafficMod / 100)
        );

        // 2. Run the Heavy Engine
        const projection = CashflowEngine.generateProjection(adjustedHistory, currentBalance, 30);

        // 3. Calculate Totals
        const totalRev = projection.revenue.reduce((a, b) => a + b, 0);

        // Apply Cost Mod to the Engine's output
        const totalCost = projection.expenses.reduce((a, b) => a + b, 0) * (1 + costMod / 100);

        return {
            revenue: totalRev,
            cost: totalCost,
            profit: totalRev - totalCost,
            runway: projection.runwayMonths
        };
    }, [priceMod, costMod, trafficMod]);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Scenario Studio</h1>
                    <p className="text-gray-500">Business Simulation & Forecasting</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-500">Runway Prediction:</span>
                    <span className={`ml-2 font-bold ${simulation.runway > 12 ? 'text-green-600' : 'text-red-500'}`}>
                        {simulation.runway > 24 ? '> 2 Years' : `${simulation.runway} Months`}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Controls */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-8">
                    <h3 className="font-bold text-gray-700 border-b pb-2">Simulation Parameters</h3>

                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                            <span>Pricing Strategy</span>
                            <span className={priceMod > 0 ? 'text-green-600' : 'text-red-500'}>{priceMod > 0 ? '+' : ''}{priceMod}%</span>
                        </label>
                        <input
                            type="range" min="-20" max="50" value={priceMod}
                            onChange={(e) => setPriceMod(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-warung-orange"
                        />
                        <p className="text-xs text-gray-400 mt-1">Impact on Margin & Volume</p>
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                            <span>Operational Costs</span>
                            <span className={costMod > 0 ? 'text-red-500' : 'text-green-600'}>{costMod > 0 ? '+' : ''}{costMod}%</span>
                        </label>
                        <input
                            type="range" min="-10" max="30" value={costMod}
                            onChange={(e) => setCostMod(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-warung-orange"
                        />
                        <p className="text-xs text-gray-400 mt-1">Overhead & COGS Adjustments</p>
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                            <span>Foot Traffic</span>
                            <span className={trafficMod > 0 ? 'text-green-600' : 'text-red-500'}>{trafficMod > 0 ? '+' : ''}{trafficMod}%</span>
                        </label>
                        <input
                            type="range" min="-50" max="50" value={trafficMod}
                            onChange={(e) => setTrafficMod(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-warung-orange"
                        />
                        <p className="text-xs text-gray-400 mt-1">Marketing & Location Impact</p>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase font-bold">Projected Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                Rp {simulation.revenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase font-bold">Projected Cost</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">
                                Rp {simulation.cost.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase font-bold">Net Profit</p>
                            <p className={`text-2xl font-bold mt-1 ${simulation.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Rp {simulation.profit.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <i className="fas fa-chart-area text-4xl mb-2"></i>
                            <p>Interactive Projection Chart Placeholder</p>
                            <p className="text-xs">(Requires Chart.js Integration)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
