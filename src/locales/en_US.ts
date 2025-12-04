export const DICTIONARY_EN = {
    common: {
        welcome: "Welcome to K'Lontong",
        loading: "Loading system...",
        error: "System error occurred",
        success: "Operation successful",
        save: "Save Changes",
        cancel: "Cancel",
        delete: "Delete Data",
        edit: "Edit Data",
        view: "View Details",
        search: "Search data...",
        filter: "Filter Data",
        export: "Export to CSV",
        import: "Import from CSV",
        back: "Back",
        next: "Next",
        finish: "Finish",
        close: "Close",
        confirm: "Confirm",
        deny: "Deny",
        auth_required: "Authentication Required",
        session_expired: "Session Expired",
        network_error: "Failed to connect to network",
        offline_mode: "Offline Mode Active",
        online_mode: "Online Mode Active",
        syncing: "Syncing data...",
        synced: "Data synced"
    },
    modules: {
        pos: {
            title: "Smart POS",
            scan_barcode: "Scan Barcode",
            voice_cmd: "Voice Command",
            cart_empty: "Cart is empty",
            checkout: "Pay Now",
            hold: "Hold Transaction",
            recall: "Recall Transaction",
            discount: "Manual Discount",
            receipt: "Print Receipt",
            payment_methods: {
                cash: "Cash",
                qris: "Dynamic QRIS",
                transfer: "Bank Transfer",
                credit: "Credit / Debt"
            }
        },
        inventory: {
            title: "Stock Management",
            sku: "SKU Code",
            name: "Item Name",
            stock: "Physical Stock",
            cogs: "Cost of Goods Sold",
            price: "Selling Price",
            margin: "Profit Margin",
            supplier: "Main Supplier",
            status: {
                critical: "Critical Stock",
                warning: "Low Stock",
                healthy: "Healthy",
                overstock: "Overstock"
            }
        },
        analytics: {
            title: "Business Analytics",
            revenue: "Gross Revenue",
            profit: "Net Profit",
            expense: "Operational Expense",
            tax: "Tax Estimate",
            fraud: "Fraud Detection",
            growth: "Monthly Growth"
        },
        legal: {
            terms: "Terms and Conditions...",
            privacy: "Data Privacy Policy...",
            disclaimer: "Disclaimer..."
        }
    },
    errors: {
        e404: "Page not found",
        e500: "Internal server error",
        e403: "Access denied",
        validation: {
            required: "This field is required",
            email: "Invalid email format",
            phone: "Invalid phone number",
            numeric: "Must be a number"
        }
    }
};
