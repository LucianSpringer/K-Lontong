import React, { useMemo, useState } from 'react';
import { TransactionSeeder } from '../../core/generators/TransactionSeeder';
import { ForensicsEngine } from '../../core/engines/ForensicsEngine';
import { SKU } from '../../core/types/InventoryTypes';

export const AnalyticsDashboard: React.FC = () => {
    const [seedKey, setSeedKey] = useState(0); // Used to trigger re-seeding

    // [LUMEN NOTE] Memoize the heavy calculation to prevent UI freeze
    const { data, insights } = useMemo(() => {
        // Mock SKUs for the seeder
        const mockSkus = ['SKU-001', 'SKU-002', 'SKU-003'] as unknown as SKU[];
        const rawData = TransactionSeeder.generateHistory(mockSkus);
        const analysis = ForensicsEngine.analyze(rawData);
        return { data: rawData, insights: analysis };
    }, [seedKey]);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen space-y-8 animate-slide-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Financial Forensics</h2>
                    <p className="text-gray-500">Real-time analysis of {data.length.toLocaleString()} transactions.</p>
                </div>
                <button
                    onClick={() => setSeedKey(prev => prev + 1)}
                    className="bg-warung-deep-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                    <i className="fas fa-sync mr-2"></i> Re-Seed Data
                </button>
            </header>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-warung-teal hover:shadow-xl transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
                    <p className="text-2xl font-mono font-bold text-gray-800 mt-2">
                        Rp {(insights.totalRevenue / 1000000).toFixed(2)} Jt
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-warung-orange hover:shadow-xl transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase">Avg Basket</p>
                    <p className="text-2xl font-mono font-bold text-gray-800 mt-2">
                        Rp {Math.round(insights.averageBasketSize).toLocaleString()}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase">Fraud Risk</p>
                    <p className="text-2xl font-mono font-bold text-red-500 mt-2">
                        {insights.fraudRiskScore.toFixed(3)}%
                    </p>
                    <p className="text-xs text-red-300 mt-1">High-value cash transactions</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase">Top Method</p>
                    <p className="text-2xl font-mono font-bold text-blue-500 mt-2">
                        {insights.topPaymentMethod}
                    </p>
                </div>
            </div>

            {/* Recent Transactions List (Virtualization Candidate) */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-heading text-lg text-gray-700">Live Transaction Feed</h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">ID</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Method</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono text-sm">
                            {data.slice(0, 100).map((tx) => (
                                <tr key={tx.id as unknown as string} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 text-gray-400">{(tx.id as unknown as string).slice(0, 12)}...</td>
                                    <td className="p-4">{tx.timestamp.toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${tx.paymentMethod === 'CASH' ? 'bg-green-100 text-green-700' :
                                                tx.paymentMethod === 'QRIS' ? 'bg-blue-100 text-blue-700' :
                                                    tx.paymentMethod === 'KASBON' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-purple-100 text-purple-700'
                                            }`}>
                                            {tx.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-gray-700">
                                        Rp {tx.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        {tx.isFlaggedSuspicious ? (
                                            <span className="text-red-500 font-bold flex items-center gap-1 animate-pulse">
                                                <i className="fas fa-exclamation-triangle"></i> FLAG
                                            </span>
                                        ) : (
                                            <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                                                <i className="fas fa-check-circle"></i> VERIFIED
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 text-center text-gray-400 text-sm border-t border-gray-100 bg-gray-50/30">
                        Showing latest 100 of {data.length.toLocaleString()} records...
                    </div>
                </div>
            </div>
        </div>
    );
};
