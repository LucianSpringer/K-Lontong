import React, { useState, useMemo } from 'react';
import { WarungIPOEngine } from '../../core/engines/WarungIPOEngine';

export const IPOLaunchpad: React.FC = () => {
    const [revenue, setRevenue] = useState(60000000); // 60jt
    const [profit, setProfit] = useState(12000000);   // 12jt (20%)
    const [growth, setGrowth] = useState(25);         // 25% YoY

    const ipo = useMemo(() => WarungIPOEngine.valuate(revenue, profit, growth), [revenue, profit, growth]);

    return (
        <div className="bg-gray-900 p-8 rounded-3xl min-h-screen animate-slide-in text-white">
            <header className="mb-12 text-center">
                <span className="bg-green-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Warung Go Public</span>
                <h2 className="text-5xl font-heading mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Unlock Your Equity
                </h2>
                <p className="text-gray-400">Ubah pelanggan setia menjadi investor. Dapatkan modal ekspansi tanpa utang bank.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Simulation Controls */}
                <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700">
                    <h3 className="text-xl font-bold mb-6">Business Metrics</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Monthly Revenue</label>
                            <input type="range" min="10000000" max="200000000" step="1000000" value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full accent-green-500" />
                            <div className="text-right font-mono text-green-400">Rp {revenue.toLocaleString()}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Net Profit</label>
                            <input type="range" min="1000000" max="50000000" step="500000" value={profit} onChange={e => setProfit(Number(e.target.value))} className="w-full accent-green-500" />
                            <div className="text-right font-mono text-green-400">Rp {profit.toLocaleString()}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Growth Rate (YoY)</label>
                            <input type="range" min="0" max="100" value={growth} onChange={e => setGrowth(Number(e.target.value))} className="w-full accent-blue-500" />
                            <div className="text-right font-mono text-blue-400">{growth}%</div>
                        </div>
                    </div>
                </div>

                {/* IPO Card */}
                <div className="bg-gradient-to-br from-green-900 to-gray-900 p-8 rounded-3xl border border-green-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

                    <div className="relative z-10">
                        <p className="text-sm text-green-300 font-bold mb-1">ESTIMATED VALUATION</p>
                        <h2 className="text-5xl font-mono font-bold text-white mb-8">Rp {(ipo.valuation / 1000000000).toFixed(2)} Miliar</h2>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-400">Share Price</p>
                                <p className="text-2xl font-bold">Rp {ipo.sharePrice}</p>
                            </div>
                            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-400">Dividend Yield</p>
                                <p className="text-2xl font-bold text-green-400">{ipo.dividendYield}%</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/50">
                                Launch IPO
                            </button>
                            <button className="flex-1 bg-transparent border border-white/20 hover:bg-white/10 font-bold py-4 rounded-xl transition-all">
                                Download Prospectus
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-6">
                            *Estimasi berdasarkan data historis. Tidak menjamin kinerja masa depan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
