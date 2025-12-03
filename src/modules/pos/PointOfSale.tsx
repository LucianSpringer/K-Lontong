import React, { useState, useEffect } from 'react';
import { OfflinePersistence, OfflineTransaction } from '../../core/offline/OfflinePersistence';

// Mock Product DB (In production, connect to InventoryStore)
const PRODUCTS = [
    { sku: 'SKU-001', name: 'Indomie Goreng', price: 3500 },
    { sku: 'SKU-002', name: 'Telur Ayam (kg)', price: 28000 },
    { sku: 'SKU-003', name: 'Minyak Goreng 1L', price: 14500 },
    { sku: 'SKU-004', name: 'Aqua Galon', price: 21000 },
    { sku: 'SKU-005', name: 'Rokok Surya 12', price: 23000 },
    { sku: 'SKU-006', name: 'Beras Premium 5kg', price: 68000 },
    { sku: 'SKU-007', name: 'Gula Pasir 1kg', price: 15000 },
    { sku: 'SKU-008', name: 'Kopi Kapal  Api', price: 12500 },
];

interface CartItem {
    sku: string;
    name: string;
    price: number;
    qty: number;
}

export const PointOfSale: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [dbStatus, setDbStatus] = useState<'INIT' | 'READY' | 'ERROR'>('INIT');
    const [persistence] = useState(new OfflinePersistence());

    // Initialize Offline DB on Mount
    useEffect(() => {
        persistence.init()
            .then(() => setDbStatus('READY'))
            .catch(() => setDbStatus('ERROR'));
    }, [persistence]);

    const addToCart = (product: typeof PRODUCTS[0]) => {
        setCart(prev => {
            const existing = prev.find(p => p.sku === product.sku);
            if (existing) {
                return prev.map(p => p.sku === product.sku ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (sku: string) => {
        setCart(prev => prev.filter(p => p.sku !== sku));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const tx: OfflineTransaction = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            items: JSON.stringify(cart),
            total,
            paymentMethod: 'CASH',
            synced: 0
        };

        try {
            await persistence.saveTransaction(tx);
            alert(`✅ Transaksi Disimpan (Offline Mode)\nTotal: Rp ${total.toLocaleString()}`);
            setCart([]);
        } catch (e) {
            alert('❌ Gagal menyimpan transaksi');
        }
    };

    const handleClear = () => {
        if (cart.length > 0 && confirm('Hapus semua item dari keranjang?')) {
            setCart([]);
        }
    };

    // Filter Products
    const filteredProducts = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Left: Product Grid */}
            <div className="w-2/3 flex flex-col p-6 gap-6">
                {/* Header & Search */}
                <div className="flex justify-between items-center bg-white p-4rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warung-orange rounded-lg flex items-center justify-center text-white font-bold shadow-md">POS</div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg">Kasir Pintar</h2>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${dbStatus === 'READY' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                {dbStatus === 'READY' ? 'Database Ready' : dbStatus === 'ERROR' ? 'Connection Error' : 'Connecting...'}
                            </p>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="🔍 Cari Barang (F1)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-64 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-warung-teal outline-none text-sm"
                    />
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-3 lg:grid-cols-4 gap-4 custom-scrollbar">
                    {filteredProducts.map(p => (
                        <button
                            key={p.sku}
                            onClick={() => addToCart(p)}
                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg hover:border-warung-orange border-2 border-transparent transition-all flex flex-col justify-between h-36 text-left group"
                        >
                            <span className="font-bold text-gray-700 group-hover:text-warung-orange line-clamp-2 text-sm leading-tight">{p.name}</span>
                            <div>
                                <span className="text-xs text-gray-400 block mb-1">{p.sku}</span>
                                <span className="font-mono font-bold text-warung-teal text-lg">
                                    Rp {p.price.toLocaleString()}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Cart Panel */}
            <div className="w-1/3 bg-white shadow-2xl z-10 flex flex-col">
                <div className="p-6 bg-warung-deep-brown text-white">
                    <h3 className="font-heading text-xl">Keranjang Belanja</h3>
                    <p className="text-white/60 text-sm">Transaksi #TRX-{Date.now().toString().slice(-4)}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <i className="fas fa-basket-shopping text-6xl mb-4"></i>
                            <p className="text-sm">Belum ada barang</p>
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors group">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-700 text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.qty} × Rp {item.price.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="font-mono font-bold text-gray-800 text-sm">
                                        Rp {(item.qty * item.price).toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.sku)}
                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Total & Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <span className="text-gray-500 uppercase font-bold text-xs tracking-wider">Total Tagihan</span>
                        <span className="text-4xl font-heading text-warung-deep-brown font-mono">
                            {total.toLocaleString()}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className="bg-yellow-100 text-yellow-700 py-3 rounded-xl font-bold hover:bg-yellow-200 transition text-sm disabled:opacity-50"
                            disabled={cart.length === 0}
                        >
                            <i className="fas fa-pause mr-2"></i> Hold
                        </button>
                        <button
                            onClick={handleClear}
                            className="bg-red-100 text-red-700 py-3 rounded-xl font-bold hover:bg-red-200 transition text-sm disabled:opacity-50"
                            disabled={cart.length === 0}
                        >
                            <i className="fas fa-trash mr-2"></i> Batal
                        </button>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || dbStatus !== 'READY'}
                        className="w-full mt-3 bg-warung-teal text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-cash-register mr-2"></i> Bayar Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};
