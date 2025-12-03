import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'BOT' | 'USER';
    options?: { label: string; nextId: string }[];
}

const SCRIPT: Record<string, Message> = {
    'INIT': {
        id: 'INIT',
        text: "Halo Juragan! 👋 Bingung pilih paket yang mana? Saya bantu cek ya.",
        sender: 'BOT',
        options: [
            { label: "Boleh, bantu dong", nextId: "Q1" },
            { label: "Saya lihat sendiri saja", nextId: "END_SOLO" }
        ]
    },
    'Q1': {
        id: 'Q1',
        text: "Oke! Berapa rata-rata omzet harian warung saat ini?",
        sender: 'BOT',
        options: [
            { label: "< 1 Juta", nextId: "RES_STARTER" },
            { label: "1 - 5 Juta", nextId: "Q2" },
            { label: "> 5 Juta", nextId: "RES_ENTERPRISE" }
        ]
    },
    'Q2': {
        id: 'Q2',
        text: "Sudah punya karyawan atau jaga sendiri?",
        sender: 'BOT',
        options: [
            { label: "Jaga Sendiri", nextId: "RES_PRO_SOLO" },
            { label: "Ada Karyawan", nextId: "RES_PRO_TEAM" }
        ]
    },
    'RES_STARTER': { id: 'RES_STARTER', text: "💡 Rekomendasi: Paket STARTER (Gratis). Cocok untuk mulai digitalisasi tanpa biaya.", sender: 'BOT' },
    'RES_PRO_SOLO': { id: 'RES_PRO_SOLO', text: "💡 Rekomendasi: Paket PRO. Fitur stok otomatis akan sangat membantu Anda menghemat waktu.", sender: 'BOT' },
    'RES_PRO_TEAM': { id: 'RES_PRO_TEAM', text: "💡 Rekomendasi: Paket PRO. Anda butuh fitur 'Multi-User' untuk memantau kinerja karyawan.", sender: 'BOT' },
    'RES_ENTERPRISE': { id: 'RES_ENTERPRISE', text: "🚀 Rekomendasi: Paket ENTERPRISE. Anda butuh analitik mendalam dan API access untuk skala besar.", sender: 'BOT' },
    'END_SOLO': { id: 'END_SOLO', text: "Siap! Silakan jelajahi fitur kami di bawah.", sender: 'BOT' }
};

export const AIChatAdvisor: React.FC = () => {
    const [history, setHistory] = useState<Message[]>([SCRIPT['INIT']]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isTyping]);

    const handleOptionClick = (label: string, nextId: string) => {
        // 1. Add User Response
        setHistory(prev => [...prev, { id: crypto.randomUUID(), text: label, sender: 'USER' }]);
        setIsTyping(true);

        // 2. Simulate Bot Delay
        setTimeout(() => {
            setIsTyping(false);
            setHistory(prev => [...prev, SCRIPT[nextId]]);
        }, 1000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-warung-teal p-4 text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot"></i>
                </div>
                <div>
                    <h4 className="font-bold">Asisten K'Lontong</h4>
                    <p className="text-xs opacity-80 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
                {history.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'USER'
                                ? 'bg-warung-teal text-white rounded-tr-none'
                                : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                {history[history.length - 1].sender === 'BOT' && history[history.length - 1].options && (
                    <div className="flex flex-wrap gap-2">
                        {history[history.length - 1].options!.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(opt.label, opt.nextId)}
                                className="px-4 py-2 bg-white border border-warung-teal text-warung-teal rounded-full text-sm font-bold hover:bg-teal-50 transition"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
