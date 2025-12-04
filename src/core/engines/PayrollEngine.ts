import { AuditLogger } from '../security/AuditLogger';

export interface Employee {
    id: string;
    name: string;
    role: 'KASIR' | 'HELPER' | 'MANAGER';
    baseSalary: number;
    revenueShare: number; // percentage 0-100
    bankAccount: string;
    lastPayout: string | null;
}

export interface PayoutSlip {
    id: string;
    employeeId: string;
    date: string;
    amount: number;
    breakdown: { base: number; bonus: number };
    status: 'PENDING' | 'TRANSFERRED' | 'FAILED';
}

export class PayrollEngine {
    private static employees: Employee[] = [
        { id: 'EMP-01', name: 'Siti Aminah', role: 'KASIR', baseSalary: 50000, revenueShare: 1.5, bankAccount: 'BCA 123...', lastPayout: null },
        { id: 'EMP-02', name: 'Joko Susilo', role: 'HELPER', baseSalary: 40000, revenueShare: 1.0, bankAccount: 'BRI 456...', lastPayout: null }
    ];

    public static getEmployees() { return this.employees; }

    public static calculateDailyPayout(dailyRevenue: number): PayoutSlip[] {
        return this.employees.map(emp => {
            const bonus = Math.floor(dailyRevenue * (emp.revenueShare / 100));
            const total = emp.baseSalary + bonus;

            return {
                id: `PAY-${Date.now()}-${emp.id}`,
                employeeId: emp.id,
                date: new Date().toISOString(),
                amount: total,
                breakdown: { base: emp.baseSalary, bonus },
                status: 'PENDING'
            };
        });
    }

    public static async executeTransfer(slips: PayoutSlip[]): Promise<PayoutSlip[]> {
        // Simulate Bank API Latency
        await new Promise(r => setTimeout(r, 2000));

        return slips.map(slip => {
            const success = Math.random() > 0.1; // 90% success rate
            if (success) {
                AuditLogger.log('PAYROLL_AUTO', `TRANSFER: Rp${slip.amount} to ${slip.employeeId}`, 'INFO');
            } else {
                AuditLogger.log('PAYROLL_ERR', `FAILED: ${slip.employeeId}`, 'CRITICAL');
            }

            return { ...slip, status: success ? 'TRANSFERRED' : 'FAILED' };
        });
    }
}
