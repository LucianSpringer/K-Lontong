import React, { useState, useEffect } from 'react';
import { GamificationEngine } from '../../core/engines/GamificationEngine';
import { TokenEconomy } from '../../core/engines/TokenEconomy';

export const EngagementDashboard: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [badges, setBadges] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ledger, setLedger] = useState<any[]>([]);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        // 1. Load Gamification
        const stats = { sales: 1240, revenue: 15000000, daysActive: 12 };
        setBadges(GamificationEngine.getBadges(stats));

        // 2. Load Token Economy
        // Simulate earning
        if (TokenEconomy.getBalance() < 200) {
            TokenEconomy.mint(50, "Daily Login Bonus");
            TokenEconomy.mint(100, "Quest Complete: First Sale");
        }
        setLedger(TokenEconomy.getLedger());
        setBalance(TokenEconomy.getBalance());
    }, []);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Warung Quest</h2>
                    <p className="text-gray-500">Level up your business & earn rewards.</p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-xl font-bold shadow-inner border border-yellow-200 flex items-center gap-2">
                    <i className="fas fa-coins text-yellow-600"></i> {balance} $LONT
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Badges */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-gray-700">Active Quests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {badges.map(badge => (
                            <div key={badge.id} className={`p-4 rounded-xl border-2 flex gap-4 items-center ${badge.unlocked ? 'bg-white border-green-400' : 'bg-gray-100 border-gray-200 grayscale'}`}>
                                <div className="text-4xl">{badge.icon}</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800">{badge.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${badge.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ledger */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">Token Ledger</h3>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto text-xs font-mono">
                        {ledger.map((tx, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded border-l-4 border-yellow-400">
                                <div className="flex justify-between font-bold">
                                    <span>{tx.memo}</span>
                                    <span className="text-green-600">+{tx.amount}</span>
                                </div>
                                <div className="text-gray-400 mt-1 truncate" title={tx.hash}>{tx.hash}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
