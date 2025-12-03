import React, { useMemo } from 'react';
import { WarungIQEngine } from '../../core/engines/WarungIQEngine';
import { ForecastEngine } from '../../core/engines/ForecastEngine';

export const WarungIQDashboard: React.FC = () => {
    // Mock Real-time Data
    const metrics = {
        inventoryTurnover: 8.5,
        marginStability: 2.3,
        transactionFreq: 85,
        fraudRatio: 0.005
    };

    const iqResult = useMemo(() => WarungIQEngine.calculate(metrics), []);

    // Forecast Data (Holt-Winters)
    const history = [12, 13, 15, 14, 18, 20, 22, 21, 25, 28, 30, 29, 35, 38]; // Sales data
    const forecast = useMemo(() => ForecastEngine.holtWinters(history, 7, 0.5, 0.3, 0.3, 7), []);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="mb-8">
                <h2 className="text-4xl font-heading text-warung-deep-brown">Warung IQ <span className="text-warung-teal text-sm align-top">PRO</span></h2>
                <p className="text-gray-500">Artificial Intelligence Business Diagnostics.</p>
            </header>

            {/* IQ Score Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-warung-teal relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-64 h-64 bg-warung-teal/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                                <circle cx="80" cy="80" r="70" stroke="#0D9488" strokeWidth="10" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * iqResult.score / 200)} />
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-4xl font-black text-warung-deep-brown">{iqResult.score}</span>
                                <span className="block text-xs text-gray-400 uppercase tracking-widest">/200</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-warung-deep-brown mb-2">{iqResult.tier} TIER</h3>
                            <p className="text-gray-600 italic mb-4">"{iqResult.recommendation}"</p>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(iqResult.breakdown).map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-xs border-b border-gray-100 pb-1">
                                        <span className="text-gray-500">{k}</span>
                                        <span className="font-bold text-warung-teal">{Math.floor(v)} pts</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forecast Chart (Visualized as Bars) */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h3 className="font-bold text-lg mb-6 text-gray-700"><i className="fas fa-chart-line mr-2 text-warung-orange"></i> Revenue Forecast (AI)</h3>
                    <div className="flex items-end gap-2 h-48">
                        {forecast.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div
                                    className={`w-full rounded-t-md transition-all duration-500 ${i >= 14 ? 'bg-warung-orange opacity-80' : 'bg-gray-300'}`}
                                    style={{ height: `${(val / 40) * 100}%` }}
                                ></div>
                                <span className="text-[10px] text-center text-gray-400 mt-2">{i >= 14 ? `+${i - 13}d` : ''}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-xs font-bold">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-300"></div> History</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-warung-orange"></div> AI Projection</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
