import React from 'react';

const testimonials = [
    {
        name: 'Bu Siti',
        location: 'Jakarta Timur',
        rating: 5,
        text: 'Sejak pakai K\'Lontong, omzet warung saya naik 70%! Stok terkontrol, nggak pernah kehabisan barang laris lagi.',
        image: 'https://i.pravatar.cc/150?img=1'
    },
    {
        name: 'Pak Joko',
        location: 'Bandung',
        rating: 5,
        text: 'Sistem kasir digitalnya praktis banget. Pembayaran QRIS juga udah support. Pelanggan makin banyak!',
        image: 'https://i.pravatar.cc/150?img=12'
    },
    {
        name: 'Bu Ani',
        location: 'Surabaya',
        rating: 5,
        text: 'Loyalty program-nya keren! Pelanggan jadi sering balik. Warung saya sekarang lebih ramai dari kompetitor.',
        image: 'https://i.pravatar.cc/150?img=5'
    }
];

export const TestimonialGrid: React.FC = () => {
    return (
        <section className="bg-gradient-to-br from-warung-cream to-white py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-warung-teal font-bold uppercase tracking-widest text-sm">
                        <i className="fas fa-quote-left mr-2"></i>
                        Testimoni
                    </span>
                    <h2 className="text-4xl font-heading text-warung-deep-brown mt-4">
                        Kata Mereka yang Sudah <span className="text-warung-orange">Sukses</span>
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Ribuan pemilik warung telah merasakan transformasi bisnis mereka. Sekarang giliran Anda!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-warung-orange"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Rating Stars */}
                            <div className="flex items-center gap-1 mb-4 text-warung-yellow">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <i key={i} className="fas fa-star"></i>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 leading-relaxed mb-6 italic">
                                "{testimonial.text}"
                            </p>

                            {/* Customer Info */}
                            <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-warung-orange"
                                />
                                <div>
                                    <p className="font-bold text-warung-deep-brown">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">
                                        <i className="fas fa-location-dot mr-1"></i>
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-6 bg-white px-8 py-4 rounded-full shadow-lg">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-users text-2xl text-warung-teal"></i>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-warung-deep-brown">1,204+</p>
                                <p className="text-xs text-gray-500">Warung Aktif</p>
                            </div>
                        </div>

                        <div className="w-px h-12 bg-gray-200"></div>

                        <div className="flex items-center gap-2">
                            <i className="fas fa-star text-2xl text-warung-yellow"></i>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-warung-deep-brown">4.9/5</p>
                                <p className="text-xs text-gray-500">Rating Pengguna</p>
                            </div>
                        </div>

                        <div className="w-px h-12 bg-gray-200"></div>

                        <div className="flex items-center gap-2">
                            <i className="fas fa-chart-line text-2xl text-warung-orange"></i>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-warung-deep-brown">+70%</p>
                                <p className="text-xs text-gray-500">Rata-rata Omzet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
