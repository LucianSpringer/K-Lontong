import React, { useState, useEffect } from 'react';
import { Role, Permission, ROLE_PERMISSIONS, AccessControl } from '../../core/security/AccessControl';
import { AuditLogger, AuditLog } from '../../core/security/AuditLogger';
import { useTheme } from '../../store/ThemeContext'; // Import Hook

interface TeamMember {
    id: string;
    name: string;
    role: Role;
    lastActive: string;
    status: 'ACTIVE' | 'SUSPENDED';
}

const MOCK_TEAM: TeamMember[] = [
    { id: 'TM-001', name: 'Budi Santoso (You)', role: Role.OWNER, lastActive: 'Now', status: 'ACTIVE' },
    { id: 'TM-002', name: 'Siti Aminah', role: Role.STORE_MANAGER, lastActive: '2h ago', status: 'ACTIVE' },
    { id: 'TM-003', name: 'Joko Anwar', role: Role.CASHIER, lastActive: '5m ago', status: 'ACTIVE' },
    { id: 'TM-004', name: 'External Auditor', role: Role.AUDITOR, lastActive: '1d ago', status: 'SUSPENDED' },
];

export const TeamSettings: React.FC = () => {
    const { theme, mode, setTheme, toggleMode } = useTheme(); // Use Context
    const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM);
    const [selectedRole, setSelectedRole] = useState<Role>(Role.OWNER);
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        setLogs(AuditLogger.getLogs());
    }, []);

    const handleStatusToggle = (id: string) => {
        setMembers(prev => prev.map(m => {
            if (m.id === id) {
                const newStatus = m.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                AuditLogger.log(
                    newStatus === 'SUSPENDED' ? 'USER_SUSPENSION' : 'USER_ACTIVATION',
                    `USER:${id}`,
                    'WARNING'
                );
                setLogs(AuditLogger.getLogs());
                return { ...m, status: newStatus };
            }
            return m;
        }));
    };

    return (
        <div className="bg-gray-50 p-8 rounded-3xl min-h-screen animate-slide-in space-y-8 dark:bg-gray-900 transition-colors duration-300">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-heading text-warung-deep-brown dark:text-warung-yellow">Settings & Preferences</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage Access, Audit Logs, and App Appearance.</p>
                </div>
                <div className="bg-warung-deep-brown text-white px-4 py-2 rounded-lg text-xs font-mono">
                    Session: {AccessControl.getSessionRole()}
                </div>
            </header>

            {/* NEW: Appearance Control Panel */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <i className="fas fa-palette text-warung-teal"></i> App Appearance
                </h3>
                <div className="flex flex-col md:flex-row gap-6 items-center">

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleMode}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${mode === 'DARK' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {mode === 'DARK' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                        {mode === 'DARK' ? 'Dark Mode On' : 'Light Mode'}
                    </button>

                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden md:block"></div>

                    {/* Theme Selector */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setTheme('DEFAULT')}
                            className={`px-4 py-2 rounded-lg border-2 font-bold text-sm ${theme === 'DEFAULT' ? 'border-warung-orange text-warung-orange bg-orange-50' : 'border-transparent text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            🟠 Default
                        </button>
                        <button
                            onClick={() => setTheme('TOSCA')}
                            className={`px-4 py-2 rounded-lg border-2 font-bold text-sm ${theme === 'TOSCA' ? 'border-teal-500 text-teal-500 bg-teal-50' : 'border-transparent text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            🟢 Tosca
                        </button>
                        <button
                            onClick={() => setTheme('MAROON')}
                            className={`px-4 py-2 rounded-lg border-2 font-bold text-sm ${theme === 'MAROON' ? 'border-red-800 text-red-800 bg-red-50' : 'border-transparent text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            🔴 Maroon
                        </button>
                        <button
                            onClick={() => setTheme('INDOMART_BLUE')}
                            className={`px-4 py-2 rounded-lg border-2 font-bold text-sm ${theme === 'INDOMART_BLUE' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            🔵 IndoBlue
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Team Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Authorized Personnel</h3>
                            <button className="text-xs bg-warung-teal text-white px-3 py-2 rounded-lg font-bold hover:bg-teal-700">
                                <i className="fas fa-plus mr-2"></i> Add Member
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">User</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {members.map(m => (
                                    <tr key={m.id} className="hover:bg-blue-50/30 dark:hover:bg-gray-700 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{m.name}</p>
                                            <p className="text-xs text-gray-400 font-mono">{m.id}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${m.role === Role.OWNER ? 'bg-purple-100 text-purple-700' :
                                                    m.role === Role.STORE_MANAGER ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {m.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${m.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-xs font-bold ${m.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {m.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleStatusToggle(m.id)}
                                                className={`text-xs font-bold hover:underline ${m.status === 'ACTIVE' ? 'text-red-500' : 'text-green-600'}`}
                                                disabled={m.role === Role.OWNER}
                                            >
                                                {m.status === 'ACTIVE' ? 'REVOKE' : 'RESTORE'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Audit Logs Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Security Audit Log</h3>
                            <button onClick={() => { AuditLogger.clearLogs(); setLogs([]); }} className="text-xs text-red-500 hover:text-red-700 font-bold">Clear All</button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-4 space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-4">No audit records found.</p>
                            ) : (
                                logs.map(log => (
                                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs transition-colors">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.severity === 'CRITICAL' ? 'bg-red-500' :
                                                log.severity === 'WARNING' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{log.action}</span>
                                                <span className="text-gray-400 font-mono text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                                Resource: <span className="font-mono bg-gray-100 dark:bg-gray-900 px-1 rounded">{log.resource}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Matrix Viewer */}
                <div className="space-y-6">
                    <div className="bg-warung-deep-brown text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-warung-orange/10 rounded-full blur-2xl"></div>
                        <h3 className="font-heading text-xl mb-2 text-warung-yellow relative z-10">Permission Matrix</h3>
                        <p className="text-white/60 text-xs mb-6 relative z-10">Select a role to view assigned capabilities.</p>

                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 relative z-10 scrollbar-hide">
                            {Object.values(Role).map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedRole === role
                                            ? 'bg-warung-orange border-warung-orange text-white shadow-lg'
                                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                        }`}
                                >
                                    {role.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                            {Object.values(Permission).map(perm => {
                                const hasAccess = ROLE_PERMISSIONS[selectedRole].includes(perm);
                                return (
                                    <div key={perm} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${hasAccess
                                            ? 'border-green-500/30 bg-green-500/10'
                                            : 'border-white/5 bg-black/20 opacity-50'
                                        }`}>
                                        <span className="text-xs font-mono tracking-tight">{perm}</span>
                                        {hasAccess ? (
                                            <i className="fas fa-check-circle text-green-400"></i>
                                        ) : (
                                            <i className="fas fa-lock text-white/20"></i>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
