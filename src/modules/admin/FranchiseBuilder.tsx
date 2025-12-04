import React, { useState } from 'react';
import { FranchiseHQEngine, FranchisePackage } from '../../core/engines/FranchiseHQEngine';

export const FranchiseBuilder: React.FC = () => {
    const [selectedTier, setSelectedTier] = useState<FranchisePackage['tier']>('GROWTH');
    const pkg = FranchiseHQEngine.generatePackage(selectedTier);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="text-center mb-12">
                <h2 className="text-4xl font-heading text-warung-deep-brown">Franchise Builder</h2>
                <p className="text-gray-500">Duplikasi kesuksesan warung Anda dengan sistem otomatis.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {(['STARTER', 'GROWTH', 'DOMINANCE'] as const).map(tier => (
                    <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedTier === tier
                                ? 'border-warung-orange bg-white shadow-xl scale-105 ring-4 ring-orange-100'
                                : 'border-transparent bg-white shadow-sm hover:shadow-md text-gray-400'
                            }`}
                    >
                        <h3 className={`font-bold text-xl mb-2 ${selectedTier === tier ? 'text-warung-deep-brown' : ''}`}>{tier}</h3>
                        <div className="h-1 w-12 bg-gray-200 rounded mb-4"></div>
                    </button>
                ))}
            </div>

            <div className="mt-12 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-warung-deep-brown p-12 text-white flex flex-col justify-center relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                    <h3 className="text-3xl font-heading mb-2">Paket {pkg.tier}</h3>
                    <p className="text-white/60 mb-8">Royalti {pkg.royaltyFee}% dari omzet mitra.</p>

                    <div className="text-5xl font-mono font-bold text-warung-yellow mb-2">
                        Rp {(pkg.setupCost / 1000000)} Jt
                    </div>
                    <p className="text-sm text-white/50">Biaya Kemitraan Awal</p>

                    <div className="mt-12 flex gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{pkg.roiMonths}</p>
                            <p className="text-xs text-white/50 uppercase">Bulan ROI</p>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{pkg.includes.length}</p>
                            <p className="text-xs text-white/50 uppercase">Fasilitas</p>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 p-12">
                    <h4 className="font-bold text-gray-800 mb-6 text-lg">Apa yang didapat mitra?</h4>
                    <ul className="space-y-4">
                        {pkg.includes.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-600">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                                    <i className="fas fa-check"></i>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <button className="w-full py-4 bg-warung-teal text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-lg flex items-center justify-center gap-2">
                            <i className="fas fa-file-contract"></i> Generate Contract & SOP
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">Dokumen legal otomatis ter-generate sesuai hukum RI.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
