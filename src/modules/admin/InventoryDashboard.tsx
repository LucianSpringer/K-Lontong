import React, { useState, useMemo, useRef } from 'react';
import { InventoryItem, StockStatus, SKU } from '../../core/types/InventoryTypes';
import { DataImportEngine } from '../../core/engines/DataImportEngine';

// Mock Data Generator
const MOCK_INVENTORY: InventoryItem[] = Array.from({ length: 50 }).map((_, i) => ({
    sku: `SKU-${1000 + i}` as unknown as SKU,
    name: `Warung Item #${i + 1}`,
    category: i % 3 === 0 ? 'FROZEN' : 'DRY_GOODS',
    purchasePrice: 10000 + (i * 500),
    retailPrice: 12500 + (i * 600),
    margin: 0,
    currentStock: Math.floor(Math.random() * 100),
    reorderPoint: 20,
    status: Math.random() > 0.8 ? StockStatus.CRITICAL : StockStatus.HEALTHY,
    metadata: { shelfLifeDays: 365, volumetricWeight: 0.5, supplierLeadTime: 24, demandElasticity: 0.8 },
    lastRestock: new Date(),
    supplierId: 'SUP-001' as any
}));

export const InventoryDashboard: React.FC = () => {
    const [filter, setFilter] = useState<StockStatus | 'ALL'>('ALL');
    const [sortKey, setSortKey] = useState<keyof InventoryItem>('currentStock');
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Algorithmic Density: Client-side sorting & filtering logic
    const processedData = useMemo(() => {
        let data = [...inventory];
        // Calculate Real-time Margins
        data = data.map(item => ({
            ...item,
            margin: ((item.retailPrice - item.purchasePrice) / item.retailPrice) * 100
        }));
        // Filter
        if (filter !== 'ALL') data = data.filter(item => item.status === filter);
        // Sort
        data.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === 'number' && typeof valB === 'number') return valB - valA;
            return 0;
        });
        return data;
    }, [filter, sortKey, inventory]);

    // Handle CSV Import
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const result = DataImportEngine.parseCSV(text);

            if (result.success) {
                // Merge new items into state
                setInventory(prev => [...result.data as InventoryItem[], ...prev]);
                alert(`Berhasil import ${result.data.length} barang!`);
            } else {
                alert(`Gagal: ${result.errors.join('\n')}`);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Warung OS: Inventory</h2>
                    <p className="text-gray-500">Real-time stock monitoring & margin analysis.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-lg font-bold bg-warung-brown text-white shadow-lg hover:bg-brown-800 transition"
                    >
                        <i className="fas fa-file-import mr-2"></i> Import CSV
                    </button>
                    <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-lg font-bold ${filter === 'ALL' ? 'bg-warung-teal text-white' : 'bg-white text-gray-600'}`}>All</button>
                    <button onClick={() => setFilter(StockStatus.CRITICAL)} className={`px-4 py-2 rounded-lg font-bold ${filter === StockStatus.CRITICAL ? 'bg-red-500 text-white' : 'bg-white text-red-500'}`}>Critical Low</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase">SKU</th>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase">Product Name</th>
                                <th className="p-4 font-bold text-gray-500 text-sm uppercase cursor-pointer" onClick={() => setSortKey('currentStock')}>Stock <i className="fas fa-sort ml-1"></i></th>
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
                                            <span className={`font-bold ${item.currentStock < item.reorderPoint ? 'text-red-500' : 'text-green-600'}`}>{item.currentStock}</span>
                                            <span className="text-xs text-gray-400">/ {item.reorderPoint}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono">{item.margin.toFixed(1)}%</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === StockStatus.CRITICAL ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-warung-teal hover:text-teal-700 font-bold text-sm">Restock</button>
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
