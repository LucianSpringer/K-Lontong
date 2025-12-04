import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './store/ThemeContext';
import { RouteRegistry } from './core/router/RouteRegistry';
import { StateHealer } from './core/system/StateHealer';
import { P2PSyncEngine } from './core/network/P2PSyncEngine';

// Components
import { HeroSection } from './components/HeroSection';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { PerfTraceOverlay } from './modules/developer/PerfTraceOverlay';

// Module Imports (Registering them dynamically)
import { InventoryDashboard } from './modules/admin/InventoryDashboard';
import { AnalyticsDashboard } from './modules/admin/AnalyticsDashboard';
import { TeamSettings } from './modules/settings/TeamSettings';
import { PointOfSale } from './modules/pos/PointOfSale';
import { IntegrationsDashboard } from './modules/admin/IntegrationsDashboard';
import { ProcurementDashboard } from './modules/admin/ProcurementDashboard';
import { FranchiseDashboard } from './modules/admin/FranchiseDashboard';
import { ARStoreLayout } from './modules/tools/ARStoreLayout';
import { CompetitorScanner } from './modules/tools/CompetitorScanner';
import { StoreLayoutEditor } from './modules/tools/StoreLayoutEditor';
import { DeveloperConsole } from './modules/developer/DeveloperConsole';
import { AuditReplay } from './modules/developer/AuditReplay';
import { WarungIQDashboard } from './modules/admin/WarungIQDashboard';
import { SupplierDashboard } from './modules/admin/SupplierDashboard';
import { ExpenseDashboard } from './modules/admin/ExpenseDashboard';
import { MarketTrendDashboard } from './modules/admin/MarketTrendDashboard';
import { OmniVisionDashboard } from './modules/analytics/OmniVisionDashboard';
import { CustomerJourneyMap } from './modules/analytics/CustomerJourneyMap';
import { ScenarioStudio } from './modules/analytics/ScenarioStudio';
import { DeveloperSandbox } from './modules/developer/DeveloperSandbox';
import { EngagementDashboard } from './modules/engagement/EngagementDashboard';
import { AutoPilotDashboard } from './modules/admin/AutoPilotDashboard';
import { DeliveryRouteVisualizer } from './modules/logistics/DeliveryRouteVisualizer';

import { WarungGPTConsole } from './modules/ai/WarungGPTConsole';

// 1. REGISTER ROUTES (Simulating Module Injection)
RouteRegistry.register({ id: 'INVENTORY', label: 'Inventory', component: InventoryDashboard, icon: 'fa-box' });
RouteRegistry.register({ id: 'POS', label: 'Point of Sale', component: PointOfSale, icon: 'fa-cash-register' });
RouteRegistry.register({ id: 'ANALYTICS', label: 'Analytics', component: AnalyticsDashboard, icon: 'fa-chart-pie' });
RouteRegistry.register({ id: 'SETTINGS', label: 'Settings', component: TeamSettings, icon: 'fa-cog' });
RouteRegistry.register({ id: 'INTEGRATIONS', label: 'Integrations', component: IntegrationsDashboard, icon: 'fa-plug' });
RouteRegistry.register({ id: 'PROCUREMENT', label: 'Procurement', component: ProcurementDashboard, icon: 'fa-truck' });
RouteRegistry.register({ id: 'FRANCHISE', label: 'Franchise', component: FranchiseDashboard, icon: 'fa-building' });
RouteRegistry.register({ id: 'AR', label: 'AR Layout', component: ARStoreLayout, icon: 'fa-cube' });
RouteRegistry.register({ id: 'SCANNER', label: 'Scanner', component: CompetitorScanner, icon: 'fa-camera' });
RouteRegistry.register({ id: 'LAYOUT_PRO', label: 'Layout Editor', component: StoreLayoutEditor, icon: 'fa-th' });
RouteRegistry.register({ id: 'WARUNG_IQ', label: 'Warung IQ', component: WarungIQDashboard, icon: 'fa-brain' });
RouteRegistry.register({ id: 'SUPPLIERS', label: 'Suppliers', component: SupplierDashboard, icon: 'fa-handshake' });
RouteRegistry.register({ id: 'EXPENSES', label: 'Expenses', component: ExpenseDashboard, icon: 'fa-wallet' });
RouteRegistry.register({ id: 'MARKET', label: 'Market Trend', component: MarketTrendDashboard, icon: 'fa-arrow-trend-up' });
RouteRegistry.register({ id: 'OMNIVISION', label: 'OmniVision', component: OmniVisionDashboard, icon: 'fa-network-wired' });
RouteRegistry.register({ id: 'CUSTOMER_JOURNEY', label: 'Journey Map', component: CustomerJourneyMap, icon: 'fa-route' });
RouteRegistry.register({ id: 'SCENARIO', label: 'Scenario Sim', component: ScenarioStudio, icon: 'fa-flask' });
RouteRegistry.register({ id: 'DEV_CONSOLE', label: 'Dev Console', component: DeveloperConsole, icon: 'fa-terminal' });
RouteRegistry.register({ id: 'AUDIT_REPLAY', label: 'Audit Replay', component: AuditReplay, icon: 'fa-history' });
RouteRegistry.register({ id: 'DEV_SANDBOX', label: 'Sandbox', component: DeveloperSandbox, icon: 'fa-code' });
RouteRegistry.register({ id: 'ENGAGEMENT', label: 'Engagement', component: EngagementDashboard, icon: 'fa-trophy' });
RouteRegistry.register({ id: 'AUTOPILOT', label: 'AutoPilot', component: AutoPilotDashboard, icon: 'fa-robot' });
RouteRegistry.register({ id: 'LOGISTICS', label: 'Logistics', component: DeliveryRouteVisualizer, icon: 'fa-map-signs' });
RouteRegistry.register({ id: 'WARUNG_GPT', label: 'WarungGPT', component: WarungGPTConsole, icon: 'fa-comments' });

export const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<string>('LANDING');
    const [isCmdOpen, setIsCmdOpen] = useState(false);

    // Init State Healer & P2P
    useEffect(() => {
        StateHealer.snapshot({ viewMode, timestamp: Date.now() });
        P2PSyncEngine.scanForPeers();
    }, [viewMode]);

    // Keyboard Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCmdOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const ActiveComponent = RouteRegistry.getRoute(viewMode)?.component;

    return (
        <ThemeProvider>
            <div className="bg-warung-cream min-h-screen font-sans text-gray-800 scroll-smooth dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

                {/* Infrastructure Overlays */}
                <ToastContainer />
                <PerfTraceOverlay />
                <CommandPalette
                    isOpen={isCmdOpen}
                    onClose={() => setIsCmdOpen(false)}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onNavigate={(view) => setViewMode(view as any)}
                />

                {/* Navigation */}
                <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-sm border-b border-warung-orange/10 px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('LANDING')}>
                        <div className="w-8 h-8 bg-warung-orange rounded-lg flex items-center justify-center text-white font-heading shadow-lg">K'</div>
                        <span className="font-heading text-xl text-warung-brown dark:text-white">K'<span className="text-warung-teal">Lontong</span></span>
                    </div>

                    {/* Dynamic Navigation Bar (Top 5 + More) */}
                    <div className="hidden md:flex items-center gap-2">
                        {['POS', 'INVENTORY', 'AUTOPILOT', 'LOGISTICS'].map(id => {
                            const route = RouteRegistry.getRoute(id);
                            if (!route) return null;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setViewMode(id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${viewMode === id ? 'bg-warung-orange text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <i className={`fas ${route.icon}`}></i> {route.label}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setViewMode('WARUNG_GPT')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${viewMode === 'WARUNG_GPT' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                        >
                            <i className="fas fa-robot"></i> GPT
                        </button>
                        <button onClick={() => setIsCmdOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                            More... (Ctrl+K)
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <main>
                    {viewMode === 'LANDING' ? (
                        <HeroSection onCtaClick={() => setViewMode('POS')} />
                    ) : (
                        ActiveComponent ? <ActiveComponent /> : <div className="p-20 text-center">Route Not Found</div>
                    )}
                </main>
            </div>
        </ThemeProvider>
    );
};
