import React from 'react';

const MOCK_SUPPLIERS = [
    { id: 1, name: 'Grosir Jaya', phone: '0812...', reliability: 98, deliveryTime: '24h' },
    { id: 2, name: 'Agen Telur Berkah', phone: '0856...', reliability: 85, deliveryTime: '12h' },
    { id: 3, name: 'Indomarco DC', phone: '021...', reliability: 99, deliveryTime: '48h' }
];

export const SupplierDashboard: React.FC = () => {
    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="flex justify-between mb-8">
                <h2 className="text-3xl font-heading text-warung-deep-brown">Supplier Management</h2>
                <button className="bg-warung-teal text-white px-4 py-2 rounded-xl font-bold shadow-lg">+ New Supplier</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_SUPPLIERS.map(sup => (
                    <div key={sup.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-600">
                                <i className="fas fa-truck-fast"></i>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${sup.reliability > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                Score: {sup.reliability}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{sup.name}</h3>
                        <p className="text-gray-500 text-sm mb-4"><i className="fas fa-phone mr-2"></i>{sup.phone}</p>
                        <div className="border-t border-gray-100 pt-4 flex justify-between text-sm">
                            <span className="text-gray-500">Avg Delivery</span>
                            <span className="font-mono font-bold">{sup.deliveryTime}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
