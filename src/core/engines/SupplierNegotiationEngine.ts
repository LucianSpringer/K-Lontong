import { AuditLogger } from '../security/AuditLogger';

export interface NegotiationSession {
    id: string;
    item: string;
    qty: number;
    targetPrice: number;
    status: 'BROADCASTING' | 'NEGOTIATING' | 'DEAL_REACHED' | 'FAILED';
    offers: { supplier: string; price: number; timestamp: number }[];
    bestOffer?: { supplier: string; price: number };
}

export class SupplierNegotiationEngine {
    private static sessions: Map<string, NegotiationSession> = new Map();

    public static startNegotiation(item: string, qty: number, lastPrice: number): string {
        const id = crypto.randomUUID();
        const target = lastPrice * 0.95; // Aim for 5% discount

        const session: NegotiationSession = {
            id,
            item,
            qty,
            targetPrice: target,
            status: 'BROADCASTING',
            offers: []
        };

        this.sessions.set(id, session);
        AuditLogger.log('NEGO_BOT', `STARTED: ${item} @ Rp${target}`, 'INFO');

        // Simulate Async Reply Loop
        this.simulateReplies(id, lastPrice);

        return id;
    }

    private static simulateReplies(sessionId: string, basePrice: number) {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        // Mock Suppliers
        const suppliers = ['Grosir Jaya', 'Indomarco', 'Agen Berkah', 'Toko Madura Pusat'];

        let delay = 0;
        suppliers.forEach(sup => {
            delay += Math.random() * 2000 + 1000; // 1-3s gap

            setTimeout(() => {
                // Logic: Random chance to beat target price
                const offerPrice = basePrice * (Math.random() * 0.15 + 0.90); // 90% - 105% of base

                const offer = { supplier: sup, price: Math.floor(offerPrice), timestamp: Date.now() };
                session.offers.push(offer);
                session.status = 'NEGOTIATING';

                // Check if deal reached
                if (offer.price <= session.targetPrice) {
                    if (!session.bestOffer || offer.price < session.bestOffer.price) {
                        session.bestOffer = offer;
                    }
                }

                // Finalize after all replies (simplified)
                if (session.offers.length === suppliers.length) {
                    this.finalize(sessionId);
                }
            }, delay);
        });
    }

    private static finalize(id: string) {
        const session = this.sessions.get(id);
        if (!session) return;

        if (session.bestOffer) {
            session.status = 'DEAL_REACHED';
            AuditLogger.log('NEGO_BOT', `DEAL: ${session.bestOffer.supplier} @ Rp${session.bestOffer.price}`, 'INFO');
        } else {
            session.status = 'FAILED';
        }
    }

    public static getSession(id: string) {
        return this.sessions.get(id);
    }
}
