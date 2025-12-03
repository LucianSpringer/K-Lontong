import React, { useRef, useState, useEffect } from 'react';

interface Furniture {
    id: string;
    type: 'SHELF' | 'FRIDGE' | 'CASHIER';
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
}

export const ARStoreLayout: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [items, setItems] = useState<Furniture[]>([
        { id: '1', type: 'CASHIER', x: 20, y: 20, w: 60, h: 40, color: '#FF6B35' },
        { id: '2', type: 'SHELF', x: 100, y: 20, w: 40, h: 100, color: '#0D9488' }
    ]);
    const [dragId, setDragId] = useState<string | null>(null);

    // Canvas Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            // Clear
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 20) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            // Items
            items.forEach(item => {
                ctx.fillStyle = item.color;
                ctx.fillRect(item.x, item.y, item.w, item.h);

                // Shadow
                ctx.shadowColor = 'rgba(0,0,0,0.2)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;

                // Label
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                ctx.fillText(item.type, item.x + 5, item.y + 15);

                ctx.shadowColor = 'transparent';
            });
        };

        const interval = setInterval(render, 1000 / 60); // 60 FPS
        return () => clearInterval(interval);
    }, [items]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // Simple Hit Detection
        const hit = items.find(item =>
            mx >= item.x && mx <= item.x + item.w &&
            my >= item.y && my <= item.y + item.h
        );

        if (hit) setDragId(hit.id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragId) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        setItems(prev => prev.map(item => {
            if (item.id === dragId) {
                return { ...item, x: mx - item.w / 2, y: my - item.h / 2 };
            }
            return item;
        }));
    };

    const addItem = (type: Furniture['type']) => {
        setItems(prev => [...prev, {
            id: crypto.randomUUID(),
            type,
            x: 150,
            y: 150,
            w: type === 'SHELF' ? 40 : 60,
            h: type === 'SHELF' ? 100 : 60,
            color: type === 'SHELF' ? '#0D9488' : type === 'FRIDGE' ? '#3B82F6' : '#FF6B35'
        }]);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">AR Store Planner</h2>
                    <p className="text-gray-500">Desain layout warung anti-rugi dengan drag & drop.</p>
                </div>
            </header>

            <div className="flex gap-6">
                <div className="w-1/4 space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-md">
                        <h4 className="font-bold mb-4 text-gray-700">Furniture</h4>
                        <button onClick={() => addItem('SHELF')} className="w-full bg-teal-100 text-teal-800 py-3 rounded-xl mb-2 font-bold hover:bg-teal-200 transition">
                            <i className="fas fa-layer-group mr-2"></i> Rak Gondola
                        </button>
                        <button onClick={() => addItem('FRIDGE')} className="w-full bg-blue-100 text-blue-800 py-3 rounded-xl mb-2 font-bold hover:bg-blue-200 transition">
                            <i className="fas fa-snowflake mr-2"></i> Kulkas
                        </button>
                        <button onClick={() => addItem('CASHIER')} className="w-full bg-orange-100 text-orange-800 py-3 rounded-xl font-bold hover:bg-orange-200 transition">
                            <i className="fas fa-cash-register mr-2"></i> Meja Kasir
                        </button>
                    </div>

                    <div className="bg-warung-deep-brown text-white p-4 rounded-2xl">
                        <h4 className="font-bold mb-2">AI Recommendation</h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                            "Posisi kasir di sebelah kanan pintu masuk meningkatkan impulse buying sebesar 15%."
                        </p>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 cursor-crosshair">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="w-full h-full"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={() => setDragId(null)}
                        onMouseLeave={() => setDragId(null)}
                    />
                </div>
            </div>
        </div>
    );
};
