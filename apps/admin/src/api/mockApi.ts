// Mock API for navigation items and user roles

export const fetchNavigationItems = async () => {
  return [
    { path: '/orders', label: 'Orders', roles: ['all'] },
    { path: '/delivery', label: 'Delivery', roles: ['manager', 'driver'] },
    { path: '/menu', label: 'Menu Management', roles: ['manager'] },
    { path: '/settings', label: 'Settings', roles: ['manager'] },
    { path: '/users', label: 'User Management', roles: ['manager'] },
  ];
};

export const fetchUserRole = async () => {
  return { name: 'John Doe', role: 'manager' };
};
