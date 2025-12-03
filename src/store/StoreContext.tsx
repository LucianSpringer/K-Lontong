import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SimulationParams } from '../core/engines/OmzetProfitEngine';

interface LeadMagnetState {
    hasSubmitted: boolean;
    submittedAt: number | null;
    email: string | null;
    phone: string | null;
}

interface WarungState {
    // Calculator State
    calculatorInputs: SimulationParams;

    // Lead Magnet State
    leadMagnet: LeadMagnetState;

    // Session tracking
    firstVisit: number;
}

interface WarungContextType {
    state: WarungState;
    updateCalculatorInputs: (inputs: Partial<SimulationParams>) => void;
    recordLeadSubmission: (email: string, phone: string) => void;
    resetLeadMagnet: () => void;
}

const defaultState: WarungState = {
    calculatorInputs: {
        dailyRevenue: 500000,
        marginPercent: 15,
        operationalCost: 1500000,
        daysOpen: 30
    },
    leadMagnet: {
        hasSubmitted: false,
        submittedAt: null,
        email: null,
        phone: null
    },
    firstVisit: Date.now()
};

const WarungContext = createContext<WarungContextType | undefined>(undefined);

const STORAGE_KEY = 'klontong_warung_state';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<WarungState>(() => {
        // Load from localStorage on init
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...defaultState, ...parsed };
            }
        } catch (error) {
            console.error('Failed to load state from localStorage:', error);
        }
        return defaultState;
    });

    // Persist to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save state to localStorage:', error);
        }
    }, [state]);

    const updateCalculatorInputs = (inputs: Partial<SimulationParams>) => {
        setState(prev => ({
            ...prev,
            calculatorInputs: {
                ...prev.calculatorInputs,
                ...inputs
            }
        }));
    };

    const recordLeadSubmission = (email: string, phone: string) => {
        setState(prev => ({
            ...prev,
            leadMagnet: {
                hasSubmitted: true,
                submittedAt: Date.now(),
                email,
                phone
            }
        }));
    };

    const resetLeadMagnet = () => {
        setState(prev => ({
            ...prev,
            leadMagnet: {
                hasSubmitted: false,
                submittedAt: null,
                email: null,
                phone: null
            }
        }));
    };

    const value: WarungContextType = {
        state,
        updateCalculatorInputs,
        recordLeadSubmission,
        resetLeadMagnet
    };

    return <WarungContext.Provider value={value}>{children}</WarungContext.Provider>;
};

export const useWarungStore = (): WarungContextType => {
    const context = useContext(WarungContext);
    if (!context) {
        throw new Error('useWarungStore must be used within StoreProvider');
    }
    return context;
};
