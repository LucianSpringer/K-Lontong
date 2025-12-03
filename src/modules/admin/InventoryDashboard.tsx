import React, { useState, useMemo } from 'react';
import { InventoryItem, StockStatus, SKU } from '../../core/types/InventoryTypes';

// Mock Data Generator (In production, fetch this)
const MOCK_INVENTORY: InventoryItem[] = Array.from({ length: 50 }).map((_, i) => ({
    sku: `SKU-${1000 + i}` as unknown as SKU,
    name: `Warung Item #${i + 1}`,
    category: i % 3 === 0 ? 'FROZEN' : 'DRY_GOODS',
    purchasePrice: 10000 + (i * 500),
    retailPrice: 12500 + (i * 600),
    margin: 0, // To be calculated
    currentStock: Math.floor(Math.random() * 100),
    reorderPoint: 20,
    status: Math.random() > 0.8 ? StockStatus.CRITICAL : StockStatus.HEALTHY,
    metadata: {
        shelfLifeDays: 365,
        volumetricWeight: 0.5,
        supplierLeadTime: 24,
        demandElasticity: 0.8
    },
    lastRestock: new Date(),
    supplierId: 'SUP-001' as any
}));

export const InventoryDashboard: React.FC = () => {
    const [filter, setFilter] = useState<StockStatus | 'ALL'>('ALL');
    const [sortKey, setSortKey] = useState<keyof InventoryItem>('currentStock');

    // Algorithmic Density: Client-side sorting & filtering logic
    const processedData = useMemo(() => {
        let data = [...MOCK_INVENTORY];

        // 1. Calculate Real-time Margins
        data = data.map(item => ({
            ...item,
            margin: ((item.retailPrice - item.purchasePrice) / item.retailPrice) * 100
        }));

        // 2. Apply Filters
        if (filter !== 'ALL') {
            data = data.filter(item => item.status === filter);
        }

        // 3. Sort
        data.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === 'number' && typeof valB === 'number') {
                return valB - valA; // Descending
            }
            return 0;
        });

        return data;
    }, [filter, sortKey]);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Warung OS: Inventory</h2>
                    <p className="text-gray-500">Real-time stock monitoring & margin analysis.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'ALL' ? 'bg-warung-teal text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter(StockStatus.CRITICAL)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === StockStatus.CRITICAL ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-red-500 hover:bg-red-50'}`}
                    >
                        Critical Low
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase">SKU</th>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase">Product Name</th>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase cursor-pointer hover:text-warung-orange transition-colors" onClick={() => setSortKey('currentStock')}>
                                    Stock <i className="fas fa-sort ml-1"></i>
                                </th>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase">Margin (%)</th>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase">Status</th>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {processedData.map((item) => (
                                <tr key={item.sku as unknown as string} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-gray-400">{item.sku as unknown as string}</td>
                                    <td className="p-4 font-bold text-gray-700">{item.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${item.currentStock < item.reorderPoint ? 'text-red-500' : 'text-green-600'}`}>
                                                {item.currentStock}
                                            </span>
                                            <span className="text-xs text-gray-400">/ {item.reorderPoint}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono">
                                        {item.margin.toFixed(1)}%
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === StockStatus.CRITICAL ? 'bg-red-100 text-red-600' :
                                                item.status === StockStatus.HEALTHY ? 'bg-green-100 text-green-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-warung-teal hover:text-teal-700 font-bold text-sm transition-colors">
                                            Restock
                                        </button>
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
