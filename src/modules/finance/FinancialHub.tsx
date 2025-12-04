import React, { useState, useMemo } from 'react';
import { WarungFinancialProfile } from '../../core/engines/WarungFinancialProfile';
import { MicroInsuranceEngine } from '../../core/engines/MicroInsuranceEngine';

export const FinancialHub: React.FC = () => {
    // Mock Data for Scoring
    const score = useMemo(() => WarungFinancialProfile.calculateScore(
        [15000000, 14500000, 16000000, 15500000, 15000000], // Revenue
        3, // Years Active
        45000000, // Inventory
        1 // Late payments
    ), []);

    const [policies, setPolicies] = useState(MicroInsuranceEngine.getActivePolicies());

    const handleTogglePolicy = (id: string) => {
        MicroInsuranceEngine.togglePolicy(id);
        setPolicies([...MicroInsuranceEngine.getActivePolicies()]); // Force refresh
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in space-y-8">
            <header>
                <h2 className="text-3xl font-heading text-warung-deep-brown">Financial Hub</h2>
                <p className="text-gray-500">Credit Profile & Risk Management.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Credit Score Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-gray-800">Warung Credit Score</h3>
                            <p className="text-xs text-gray-400">Powered by K'Lontong Financial Graph</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${score.rating === 'EXCELLENT' ? 'bg-green-500' : score.rating === 'GOOD' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}>
                            {score.rating}
                        </span>
                    </div>

                    <div className="flex items-center justify-center my-8">
                        <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-8 border-gray-100">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="90" cy="90" r="80" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                                <circle cx="90" cy="90" r="80" stroke={score.score > 700 ? '#10B981' : '#F59E0B'} strokeWidth="12" fill="none" strokeDasharray="500" strokeDashoffset={500 - (500 * (score.score - 300) / 550)} />
                            </svg>
                            <div className="text-center">
                                <span className="text-5xl font-black text-gray-800">{score.score}</span>
                                <span className="block text-xs text-gray-400">/ 850</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Limit Pinjaman</span>
                            <span className="font-bold text-green-600">Rp {score.maxLoanLimit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Bunga Spesial</span>
                            <span className="font-bold text-blue-600">{score.interestRate}% / bulan</span>
                        </div>
                    </div>
                </div>

                {/* Micro Insurance */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                        <i className="fas fa-shield-halved text-warung-teal"></i> Proteksi Warung
                    </h3>

                    <div className="space-y-4">
                        {policies.map(p => (
                            <div key={p.id} className={`p-4 rounded-xl border-2 transition-all ${p.active ? 'border-warung-teal bg-teal-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${p.active ? 'bg-warung-teal' : 'bg-gray-300'}`}>
                                            <i className={`fas ${p.type === 'FIRE' ? 'fa-fire' : 'fa-mask'}`}></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{p.type} PROTECTION</h4>
                                            <p className="text-xs text-gray-500">by {p.provider}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={p.active} onChange={() => handleTogglePolicy(p.id)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warung-teal"></div>
                                    </label>
                                </div>
                                <div className="mt-3 pt-3 border-t border-black/5 flex justify-between text-sm">
                                    <span>Coverage: <strong>Rp {(p.coverage / 1000000)} Juta</strong></span>
                                    <span className={p.active ? 'text-teal-700 font-bold' : 'text-gray-400'}>Rp {p.dailyPremium}/hari</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
