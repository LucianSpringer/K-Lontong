import React, { useState } from 'react';
import { PayrollEngine, PayoutSlip } from '../../core/engines/PayrollEngine';

export const PayrollManager: React.FC = () => {
    const [revenue, setRevenue] = useState(2500000);
    const [slips, setSlips] = useState<PayoutSlip[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleCalculate = () => {
        setSlips(PayrollEngine.calculateDailyPayout(revenue));
    };

    const handleTransfer = async () => {
        setProcessing(true);
        const results = await PayrollEngine.executeTransfer(slips);
        setSlips(results);
        setProcessing(false);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <h2 className="text-3xl font-heading text-warung-deep-brown mb-6">Salary Autopilot</h2>

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <label className="block text-sm font-bold text-gray-500 mb-2">Input Omzet Hari Ini</label>
                <div className="flex gap-4">
                    <input
                        type="number"
                        value={revenue}
                        onChange={e => setRevenue(Number(e.target.value))}
                        className="flex-1 p-3 border rounded-xl text-xl font-mono"
                    />
                    <button onClick={handleCalculate} className="bg-warung-teal text-white px-6 rounded-xl font-bold">Hitung Gaji</button>
                </div>
            </div>

            {slips.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-4">Slip Gaji Harian</h3>
                    <div className="space-y-3">
                        {slips.map(slip => (
                            <div key={slip.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
                                <div>
                                    <p className="font-bold">{slip.employeeId}</p>
                                    <p className="text-xs text-gray-500">Base: {slip.breakdown.base} + Bonus: {slip.breakdown.bonus}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-bold text-lg">Rp {slip.amount.toLocaleString()}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${slip.status === 'TRANSFERRED' ? 'bg-green-100 text-green-700' :
                                            slip.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>{slip.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleTransfer}
                        disabled={processing || slips[0].status === 'TRANSFERRED'}
                        className="w-full mt-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition"
                    >
                        {processing ? 'Memproses Transfer...' : 'Transfer Otomatis ke Rekening'}
                    </button>
                </div>
            )}
        </div>
    );
};
