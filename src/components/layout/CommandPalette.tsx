import React, { useState, useEffect, useRef } from 'react';

interface Command {
    id: string;
    label: string;
    icon: string;
    action: () => void;
    shortcut?: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const commands: Command[] = [
        { id: 'home', label: 'Go to Dashboard', icon: 'fa-home', action: () => onNavigate('INVENTORY') },
        { id: 'pos', label: 'Open Point of Sale', icon: 'fa-cash-register', action: () => onNavigate('POS') },
        { id: 'analytics', label: 'View Analytics', icon: 'fa-chart-line', action: () => onNavigate('ANALYTICS') },
        { id: 'settings', label: 'System Settings', icon: 'fa-cog', action: () => onNavigate('SETTINGS') },
        { id: 'supply', label: 'Supply Chain', icon: 'fa-truck', action: () => onNavigate('PROCUREMENT') },
        { id: 'dev', label: 'Developer Console', icon: 'fa-terminal', action: () => onNavigate('DEV_CONSOLE') },
        { id: 'audit', label: 'Audit Replay', icon: 'fa-history', action: () => onNavigate('AUDIT_REPLAY') },
        { id: 'theme', label: 'Toggle Dark Mode', icon: 'fa-moon', action: () => document.body.classList.toggle('dark') },
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            if (filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-in">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <i className="fas fa-search text-gray-400"></i>
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent outline-none text-lg text-gray-800 dark:text-white placeholder-gray-400"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                    />
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded">ESC</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredCommands.map((cmd, idx) => (
                        <button
                            key={cmd.id}
                            onClick={() => { cmd.action(); onClose(); }}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${idx === selectedIndex
                                    ? 'bg-warung-teal text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <i className={`fas ${cmd.icon} w-5 text-center`}></i>
                            <span className="flex-1 font-medium">{cmd.label}</span>
                            {cmd.shortcut && <span className="text-xs opacity-60">{cmd.shortcut}</span>}
                            {idx === selectedIndex && <i className="fas fa-level-down-alt transform rotate-90 opacity-50"></i>}
                        </button>
                    ))}
                    {filteredCommands.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            No commands found for "{query}"
                        </div>
                    )}
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500">
                    <span><strong>↑↓</strong> to navigate</span>
                    <span><strong>↵</strong> to select</span>
                </div>
            </div>
        </div>
    );
};
