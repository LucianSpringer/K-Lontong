import React, { useState, useEffect } from 'react';
import { SupplyChainBrain, PurchaseOrder } from '../../core/engines/SupplyChainBrain';
import { InventoryItem } from '../../core/types/InventoryTypes';

// Mock Data Wrapper
const MOCK_INVENTORY = Array.from({ length: 20 }).map((_, i) => ({
    sku: `SKU-${1000 + i}`,
    name: `Item #${i}`,
    currentStock: Math.floor(Math.random() * 20), // Low stock
    purchasePrice: 10000 + (i * 1000),
    supplierId: i % 2 === 0 ? 'SUP-001' : 'SUP-002'
})) as InventoryItem[];

export const ProcurementDashboard: React.FC = () => {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

    useEffect(() => {
        // Run the Brain
        const generatedPOs = SupplyChainBrain.generateSmartPO(MOCK_INVENTORY);
        setOrders(generatedPOs);
    }, []);

    const handleAction = (id: string, action: 'SEND' | 'CANCEL') => {
        setOrders(prev => prev.map(po => {
            if (po.id === id) {
                return { ...po, status: action === 'SEND' ? 'SENT' : 'CANCELLED' };
            }
            return po;
        }));
        if (selectedPO?.id === id) setSelectedPO(null);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen space-y-8 animate-slide-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Smart Procurement</h2>
                    <p className="text-gray-500">Auto-generated Purchase Orders based on EOQ & ROP logic.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-600">AI Restock Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PO List */}
                <div className="lg:col-span-2 space-y-4">
                    {orders.length === 0 && (
                        <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-dashed">
                            No restock needed currently.
                        </div>
                    )}
                    {orders.map(po => (
                        <div
                            key={po.id}
                            onClick={() => setSelectedPO(po)}
                            className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${selectedPO?.id === po.id ? 'border-warung-orange ring-1 ring-warung-orange' : 'border-gray-100'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-bold text-gray-400">{po.id}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${po.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                                            po.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {po.status}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-warung-deep-brown mt-1">
                                        {SupplyChainBrain.getSupplierName(po.supplierId)}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Est. Delivery</p>
                                    <p className="font-bold text-gray-700">{po.expectedDelivery.toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                                <div className="text-xs text-gray-500">
                                    {po.items.length} unique items
                                    <br />
                                    Total Qty: {po.items.reduce((a, b) => a + b.qty, 0)}
                                </div>
                                <div className="text-xl font-bold font-mono text-warung-teal">
                                    Rp {po.totalCost.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 h-fit sticky top-24">
                    {selectedPO ? (
                        <div className="space-y-6">
                            <div className="text-center border-b border-gray-100 pb-4">
                                <h3 className="font-heading text-xl text-warung-deep-brown">Order Details</h3>
                                <p className="text-xs text-gray-400">{selectedPO.id}</p>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {selectedPO.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <div>
                                            <p className="font-bold text-gray-700">{item.sku}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.qty} (EOQ Optimized)</p>
                                        </div>
                                        <div className="font-mono text-gray-600">
                                            Rp {item.cost.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between mb-4 font-bold text-lg">
                                    <span>Total</span>
                                    <span>Rp {selectedPO.totalCost.toLocaleString()}</span>
                                </div>

                                {selectedPO.status === 'DRAFT' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleAction(selectedPO.id, 'CANCEL')}
                                            className="py-3 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedPO.id, 'SEND')}
                                            className="py-3 rounded-xl font-bold text-white bg-warung-teal hover:bg-teal-700 transition shadow-lg"
                                        >
                                            Send PO via WA
                                        </button>
                                    </div>
                                )}
                                {selectedPO.status === 'SENT' && (
                                    <div className="text-center p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                                        <i className="fas fa-check-circle mr-2"></i> Sent to Supplier
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                            <i className="fas fa-file-invoice text-4xl mb-4 opacity-50"></i>
                            <p className="text-sm text-center">Select an order to review details and approve.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
