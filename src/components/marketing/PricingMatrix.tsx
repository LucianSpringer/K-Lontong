import React, { useState } from 'react';

type PlanTier = 'STARTER' | 'PRO' | 'ENTERPRISE';

interface PlanFeature {
    name: string;
    included: boolean;
    tooltip?: string;
}

interface PricingPlan {
    id: PlanTier;
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    description: string;
    features: PlanFeature[];
    isPopular?: boolean;
}

const PRICING_DATA: PricingPlan[] = [
    {
        id: 'STARTER',
        name: 'Warung Rintisan',
        monthlyPrice: 0,
        annualPrice: 0,
        description: 'Mulai digitalisasi warung tanpa biaya.',
        features: [
            { name: 'POS Kasir Dasar', included: true },
            { name: 'Catat Stok Manual', included: true },
            { name: 'Laporan Harian Sederhana', included: true },
            { name: 'Multi-Cabang', included: false },
            { name: 'AI Prediksi Stok', included: false },
        ]
    },
    {
        id: 'PRO',
        name: 'Juragan Modern',
        monthlyPrice: 49000,
        annualPrice: 490000, // Hemat 2 bulan
        description: 'Fitur lengkap untuk pertumbuhan omzet maksimal.',
        isPopular: true,
        features: [
            { name: 'POS Kasir Unlimited', included: true },
            { name: 'Manajemen Stok Otomatis', included: true },
            { name: 'Laporan Laba Rugi Real-time', included: true },
            { name: 'Integrasi QRIS & E-Wallet', included: true },
            { name: 'Support Prioritas 24/7', included: true },
        ]
    },
    {
        id: 'ENTERPRISE',
        name: 'Grosir Network',
        monthlyPrice: 199000,
        annualPrice: 1990000,
        description: 'Untuk distributor dan jaringan warung besar.',
        features: [
            { name: 'Semua Fitur Pro', included: true },
            { name: 'Multi-Gudang & Cabang', included: true },
            { name: 'API Access', included: true },
            { name: 'Whitelabel Mobile App', included: true },
            { name: 'Dedicated Account Manager', included: true },
        ]
    }
];

export const PricingMatrix: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

    return (
        <section className="py-20 bg-white" id="pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-warung-teal font-bold uppercase tracking-widest text-sm">
                        <i className="fas fa-tags mr-2"></i>
                        Investasi Cerdas
                    </span>
                    <h2 className="text-4xl font-heading text-warung-deep-brown mt-4">
                        Pilih Paket Sesuai Skala Warungmu
                    </h2>

                    {/* Billing Toggle */}
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <span className={`text-sm font-bold ${billingCycle === 'MONTHLY' ? 'text-warung-deep-brown' : 'text-gray-400'}`}>Bulanan</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
                            className="w-16 h-8 bg-warung-teal rounded-full p-1 relative transition-colors duration-300 focus:outline-none"
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'ANNUAL' ? 'translate-x-8' : ''}`}></div>
                        </button>
                        <span className={`text-sm font-bold ${billingCycle === 'ANNUAL' ? 'text-warung-deep-brown' : 'text-gray-400'}`}>
                            Tahunan <span className="text-warung-orange text-xs ml-1">(Hemat 17%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRICING_DATA.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col ${plan.isPopular ? 'border-warung-orange shadow-lg' : 'border-gray-100'}`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-warung-orange text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                                    Paling Laris
                                </div>
                            )}

                            <h3 className="text-2xl font-heading text-warung-deep-brown">{plan.name}</h3>
                            <p className="text-gray-500 text-sm mt-2 mb-6 min-h-[40px]">{plan.description}</p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-warung-deep-brown font-mono">
                                    {billingCycle === 'MONTHLY'
                                        ? (plan.monthlyPrice === 0 ? 'Gratis' : `Rp ${plan.monthlyPrice.toLocaleString()}`)
                                        : (plan.annualPrice === 0 ? 'Gratis' : `Rp ${(plan.annualPrice / 12).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`)
                                    }
                                </span>
                                {plan.monthlyPrice > 0 && (
                                    <span className="text-gray-400 text-sm">/bulan</span>
                                )}
                                {billingCycle === 'ANNUAL' && plan.annualPrice > 0 && (
                                    <div className="text-xs text-warung-teal mt-1 font-bold">
                                        Ditagih Rp {plan.annualPrice.toLocaleString()} /tahun
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm">
                                        {feature.included ? (
                                            <i className="fas fa-check-circle text-green-500 text-lg"></i>
                                        ) : (
                                            <i className="fas fa-times-circle text-gray-200 text-lg"></i>
                                        )}
                                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-colors ${plan.isPopular
                                    ? 'bg-warung-orange text-white hover:bg-orange-600 shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>
                                {plan.monthlyPrice === 0 ? 'Mulai Sekarang' : 'Pilih Paket Ini'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
