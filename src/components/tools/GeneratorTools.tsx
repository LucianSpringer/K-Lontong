import React, { useState } from 'react';

// --- NAME GENERATOR ---
const PREFIXES = ['Warung', 'Toko', 'Kedai', 'Mart', 'Grosir'];
const ADJECTIVES = ['Berkah', 'Rejeki', 'Jaya', 'Makmur', 'Laris', 'Sejahtera', 'Hoki', 'Modern'];
const SUFFIXES = ['Abadi', 'Sentosa', 'Keluarga', '88', '99', 'Express', 'Idola'];

export const NameGenerator: React.FC = () => {
    const [ownerName, setOwnerName] = useState('');
    const [results, setResults] = useState<string[]>([]);

    const generate = () => {
        if (!ownerName) return;
        const res = [];
        for (let i = 0; i < 5; i++) {
            const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
            const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
            const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];

            // Variasi Pola
            const pattern = Math.random();
            if (pattern < 0.33) res.push(`${p} ${ownerName} ${a}`);
            else if (pattern < 0.66) res.push(`${p} ${a} ${s}`);
            else res.push(`${ownerName} ${s} ${p}`); // Unik: Budi Sentosa Mart
        }
        setResults(res);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h4 className="font-heading text-lg text-warung-deep-brown mb-4">
                <i className="fas fa-magic text-warung-orange mr-2"></i>
                Generator Nama Hoki
            </h4>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Nama Pemilik (cth: Budi)"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-warung-orange outline-none"
                />
                <button
                    onClick={generate}
                    className="bg-warung-deep-brown text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition-colors"
                >
                    Buat
                </button>
            </div>
            <div className="space-y-2">
                {results.map((name, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 font-bold text-gray-700 text-center animate-slide-in">
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- LOCATION INTELLIGENCE SIMULATOR ---
export const LocationIntelligence: React.FC = () => {
    const [competitors, setCompetitors] = useState<number>(0);
    const [traffic, setTraffic] = useState<'LOW' | 'MED' | 'HIGH'>('MED');
    const [score, setScore] = useState<number | null>(null);

    const analyze = () => {
        // Logic: Traffic tinggi bagus, tapi kompetitor banyak mengurangi nilai
        let baseScore = traffic === 'HIGH' ? 90 : traffic === 'MED' ? 60 : 30;
        baseScore -= (competitors * 10); // Tiap kompetitor kurangi 10 poin
        if (baseScore < 0) baseScore = 10;
        setScore(baseScore);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h4 className="font-heading text-lg text-warung-deep-brown mb-4">
                <i className="fas fa-map-location-dot text-warung-teal mr-2"></i>
                Cek Potensi Lokasi
            </h4>
            <div className="space-y-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-gray-500">Jumlah Kompetitor (Radius 500m)</label>
                    <input
                        type="number"
                        value={competitors}
                        onChange={e => setCompetitors(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg mt-1"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500">Kepadatan Lalu Lintas</label>
                    <select
                        value={traffic}
                        onChange={e => setTraffic(e.target.value as any)}
                        className="w-full p-2 border rounded-lg mt-1"
                    >
                        <option value="LOW">Sepi (Gang Buntu/Perumahan Kecil)</option>
                        <option value="MED">Sedang (Jalan Desa/Kampung)</option>
                        <option value="HIGH">Ramai (Jalan Raya/Dekat Pasar)</option>
                    </select>
                </div>
            </div>

            {score !== null ? (
                <div className="text-center animate-slide-in">
                    <div className={`text-4xl font-black mb-1 ${score > 70 ? 'text-green-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {score}/100
                    </div>
                    <p className="text-sm font-bold text-gray-600">
                        {score > 70 ? 'LOKASI EMAS! 🔥' : score > 40 ? 'POTENSIAL (Hati-hati)' : 'KURANG STRATEGIS ⚠️'}
                    </p>
                    <button onClick={() => setScore(null)} className="text-xs text-gray-400 underline mt-2">Cek Ulang</button>
                </div>
            ) : (
                <button
                    onClick={analyze}
                    className="w-full bg-warung-teal text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors"
                >
                    Analisa Sekarang
                </button>
            )}
        </div>
    );
};
