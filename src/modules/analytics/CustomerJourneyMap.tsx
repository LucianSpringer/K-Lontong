import React from 'react';

export const CustomerJourneyMap: React.FC = () => {
    // Simple Sankey Data Structure
    const nodes = [
        { id: 'VISIT', x: 50, y: 100, label: 'Visitors (1000)', color: '#9CA3AF' },
        { id: 'CART', x: 250, y: 100, label: 'Add to Cart (600)', color: '#3B82F6' },
        { id: 'BUY', x: 450, y: 50, label: 'Purchase (450)', color: '#10B981' },
        { id: 'KASBON', x: 450, y: 150, label: 'Kasbon (150)', color: '#F59E0B' },
        { id: 'REPEAT', x: 650, y: 50, label: 'Loyal (300)', color: '#8B5CF6' },
        { id: 'CHURN', x: 650, y: 150, label: 'Churn (150)', color: '#EF4444' },
    ];

    const links = [
        { start: 'VISIT', end: 'CART', width: 60, color: '#3B82F6' },
        { start: 'CART', end: 'BUY', width: 45, color: '#10B981' },
        { start: 'CART', end: 'KASBON', width: 15, color: '#F59E0B' },
        { start: 'BUY', end: 'REPEAT', width: 30, color: '#8B5CF6' },
        { start: 'BUY', end: 'CHURN', width: 15, color: '#EF4444' },
    ];

    const getNode = (id: string) => nodes.find(n => n.id === id)!;

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="mb-8">
                <h2 className="text-3xl font-heading text-warung-deep-brown">Customer Journey Flow</h2>
                <p className="text-gray-500">Sankey visualization of conversion and retention funnels.</p>
            </header>

            <div className="bg-white p-12 rounded-2xl shadow-xl overflow-x-auto">
                <svg width="800" height="300" className="w-full">
                    {/* Links */}
                    {links.map((link, i) => {
                        const start = getNode(link.start);
                        const end = getNode(link.end);
                        const path = `M ${start.x + 20} ${start.y} C ${start.x + 100} ${start.y}, ${end.x - 100} ${end.y}, ${end.x - 20} ${end.y}`;

                        return (
                            <path
                                key={i}
                                d={path}
                                fill="none"
                                stroke={link.color}
                                strokeWidth={link.width}
                                strokeOpacity="0.4"
                                className="hover:stroke-opacity-80 transition-all duration-300"
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => (
                        <g key={node.id}>
                            <rect
                                x={node.x - 60} y={node.y - 20}
                                width="120" height="40"
                                rx="10" fill={node.color}
                                className="shadow-lg"
                            />
                            <text
                                x={node.x} y={node.y}
                                dy="5" textAnchor="middle"
                                fill="white" fontSize="12" fontWeight="bold"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};
