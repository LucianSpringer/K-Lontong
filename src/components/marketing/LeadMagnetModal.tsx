import React, { useState } from 'react';
import { LeadMagnetSequencer, LeadMagnetFormData } from '../../core/engines/LeadMagnetSequencer';
import { useWarungStore } from '../../store/StoreContext';

interface LeadMagnetProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LeadMagnetModal: React.FC<LeadMagnetProps> = ({ isOpen, onClose }) => {
    const { recordLeadSubmission } = useWarungStore();
    const [formData, setFormData] = useState<LeadMagnetFormData>({
        name: '',
        phone: '',
        email: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const validation = LeadMagnetSequencer.validateForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Check if already submitted
        if (LeadMagnetSequencer.hasSubmitted(formData.phone)) {
            setErrors({ phone: 'Nomor ini sudah terdaftar!' });
            return;
        }

        setStatus('loading');

        // Simulate API Call
        setTimeout(() => {
            // Record submission
            LeadMagnetSequencer.recordSubmission(formData.phone);
            recordLeadSubmission(formData.email || '', formData.phone);

            setStatus('success');

            // Auto close after 3 seconds
            setTimeout(() => {
                onClose();
                // Reset form
                setFormData({ name: '', phone: '', email: '' });
                setStatus('idle');
            }, 3000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col md:flex-row animate-slide-in">
                {/* Visual Side */}
                <div className="bg-warung-orange w-full md:w-2/5 p-8 flex flex-col justify-center text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400')] opacity-20 bg-cover"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                            <i className="fas fa-book"></i>
                        </div>
                        <h3 className="text-2xl font-heading mb-4">Gratis E-Book!</h3>
                        <p className="text-sm opacity-90 mb-6 leading-relaxed">
                            "101 Barang Wajib yang Paling Laris di Warung Kelontong 2025"
                        </p>
                        <div className="flex items-center gap-2 text-xs bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <i className="fas fa-fire text-warung-yellow"></i>
                            <span>1,204 orang telah mengunduh hari ini</span>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:w-3/5">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>

                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                <i className="fas fa-check"></i>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">Terima Kasih!</h4>
                            <p className="text-gray-500 mt-2">Link download telah dikirim ke WhatsApp Anda.</p>
                            <p className="text-sm text-warung-teal mt-4 font-semibold">
                                <i className="fas fa-clock mr-1"></i>
                                Penutupan otomatis...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold text-warung-deep-brown">Mau Omzet Naik 2x Lipat?</h3>
                            <p className="text-gray-500 text-sm mb-4">Pelajari rahasianya sekarang. Masukkan data Anda untuk akses instan.</p>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-warung-orange focus:border-transparent outline-none transition-all`}
                                    placeholder="Budi Santoso"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nomor WhatsApp</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-warung-orange focus:border-transparent outline-none transition-all`}
                                    placeholder="081234567890"
                                    required
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Opsional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-warung-orange focus:border-transparent outline-none transition-all`}
                                    placeholder="budi@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-warung-teal text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-teal-700 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        Kirim E-Book Sekarang
                                        <i className="fas fa-arrow-right"></i>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                <i className="fas fa-lock mr-1"></i> Data Anda 100% aman dan tidak akan disebarkan.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
