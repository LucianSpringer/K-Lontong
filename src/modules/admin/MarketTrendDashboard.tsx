import React, { useState } from 'react';

interface MarketItem {
    name: string;
    category: string;
    wholesalePrice: number;
    retailPrice: number;
    margin: number;
    trend: 'UP' | 'STABLE' | 'DOWN';
    season: string;
}

const TREND_DATA: MarketItem[] = [
    { name: 'Minyak Goreng 2L', category: 'Sembako', wholesalePrice: 28000, retailPrice: 32000, margin: 14.2, trend: 'UP', season: 'All Year' },
    { name: 'Sirup Marjan', category: 'Minuman', wholesalePrice: 18500, retailPrice: 22000, margin: 18.9, trend: 'UP', season: 'Ramadan' },
    { name: 'Rokok Filter 16', category: 'Rokok', wholesalePrice: 29000, retailPrice: 31000, margin: 6.8, trend: 'STABLE', season: 'All Year' },
    { name: 'Kopi Sachet Renceng', category: 'Minuman', wholesalePrice: 10500, retailPrice: 15000, margin: 42.8, trend: 'STABLE', season: 'All Year' },
    { name: 'Beras Premium 5kg', category: 'Sembako', wholesalePrice: 68000, retailPrice: 75000, margin: 10.2, trend: 'UP', season: 'All Year' },
    { name: 'Token Listrik', category: 'Digital', wholesalePrice: 0, retailPrice: 2500, margin: 100, trend: 'STABLE', season: 'All Year' }, // Jasa
];

export const MarketTrendDashboard: React.FC = () => {
    const [filterHighMargin, setFilterHighMargin] = useState(false);

    const filteredData = filterHighMargin
        ? TREND_DATA.filter(i => i.margin > 15)
        : TREND_DATA;

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">
                        <i className="fas fa-bolt text-warung-yellow mr-2"></i>
                        Barang Terlaris 2025
                    </h2>
                    <p className="text-gray-500">Database margin & tren pasar real-time.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterHighMargin(!filterHighMargin)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all border ${filterHighMargin
                                ? 'bg-warung-teal text-white border-warung-teal'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-warung-teal'
                            }`}
                    >
                        <i className="fas fa-filter mr-2"></i>
                        Margin {'>'} 15%
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-warung-deep-brown text-white">
                        <tr>
                            <th className="p-4 text-sm font-bold uppercase">Nama Barang</th>
                            <th className="p-4 text-sm font-bold uppercase">Kategori</th>
                            <th className="p-4 text-sm font-bold uppercase">Modal</th>
                            <th className="p-4 text-sm font-bold uppercase">Jual</th>
                            <th className="p-4 text-sm font-bold uppercase">Margin</th>
                            <th className="p-4 text-sm font-bold uppercase">Tren</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-orange-50/50 transition-colors">
                                <td className="p-4 font-bold text-gray-700">
                                    {item.name}
                                    {item.season !== 'All Year' && (
                                        <span className="ml-2 text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                            {item.season}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-500 text-sm">{item.category}</td>
                                <td className="p-4 font-mono text-sm text-gray-600">Rp {item.wholesalePrice.toLocaleString()}</td>
                                <td className="p-4 font-mono text-sm font-bold text-gray-800">Rp {item.retailPrice.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`font-bold ${item.margin > 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {item.margin.toFixed(1)}%
                                    </span>
                                </td>
                                <td className="p-4">
                                    {item.trend === 'UP' && <span className="text-green-500 font-bold text-xs"><i className="fas fa-arrow-up"></i> NAIK</span>}
                                    {item.trend === 'STABLE' && <span className="text-gray-400 font-bold text-xs"><i className="fas fa-minus"></i> STABIL</span>}
                                    {item.trend === 'DOWN' && <span className="text-red-500 font-bold text-xs"><i className="fas fa-arrow-down"></i> TURUN</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fas fa-lock"></i>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-blue-800">Akses Terbatas</h4>
                    <p className="text-sm text-blue-600">Menampilkan 6 dari 100+ barang terlaris. Upgrade ke Member PRO untuk akses database lengkap.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
                    Upgrade Sekarang
                </button>
            </div>
        </div>
    );
};
