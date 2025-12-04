import React, { useMemo, useState } from 'react';
import { TransactionSeeder } from '../../core/generators/TransactionSeeder';
import { ForensicsEngine } from '../../core/engines/ForensicsEngine';
import { TaxComplianceEngine } from '../../core/engines/TaxComplianceEngine';
import { AuditSimulatorEngine } from '../../core/engines/AuditSimulatorEngine';
import { SKU } from '../../core/types/InventoryTypes';

export const AnalyticsDashboard: React.FC = () => {
    const [seedKey, setSeedKey] = useState(0);

    const { data, insights, taxReport, auditReport } = useMemo(() => {
        const mockSkus = ['SKU-001', 'SKU-002', 'SKU-003'] as unknown as SKU[];
        const rawData = TransactionSeeder.generateHistory(mockSkus);
        const analysis = ForensicsEngine.analyze(rawData);

        // Tax Logic
        const simpleTx = rawData.map(r => ({ id: r.id, total: r.totalAmount }));
        const report = TaxComplianceEngine.generateReport(simpleTx, false);

        // NEW: Run Audit Simulation
        // We need mock inventory for this engine
        const mockInvForAudit = Array.from({ length: 20 }).map((_, i) => ({
            sku: `SKU-${i}`, name: `Item ${i}`, currentStock: 50, purchasePrice: 10000
        })) as any[];
        const audit = AuditSimulatorEngine.runAudit(mockInvForAudit, rawData);

        return { data: rawData, insights: analysis, taxReport: report, auditReport: audit };
    }, [seedKey]);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen space-y-8 animate-slide-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown">Financial Forensics</h2>
                    <p className="text-gray-500">Real-time analysis of {data.length.toLocaleString()} transactions.</p>
                </div>
                <button onClick={() => setSeedKey(prev => prev + 1)} className="bg-warung-deep-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all">
                    <i className="fas fa-sync mr-2"></i> Re-Seed Data
                </button>
            </header>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-warung-teal">
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
                    <p className="text-2xl font-mono font-bold text-gray-800 mt-2">Rp {(insights.totalRevenue / 1000000).toFixed(2)} Jt</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-warung-orange">
                    <p className="text-xs font-bold text-gray-400 uppercase">Avg Basket</p>
                    <p className="text-2xl font-mono font-bold text-gray-800 mt-2">Rp {Math.round(insights.averageBasketSize).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
                    <p className="text-xs font-bold text-gray-400 uppercase">Fraud Risk</p>
                    <p className="text-2xl font-mono font-bold text-red-500 mt-2">{insights.fraudRiskScore.toFixed(3)}%</p>
                </div>
                {/* Tax Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-20 text-6xl"><i className="fas fa-file-invoice-dollar"></i></div>
                    <p className="text-xs font-bold opacity-80 uppercase">Estimasi PPh Final (0.5%)</p>
                    <p className="text-2xl font-mono font-bold mt-2">Rp {taxReport.pphFinal.toLocaleString()}</p>
                    <p className="text-xs opacity-60 mt-1">Periode: {taxReport.period}</p>
                </div>
            </div>

            {/* NEW: Audit Score Card */}
            <div className={`p-6 rounded-2xl shadow-lg border-l-4 ${auditReport.complianceScore > 80 ? 'border-green-500' : 'border-red-500'} bg-white`}>
                <p className="text-xs font-bold text-gray-400 uppercase">Inventory Integrity</p>
                <p className="text-2xl font-mono font-bold text-gray-800 mt-2">{auditReport.complianceScore}%</p>
                <p className="text-xs text-red-400 mt-1">Variance: -Rp {auditReport.totalVariance.toLocaleString()}</p>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-heading text-lg text-gray-700">Live Transaction Feed</h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">ID</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Method</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono text-sm">
                            {data.slice(0, 100).map((tx) => (
                                <tr key={tx.id as unknown as string} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 text-gray-400">{(tx.id as unknown as string).slice(0, 12)}...</td>
                                    <td className="p-4">{tx.timestamp.toLocaleDateString()}</td>
                                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-gray-100">{tx.paymentMethod}</span></td>
                                    <td className="p-4 font-bold text-gray-700">Rp {tx.totalAmount.toLocaleString()}</td>
                                    <td className="p-4">{tx.isFlaggedSuspicious ? 'FLAG' : 'OK'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
