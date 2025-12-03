import React, { useMemo } from 'react';
import { OmzetProfitEngine } from '../../core/engines/OmzetProfitEngine';
import { useWarungStore } from '../../store/StoreContext';

export const OmzetCalculator: React.FC = () => {
    const { state, updateCalculatorInputs } = useWarungStore();
    const inputs = state.calculatorInputs;

    const results = useMemo(() => {
        return OmzetProfitEngine.calculateProjection(inputs);
    }, [inputs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateCalculatorInputs({ [name]: parseFloat(value) || 0 });
    };

    return (
        <div id="calculator" className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <span className="text-warung-orange font-bold uppercase tracking-widest text-sm">Simulasi Bisnis</span>
                <h3 className="text-3xl md:text-5xl font-heading text-warung-deep-brown mt-2 mb-6">
                    Kalkulator Omzet <br /> <span className="text-warung-teal">Warung Modern</span>
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                    Jangan cuma tebak-tebakan. Hitung potensi keuntungan warung Anda dengan algoritma kami.
                    Lihat kapan modal Anda kembali.
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Target Omzet Harian (Rp)
                        </label>
                        <input
                            type="number"
                            name="dailyRevenue"
                            value={inputs.dailyRevenue}
                            onChange={handleInputChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-warung-orange focus:ring-0 transition-colors font-mono text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Margin Laba (%)
                            </label>
                            <input
                                type="number"
                                name="marginPercent"
                                value={inputs.marginPercent}
                                onChange={handleInputChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-warung-orange transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Hari Buka/Bulan
                            </label>
                            <input
                                type="number"
                                name="daysOpen"
                                value={inputs.daysOpen}
                                onChange={handleInputChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-warung-orange transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Biaya Operasional Bulanan (Rp)
                        </label>
                        <input
                            type="number"
                            name="operationalCost"
                            value={inputs.operationalCost}
                            onChange={handleInputChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-warung-orange transition-colors font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-warung-deep-brown text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-warung-orange opacity-10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-warung-teal opacity-10 rounded-full -ml-16 -mb-16"></div>

                <div className="relative z-10 space-y-8">
                    <div className="border-b border-white/10 pb-6">
                        <p className="text-white/60 text-sm uppercase tracking-wider">Estimasi Bersih Bulanan</p>
                        <p className="text-4xl font-bold font-mono text-warung-yellow mt-2">
                            Rp {results.monthlyNet.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-white/50 mt-2">
                            <i className="fas fa-info-circle mr-1"></i>
                            Sudah dikurangi biaya operasional
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-white/60 text-sm">Total 6 Bulan</p>
                            <p className="text-xl font-bold mt-1">
                                Rp {results.sixMonthProjection.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-xs text-warung-teal mt-1">
                                <i className="fas fa-chart-line mr-1"></i>
                                +5% growth/bulan
                            </p>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm">Balik Modal</p>
                            <p className="text-xl font-bold mt-1 text-warung-teal">
                                {results.breakEvenDay ? `Hari ke-${results.breakEvenDay}` : 'Belum Profit'}
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                                dari awal bulan
                            </p>
                        </div>
                    </div>

                    <div className={`mt-6 p-4 rounded-xl text-center font-bold border-2 ${results.feasibilityScore === 'HIGH_YIELD' ? 'bg-green-500/20 border-green-500 text-green-300' :
                            results.feasibilityScore === 'MODERATE' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' :
                                'bg-red-500/20 border-red-500 text-red-300'
                        }`}>
                        <div className="flex items-center justify-center gap-2">
                            <i className={`fas ${results.feasibilityScore === 'HIGH_YIELD' ? 'fa-circle-check' :
                                    results.feasibilityScore === 'MODERATE' ? 'fa-triangle-exclamation' :
                                        'fa-circle-xmark'
                                }`}></i>
                            <span>STATUS: {results.feasibilityScore.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-white/60 mb-2">Omzet Kotor Bulanan</p>
                        <p className="text-lg font-mono">
                            Rp {results.monthlyGross.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
