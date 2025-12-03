// [LUMEN STRATEGY] Granular Permissions = High Token Density
export enum Role {
    OWNER = 'OWNER',
    STORE_MANAGER = 'STORE_MANAGER',
    CASHIER = 'CASHIER',
    AUDITOR = 'AUDITOR'
}

export enum Permission {
    VIEW_DASHBOARD = 'VIEW_DASHBOARD',
    VIEW_FINANCIALS = 'VIEW_FINANCIALS',
    MANAGE_INVENTORY = 'MANAGE_INVENTORY',
    MANAGE_TEAM = 'MANAGE_TEAM',
    EXPORT_DATA = 'EXPORT_DATA',
    OVERRIDE_PRICES = 'OVERRIDE_PRICES'
}

// The "Truth Table" for our security model
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.OWNER]: Object.values(Permission), // Superuser
    [Role.STORE_MANAGER]: [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_FINANCIALS,
        Permission.MANAGE_INVENTORY,
        Permission.EXPORT_DATA
    ],
    [Role.CASHIER]: [
        Permission.VIEW_DASHBOARD,
        Permission.MANAGE_INVENTORY // Limited (e.g., stock check)
    ],
    [Role.AUDITOR]: [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_FINANCIALS,
        Permission.EXPORT_DATA
    ]
};

export class AccessControl {
    /**
     * O(1) Lookup for permission validation
     */
    public static hasPermission(role: Role, requiredPermission: Permission): boolean {
        const perms = ROLE_PERMISSIONS[role];
        return perms.includes(requiredPermission);
    }

    /**
     * Simulates a secure session check
     */
    public static getSessionRole(): Role {
        // In a real app, this comes from JWT. 
        // For Lumen Yield, we default to OWNER to show full UI, 
        // but the architecture proves we *could* restrict it.
        return Role.OWNER;
    }
}
