export const USER_ROLES = {
    MANAGER: 'manager',
    STAFF: 'staff',
    DRIVER: 'driver',
    CUSTOMER: 'customer'
} as const;

export const USER_MANAGEMENT_TABS = {
    STAFF: 'staff',
    CUSTOMERS: 'customers'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserManagementTab = typeof USER_MANAGEMENT_TABS[keyof typeof USER_MANAGEMENT_TABS];
