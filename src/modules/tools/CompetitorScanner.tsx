import React, { useState, useRef } from 'react';

export const CompetitorScanner: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<any | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setScanning(true);
            }
        } catch (e) {
            alert("Kamera tidak ditemukan (Simulasi Mode)");
            setScanning(true); // Fallback for desktop without cam
        }
    };

    const captureAndAnalyze = () => {
        setScanning(false);
        // Simulate Processing Delay
        setTimeout(() => {
            setResult({
                store: "Indomaret Raya",
                items: [
                    { name: "Minyak Tropical 2L", price: 34000, gap: "+2000" },
                    { name: "Indomie Goreng", price: 3100, gap: "-400" },
                    { name: "Teh Pucuk Harum", price: 4000, gap: "0" }
                ],
                insight: "Harga minyak goreng Anda terlalu murah. Naikkan Rp 1.500 untuk margin lebih sehat."
            });
        }, 1500);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="mb-8">
                <h2 className="text-3xl font-heading text-warung-deep-brown">Competitor Intelligence</h2>
                <p className="text-gray-500">Scan struk kompetitor untuk rekomendasi harga otomatis.</p>
            </header>

            <div className="flex gap-8">
                <div className="w-1/2">
                    <div className="bg-black rounded-3xl overflow-hidden aspect-[3/4] relative shadow-2xl border-4 border-gray-800">
                        {scanning ? (
                            <>
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 border-2 border-warung-teal rounded-lg animate-pulse"></div>
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                                    <button onClick={captureAndAnalyze} className="w-16 h-16 bg-white rounded-full border-4 border-gray-300"></button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white">
                                <i className="fas fa-camera text-6xl mb-4 text-gray-600"></i>
                                <button onClick={startCamera} className="bg-warung-teal px-6 py-3 rounded-xl font-bold">
                                    Mulai Scan
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-1/2 space-y-6">
                    {result ? (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-slide-in">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                                <h3 className="font-bold text-xl">{result.store}</h3>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Terverifikasi</span>
                            </div>

                            <table className="w-full text-sm mb-6">
                                <thead>
                                    <tr className="text-left text-gray-500">
                                        <th className="pb-2">Barang</th>
                                        <th className="pb-2 text-right">Harga Mereka</th>
                                        <th className="pb-2 text-right">Selisih</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono">
                                    {result.items.map((item: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-50">
                                            <td className="py-3 font-bold text-gray-700">{item.name}</td>
                                            <td className="py-3 text-right">Rp {item.price.toLocaleString()}</td>
                                            <td className={`py-3 text-right font-bold ${item.gap.startsWith('+') ? 'text-green-500' : item.gap === '0' ? 'text-gray-400' : 'text-red-500'}`}>
                                                {item.gap}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm flex gap-3">
                                <i className="fas fa-lightbulb mt-1"></i>
                                {result.insight}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center h-full flex flex-col justify-center text-gray-400">
                            <p>Hasil analisa akan muncul di sini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
