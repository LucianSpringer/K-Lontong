import React, { useState, useRef, useEffect } from 'react';
import { WarungGPTEngine } from '../../core/ai/WarungGPTEngine';

interface Message {
    id: string;
    text: string;
    sender: 'USER' | 'AI';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any[];
}

export const WarungGPTConsole: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Halo Juragan! Saya WarungGPT. Ada yang bisa saya bantu analisis hari ini?", sender: 'AI' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: crypto.randomUUID(), text: input, sender: 'USER' as const };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Mock Context
        const context = { inventory: [], transactions: [] }; // Pass real state here in integration

        const response = await WarungGPTEngine.query(userMsg.text, context);

        setIsThinking(false);
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            text: response.text,
            sender: 'AI',
            data: response.data
        }]);
    };

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages, isThinking]);

    return (
        <div className="bg-gray-900 p-6 rounded-3xl h-[600px] flex flex-col border border-gray-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <i className="fas fa-brain text-white"></i>
                </div>
                <div>
                    <h3 className="text-white font-bold">WarungGPT <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded ml-2">PRO</span></h3>
                    <p className="text-gray-400 text-xs">Powered by Llama-3-Quantized</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender === 'USER'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                            }`}>
                            <p>{msg.text}</p>
                            {msg.data && (
                                <div className="mt-3 bg-black/50 rounded-lg p-2 overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="text-gray-500 text-left"><th className="pb-1">Item</th><th className="pb-1">Value</th></tr>
                                        </thead>
                                        <tbody>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {msg.data.map((row: any, i: number) => (
                                                <tr key={i} className="border-t border-gray-700">
                                                    <td className="py-1">{row.name || Object.values(row)[0]}</td>
                                                    <td className="py-1 font-mono text-green-400">{row.margin || Object.values(row)[1]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Tanya strategi warung..."
                    className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                    onClick={handleSend}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};
