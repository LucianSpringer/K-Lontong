import React, { useMemo } from 'react';
import { BattleArenaEngine } from '../../core/engines/BattleArenaEngine';

export const BattleArena: React.FC = () => {
    const leaderboard = useMemo(() => BattleArenaEngine.getLeaderboard(8500000), []);

    return (
        <div className="bg-indigo-900 p-8 rounded-3xl min-h-screen animate-slide-in text-white">
            <header className="text-center mb-12">
                <h2 className="text-4xl font-heading text-yellow-400 drop-shadow-lg">WARUNG BATTLE ARENA</h2>
                <p className="text-indigo-200">Kecamatan Sukolilo Region • Season 4</p>
            </header>

            <div className="max-w-4xl mx-auto bg-indigo-800/50 p-8 rounded-3xl border border-indigo-500/30 backdrop-blur-sm">
                <div className="space-y-4">
                    {leaderboard.map((fighter) => (
                        <div key={fighter.id} className={`flex items-center p-4 rounded-2xl border-2 transition-all ${fighter.id === 'ME'
                                ? 'bg-gradient-to-r from-yellow-600 to-yellow-800 border-yellow-400 scale-105 shadow-2xl z-10'
                                : 'bg-indigo-900/80 border-indigo-700 opacity-80'
                            }`}>
                            <div className="w-12 text-2xl font-black text-center">{fighter.rank}</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg">{fighter.name}</h4>
                                <p className="text-xs text-indigo-300">{fighter.district}</p>
                            </div>
                            {fighter.prize && (
                                <div className="px-3 py-1 bg-green-600 rounded-full text-xs font-bold flex items-center gap-1 mr-4">
                                    <i className="fas fa-gift"></i> {fighter.prize}
                                </div>
                            )}
                            <div className="font-mono font-bold text-xl">
                                Rp {(fighter.score / 1000000).toFixed(1)}jt
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
