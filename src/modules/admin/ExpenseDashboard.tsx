import React from 'react';

export const ExpenseDashboard: React.FC = () => {
    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <h2 className="text-3xl font-heading text-warung-deep-brown mb-8">Operational Expenses</h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Category</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="p-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">UTILITIES</span></td>
                            <td className="p-4 text-sm">Listrik Token PLN</td>
                            <td className="p-4 text-sm text-gray-500">Oct 12, 2024</td>
                            <td className="p-4 text-right font-mono font-bold">Rp 500.000</td>
                        </tr>
                        <tr>
                            <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">WAGES</span></td>
                            <td className="p-4 text-sm">Gaji Karyawan (Part-time)</td>
                            <td className="p-4 text-sm text-gray-500">Oct 01, 2024</td>
                            <td className="p-4 text-right font-mono font-bold">Rp 1.200.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
