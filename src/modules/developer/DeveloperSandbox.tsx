import React, { useState } from 'react';
import { PluginKernel } from '../../core/systems/PluginKernel';
import { LogIntelligence } from '../../core/engines/LogIntelligence';
import { AuditLogger } from '../../core/security/AuditLogger';

export const DeveloperSandbox: React.FC = () => {
    const [plugins] = useState(PluginKernel.getRegistry());
    const [logs] = useState(AuditLogger.getLogs());
    const insights = LogIntelligence.analyzeLogs(logs);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in space-y-8">
            <header>
                <h2 className="text-3xl font-heading text-warung-deep-brown">Dev Sandbox</h2>
                <p className="text-gray-500">Plugin Management & AI Log Analysis.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plugin Registry */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Plugin Registry</h3>
                    <div className="space-y-3">
                        {plugins.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{p.name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{p.id} v{p.version}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">ACTIVE</span>
                            </div>
                        ))}
                        <button
                            onClick={() => { PluginKernel.loadAll(); alert('Plugins Reloaded'); }}
                            className="w-full py-2 mt-4 bg-gray-900 text-white rounded-lg text-xs font-bold"
                        >
                            Reload Plugins
                        </button>
                    </div>
                </div>

                {/* AI Log Analyst */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <i className="fas fa-brain text-purple-500"></i> AI Log Insights
                    </h3>
                    <div className="space-y-3">
                        {insights.map((ins, i) => (
                            <div key={i} className={`p-3 rounded-lg border-l-4 ${ins.severity === 'CRITICAL' ? 'border-red-500 bg-red-50' :
                                    ins.severity === 'WARNING' ? 'border-yellow-500 bg-yellow-50' :
                                        'border-blue-500 bg-blue-50'
                                }`}>
                                <div className="flex justify-between">
                                    <span className="font-bold text-sm">{ins.summary}</span>
                                    <span className="text-xs opacity-70">{ins.severity}</span>
                                </div>
                                <p className="text-xs mt-1 italic">"{ins.recommendation}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
