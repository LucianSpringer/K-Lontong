import React, { useState, useEffect } from 'react';
import { SKU } from '../../core/types/InventoryTypes';
import { GLOBAL_CATALOG } from '../../data/GlobalProductCatalog';
import { RegionalVoiceKernel } from '../../core/ai/RegionalVoiceKernel';

interface CartItem {
    sku: SKU;
    name: string;
    price: number;
    qty: number;
}

export const PointOfSale: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isListening, setIsListening] = useState(false);

    const addToCart = (sku: SKU) => {
        const product = GLOBAL_CATALOG.find(p => p.sku === sku);
        if (!product) return;

        setCart(prev => {
            const existing = prev.find(item => item.sku === sku);
            if (existing) {
                return prev.map(item => item.sku === sku ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { sku: product.sku, name: product.name, price: product.price, qty: 1 }];
        });
    };

    const handleVoiceCommand = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Browser tidak support voice recognition");
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.start();
        setIsListening(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);

            // [LUMEN CONNECTION] Use Polyglot Engine
            const result = RegionalVoiceKernel.parsePolyglot(transcript);

            if (result.intent === 'ADD_TO_CART' && result.productKeyword) {
                const product = GLOBAL_CATALOG.find(p => p.name.toLowerCase().includes(result.productKeyword!.toLowerCase()));
                if (product) {
                    addToCart(product.sku);
                    alert(`🎤 (${result.rawText}) -> Detected: ${product.name}`);
                } else {
                    alert(`🎤 (${result.rawText}) -> Produk tidak ditemukan: ${result.productKeyword}`);
                }
            } else {
                alert(`🎤 (${result.rawText}) -> Intent: ${result.intent}`);
            }
        };

        recognition.onerror = () => setIsListening(false);
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-gray-100 animate-slide-in">
            {/* Catalog Section */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-heading text-warung-deep-brown">Katalog Produk</h2>
                    <button
                        onClick={handleVoiceCommand}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}
                    >
                        <i className="fas fa-microphone"></i> {isListening ? 'Mendengarkan...' : 'Voice Command'}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {GLOBAL_CATALOG.slice(0, 20).map(product => (
                        <button
                            key={product.sku}
                            onClick={() => addToCart(product.sku)}
                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-left flex flex-col h-full"
                        >
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 line-clamp-2">{product.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                            </div>
                            <p className="font-mono font-bold text-warung-orange mt-2">Rp {product.price.toLocaleString()}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col shadow-2xl">
                <div className="p-6 bg-warung-deep-brown text-white">
                    <h3 className="text-xl font-heading">Keranjang Belanja</h3>
                    <p className="text-sm opacity-80">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">
                            <i className="fas fa-shopping-basket text-4xl mb-2"></i>
                            <p>Keranjang kosong</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.sku} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <p className="font-bold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.qty} x Rp {item.price.toLocaleString()}</p>
                                </div>
                                <p className="font-mono font-bold">Rp {(item.price * item.qty).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4 text-xl font-bold">
                        <span>Total</span>
                        <span>Rp {total.toLocaleString()}</span>
                    </div>
                    <button className="w-full py-4 bg-warung-orange text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg">
                        Bayar Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};
