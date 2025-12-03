import React, { useState, useEffect } from 'react';
import { LeadMagnetSequencer, ScarcityState } from '../../core/engines/LeadMagnetSequencer';

interface ScarcityTimerProps {
    deadline: string;
    label?: string;
}

export const ScarcityTimer: React.FC<ScarcityTimerProps> = ({
    deadline,
    label = 'Promo Berakhir Dalam: '
}) => {
    const [scarcity, setScarcity] = useState<ScarcityState>(() =>
        LeadMagnetSequencer.calculateScarcity(deadline)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setScarcity(LeadMagnetSequencer.calculateScarcity(deadline));
        }, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    if (scarcity.isExpired) {
        return (
            <div className="flex items-center justify-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                <span>Promo Telah Berakhir</span>
            </div>
        );
    }

    const formatTime = (num: number): string => String(num).padStart(2, '0');

    return (
        <div className="flex items-center justify-center gap-3">
            <span>{label}</span>

            <div className="flex items-center gap-2 font-mono">
                {scarcity.hoursRemaining > 0 && (
                    <>
                        <div className="bg-warung-yellow text-warung-deep-brown px-2 py-1 rounded font-bold min-w-[2.5rem] text-center">
                            {formatTime(scarcity.hoursRemaining)}
                        </div>
                        <span>:</span>
                    </>
                )}

                <div className="bg-warung-yellow text-warung-deep-brown px-2 py-1 rounded font-bold min-w-[2.5rem] text-center">
                    {formatTime(scarcity.minutesRemaining)}
                </div>
                <span>:</span>

                <div className="bg-warung-yellow text-warung-deep-brown px-2 py-1 rounded font-bold min-w-[2.5rem] text-center">
                    {formatTime(scarcity.secondsRemaining)}
                </div>
            </div>
        </div>
    );
};
