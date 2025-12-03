import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { ProductShowcase } from './components/ProductShowcase';
import { OmzetCalculator } from './components/tools/OmzetCalculator';
import { LeadMagnetModal } from './components/marketing/LeadMagnetModal';
import { TestimonialGrid } from './components/social/TestimonialGrid';
import { WarungFooter } from './components/layout/WarungFooter';
import { ScarcityTimer } from './components/marketing/ScarcityTimer';
import { InventoryDashboard } from './modules/admin/InventoryDashboard';
import { AnalyticsDashboard } from './modules/admin/AnalyticsDashboard';

// [LUMEN NOTE] High-Entropy State Management
// We lift the state here to allow for future global context expansion
export const App: React.FC = () => {
    const [isLeadMagnetOpen, setLeadMagnetOpen] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'LANDING' | 'INVENTORY' | 'ANALYTICS'>('LANDING');

    // Trigger Lead Magnet on Timer (15s delay)
    useEffect(() => {
        const timer = setTimeout(() => setLeadMagnetOpen(true), 15000);
        return () => clearTimeout(timer);
    }, []);

    const renderContent = () => {
        switch (viewMode) {
            case 'INVENTORY':
                return <InventoryDashboard />;
            case 'ANALYTICS':
                return <AnalyticsDashboard />;
            default:
                return (
                    <>
                        {/* Sticky Navigation */}
                        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-warung-orange/10">
                            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-warung-orange rounded-lg flex items-center justify-center text-white font-heading text-xl shadow-lg">
                                        K'
                                    </div>
                                    <span className="font-heading text-2xl text-warung-brown">
                                        K'<span className="text-warung-teal">Lontong</span>
                                    </span>
                                </div>

                                {/* Desktop Nav Links */}
                                <div className="hidden md:flex items-center gap-8">
                                    <a href="#features" className="text-gray-700 hover:text-warung-orange transition-colors font-medium">
                                        Fitur
                                    </a>
                                    <a href="#calculator" className="text-gray-700 hover:text-warung-orange transition-colors font-medium">
                                        Kalkulator
                                    </a>
                                    <a href="#testimonials" className="text-gray-700 hover:text-warung-orange transition-colors font-medium">
                                        Testimoni
                                    </a>
                                </div>

                                <button
                                    onClick={() => setLeadMagnetOpen(true)}
                                    className="bg-warung-teal hover:bg-teal-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md transform hover:scale-105 text-sm md:text-base"
                                >
                                    <i className="fas fa-download mr-2"></i>
                                    <span className="hidden md:inline">Download E-Book Gratis</span>
                                    <span className="md:hidden">E-Book</span>
                                </button>
                            </div>
                        </nav>

                        <main className="space-y-24 pb-20">
                            {/* Hero Section */}
                            <HeroSection onCtaClick={() => setLeadMagnetOpen(true)} />

                            {/* Features Section */}
                            <section id="features" className="max-w-7xl mx-auto px-4">
                                <div className="text-center mb-12">
                                    <span className="text-warung-teal font-bold uppercase tracking-widest text-sm">
                                        <i className="fas fa-rocket mr-2"></i>
                                        Fitur Unggulan
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-heading text-warung-deep-brown mt-4">
                                        Kenapa Harus K'Lontong?
                                    </h2>
                                    <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                                        Sistem modern, keuntungan maksimal. Kelola warung seperti toko retail profesional.
                                    </p>
                                </div>
                                <ProductShowcase />
                            </section>

                            {/* Calculator Section */}
                            <section id="calculator" className="bg-white py-20 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-warung-orange to-warung-yellow"></div>
                                <OmzetCalculator />
                            </section>

                            {/* Testimonials */}
                            <section id="testimonials">
                                <TestimonialGrid />
                            </section>

                            {/* Final CTA Section */}
                            <section className="max-w-4xl mx-auto px-4">
                                <div className="bg-gradient-warung rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>

                                    <div className="relative z-10">
                                        <h2 className="text-4xl md:text-5xl font-heading mb-6">
                                            Siap Tingkatkan Omzet Warung Anda?
                                        </h2>
                                        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                                            Bergabunglah dengan 1,204+ pemilik warung yang telah merasakan peningkatan omzet hingga 2x lipat.
                                        </p>
                                        <button
                                            onClick={() => setLeadMagnetOpen(true)}
                                            className="bg-white text-warung-orange px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                                        >
                                            <i className="fas fa-download mr-2"></i>
                                            Mulai Sekarang - GRATIS!
                                        </button>
                                        <p className="text-sm opacity-75 mt-4">
                                            <i className="fas fa-shield-halved mr-1"></i>
                                            Tidak perlu kartu kredit. 100% gratis.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <WarungFooter />

                        {/* Modal Overlay */}
                        {isLeadMagnetOpen && (
                            <LeadMagnetModal isOpen={isLeadMagnetOpen} onClose={() => setLeadMagnetOpen(false)} />
                        )}
                    </>
                );
        }
    };

    return (
        <div className="bg-warung-cream min-h-screen font-sans text-gray-800 scroll-smooth">
            {/* Global Marketing Header */}
            <div className="bg-warung-deep-brown text-warung-yellow text-center py-2 text-sm font-bold tracking-wider flex justify-between px-4 items-center">
                <div className="w-1/3 flex gap-2">
                    {viewMode !== 'LANDING' && (
                        <button
                            onClick={() => setViewMode('LANDING')}
                            className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                            <i className="fas fa-arrow-left"></i> Back to Site
                        </button>
                    )}
                </div>

                <ScarcityTimer deadline="2025-12-31" label="Workshop Gratis Ditutup Dalam: " />

                <div className="w-1/3 text-right flex justify-end gap-2">
                    <button
                        onClick={() => setViewMode('INVENTORY')}
                        className={`text-xs px-2 py-1 rounded transition-colors ${viewMode === 'INVENTORY' ? 'bg-warung-orange text-white' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setViewMode('ANALYTICS')}
                        className={`text-xs px-2 py-1 rounded transition-colors ${viewMode === 'ANALYTICS' ? 'bg-warung-orange text-white' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        Forensics
                    </button>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};
