import { AuditLogger } from '../security/AuditLogger';

export interface IPlugin {
    id: string;
    name: string;
    version: string;
    onMount: () => void;
    onEvent: (event: string, data: any) => void;
    onDestroy: () => void;
}

export class PluginKernel {
    private static plugins: Map<string, IPlugin> = new Map();
    // eslint-disable-next-line @typescript-eslint/ban-types
    // private static activeHooks: Record<string, Function[]> = {};

    public static register(plugin: IPlugin) {
        if (this.plugins.has(plugin.id)) {
            console.warn(`Plugin ${plugin.id} already registered.`);
            return;
        }
        this.plugins.set(plugin.id, plugin);
        AuditLogger.log('PLUGIN_SYS', `REGISTERED:${plugin.id}`, 'INFO');
    }

    public static loadAll() {
        this.plugins.forEach(p => {
            try {
                p.onMount();
                AuditLogger.log('PLUGIN_SYS', `MOUNTED:${p.id}`, 'INFO');
            } catch (e) {
                AuditLogger.log('PLUGIN_ERR', `FAIL_MOUNT:${p.id}`, 'CRITICAL');
            }
        });
    }

    public static dispatchEvent(event: string, data: any) {
        this.plugins.forEach(p => p.onEvent(event, data));
    }

    public static getRegistry(): IPlugin[] {
        return Array.from(this.plugins.values());
    }
}

// Example Internal Plugin: Auto-Logger
class AutoLoggerPlugin implements IPlugin {
    id = 'core.logger';
    name = 'Core Auto Logger';
    version = '1.0.0';

    onMount() { console.log('AutoLogger Active'); }
    onEvent(event: string, data: any) {
        if (event === 'TRANSACTION') {
            console.log(`[PLUGIN-HOOK] New Sale: ${data.amount}`);
        }
    }
    onDestroy() { }
}

// Initialize Core Plugins
PluginKernel.register(new AutoLoggerPlugin());
