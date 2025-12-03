import React, { useState, useEffect } from 'react';
import { OmniChannelGateway, Platform, SyncStatus } from '../../core/integrations/OmniChannelGateway';
import { DigitalPaymentService } from '../../core/integrations/DigitalPaymentService';

export const IntegrationsDashboard: React.FC = () => {
    const [platforms] = useState<Platform[]>([Platform.SHOPEE, Platform.GOFOOD, Platform.TIKTOK_SHOP]);
    const [syncLogs, setSyncLogs] = useState<{ platform: string, status: string, time: string }[]>([]);
    const [qrisDemo, setQrisDemo] = useState<string>('');

    // Initialize Gateway on mount
    useEffect(() => {
        OmniChannelGateway.initialize();
    }, []);

    const handleManualSync = async () => {
        const timestamp = new Date().toLocaleTimeString();
        setSyncLogs(prev => [{ platform: 'SYSTEM', status: 'INITIATING_BROADCAST...', time: timestamp }, ...prev]);

        // Simulate syncing SKU-001
        const results = await OmniChannelGateway.broadcastInventoryUpdate('SKU-001' as any, 50);

        Object.entries(results).forEach(([plat, status]) => {
            setSyncLogs(prev => [{ platform: plat, status: status, time: new Date().toLocaleTimeString() }, ...prev]);
        });
    };

    const generateDemoQR = () => {
        const qr = DigitalPaymentService.generateDynamicQRIS(150000, "WARUNG_SEJAHTERA");
        setQrisDemo(qr);
    };

    // FIXED: Use SyncStatus Enum for styling logic
    const getStatusColor = (status: string) => {
        switch (status) {
            case SyncStatus.SYNCED: return 'text-green-500';
            case SyncStatus.FAILED: return 'text-red-500';
            case SyncStatus.CONFLICT: return 'text-yellow-500';
            default: return 'text-blue-400';
        }
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen space-y-8 animate-slide-in">
            <header>
                <h2 className="text-3xl font-heading text-warung-deep-brown">
                    <i className="fas fa-network-wired text-warung-teal mr-3"></i>
                    The API Mesh
                </h2>
                <p className="text-gray-500">External Integrations & Omnichannel Orchestration.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Marketplace Status */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-700">Connected Platforms</h3>
                            <button
                                onClick={handleManualSync}
                                className="bg-warung-orange text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition"
                            >
                                <i className="fas fa-sync mr-2"></i> Force Sync
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {platforms.map(p => (
                                <div key={p} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 p-1 px-3 rounded-bl-lg text-[10px] font-bold ${p === Platform.SHOPEE ? 'bg-orange-500 text-white' :
                                        p === Platform.GOFOOD ? 'bg-green-500 text-white' : 'bg-black text-white'
                                        }`}>
                                        ACTIVE
                                    </div>
                                    <div className="text-2xl text-gray-700">
                                        <i className={`fas ${p === Platform.SHOPEE ? 'fa-bag-shopping' : p === Platform.GOFOOD ? 'fa-utensils' : 'fa-video'}`}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{p.replace('_', ' ')}</h4>
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            Latency: {Math.floor(Math.random() * 100) + 20}ms
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sync Logs */}
                    <div className="bg-black text-green-400 font-mono rounded-2xl p-6 shadow-xl h-64 overflow-y-auto text-xs border border-gray-800">
                        <div className="flex justify-between border-b border-gray-800 pb-2 mb-2">
                            <span>&gt; SYSTEM_LOGS --tail -f</span>
                            <span className="animate-pulse">_</span>
                        </div>
                        {syncLogs.length === 0 && <span className="opacity-50 text-gray-500">Waiting for events...</span>}
                        {syncLogs.map((log, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-gray-500">[{log.time}]</span>
                                <span className="text-blue-400 mx-2">{log.platform}</span>
                                <span className={getStatusColor(log.status)}>
                                    &gt;&gt; {log.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Fintech & Bot */}
                <div className="space-y-6">
                    {/* QRIS Generator */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-700 mb-4">Fintech Core (CRC16)</h3>
                        <p className="text-xs text-gray-500 mb-4">Generate Dynamic QRIS standard compliant strings.</p>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={generateDemoQR}
                                className="flex-1 bg-warung-teal text-white py-2 rounded-lg font-bold text-sm"
                            >
                                Gen QR Code
                            </button>
                        </div>

                        {qrisDemo && (
                            <div className="bg-gray-100 p-3 rounded-lg break-all text-[10px] font-mono border border-gray-200">
                                {qrisDemo}
                            </div>
                        )}
                    </div>

                    {/* WhatsApp Bot Status */}
                    <div className="bg-[#25D366] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-white opacity-20 text-8xl">
                            <i className="fab fa-whatsapp"></i>
                        </div>
                        <h3 className="font-bold text-lg relative z-10">WhatsApp Cloud API</h3>
                        <div className="mt-4 space-y-2 relative z-10">
                            <div className="flex justify-between text-sm border-b border-white/30 pb-1">
                                <span>Catalog Sync</span>
                                <span className="font-bold">AUTO (12am)</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/30 pb-1">
                                <span>Chatbot</span>
                                <span className="font-bold">ACTIVE</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/30 pb-1">
                                <span>Pending Msg</span>
                                <span className="font-bold">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
