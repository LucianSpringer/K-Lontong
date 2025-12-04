import React, { useState, useEffect } from 'react';
import { NotificationOrchestrator, AppNotification } from '../../core/services/NotificationOrchestrator';

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<AppNotification[]>([]);

    useEffect(() => {
        // Subscribe to the Event Bus
        const unsubscribe = NotificationOrchestrator.subscribe((notification) => {
            setToasts(prev => [...prev, notification]);

            // Auto-dismiss
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== notification.id));
            }, 5000);
        });

        return unsubscribe;
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`min-w-[300px] p-4 rounded-xl shadow-2xl text-white flex items-center gap-3 animate-slide-in ${toast.type === 'ERROR' ? 'bg-red-600' :
                            toast.type === 'WARNING' ? 'bg-yellow-500' :
                                toast.type === 'SUCCESS' ? 'bg-green-600' : 'bg-gray-800'
                        }`}
                >
                    <i className={`fas ${toast.type === 'ERROR' ? 'fa-times-circle' :
                            toast.type === 'WARNING' ? 'fa-exclamation-triangle' :
                                toast.type === 'SUCCESS' ? 'fa-check-circle' : 'fa-info-circle'
                        }`}></i>
                    <div className="flex-1">
                        <p className="font-bold text-xs opacity-80">{toast.type}</p>
                        <p className="text-sm">{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
