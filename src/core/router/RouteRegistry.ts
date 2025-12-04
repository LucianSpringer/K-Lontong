import React from 'react';

export interface RouteConfig {
    id: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.FC<any>;
    icon?: string;
    role?: string[]; // RBAC support
}

export class RouteRegistry {
    private static routes: Map<string, RouteConfig> = new Map();

    public static register(config: RouteConfig) {
        if (!this.routes.has(config.id)) {
            this.routes.set(config.id, config);
        }
    }

    public static getRoute(id: string): RouteConfig | undefined {
        return this.routes.get(id);
    }

    public static getAll(): RouteConfig[] {
        return Array.from(this.routes.values());
    }
}
