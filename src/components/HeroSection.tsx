import React from 'react';

interface HeroSectionProps {
    onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
    return (
        <section className="relative bg-gradient-to-br from-warung-cream via-warung-cream to-orange-50 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-warung-orange/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-warung-yellow/10 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 animate-slide-in">
                        <div className="inline-block">
                            <span className="bg-warung-teal/10 text-warung-teal px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                                <i className="fas fa-rocket mr-2"></i>
                                Sistem Warung Masa Depan
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading text-warung-deep-brown leading-tight">
                            Kelola Warung,
                            <br />
                            <span className="text-gradient">Raih Untung Maksimal</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            Stop tebak-tebakan! Gunakan sistem modern untuk hitung omzet, kelola stok, dan tingkatkan keuntungan warung Anda hingga <span className="font-bold text-warung-orange">2x lipat</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onCtaClick}
                                className="bg-warung-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-warung hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-download"></i>
                                Download E-Book Gratis
                            </button>

                            <a
                                href="#calculator"
                                className="border-2 border-warung-teal text-warung-teal hover:bg-warung-teal hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 text-center"
                            >
                                Hitung Omzet Sekarang
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-warung-orange border-2 border-white"></div>
                                    <div className="w-10 h-10 rounded-full bg-warung-teal border-2 border-white"></div>
                                    <div className="w-10 h-10 rounded-full bg-warung-yellow border-2 border-white"></div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    <span className="font-bold text-warung-deep-brown">1,204+</span> warung sukses
                                </p>
                            </div>

                            <div className="flex items-center gap-1 text-warung-yellow">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <span className="ml-2 text-sm text-gray-600 font-semibold">4.9/5</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative">
                        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                            {/* Mini Dashboard Preview */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Omzet Hari Ini</p>
                                        <p className="text-3xl font-bold text-warung-deep-brown">Rp 1.2jt</p>
                                    </div>
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-arrow-trend-up text-2xl text-green-600"></i>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-warung-cream p-4 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Produk Terlaris</p>
                                        <p className="font-bold text-warung-brown">Indomie Goreng</p>
                                        <p className="text-sm text-warung-teal mt-1">↑ 24 terjual</p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Stok Menipis</p>
                                        <p className="font-bold text-warung-orange">Minyak Goreng</p>
                                        <p className="text-sm text-red-500 mt-1">⚠ 3 liter</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-warung p-4 rounded-xl text-white">
                                    <p className="text-sm opacity-90">Proyeksi Bulan Ini</p>
                                    <p className="text-2xl font-bold mt-1">Rp 15.5jt</p>
                                    <p className="text-xs opacity-75 mt-2">
                                        <i className="fas fa-chart-line mr-1"></i>
                                        Target tercapai 76%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-4 -right-4 bg-warung-yellow text-warung-deep-brown px-6 py-3 rounded-full shadow-lg font-bold text-sm animate-pulse-glow z-20">
                            <i className="fas fa-fire mr-2"></i>
                            Trending!
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
