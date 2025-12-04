import React, { useMemo } from 'react';
import { CrowdPriceEngine } from '../../core/engines/CrowdPriceEngine';

export const MarketTrendDashboard: React.FC = () => {
    // Use memo to fetch insights for top items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marketInsight = useMemo(() => CrowdPriceEngine.getMarketInsight('SKU-1001' as any, 3100), []);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <h2 className="text-3xl font-heading text-warung-deep-brown mb-6">Market Trends</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">📡 Radar Kompetitor (Live)</h3>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Harga Pasar</p>
                            <p className="text-xl font-mono font-bold">Rp {marketInsight.marketAvg.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Termurah</p>
                            <p className="text-xl font-mono font-bold text-green-600">Rp {marketInsight.lowestPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Heatmap Persaingan</p>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${marketInsight.heatmapIntensity}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
                        <strong>Rekomendasi:</strong> {marketInsight.recommendation}
                    </div>
                </div>

                {/* Placeholder for other charts */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-400">
                    <p>Trend Chart Placeholder</p>
                </div>
            </div>
        </div>
    );
};
