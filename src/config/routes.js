export const routes = {
  admin: [
    {
      path: '/dashboard',
      component: 'Dashboard',
      allowedRoles: ['Admin', 'Distributor']
    },
    {
      path: '/users',
      component: 'Users',
      allowedRoles: ['Admin']
    },
    {
      path: '/reports',
      component: 'Reports',
      allowedRoles: ['Admin']
    },
    {
      path: '/profile',
      component: 'Profile',
      allowedRoles: ['Admin', 'Distributor']
    },
    // Add more routes as needed
  ]
}; 