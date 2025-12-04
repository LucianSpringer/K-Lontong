import React, { useMemo } from 'react';
import { DeliveryRouter, GeoPoint } from '../../core/engines/DeliveryRouter';

export const DeliveryRouteVisualizer: React.FC = () => {
    const start: GeoPoint = { id: 'HQ', lat: -7.2575, lng: 112.7521, address: 'HQ Surabaya' };
    const stops: GeoPoint[] = [
        { id: 'C1', lat: -7.2650, lng: 112.7600, address: 'Warung Bu Siti' },
        { id: 'C2', lat: -7.2400, lng: 112.7400, address: 'Toko Madura' },
        { id: 'C3', lat: -7.2700, lng: 112.7300, address: 'Agen Sembako' },
        { id: 'C4', lat: -7.2500, lng: 112.7800, address: 'Kedai Kopi' },
    ];

    const route = useMemo(() => DeliveryRouter.optimizeRoute(start, stops), []);

    // Simplified SVG Scaling for Visualization
    const scaleX = (lng: number) => (lng - 112.72) * 8000;
    const scaleY = (lat: number) => (lat - -7.28) * -8000;

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Smart Logistics</h2>
                    <p className="text-gray-500">AI-Optimized Delivery Routes (TSP Heuristic).</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Distance</p>
                    <p className="text-2xl font-mono font-bold text-warung-teal">{route.totalDistance} km</p>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-xl p-8 relative h-[500px] overflow-hidden border border-gray-200">
                <div className="absolute inset-0 bg-gray-50 opacity-50" style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <svg className="absolute inset-0 w-full h-full">
                    <polyline
                        points={route.path.map(p => `${scaleX(p.lng)},${scaleY(p.lat)}`).join(' ')}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="4"
                        strokeDasharray="10,5"
                        className="animate-pulse"
                    />
                </svg>

                {route.path.map((point, idx) => (
                    <div
                        key={point.id}
                        className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: scaleX(point.lng), top: scaleY(point.lat) }}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg z-10 ${idx === 0 ? 'bg-warung-deep-brown' : 'bg-warung-teal'}`}>
                            {idx === 0 ? 'HQ' : idx}
                        </div>
                        <div className="bg-white px-2 py-1 rounded text-[10px] font-bold shadow mt-1 whitespace-nowrap z-20">
                            {point.address}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
