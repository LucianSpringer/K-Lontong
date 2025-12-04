import React, { useState } from 'react';
import { SupplierMarketplaceEngine, MarketRequest } from '../../core/engines/SupplierMarketplaceEngine';
import { SKU } from '../../core/types/InventoryTypes';

export const MarketplaceView: React.FC = () => {
    const [requests, setRequests] = useState<MarketRequest[]>([]);

    const createRequest = () => {
        const id = SupplierMarketplaceEngine.postRequest('SKU-1001' as SKU, 100);
        // Poll for updates
        const interval = setInterval(() => {
            const req = SupplierMarketplaceEngine.getRequest(id);
            if (req) setRequests([req]); // Simplified single view
            if (req?.bids.length && req.bids.length > 3) clearInterval(interval);
        }, 1000);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="flex justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Supplier Marketplace</h2>
                    <p className="text-gray-500">Real-time bidding for best wholesale prices.</p>
                </div>
                <button onClick={createRequest} className="bg-warung-orange text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition">
                    <i className="fas fa-bullhorn mr-2"></i> Post Request (Indomie)
                </button>
            </header>

            <div className="space-y-6">
                {requests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="font-bold text-lg">Request #{req.id.slice(0, 8)}</h3>
                                <p className="text-sm text-gray-500">{req.qty}x {req.sku}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                LIVE BIDDING ({req.bids.length} Offers)
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {req.bids.map(bid => (
                                <div key={bid.id} className={`p-4 rounded-xl border-2 relative overflow-hidden ${bid.id === req.bestBidId ? 'border-green-500 bg-green-50' : 'border-gray-100'
                                    }`}>
                                    {bid.id === req.bestBidId && (
                                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">BEST PRICE</div>
                                    )}
                                    <h4 className="font-bold text-gray-800">{bid.supplierName}</h4>
                                    <div className="text-2xl font-mono font-bold text-warung-deep-brown my-2">
                                        Rp {bid.price.toLocaleString()}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span><i className="fas fa-star text-yellow-400"></i> {bid.rating}</span>
                                        <span><i className="fas fa-truck"></i> {bid.deliverySLA}</span>
                                    </div>
                                    <button className="w-full mt-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold hover:bg-gray-50">
                                        Chat Supplier
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                        <i className="fas fa-shop text-4xl mb-4"></i>
                        <p>No active requests. Post one to start bidding.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
