import React, { useState } from 'react';
import { EmergencyResponseEngine } from '../../core/engines/EmergencyResponseEngine';

export const EmergencyControl: React.FC = () => {
    // Simulate falling revenue
    const revenueHistory = [5000000, 4800000, 4500000, 4000000, 3500000, 3000000, 2500000];
    const health = EmergencyResponseEngine.checkHealth(revenueHistory);
    const [active, setActive] = useState(false);

    return (
        <div className="bg-gray-900 p-8 rounded-3xl min-h-screen flex items-center justify-center animate-slide-in">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="inline-block p-6 rounded-full bg-red-900/30 border-4 border-red-600 animate-pulse">
                    <i className="fas fa-siren-on text-6xl text-red-500"></i>
                </div>

                <h2 className="text-5xl font-heading text-white">WARUNG DARURAT</h2>

                {health.isEmergency ? (
                    <div className="bg-red-500/20 border border-red-500 p-6 rounded-2xl">
                        <h3 className="text-2xl font-bold text-red-400 mb-2">CRITICAL ALERT</h3>
                        <p className="text-white">Omzet turun <span className="font-bold text-red-200">{health.revenueDrop}%</span> dalam 7 hari terakhir.</p>
                    </div>
                ) : (
                    <div className="bg-green-500/20 border border-green-500 p-6 rounded-2xl">
                        <p className="text-green-400">Status: STABIL</p>
                    </div>
                )}

                {!active ? (
                    <button
                        onClick={() => { EmergencyResponseEngine.activateProtocol(); setActive(true); }}
                        className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-2xl font-black rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-all transform hover:scale-105 active:scale-95"
                    >
                        AKTIFKAN PROTOKOL PENYELAMATAN
                    </button>
                ) : (
                    <div className="space-y-4 text-left">
                        <div className="bg-gray-800 p-4 rounded-xl border border-green-500 text-green-400">
                            <i className="fas fa-check mr-2"></i> Diskon 20% Applied
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl border border-green-500 text-green-400">
                            <i className="fas fa-check mr-2"></i> WA Broadcast Sent to 500 Customers
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl border border-green-500 text-green-400">
                            <i className="fas fa-check mr-2"></i> Restock List Generated
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
