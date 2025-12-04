import React, { useState, useMemo, useRef } from 'react';
import { InventoryItem, StockStatus, SKU } from '../../core/types/InventoryTypes';
import { DataImportEngine } from '../../core/engines/DataImportEngine';
import { DemandNeuralNet } from '../../core/ai/DemandNeuralNet';
import { ExpiryIntelEngine } from '../../core/engines/ExpiryIntelEngine';
import { ReceiptOCREngine } from '../../core/ai/ReceiptOCREngine';

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
    const [showForecast, setShowForecast] = useState(false);
    const [showExpiry, setShowExpiry] = useState(false);

    // [LUMEN CONNECTION] Expiry Engine
    const expiryRisks = useMemo(() => ExpiryIntelEngine.analyze(inventory), [inventory]);

    const processedData = useMemo(() => {
        let data = [...inventory];
        if (filter !== 'ALL') {
            data = data.filter(item => item.status === filter);
        }
        data.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
        return data;
    }, [inventory, filter, sortKey]);

    // [LUMEN CONNECTION] Receipt OCR Scan
    const handleScanStock = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (file) {
                alert("Memproses Struk Belanja (OCR AI)...");
                const receipt = await ReceiptOCREngine.processImage(file);
                const newItems = ReceiptOCREngine.convertToInventory(receipt);
                setInventory(prev => [...newItems as InventoryItem[], ...prev]);
                alert(`Berhasil scan ${receipt.items.length} item dari ${receipt.merchant}!`);
            }
        };
        input.click();
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const items = await DataImportEngine.parseCSV(e.target.files[0]);
            setInventory(prev => [...prev, ...items]);
        }
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Warung OS: Inventory</h2>
                    <p className="text-gray-500">Stock monitoring, AI Forecasting & Expiry Intel.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowForecast(!showForecast)} className={`px-3 py-2 rounded-lg font-bold text-xs ${showForecast ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border border-purple-200'}`}>
                        <i className="fas fa-brain mr-1"></i> Forecast
                    </button>
                    <button onClick={() => setShowExpiry(!showExpiry)} className={`px-3 py-2 rounded-lg font-bold text-xs ${showExpiry ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-200'}`}>
                        <i className="fas fa-biohazard mr-1"></i> Expiry ({expiryRisks.length})
                    </button>
                    <button onClick={handleScanStock} className="px-3 py-2 rounded-lg font-bold text-xs bg-blue-600 text-white hover:bg-blue-700">
                        <i className="fas fa-camera mr-1"></i> Scan Struk
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-lg font-bold text-xs bg-green-600 text-white hover:bg-green-700">
                        <i className="fas fa-file-csv mr-1"></i> Import CSV
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".csv" />
                </div>
            </div>

            {/* Expiry Warning Banner */}
            {showExpiry && expiryRisks.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm">
                    <h4 className="font-bold text-red-700 mb-2">🚨 Critical Expiry Risks Detected</h4>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {expiryRisks.slice(0, 5).map((risk, i) => (
                            <div key={i} className="min-w-[200px] bg-white p-3 rounded-lg border border-red-100 shadow-sm text-xs">
                                <p className="font-bold text-gray-800 truncate">{risk.sku}</p>
                                <p className="text-red-500 font-mono">{risk.daysRemaining} Hari Lagi</p>
                                <p className="text-gray-500 mt-1">Saran: {risk.suggestedAction}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-bold text-gray-500 text-sm">SKU</th>
                                <th className="p-4 font-bold text-gray-500 text-sm">Product</th>
                                <th className="p-4 font-bold text-gray-500 text-sm">Stock</th>
                                {showForecast && <th className="p-4 font-bold text-purple-600 text-sm">AI Forecast</th>}
                                <th className="p-4 font-bold text-gray-500 text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {processedData.map((item) => (
                                <tr key={item.sku as unknown as string}>
                                    <td className="p-4 text-xs">{item.sku as unknown as string}</td>
                                    <td className="p-4 font-bold text-gray-700">{item.name}</td>
                                    <td className="p-4">{item.currentStock}</td>
                                    {showForecast && (
                                        <td className="p-4 text-purple-600 font-mono font-bold">
                                            {DemandNeuralNet.forecastSales([10, 12, 15, 10, 20, 18, item.currentStock])}
                                        </td>
                                    )}
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === StockStatus.CRITICAL ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {item.status}
                                        </span>
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
