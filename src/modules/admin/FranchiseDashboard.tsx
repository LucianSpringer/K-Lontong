import React, { useState, useEffect } from 'react';
import { FranchiseNetwork, BranchNode } from '../../core/engines/FranchiseNetwork';
import { DynamicPricingEngine } from '../../core/engines/DynamicPricingEngine';

export const FranchiseDashboard: React.FC = () => {
    const [branches, setBranches] = useState<BranchNode[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const data = FranchiseNetwork.getNetworkOverview();
        setBranches(data);
        setTotalRevenue(FranchiseNetwork.getTotalNetworkRevenue(data));
    }, []);

    // Simulated Pricing Check
    const pricingSample = DynamicPricingEngine.calculatePrice({
        sku: 'SKU-001' as any,
        basePrice: 3500,
        elasticity: 1.5,
        competitorPrice: 3400,
        minMargin: 10
    });

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen space-y-8 animate-slide-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">HQ Command Center</h2>
                    <p className="text-gray-500">Real-time monitoring of {branches.length} franchise units.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase font-bold">Network Revenue (Today)</p>
                    <p className="text-3xl font-mono font-bold text-warung-teal">
                        Rp {(totalRevenue / 1000000).toFixed(2)} Jt
                    </p>
                </div>
            </header>

            {/* Dynamic Pricing Alert */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-lg"><i className="fas fa-bolt mr-2"></i> Dynamic Pricing Engine Active</h4>
                    <p className="text-white/80 text-sm">
                        Optimization detected for <strong>{pricingSample.sku}</strong>.
                        Rule applied: <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">{pricingSample.ruleApplied}</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs opacity-75">Adjusted Price</p>
                    <p className="text-2xl font-bold font-mono">Rp {pricingSample.suggestedPrice.toLocaleString()}</p>
                    <p className="text-green-300 text-xs font-bold">+{pricingSample.projectedUplift}% Uplift</p>
                </div>
            </div>

            {/* Branch Grid */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-700">Branch Performance Ranking</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Rank</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Branch Name</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Daily Rev</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {branches.map((branch, idx) => (
                                <tr key={branch.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 font-mono text-gray-400 font-bold">#{idx + 1}</td>
                                    <td className="p-4 font-bold text-warung-deep-brown">{branch.name}</td>
                                    <td className="p-4 text-sm text-gray-600">{branch.location}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${branch.status === 'ONLINE' ? 'bg-green-100 text-green-700' :
                                                branch.status === 'WARNING' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {branch.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-gray-800">
                                        Rp {branch.dailyRevenue.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="inline-block w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full ${branch.performanceScore > 90 ? 'bg-green-500' : branch.performanceScore > 80 ? 'bg-warung-teal' : 'bg-yellow-500'}`}
                                                style={{ width: `${branch.performanceScore}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-xs font-bold">{branch.performanceScore}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
