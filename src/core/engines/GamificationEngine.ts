export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
    progress: number; // 0-100
}

export class GamificationEngine {
    public static getBadges(stats: { sales: number, revenue: number, daysActive: number }): Badge[] {
        return [
            {
                id: 'B_SULTAN',
                name: 'Warung Sultan',
                icon: '👑',
                description: 'Reach Rp 100.000.000 Lifetime Revenue',
                unlocked: stats.revenue >= 100000000,
                progress: Math.min(100, (stats.revenue / 100000000) * 100)
            },
            {
                id: 'B_TRAFFIC',
                name: 'Pasar Kaget',
                icon: '🔥',
                description: 'Process 1,000 Transactions',
                unlocked: stats.sales >= 1000,
                progress: Math.min(100, (stats.sales / 1000) * 100)
            },
            {
                id: 'B_LOYAL',
                name: 'Legenda Lokal',
                icon: '🏛️',
                description: 'Active for 30 Days',
                unlocked: stats.daysActive >= 30,
                progress: Math.min(100, (stats.daysActive / 30) * 100)
            }
        ];
    }

    public static calculateLevel(xp: number): number {
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }
}
