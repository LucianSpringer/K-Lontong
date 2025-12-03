import React, { useEffect, useState } from 'react';

interface MapNode {
    id: number;
    x: number;
    y: number;
    size: number;
    pulseDelay: number;
    active: boolean;
}

export const WarungMapVisualizer: React.FC = () => {
    const [nodes, setNodes] = useState<MapNode[]>([]);

    // Procedural Generation of "Warung Nodes"
    useEffect(() => {
        const newNodes: MapNode[] = [];
        for (let i = 0; i < 40; i++) {
            newNodes.push({
                id: i,
                x: Math.random() * 100, // Percentage
                y: Math.random() * 100,
                size: Math.random() * 8 + 4,
                pulseDelay: Math.random() * 2,
                active: Math.random() > 0.3
            });
        }
        setNodes(newNodes);
    }, []);

    return (
        <section className="py-20 bg-warung-deep-brown overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">

                {/* Text Content */}
                <div className="md:w-1/3 text-white">
                    <span className="text-warung-yellow font-bold uppercase tracking-widest text-sm">
                        <i className="fas fa-globe-asia mr-2"></i>
                        Ekosistem Nasional
                    </span>
                    <h2 className="text-4xl font-heading mt-4 mb-6">
                        Bergabung dengan <span className="text-warung-teal">Jaringan Raksasa</span>
                    </h2>
                    <p className="text-white/70 mb-8 leading-relaxed">
                        Anda tidak sendirian. Bergabunglah dengan ribuan mitra K'Lontong yang tersebar di seluruh nusantara. Kami membangun rantai pasok digital yang menghubungkan warung kecil dengan distributor besar.
                    </p>

                    <div className="flex gap-8">
                        <div>
                            <p className="text-3xl font-bold text-warung-orange">15+</p>
                            <p className="text-xs text-white/50 uppercase">Kota Besar</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-warung-teal">24/7</p>
                            <p className="text-xs text-white/50 uppercase">Sistem Online</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-warung-yellow">50rb+</p>
                            <p className="text-xs text-white/50 uppercase">Transaksi/Hari</p>
                        </div>
                    </div>
                </div>

                {/* The Map Visualization */}
                <div className="md:w-2/3 w-full h-[400px] bg-white/5 rounded-3xl border border-white/10 relative shadow-2xl backdrop-blur-sm overflow-hidden group">
                    {/* Abstract Map Shape (Simulated Indonesia-ish blob) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <i className="fas fa-map text-[300px] text-white"></i>
                    </div>

                    {/* Nodes */}
                    {nodes.map((node) => (
                        <div
                            key={node.id}
                            className="absolute rounded-full transition-all duration-1000"
                            style={{
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                                width: `${node.size}px`,
                                height: `${node.size}px`,
                                backgroundColor: node.active ? '#10B981' : '#F59E0B',
                                boxShadow: node.active ? '0 0 10px #10B981' : 'none',
                                animation: `pulse-glow 2s infinite ${node.pulseDelay}s`
                            }}
                        >
                            {node.active && (
                                <div className="absolute -inset-4 border border-white/20 rounded-full animate-ping opacity-20"></div>
                            )}
                        </div>
                    ))}

                    {/* Overlay Label */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-4 py-2 rounded-lg text-xs text-white border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Live Transaction Feed
                    </div>
                </div>
            </div>
        </section>
    );
};
