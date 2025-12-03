import React, { useState } from 'react';

type LocationType = 'RURAL' | 'SUBURBAN' | 'URBAN_HIGH_TRAFFIC';
type ShopSize = 'SMALL_3X3' | 'MEDIUM_4X6' | 'LARGE_RUKO';

interface CostBreakdown {
    rent: number;
    renovation: number;
    equipment: number; // Rak, Etalase, Kulkas
    initialStock: number;
    marketing: number;
    total: number;
}

export const BusinessStarterCalculator: React.FC = () => {
    const [location, setLocation] = useState<LocationType>('SUBURBAN');
    const [size, setSize] = useState<ShopSize>('MEDIUM_4X6');
    const [budget, setBudget] = useState<number>(20000000);

    // Algorithmic Density: Logic Estimasi Biaya
    const calculateCosts = (): CostBreakdown => {
        let baseRent = 0;
        let equipmentCost = 0;
        let renovationCost = 0;

        // Faktor Lokasi
        switch (location) {
            case 'RURAL': baseRent = 5000000; break; // 5jt/thn
            case 'SUBURBAN': baseRent = 15000000; break;
            case 'URBAN_HIGH_TRAFFIC': baseRent = 45000000; break;
        }

        // Faktor Ukuran
        switch (size) {
            case 'SMALL_3X3':
                equipmentCost = 3000000;
                renovationCost = 1000000;
                break;
            case 'MEDIUM_4X6':
                equipmentCost = 7000000;
                renovationCost = 2500000;
                break;
            case 'LARGE_RUKO':
                equipmentCost = 15000000;
                renovationCost = 5000000;
                break;
        }

        // Sisa modal dialokasikan ke stok (Priority Logic)
        const fixedCosts = baseRent + equipmentCost + renovationCost + 500000; // 500k marketing
        let stockAllocation = budget - fixedCosts;

        if (stockAllocation < 0) stockAllocation = 0;

        return {
            rent: baseRent,
            renovation: renovationCost,
            equipment: equipmentCost,
            marketing: 500000,
            initialStock: stockAllocation,
            total: fixedCosts + stockAllocation
        };
    };

    const costs = calculateCosts();
    const potentialRevenue = costs.initialStock * 1.3; // Asumsi markup rata-rata 30%
    const isBudgetEnough = costs.initialStock > 1000000; // Minimal stok 1jt

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-heading text-warung-deep-brown">Simulasi Buka Warung</h3>
                <p className="text-gray-500">Hitung detail modal yang dibutuhkan berdasarkan lokasi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Warung</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['RURAL', 'SUBURBAN', 'URBAN_HIGH_TRAFFIC'] as LocationType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setLocation(t)}
                                    className={`p-2 rounded-lg text-xs font-bold border transition-all ${location === t
                                        ? 'bg-warung-orange text-white border-warung-orange'
                                        : 'bg-white text-gray-500 border-gray-200'
                                        }`}
                                >
                                    {t === 'RURAL' ? 'Pedesaan' : t === 'SUBURBAN' ? 'Perumahan' : 'Kota Besar'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ukuran Toko</label>
                        <select
                            value={size}
                            onChange={(e) => setSize(e.target.value as ShopSize)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-warung-orange"
                        >
                            <option value="SMALL_3X3">Kecil (3x3 m)</option>
                            <option value="MEDIUM_4X6">Sedang (4x6 m)</option>
                            <option value="LARGE_RUKO">Besar (Ruko)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Modal Awal Anda</label>
                        <input
                            type="range"
                            min="5000000"
                            max="100000000"
                            step="1000000"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full accent-warung-teal"
                        />
                        <div className="text-right font-mono font-bold text-warung-teal">
                            Rp {budget.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Results Visualization */}
                <div className={`rounded-2xl p-6 ${isBudgetEnough ? 'bg-gray-50' : 'bg-red-50 border border-red-200'}`}>
                    <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Rincian Estimasi Biaya</h4>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Sewa Tempat (Thn)</span>
                            <span className="font-mono">Rp {costs.rent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Peralatan (Rak/Etalase)</span>
                            <span className="font-mono">Rp {costs.equipment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Renovasi Ringan</span>
                            <span className="font-mono">Rp {costs.renovation.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-gray-300">
                            <span className="font-bold text-warung-deep-brown">Sisa Untuk Stok Barang</span>
                            <span className={`font-mono font-bold ${isBudgetEnough ? 'text-green-600' : 'text-red-500'}`}>
                                Rp {costs.initialStock.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {!isBudgetEnough && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 text-xs rounded-lg flex gap-2">
                            <i className="fas fa-exclamation-triangle mt-1"></i>
                            <div>
                                <strong>Modal Kurang!</strong> Stok barang terlalu sedikit. Disarankan minimal Rp 10 Juta untuk lokasi ini.
                            </div>
                        </div>
                    )}

                    {isBudgetEnough && (
                        <div className="mt-6 bg-warung-teal text-white p-4 rounded-xl">
                            <p className="text-xs opacity-80">Potensi Omzet Putaran Pertama</p>
                            <p className="text-2xl font-bold font-mono">Rp {potentialRevenue.toLocaleString()}</p>
                            <button
                                onClick={() => alert('Fitur download akan segera hadir! Untuk saat ini, screenshot rincian ini.')}
                                className="mt-3 w-full bg-white text-warung-teal py-2 rounded-lg font-bold text-sm hover:bg-teal-50 transition-colors"
                            >
                                <i className="fas fa-file-pdf mr-2"></i> Download Rincian PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
