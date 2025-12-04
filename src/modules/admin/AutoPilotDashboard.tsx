import React, { useState, useEffect } from 'react';
import { AutoPilotEngine, AutoPilotAction } from '../../core/engines/AutoPilotEngine';
import { PromotionGeneticEngine, PromoChromosome } from '../../core/ai/PromotionGeneticEngine';

export const AutoPilotDashboard: React.FC = () => {
    const [actions, setActions] = useState<AutoPilotAction[]>([]);
    const [promos, setPromos] = useState<PromoChromosome[]>([]);
    const [generation, setGeneration] = useState(1);

    useEffect(() => {
        // 1. Mock Inventory Data for Analysis
        const mockInventory = [
            { sku: 'SKU-1001', currentStock: 5, reorderPoint: 10, status: 'HEALTHY' },
            { sku: 'SKU-1045', currentStock: 50, retailPrice: 50000, status: 'OVERSTOCK' }
        ];
        const generatedActions = AutoPilotEngine.analyzeAndAct(mockInventory, {});
        setActions(generatedActions);

        // 2. Init Genetic Algo
        setPromos(PromotionGeneticEngine.initPopulation());
    }, []);

    const handleEvolve = () => {
        setPromos(prev => PromotionGeneticEngine.evolve(prev));
        setGeneration(g => g + 1);
    };

    const handleExecute = (id: string) => {
        AutoPilotEngine.executeAction(id);
        setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'EXECUTED' } : a));
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">AutoPilot Command</h2>
                    <p className="text-gray-500">Autonomous Business Decisions & AI Evolution.</p>
                </div>
                <div className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                    <i className="fas fa-robot"></i> AI Active
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Decision Stream */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Decision Stream</h3>
                    <div className="space-y-3">
                        {actions.map(action => (
                            <div key={action.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${action.type === 'RESTOCK' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                            }`}>{action.type}</span>
                                        <span className="text-xs text-gray-400 font-mono">{(action.confidence * 100).toFixed(0)}% Confidence</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 mt-1">
                                        {action.type === 'RESTOCK' ? `Order ${action.payload.qty}x ${action.payload.sku}` : `Discount ${action.payload.sku} by 10%`}
                                    </p>
                                </div>
                                {action.status === 'PENDING' ? (
                                    <button
                                        onClick={() => handleExecute(action.id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                ) : (
                                    <span className="text-xs font-bold text-green-600">EXECUTED</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Genetic Evolution */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800">Promotion Genome</h3>
                        <div className="text-xs text-gray-500">Gen: {generation}</div>
                    </div>

                    <div className="h-48 flex items-end gap-1 mb-4 border-b border-gray-100 pb-2">
                        {promos.map((p, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-purple-400 hover:bg-purple-600 transition-colors rounded-t-sm relative group"
                                style={{ height: `${Math.min(p.fitness, 100)}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 mb-1">
                                    Fit: {p.fitness.toFixed(0)} | Disc: {p.discountRate}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleEvolve}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-dna"></i> Evolve Next Generation
                    </button>
                </div>
            </div>
        </div>
    );
};
