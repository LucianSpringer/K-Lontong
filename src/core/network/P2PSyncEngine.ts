import { AuditLogger } from '../security/AuditLogger';

interface PeerNode {
    id: string;
    name: string;
    lastSeen: number;
    distance: number; // Simulated signal strength
}

interface SyncPacket {
    id: string;
    type: 'INVENTORY_UPDATE' | 'TX_BROADCAST';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    vectorClock: number;
}

export class P2PSyncEngine {
    private static peers: PeerNode[] = [];
    private static pendingPackets: SyncPacket[] = [];
    private static vectorClock = 0;

    public static scanForPeers(): PeerNode[] {
        // Mock Discovery
        const nearby = [
            { id: 'DEVICE_B', name: 'Kasir Gudang', lastSeen: Date.now(), distance: 85 },
            { id: 'DEVICE_C', name: 'Tablet Owner', lastSeen: Date.now(), distance: 92 }
        ];

        this.peers = nearby;
        return nearby;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static broadcast(type: SyncPacket['type'], payload: any) {
        this.vectorClock++;

        const packet: SyncPacket = {
            id: crypto.randomUUID(),
            type,
            payload,
            vectorClock: this.vectorClock
        };

        this.pendingPackets.push(packet);

        // Simulate Transmission
        setTimeout(() => {
            this.peers.forEach(p => {
                console.log(`[P2P_MESH] Sending packet ${packet.id} to ${p.name} (Signal: ${p.distance}%)`);
            });
            AuditLogger.log('MESH_SYNC', `BROADCAST:${type} to ${this.peers.length} peers`, 'INFO');
        }, 500);
    }

    public static getMeshStatus() {
        return {
            activePeers: this.peers.length,
            pendingSync: this.pendingPackets.length,
            clock: this.vectorClock,
            networkHealth: 'MESH_OPTIMAL'
        };
    }
}
