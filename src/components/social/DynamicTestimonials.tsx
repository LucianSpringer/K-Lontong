import React, { useState, useEffect } from 'react';

const FEED = [
    { name: "Pak Budi", text: "Omzet naik 2x lipat sejak pakai K'Lontong!", role: "Juragan Sembako", city: "Surabaya" },
    { name: "Ibu Sri", text: "Fitur kasbon-nya juara. Nggak pusing nagih utang.", role: "Toko Kelontong", city: "Medan" },
    { name: "Mas Doni", text: "Stok opname jadi gampang banget. Tinggal scan.", role: "Minimarket", city: "Jakarta" },
    { name: "Teh Rini", text: "Supplier langsung kirim, harga lebih murah.", role: "Warung Makan", city: "Bandung" }
];

export const DynamicTestimonials: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % FEED.length);
        }, 5000); // Rotate every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-warung-orange relative overflow-hidden h-48 flex flex-col justify-center">
            <div className="absolute top-4 right-4 text-6xl text-gray-100 font-serif">"</div>

            <div className="relative z-10 transition-opacity duration-500 animate-slide-in" key={index}>
                <p className="text-xl text-gray-700 italic font-medium mb-4">
                    "{FEED[index].text}"
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warung-teal rounded-full flex items-center justify-center text-white font-bold">
                        {FEED[index].name[0]}
                    </div>
                    <div>
                        <h5 className="font-bold text-warung-deep-brown">{FEED[index].name}</h5>
                        <p className="text-xs text-gray-500">{FEED[index].role}, {FEED[index].city}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-1">
                {FEED.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-warung-orange w-4' : 'bg-gray-300'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};
