import React, { useState, useMemo } from 'react';

type LocationTier = 'RURAL' | 'SUBURBAN' | 'URBAN';

export const ProfitSimulator: React.FC = () => {
    const [location, setLocation] = useState<LocationTier>('SUBURBAN');
    const [stockValue, setStockValue] = useState(15000000); // 15jt
    const [staffCount, setStaffCount] = useState(1);

    const simulation = useMemo(() => {
        // Heuristic Logic
        const trafficMultiplier = location === 'URBAN' ? 2.5 : location === 'SUBURBAN' ? 1.5 : 1.0;
        const stockTurnover = 1.2; // Monthly turnover rate

        const monthlyGross = stockValue * stockTurnover * trafficMultiplier;
        const margin = monthlyGross * 0.15; // 15% margin

        const staffCost = staffCount * 2500000; // UMR-ish
        const opsCost = 1000000 + (location === 'URBAN' ? 2000000 : 500000);

        const netProfit = margin - staffCost - opsCost;

        return {
            gross: monthlyGross,
            net: netProfit,
            costs: staffCost + opsCost
        };
    }, [location, stockValue, staffCount]);

    const maxVal = 100000000; // Scale for charts

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-heading text-warung-deep-brown mb-6">
                <i className="fas fa-calculator mr-2 text-warung-orange"></i>
                Simulasi Potensi Profit
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lokasi Warung</label>
                        <div className="flex gap-2">
                            {(['RURAL', 'SUBURBAN', 'URBAN'] as LocationTier[]).map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLocation(l)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${location === l ? 'border-warung-teal bg-teal-50 text-warung-teal' : 'border-gray-200 text-gray-500'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            Nilai Stok (Rp {stockValue.toLocaleString()})
                        </label>
                        <input
                            type="range"
                            min="5000000" max="50000000" step="1000000"
                            value={stockValue}
                            onChange={(e) => setStockValue(Number(e.target.value))}
                            className="w-full accent-warung-orange"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            Jumlah Karyawan ({staffCount})
                        </label>
                        <input
                            type="range"
                            min="0" max="5" step="1"
                            value={staffCount}
                            onChange={(e) => setStaffCount(Number(e.target.value))}
                            className="w-full accent-warung-orange"
                        />
                    </div>
                </div>

                {/* Visualization */}
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Omzet Bruto</span>
                            <span className="font-bold text-gray-800">Rp {simulation.gross.toLocaleString()}</span>
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${Math.min((simulation.gross / maxVal) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Biaya Ops & Gaji</span>
                            <span className="font-bold text-red-500">Rp {simulation.costs.toLocaleString()}</span>
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-400 transition-all duration-500"
                                style={{ width: `${Math.min((simulation.costs / maxVal) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-warung-deep-brown">Estimasi Profit Bersih</span>
                            <span className={`text-3xl font-mono font-bold ${simulation.net > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                Rp {simulation.net.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-right">
                            *Estimasi berdasarkan rata-rata industri
                        </p>
                    </div>

                    <button className="w-full py-3 rounded-xl bg-warung-deep-brown text-white font-bold hover:bg-black transition shadow-lg">
                        <i className="fas fa-file-pdf mr-2"></i> Download Proposal
                    </button>
                </div>
            </div>
        </div>
    );
};
