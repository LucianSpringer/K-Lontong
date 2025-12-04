export interface TransactionBlock {
    hash: string;
    prevHash: string;
    timestamp: number;
    from: string;
    to: string;
    amount: number;
    memo: string;
}

export class TokenEconomy {
    private static chain: TransactionBlock[] = [];
    private static balance: number = 100; // Genesis Drop

    private static hash(data: string): string {
        // Simple mock hash for visual effect
        let h = 0xdeadbeef;
        for (let i = 0; i < data.length; i++) h = Math.imul(h ^ data.charCodeAt(i), 2654435761);
        return ((h ^ h >>> 16) >>> 0).toString(16);
    }

    public static mint(amount: number, reason: string) {
        const prev = this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : '0xGENESIS';
        const block: TransactionBlock = {
            hash: '',
            prevHash: prev,
            timestamp: Date.now(),
            from: 'SYSTEM_MINT',
            to: 'USER_WALLET',
            amount,
            memo: reason
        };
        block.hash = this.hash(JSON.stringify(block));

        this.chain.push(block);
        this.balance += amount;
    }

    public static getLedger() {
        return [...this.chain].reverse();
    }

    public static getBalance() {
        return this.balance;
    }
}
