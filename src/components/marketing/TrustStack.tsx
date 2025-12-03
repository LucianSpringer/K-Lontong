import React from 'react';

const PARTNERS = [
    { name: "QRIS", icon: "fa-qrcode" },
    { name: "GoSend", icon: "fa-motorcycle" },
    { name: "JNE", icon: "fa-truck" },
    { name: "BCA", icon: "fa-university" },
    { name: "BRI", icon: "fa-building-columns" },
    { name: "AWS", icon: "fa-cloud" }
];

export const TrustStack: React.FC = () => {
    return (
        <div className="py-10 border-y border-gray-100 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Dipercaya Oleh Ekosistem Digital Indonesia</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {PARTNERS.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-2xl font-bold text-gray-600 hover:text-warung-deep-brown cursor-default">
                            <i className={`fas ${p.icon}`}></i>
                            <span className="hidden md:inline">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
