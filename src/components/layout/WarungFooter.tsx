import React from 'react';

export const WarungFooter: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-warung-deep-brown text-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-12 h-12 bg-warung-orange rounded-lg flex items-center justify-center text-white font-heading text-2xl shadow-lg">
                                K'
                            </div>
                            <span className="font-heading text-2xl">
                                K'<span className="text-warung-teal">Lontong</span>
                            </span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Sistem manajemen warung modern untuk meningkatkan omzet dan efisiensi bisnis Anda.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-warung-yellow">Navigasi</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#features" className="text-white/70 hover:text-warung-teal transition-colors text-sm">
                                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                                    Fitur Unggulan
                                </a>
                            </li>
                            <li>
                                <a href="#calculator" className="text-white/70 hover:text-warung-teal transition-colors text-sm">
                                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                                    Kalkulator Omzet
                                </a>
                            </li>
                            <li>
                                <a href="#testimonials" className="text-white/70 hover:text-warung-teal transition-colors text-sm">
                                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                                    Testimoni
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-warung-yellow">Sumber Daya</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-white/70 hover:text-warung-teal transition-colors text-sm">
                                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                                    Blog & Tips
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/70 hover:text-warung-teal transition-colors text-sm">
                                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                                    Tutorial Video
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/70 hover:text-warung-teal transition-colors text-sm">
                                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-warung-yellow">Hubungi Kami</h4>
                        <div className="space-y-3">
                            <a href="mailto:info@klontong.id" className="flex items-center gap-2 text-white/70 hover:text-warung-teal transition-colors text-sm">
                                <i className="fas fa-envelope"></i>
                                info@klontong.id
                            </a>
                            <a href="https://wa.me/628123456789" className="flex items-center gap-2 text-white/70 hover:text-warung-teal transition-colors text-sm">
                                <i className="fab fa-whatsapp"></i>
                                +62 812-3456-789
                            </a>
                            <div className="flex gap-3 mt-4">
                                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-warung-teal rounded-full flex items-center justify-center transition-colors">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-warung-teal rounded-full flex items-center justify-center transition-colors">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-warung-teal rounded-full flex items-center justify-center transition-colors">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/60 text-sm">
                        © {currentYear} K'Lontong. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-white/60 hover:text-warung-teal text-sm transition-colors">
                            Kebijakan Privasi
                        </a>
                        <a href="#" className="text-white/60 hover:text-warung-teal text-sm transition-colors">
                            Syarat & Ketentuan
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
