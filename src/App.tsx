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

// Module Imports (ALL PHASES)
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
// Phase 20-23 Imports
import { WarungGPTConsole } from './modules/ai/WarungGPTConsole';
import { FinancialHub } from './modules/finance/FinancialHub';
import { MarketplaceView } from './modules/admin/MarketplaceView';
import { IPOLaunchpad } from './modules/admin/IPOLaunchpad';
import { FranchiseBuilder } from './modules/admin/FranchiseBuilder';
import { PayrollManager } from './modules/admin/PayrollManager';
import { LegalAssistant } from './modules/tools/LegalAssistant';
import { BattleArena } from './modules/engagement/BattleArena';
import { EmergencyControl } from './modules/admin/EmergencyControl';

// Register All Routes (30+ Modules)
const registerRoutes = () => {
    // Core Ops
    RouteRegistry.register({ id: 'POS', label: 'Point of Sale', component: PointOfSale, icon: 'fa-cash-register' });
    RouteRegistry.register({ id: 'INVENTORY', label: 'Inventory', component: InventoryDashboard, icon: 'fa-box' });
    RouteRegistry.register({ id: 'ANALYTICS', label: 'Analytics', component: AnalyticsDashboard, icon: 'fa-chart-pie' });
    RouteRegistry.register({ id: 'SETTINGS', label: 'Settings', component: TeamSettings, icon: 'fa-cog' });

    // Admin & Finance
    RouteRegistry.register({ id: 'FINANCE', label: 'Financial Hub', component: FinancialHub, icon: 'fa-coins' });
    RouteRegistry.register({ id: 'PAYROLL', label: 'Payroll Auto', component: PayrollManager, icon: 'fa-money-check-alt' });
    RouteRegistry.register({ id: 'EXPENSES', label: 'Expenses', component: ExpenseDashboard, icon: 'fa-wallet' });
    RouteRegistry.register({ id: 'TAX', label: 'Tax & Audit', component: AnalyticsDashboard, icon: 'fa-file-invoice-dollar' }); // Re-use Analytics for now

    // Intelligence & AI
    RouteRegistry.register({ id: 'WARUNG_GPT', label: 'WarungGPT', component: WarungGPTConsole, icon: 'fa-robot' });
    RouteRegistry.register({ id: 'WARUNG_IQ', label: 'Warung IQ', component: WarungIQDashboard, icon: 'fa-brain' });
    RouteRegistry.register({ id: 'AUTOPILOT', label: 'AutoPilot', component: AutoPilotDashboard, icon: 'fa-plane' });
    RouteRegistry.register({ id: 'MARKET', label: 'Market Trends', component: MarketTrendDashboard, icon: 'fa-arrow-trend-up' });

    // Supply Chain
    RouteRegistry.register({ id: 'SUPPLIERS', label: 'Suppliers', component: SupplierDashboard, icon: 'fa-handshake' });
    RouteRegistry.register({ id: 'PROCUREMENT', label: 'Procurement', component: ProcurementDashboard, icon: 'fa-boxes-packing' });
    RouteRegistry.register({ id: 'MARKETPLACE', label: 'Marketplace', component: MarketplaceView, icon: 'fa-store' });
    RouteRegistry.register({ id: 'LOGISTICS', label: 'Logistics', component: DeliveryRouteVisualizer, icon: 'fa-map-signs' });

    // Growth & Ecosystem
    RouteRegistry.register({ id: 'FRANCHISE', label: 'HQ Monitor', component: FranchiseDashboard, icon: 'fa-sitemap' });
    RouteRegistry.register({ id: 'FRANCHISE_BUILD', label: 'Franchise Builder', component: FranchiseBuilder, icon: 'fa-tools' });
    RouteRegistry.register({ id: 'IPO', label: 'Go Public (IPO)', component: IPOLaunchpad, icon: 'fa-chart-line' });
    RouteRegistry.register({ id: 'BATTLE', label: 'Battle Arena', component: BattleArena, icon: 'fa-trophy' });
    RouteRegistry.register({ id: 'ENGAGEMENT', label: 'Loyalty XP', component: EngagementDashboard, icon: 'fa-medal' });

    // Tools
    RouteRegistry.register({ id: 'LEGAL', label: 'Legal AI', component: LegalAssistant, icon: 'fa-gavel' });
    RouteRegistry.register({ id: 'AR', label: 'AR Layout', component: ARStoreLayout, icon: 'fa-cube' });
    RouteRegistry.register({ id: 'SCANNER', label: 'Competitor Scan', component: CompetitorScanner, icon: 'fa-camera' });
    RouteRegistry.register({ id: 'LAYOUT_PRO', label: 'Layout Editor', component: StoreLayoutEditor, icon: 'fa-th' });

    // Developer & System
    RouteRegistry.register({ id: 'INTEGRATIONS', label: 'Integrations', component: IntegrationsDashboard, icon: 'fa-plug' });
    RouteRegistry.register({ id: 'OMNIVISION', label: 'OmniVision', component: OmniVisionDashboard, icon: 'fa-network-wired' });
    RouteRegistry.register({ id: 'CUSTOMER_JOURNEY', label: 'Journey Map', component: CustomerJourneyMap, icon: 'fa-route' });
    RouteRegistry.register({ id: 'SCENARIO', label: 'Sim Studio', component: ScenarioStudio, icon: 'fa-flask' });
    RouteRegistry.register({ id: 'DEV_CONSOLE', label: 'Dev Console', component: DeveloperConsole, icon: 'fa-terminal' });
    RouteRegistry.register({ id: 'AUDIT_REPLAY', label: 'Audit Replay', component: AuditReplay, icon: 'fa-history' });
    RouteRegistry.register({ id: 'DEV_SANDBOX', label: 'Data Sandbox', component: DeveloperSandbox, icon: 'fa-code' });
    RouteRegistry.register({ id: 'EMERGENCY', label: 'Emergency SOS', component: EmergencyControl, icon: 'fa-kit-medical' });
};

registerRoutes();

export const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<string>('LANDING');
    const [isCmdOpen, setIsCmdOpen] = useState(false);

    useEffect(() => {
        StateHealer.snapshot({ viewMode, timestamp: Date.now() });
        P2PSyncEngine.scanForPeers();
    }, [viewMode]);

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
                <ToastContainer />
                <PerfTraceOverlay />
                <CommandPalette
                    isOpen={isCmdOpen}
                    onClose={() => setIsCmdOpen(false)}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onNavigate={(view) => setViewMode(view as any)}
                />

                <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-sm border-b border-warung-orange/10 px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('LANDING')}>
                        <div className="w-8 h-8 bg-warung-orange rounded-lg flex items-center justify-center text-white font-heading shadow-lg">K'</div>
                        <span className="font-heading text-xl text-warung-brown dark:text-white hidden md:inline">K'<span className="text-warung-teal">Lontong</span></span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {/* Core Nav */}
                        {['POS', 'INVENTORY', 'WARUNG_GPT', 'FINANCE'].map(id => {
                            const route = RouteRegistry.getRoute(id);
                            if (!route) return null;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setViewMode(id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${viewMode === id ? 'bg-warung-orange text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <i className={`fas ${route.icon}`}></i> <span className="hidden sm:inline">{route.label}</span>
                                </button>
                            );
                        })}
                        <button onClick={() => setIsCmdOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 whitespace-nowrap">
                            <i className="fas fa-th"></i> Menu
                        </button>
                    </div>
                </nav>

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
