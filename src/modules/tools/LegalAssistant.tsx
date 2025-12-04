import React, { useState } from 'react';
import { LegalDocEngine, DocType } from '../../core/engines/LegalDocEngine';

export const LegalAssistant: React.FC = () => {
    const [docType, setDocType] = useState<DocType>('SEWA_RUKO');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [generatedDoc, setGeneratedDoc] = useState('');

    const template = LegalDocEngine.getTemplate(docType);

    const handleGenerate = () => {
        setGeneratedDoc(LegalDocEngine.generate(docType, formData));
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <h2 className="text-3xl font-heading text-warung-deep-brown mb-6">AI Legal Assistant</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg h-fit">
                    <label className="block text-sm font-bold text-gray-500 mb-2">Pilih Jenis Dokumen</label>
                    <select
                        value={docType}
                        onChange={e => setDocType(e.target.value as DocType)}
                        className="w-full p-3 border rounded-xl mb-6"
                    >
                        <option value="SEWA_RUKO">Perjanjian Sewa Ruko</option>
                        <option value="KERJA_KARYAWAN">Kontrak Karyawan</option>
                        <option value="TAGIH_UTANG">Surat Tagih Utang</option>
                    </select>

                    <div className="space-y-4">
                        {template.fields.map(field => (
                            <div key={field}>
                                <label className="block text-xs font-bold text-gray-400 mb-1">{field.replace('_', ' ')}</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleGenerate} className="w-full mt-6 bg-warung-deep-brown text-white py-3 rounded-xl font-bold">Generate Dokumen</button>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-inner border border-gray-200 font-mono text-sm whitespace-pre-wrap h-[500px] overflow-y-auto">
                    {generatedDoc || "Preview dokumen akan muncul di sini..."}
                </div>
            </div>
        </div>
    );
};
