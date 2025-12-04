import React, { useEffect, useRef } from 'react';

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
    r: number;
    color: string;
    connections: string[];
}

export const OmniVisionDashboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const nodes: Node[] = [
        { id: 'CORE', label: 'K\'Lontong Core', x: 400, y: 300, r: 40, color: '#FF6B35', connections: ['POS', 'INV', 'AI', 'FIN'] },
        { id: 'POS', label: 'Point of Sale', x: 200, y: 200, r: 30, color: '#0D9488', connections: [] },
        { id: 'INV', label: 'Inventory', x: 600, y: 200, r: 30, color: '#0D9488', connections: ['SUP'] },
        { id: 'AI', label: 'Neural Engine', x: 400, y: 150, r: 35, color: '#8B5CF6', connections: ['POS', 'INV'] },
        { id: 'FIN', label: 'Finance Hub', x: 400, y: 450, r: 30, color: '#F59E0B', connections: [] },
        { id: 'SUP', label: 'Supply Chain', x: 700, y: 150, r: 25, color: '#3B82F6', connections: [] },
        { id: 'WA', label: 'WhatsApp Bot', x: 100, y: 300, r: 25, color: '#22C55E', connections: ['POS'] },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let tick = 0;
        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Connections
            ctx.lineWidth = 2;
            nodes.forEach(node => {
                node.connections.forEach(targetId => {
                    const target = nodes.find(n => n.id === targetId);
                    if (target) {
                        // Animated Pulse Line
                        const grad = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
                        grad.addColorStop(0, node.color);
                        grad.addColorStop(1, target.color);
                        ctx.strokeStyle = grad;

                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(target.x, target.y);
                        ctx.stroke();

                        // Packet Simulation
                        const dist = Math.sqrt((target.x - node.x) ** 2 + (target.y - node.y) ** 2);
                        const speed = 2;
                        const progress = (tick * speed) % dist;
                        const ratio = progress / dist;
                        const px = node.x + (target.x - node.x) * ratio;
                        const py = node.y + (target.y - node.y) * ratio;

                        ctx.fillStyle = '#FFF';
                        ctx.beginPath();
                        ctx.arc(px, py, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            });

            // Draw Nodes
            nodes.forEach(node => {
                // Pulse Effect
                const pulse = Math.sin(tick * 0.05) * 2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r + pulse, 0, Math.PI * 2);
                ctx.fillStyle = node.color + '40'; // Transparent
                ctx.fill();

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();

                // Text
                ctx.fillStyle = '#FFF';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.label, node.x, node.y);
            });

            tick++;
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="bg-gray-900 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading text-white">OmniVision Console</h2>
                    <p className="text-gray-400">Real-time Architecture Visualization & Data Flow.</p>
                </div>
                <div className="flex items-center gap-2 text-green-400 font-mono">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    SYSTEM_OPTIMAL
                </div>
            </header>

            <div className="bg-black/50 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden relative">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-full h-full"
                />

                {/* Live Ticker */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 border-t border-gray-800">
                    <div className="flex gap-8 text-xs font-mono text-gray-400 overflow-hidden whitespace-nowrap">
                        <span>[10:42:01] Transaction #9492 Accepted</span>
                        <span>[10:42:02] Inventory Synced (Node: SUP-001)</span>
                        <span>[10:42:05] AI Model Retraining...</span>
                        <span>[10:42:08] Backup Completed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
