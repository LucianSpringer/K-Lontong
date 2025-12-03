import React, { useState } from 'react';
import { CommandHistory, ICommand } from '../../core/tools/CommandPattern';

interface GridItem {
    id: string;
    x: number; // Grid coordinates, not pixels
    y: number;
    w: number;
    h: number;
    type: 'SHELF' | 'CASHIER' | 'DOOR';
}

const CELL_SIZE = 40;

// Command Implementation for Add Item
class AddItemCommand implements ICommand {
    constructor(
        private item: GridItem,
        private setFn: React.Dispatch<React.SetStateAction<GridItem[]>>
    ) { }

    execute() {
        this.setFn(prev => [...prev, this.item]);
    }

    undo() {
        this.setFn(prev => prev.filter(i => i.id !== this.item.id));
    }
}

export const StoreLayoutEditor: React.FC = () => {
    const [items, setItems] = useState<GridItem[]>([]);
    const [history] = useState(new CommandHistory());
    const [activeTool, setActiveTool] = useState<'SHELF' | 'CASHIER' | 'DOOR'>('SHELF');
    // Force re-render on history change
    const [, setTick] = useState(0);

    const handleGridClick = (gx: number, gy: number) => {
        const newItem: GridItem = {
            id: crypto.randomUUID(),
            x: gx,
            y: gy,
            w: activeTool === 'SHELF' ? 2 : 3,
            h: 1,
            type: activeTool
        };

        const cmd = new AddItemCommand(newItem, setItems);
        history.execute(cmd);
        setTick(t => t + 1);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Grid Layout Pro</h2>
                    <p className="text-gray-500">Desain warung presisi dengan Grid System.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { history.undo(); setTick(t => t + 1); }}
                        disabled={!history.canUndo}
                        className="px-4 py-2 bg-white border rounded-lg shadow-sm disabled:opacity-50"
                    >
                        <i className="fas fa-undo mr-2"></i> Undo
                    </button>
                    <button
                        onClick={() => { history.redo(); setTick(t => t + 1); }}
                        disabled={!history.canRedo}
                        className="px-4 py-2 bg-white border rounded-lg shadow-sm disabled:opacity-50"
                    >
                        <i className="fas fa-redo mr-2"></i> Redo
                    </button>
                </div>
            </header>

            <div className="flex gap-6">
                <div className="w-48 space-y-2">
                    {['SHELF', 'CASHIER', 'DOOR'].map(tool => (
                        <button
                            key={tool}
                            onClick={() => setActiveTool(tool as any)}
                            className={`w-full p-3 rounded-xl text-left font-bold border-2 transition-all ${activeTool === tool ? 'border-warung-teal bg-teal-50 text-warung-teal' : 'border-white bg-white text-gray-600'
                                }`}
                        >
                            {tool}
                        </button>
                    ))}
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-inner border overflow-hidden relative" style={{ height: '500px' }}>
                    {/* Render Grid */}
                    <div
                        className="absolute inset-0 cursor-crosshair"
                        style={{
                            backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)',
                            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                        }}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
                            const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
                            handleGridClick(x, y);
                        }}
                    >
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`absolute border-2 border-white shadow-md rounded flex items-center justify-center text-xs font-bold text-white ${item.type === 'SHELF' ? 'bg-warung-teal' : item.type === 'CASHIER' ? 'bg-warung-orange' : 'bg-gray-800'
                                    }`}
                                style={{
                                    left: item.x * CELL_SIZE,
                                    top: item.y * CELL_SIZE,
                                    width: item.w * CELL_SIZE,
                                    height: item.h * CELL_SIZE
                                }}
                            >
                                {item.type}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
