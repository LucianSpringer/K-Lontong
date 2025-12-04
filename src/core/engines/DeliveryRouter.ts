export interface GeoPoint {
    lat: number;
    lng: number;
    id: string;
    address: string;
}

export interface DeliveryRoute {
    path: GeoPoint[];
    totalDistance: number; // km
    estimatedTime: number; // mins
}

export class DeliveryRouter {
    // Haversine Formula for distance between two coords
    private static getDistance(p1: GeoPoint, p2: GeoPoint): number {
        const R = 6371; // Earth radius in km
        const dLat = this.deg2rad(p2.lat - p1.lat);
        const dLng = this.deg2rad(p2.lng - p1.lng);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(p1.lat)) * Math.cos(this.deg2rad(p2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Nearest Neighbor Heuristic for TSP (Traveling Salesman Problem)
     */
    public static optimizeRoute(start: GeoPoint, stops: GeoPoint[]): DeliveryRoute {
        const path: GeoPoint[] = [start];
        const remainingStops = [...stops];
        let current = start;
        let totalDist = 0;

        while (remainingStops.length > 0) {
            let nearest: GeoPoint | null = null;
            let minDist = Infinity;
            let nearestIdx = -1;

            // Find nearest unvisited
            remainingStops.forEach((stop, idx) => {
                const d = this.getDistance(current, stop);
                if (d < minDist) {
                    minDist = d;
                    nearest = stop;
                    nearestIdx = idx;
                }
            });

            if (nearest && nearestIdx !== -1) {
                path.push(nearest);
                totalDist += minDist;
                current = nearest;
                remainingStops.splice(nearestIdx, 1);
            }
        }

        // Return to start (optional, omitted for one-way delivery)

        return {
            path,
            totalDistance: parseFloat(totalDist.toFixed(2)),
            estimatedTime: Math.ceil(totalDist * 15) // Assume 15 mins per km avg in traffic + stop
        };
    }
}
