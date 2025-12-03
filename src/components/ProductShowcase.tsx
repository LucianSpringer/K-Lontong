import React from 'react';

const features = [
    {
        icon: 'fa-boxes-stacked',
        title: 'Smart Inventory',
        description: 'Pantau stok real-time dengan notifikasi otomatis saat produk menipis. Tidak ada lagi kehabisan barang laris.'
    },
    {
        icon: 'fa-chart-line',
        title: 'Analisa Penjualan',
        description: 'Dashboard visual untuk melihat tren penjualan, produk terlaris, dan jam sibuk. Data-driven decision making.'
    },
    {
        icon: 'fa-credit-card',
        title: 'Multi-Payment',
        description: 'Terima pembayaran cash, QRIS, e-wallet, dan transfer bank. Semua tercatat otomatis dan akurat.'
    },
    {
        icon: 'fa-gift',
        title: 'Loyalty Program',
        description: 'Sistem poin pelanggan untuk meningkatkan repeat purchase. Warung jadi lebih ramai dan konsumen setia.'
    },
    {
        icon: 'fa-mobile-screen',
        title: 'Kasir Mobile',
        description: 'Kelola transaksi dari smartphone. Praktis, cepat, dan bisa diakses dari mana saja, kapan saja.'
    },
    {
        icon: 'fa-bell',
        title: 'Notifikasi Pintar',
        description: 'Dapatkan alert untuk stok menipis, target tercapai, atau produk expired. Warung selalu terkendali.'
    }
];

export const ProductShowcase: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
                >
                    <div className="w-16 h-16 bg-gradient-warung rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform shadow-md">
                        <i className={`fas ${feature.icon}`}></i>
                    </div>

                    <h3 className="text-xl font-heading text-warung-deep-brown mb-3">
                        {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                    </p>

                    <div className="mt-6 flex items-center text-warung-teal font-semibold text-sm group-hover:translate-x-2 transition-transform">
                        Pelajari Lebih Lanjut
                        <i className="fas fa-arrow-right ml-2"></i>
                    </div>
                </div>
            ))}
        </div>
    );
};
