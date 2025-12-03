import React, { useState, useEffect } from 'react';

export const DeveloperConsole: React.FC = () => {
    const [metrics, setMetrics] = useState({
        fps: 60,
        memory: 0,
        latency: 0,
        renders: 0
    });
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                fps: Math.floor(Math.random() * 10 + 50), // Fake FPS
                memory: Math.floor(Math.random() * 20 + 40), // MB
                latency: Math.floor(Math.random() * 50 + 10), // ms
                renders: prev.renders + 1
            }));

            if (Math.random() > 0.7) {
                const events = ['API_HEARTBEAT', 'CACHE_HIT', 'DOM_UPDATE', 'GC_COLLECT'];
                const evt = events[Math.floor(Math.random() * events.length)];
                setLogs(prev => [`[${new Date().toISOString().split('T')[1]}] ${evt}`, ...prev.slice(0, 9)]);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-900 p-6 rounded-xl text-green-400 font-mono text-sm shadow-2xl border border-green-900/50 h-full">
            <h3 className="text-lg font-bold mb-4 border-b border-green-800 pb-2 flex justify-between">
                <span>DEV_KERNEL_V1.4</span>
                <span className="animate-pulse">● LIVE</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/50 p-3 rounded border border-green-900">
                    <p className="text-gray-500 text-xs uppercase">Frame Rate</p>
                    <p className="text-2xl font-bold">{metrics.fps} FPS</p>
                </div>
                <div className="bg-black/50 p-3 rounded border border-green-900">
                    <p className="text-gray-500 text-xs uppercase">Heap Size</p>
                    <p className="text-2xl font-bold">{metrics.memory} MB</p>
                </div>
                <div className="bg-black/50 p-3 rounded border border-green-900">
                    <p className="text-gray-500 text-xs uppercase">Network Latency</p>
                    <p className="text-2xl font-bold text-yellow-400">{metrics.latency} ms</p>
                </div>
                <div className="bg-black/50 p-3 rounded border border-green-900">
                    <p className="text-gray-500 text-xs uppercase">Render Cycles</p>
                    <p className="text-2xl font-bold">{metrics.renders}</p>
                </div>
            </div>

            <div className="bg-black p-4 rounded border border-green-900 h-64 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent to-black/20"></div>
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 opacity-80 hover:opacity-100 hover:bg-green-900/30 px-1 rounded">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};
