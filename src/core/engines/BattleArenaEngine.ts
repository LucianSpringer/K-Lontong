export interface WarungFighter {
    id: string;
    name: string;
    district: string; // Kecamatan
    score: number; // Weekly Omzet
    rank: number;
    badges: string[];
    prize?: string;
}

export class BattleArenaEngine {
    private static readonly SPONSORS = ['Indomie', 'Aqua', 'Kapal Api', 'Sampoerna'];

    public static getLeaderboard(myOmzet: number): WarungFighter[] {
        // Mock Competitors in the same district
        const fighters: WarungFighter[] = Array.from({ length: 9 }).map((_, i) => ({
            id: `W-${100 + i}`,
            name: `Warung ${['Barokah', 'Rejeki', 'Madura', 'Jaya', 'Abadi'][i % 5]} ${i}`,
            district: 'Kec. Sukolilo',
            score: Math.floor(Math.random() * 10000000) + 5000000,
            rank: 0,
            badges: []
        }));

        // Add Current User
        fighters.push({
            id: 'ME',
            name: 'Warung Anda',
            district: 'Kec. Sukolilo',
            score: myOmzet,
            rank: 0,
            badges: ['CHALLENGER']
        });

        // Sort & Rank
        fighters.sort((a, b) => b.score - a.score);

        return fighters.map((f, i) => {
            let prize = undefined;
            if (i === 0) prize = `10 Karton ${this.SPONSORS[0]}`;
            if (i === 1) prize = `5 Galon ${this.SPONSORS[1]}`;
            if (i === 2) prize = `Merchandise ${this.SPONSORS[2]}`;

            return { ...f, rank: i + 1, prize };
        });
    }
}
