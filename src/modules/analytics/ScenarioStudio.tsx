import React, { useState, useMemo } from 'react';

export const ScenarioStudio: React.FC = () => {
    const [priceMod, setPriceMod] = useState(0); // % change
    const [costMod, setCostMod] = useState(0); // % change
    const [trafficMod, setTrafficMod] = useState(0); // % change

    // Base Metrics (Monthly)
    const baseRev = 15000000;
    const baseCost = 10000000;
    const baseProfit = baseRev - baseCost;

    const simulation = useMemo(() => {
        const newRev = baseRev * (1 + priceMod / 100) * (1 + trafficMod / 100);
        const newCost = baseCost * (1 + costMod / 100) * (1 + trafficMod / 100 * 0.5); // Traffic increases variable cost slightly
        const newProfit = newRev - newCost;

        return { revenue: newRev, cost: newCost, profit: newProfit };
    }, [priceMod, costMod, trafficMod]);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="mb-8">
                <h2 className="text-3xl font-heading text-warung-deep-brown">Scenario Studio</h2>
                <p className="text-gray-500">Simulate business changes and project financial impact.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-8">
                    <h3 className="font-bold text-gray-700">Variables</h3>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Pricing Strategy ({priceMod > 0 ? '+' : ''}{priceMod}%)</label>
                        <input type="range" min="-50" max="50" value={priceMod} onChange={e => setPriceMod(Number(e.target.value))} className="w-full accent-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Operational Cost ({costMod > 0 ? '+' : ''}{costMod}%)</label>
                        <input type="range" min="-50" max="50" value={costMod} onChange={e => setCostMod(Number(e.target.value))} className="w-full accent-red-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Customer Traffic ({trafficMod > 0 ? '+' : ''}{trafficMod}%)</label>
                        <input type="range" min="-50" max="100" value={trafficMod} onChange={e => setTrafficMod(Number(e.target.value))} className="w-full accent-green-500" />
                    </div>
                </div>

                {/* Results */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 uppercase">Projected Revenue</p>
                            <p className="text-2xl font-mono font-bold text-blue-600">Rp {simulation.revenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 uppercase">Projected Cost</p>
                            <p className="text-2xl font-mono font-bold text-red-500">Rp {simulation.cost.toLocaleString()}</p>
                        </div>
                        <div className={`p-4 rounded-xl shadow border text-center ${simulation.profit > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <p className="text-xs text-gray-500 uppercase">Net Profit</p>
                            <p className={`text-2xl font-mono font-bold ${simulation.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Rp {simulation.profit.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Visual Comparison */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-64 flex items-end justify-center gap-16">
                        {/* Baseline */}
                        <div className="w-24 flex flex-col items-center gap-2 group">
                            <div className="text-xs font-bold text-gray-400">BASELINE</div>
                            <div className="w-full bg-gray-300 rounded-t-lg" style={{ height: '50%' }}></div>
                            <div className="text-sm font-bold">Rp {baseProfit.toLocaleString()}</div>
                        </div>

                        {/* Simulation */}
                        <div className="w-24 flex flex-col items-center gap-2 group">
                            <div className="text-xs font-bold text-warung-orange">SIMULATION</div>
                            <div
                                className={`w-full rounded-t-lg transition-all duration-500 ${simulation.profit > baseProfit ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ height: `${Math.max(10, Math.min(100, (simulation.profit / (baseProfit * 2)) * 100))}%` }}
                            ></div>
                            <div className="text-sm font-bold">Rp {simulation.profit.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
