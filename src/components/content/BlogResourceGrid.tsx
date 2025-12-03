import React from 'react';

const RESOURCES = [
    {
        category: 'Tips Sukses',
        title: '5 Cara Menata Warung Agar Terlihat Luas dan Bersih',
        date: '12 Okt 2024',
        readTime: '4 min baca',
        image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400'
    },
    {
        category: 'Manajemen Stok',
        title: 'Mengenal Metode FIFO: Solusi Agar Barang Tidak Expired',
        date: '10 Okt 2024',
        readTime: '6 min baca',
        image: 'https://images.unsplash.com/photo-1580913428706-c311ab527ebc?w=400'
    },
    {
        category: 'Keuangan',
        title: 'Pisahkan Uang Pribadi dan Warung: Panduan Dasar',
        date: '08 Okt 2024',
        readTime: '5 min baca',
        image: 'https://images.unsplash.com/photo-1554224155-98406852d009?w=400'
    }
];

export const BlogResourceGrid: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50" id="blog">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <span className="text-warung-orange font-bold uppercase tracking-widest text-sm">
                            <i className="fas fa-graduation-cap mr-2"></i>
                            Pusat Edukasi
                        </span>
                        <h2 className="text-4xl font-heading text-warung-deep-brown mt-4">
                            Tips Sukses Juragan Warung
                        </h2>
                    </div>
                    <button className="text-warung-teal font-bold hover:text-teal-700 transition-colors">
                        Lihat Semua Artikel <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {RESOURCES.map((post, idx) => (
                        <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-warung-deep-brown shadow-sm">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                    <span><i className="far fa-calendar mr-1"></i> {post.date}</span>
                                    <span><i className="far fa-clock mr-1"></i> {post.readTime}</span>
                                </div>
                                <h3 className="font-heading text-xl text-gray-800 group-hover:text-warung-orange transition-colors mb-3">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    Pelajari strategi terbaik untuk meningkatkan efisiensi dan keuntungan warung Anda dengan langkah sederhana.
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-warung-teal text-sm font-bold">
                                    Baca Selengkapnya
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Micro-Interaction */}
                <div className="mt-16 bg-warung-deep-brown rounded-3xl p-8 md:p-12 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-heading text-white mb-4">Dapatkan Tips Harian via WhatsApp</h3>
                        <p className="text-white/70 mb-8">Gabung dengan komunitas juragan warung dan dapatkan update harga sembako & tips bisnis langsung di HP Anda.</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                placeholder="Nomor WhatsApp (08...)"
                                className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-warung-orange"
                            />
                            <button className="bg-warung-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
                                Gabung Gratis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
