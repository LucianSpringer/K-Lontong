export interface BranchNode {
    id: string;
    name: string;
    location: string;
    dailyRevenue: number;
    performanceScore: number; // 0-100
    status: 'ONLINE' | 'OFFLINE' | 'WARNING';
}

export class FranchiseNetwork {
    private static readonly LOCATIONS = ['Surabaya Pusat', 'Sidoarjo', 'Gresik', 'Mojokerto', 'Malang', 'Pasuruan'];

    public static getNetworkOverview(): BranchNode[] {
        return Array.from({ length: 12 }).map((_, i) => {
            const baseRev = 2000000;
            const variance = Math.random() * 1500000;
            const revenue = baseRev + variance;

            return {
                id: `BR-${(i + 1).toString().padStart(3, '0')}`,
                name: `K'Lontong ${this.LOCATIONS[i % this.LOCATIONS.length]} #${i + 1}`,
                location: this.LOCATIONS[i % this.LOCATIONS.length],
                dailyRevenue: revenue,
                performanceScore: Math.floor(Math.random() * 30) + 70, // 70-100
                status: (Math.random() > 0.9 ? 'WARNING' : 'ONLINE') as 'WARNING' | 'ONLINE'
            };
        }).sort((a, b) => b.dailyRevenue - a.dailyRevenue);
    }

    public static getTotalNetworkRevenue(branches: BranchNode[]): number {
        return branches.reduce((acc, curr) => acc + curr.dailyRevenue, 0);
    }
}
