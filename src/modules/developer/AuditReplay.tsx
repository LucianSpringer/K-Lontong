import React, { useState, useEffect } from 'react';
import { AuditLogger, AuditLog } from '../../core/security/AuditLogger';

export const AuditReplay: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [playbackIndex, setPlaybackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLog, setCurrentLog] = useState<AuditLog | null>(null);

    useEffect(() => {
        setLogs(AuditLogger.getLogs().reverse()); // Chronological order
    }, []);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setPlaybackIndex(prev => {
                    if (prev >= logs.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    setCurrentLog(logs[prev]);
                    return prev + 1;
                });
            }, 800); // Replay speed
        }
        return () => clearInterval(interval);
    }, [isPlaying, logs]);

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in">
            <header className="mb-8">
                <h2 className="text-3xl font-heading text-warung-deep-brown">Security Audit Replay</h2>
                <p className="text-gray-500">Visualize system events in chronological order.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Visualization Stage */}
                <div className="h-64 bg-gray-900 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                    {currentLog ? (
                        <div className="text-center animate-pulse">
                            <div className={`text-6xl mb-4 ${currentLog.severity === 'CRITICAL' ? 'text-red-500' :
                                    currentLog.severity === 'WARNING' ? 'text-yellow-500' : 'text-blue-500'
                                }`}>
                                <i className={`fas ${currentLog.severity === 'CRITICAL' ? 'fa-exclamation-triangle' :
                                        'fa-info-circle'
                                    }`}></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white">{currentLog.action}</h3>
                            <p className="text-gray-400 font-mono">{currentLog.resource}</p>
                            <span className="text-xs text-gray-600 mt-2 block">{currentLog.id}</span>
                        </div>
                    ) : (
                        <p className="text-gray-600">Press Play to Start Replay</p>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (playbackIndex >= logs.length - 1) setPlaybackIndex(0);
                            setIsPlaying(!isPlaying);
                        }}
                        className="w-12 h-12 rounded-full bg-warung-teal text-white flex items-center justify-center hover:bg-teal-700 transition"
                    >
                        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>

                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-warung-orange transition-all duration-300"
                            style={{ width: `${(playbackIndex / Math.max(1, logs.length - 1)) * 100}%` }}
                        ></div>
                    </div>

                    <span className="text-sm font-bold text-gray-500 font-mono">
                        {playbackIndex + 1} / {logs.length}
                    </span>
                </div>
            </div>
        </div>
    );
};
