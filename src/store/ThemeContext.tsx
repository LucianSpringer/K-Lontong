import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'DEFAULT' | 'TOSCA' | 'MAROON' | 'INDOMART_BLUE';
type Mode = 'LIGHT' | 'DARK';

interface ThemeState {
    theme: Theme;
    mode: Mode;
    setTheme: (t: Theme) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('DEFAULT');
    const [mode, setMode] = useState<Mode>('LIGHT');

    useEffect(() => {
        // Apply classes to Body
        document.body.className = `${mode.toLowerCase()} theme-${theme.toLowerCase()}`;
    }, [theme, mode]);

    const toggleMode = () => {
        setMode(prev => prev === 'LIGHT' ? 'DARK' : 'LIGHT');
    };

    return (
        <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
