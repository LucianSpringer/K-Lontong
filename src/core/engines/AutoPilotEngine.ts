import { AuditLogger } from '../security/AuditLogger';

export type ActionType = 'RESTOCK' | 'ADJUST_PRICE' | 'TRIGGER_PROMO' | 'HOLD_BUDGET';

export interface AutoPilotAction {
    id: string;
    type: ActionType;
    confidence: number; // 0.0 - 1.0
    payload: any;
    status: 'PENDING' | 'EXECUTED' | 'ROLLED_BACK';
    timestamp: number;
}

// Command Pattern Interface
interface IAutoCommand {
    execute(): void;
    rollback(): void;
}

class RestockCommand implements IAutoCommand {
    constructor(private sku: string, private qty: number) { }
    execute() { console.log(`[AUTOPILOT] Restocking ${this.sku} x${this.qty}`); }
    rollback() { console.log(`[AUTOPILOT] Cancelled PO for ${this.sku}`); }
}

class PriceAdjustCommand implements IAutoCommand {
    constructor(private sku: string, private oldPrice: number, private newPrice: number) { }
    execute() { console.log(`[AUTOPILOT] Price adjusted for ${this.sku}: ${this.newPrice}`); }
    rollback() { console.log(`[AUTOPILOT] Price reverted for ${this.sku}: ${this.oldPrice}`); }
}

export class AutoPilotEngine {
    private static history: AutoPilotAction[] = [];
    private static commands: Map<string, IAutoCommand> = new Map();
    private static readonly CONFIDENCE_THRESHOLD = 0.85;

    public static analyzeAndAct(inventory: any[], _marketData: any): AutoPilotAction[] {
        const actions: AutoPilotAction[] = [];

        // 1. Inventory Analysis (Supply Chain Synapse)
        inventory.forEach(item => {
            if (item.currentStock < item.reorderPoint && item.status !== 'DISCONTINUED') {
                // Calculate Confidence based on sales velocity vs lead time
                const confidence = Math.min(0.95, (item.reorderPoint / Math.max(1, item.currentStock)) * 0.1 + 0.7);

                const action: AutoPilotAction = {
                    id: crypto.randomUUID(),
                    type: 'RESTOCK',
                    confidence,
                    payload: { sku: item.sku, qty: 50 }, // Simplified EOQ
                    status: 'PENDING',
                    timestamp: Date.now()
                };

                actions.push(action);
                this.registerCommand(action, new RestockCommand(item.sku, 50));
            }
        });

        // 2. Pricing Analysis (Dynamic Pricing Synapse)
        // Mock analysis: If stock is high and turnover low, discount it
        inventory.forEach(item => {
            if (item.status === 'OVERSTOCK') {
                const action: AutoPilotAction = {
                    id: crypto.randomUUID(),
                    type: 'ADJUST_PRICE',
                    confidence: 0.88,
                    payload: { sku: item.sku, discount: 0.1 },
                    status: 'PENDING',
                    timestamp: Date.now()
                };
                actions.push(action);
                this.registerCommand(action, new PriceAdjustCommand(item.sku, item.retailPrice, item.retailPrice * 0.9));
            }
        });

        // Store in history
        this.history.push(...actions);
        return actions;
    }

    private static registerCommand(action: AutoPilotAction, cmd: IAutoCommand) {
        this.commands.set(action.id, cmd);
        // Auto-execute if confidence is high
        if (action.confidence > this.CONFIDENCE_THRESHOLD) {
            this.executeAction(action.id);
        }
    }

    public static executeAction(id: string): void {
        const cmd = this.commands.get(id);
        if (cmd) {
            cmd.execute();
            this.updateStatus(id, 'EXECUTED');
            AuditLogger.log('AUTOPILOT_EXEC', `ACTION:${id}`, 'INFO');
        }
    }

    public static rollbackAction(id: string): void {
        const cmd = this.commands.get(id);
        if (cmd) {
            cmd.rollback();
            this.updateStatus(id, 'ROLLED_BACK');
            AuditLogger.log('AUTOPILOT_ROLLBACK', `ACTION:${id}`, 'WARNING');
        }
    }

    private static updateStatus(id: string, status: AutoPilotAction['status']) {
        // In a real app, this updates a state store
        const action = this.history.find(a => a.id === id);
        if (action) {
            action.status = status;
        }
    }
}
