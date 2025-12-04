import React, { useState } from 'react';
import { SupplierNegotiationEngine } from '../../core/engines/SupplierNegotiationEngine';

const MOCK_SUPPLIERS = [
    { id: 'SUP-001', name: 'Agen Sembako Makmur', reliability: 98, speed: '24h', priceIndex: 1.0 },
    { id: 'SUP-002', name: 'Distributor Wings', reliability: 95, speed: '48h', priceIndex: 0.95 },
    { id: 'SUP-003', name: 'Toko Grosir Jaya', reliability: 80, speed: '12h', priceIndex: 1.1 },
];

export const SupplierDashboard: React.FC = () => {
    const [negotiating, setNegotiating] = useState<string | null>(null);

    const handleNegotiate = (item: string) => {
        setNegotiating(item);
        SupplierNegotiationEngine.startNegotiation(item, 100, 50000);
        alert(`🤖 AI Negotiation Bot: Memulai negosiasi harga untuk ${item} ke 15 supplier...`);
        setTimeout(() => setNegotiating(null), 3000);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <h2 className="text-3xl font-heading text-warung-deep-brown mb-6">Supplier Network</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Add a "Negotiation Card" */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl col-span-1 md:col-span-3">
                    <h3 className="font-bold text-xl mb-2"><i className="fas fa-robot"></i> AI Procurement Bot</h3>
                    <p className="opacity-80 text-sm mb-4">Otomatis tawar-menawar harga dengan supplier via WhatsApp API.</p>
                    <button
                        onClick={() => handleNegotiate("Minyak Goreng 2L")}
                        className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                        disabled={!!negotiating}
                    >
                        {negotiating ? 'Sedang Nego...' : 'Cari Termurah (Minyak Goreng)'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_SUPPLIERS.map(sup => (
                    <div key={sup.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg">{sup.name}</h4>
                                <p className="text-xs text-gray-500">{sup.id}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{sup.reliability}% Rel</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Speed: {sup.speed}</span>
                            <span>Price: {sup.priceIndex}x</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
