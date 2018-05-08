export default [
  {
    name: 'Home',
    icon: 'ti-panel',
    collapsed: false,
    path: '/select-company',
    company_route: false
  },
  // company routes
  {
    name: 'Home',
    icon: 'ti-panel',
    collapsed: false,
    path: '/admin/overview',
    company_route: true
  },
  {
    name: 'Company',
    icon: 'ti-home',
    company_route: true,
    children: [
      {
        name: 'Company Details',
        path: '/company/details'
      },
      {
        name: 'Users',
        path: '/company/users'
      }
    ]
  },
  {
    name: 'Accounting',
    icon: 'fa fa-calculator',
    company_route: true,
    permission: ['admin', 'manager', 'accountant'],
    children: [
      {
        name: 'Tax',
        path: '/accounting/tax'
      }
    ]
  },
  {
    name: 'Event Module',
    icon: 'fa fa-ticket',
    company_route: true,
    children: [
      {
        name: 'Overview',
        path: '/events/overview'
      },
      {
        name: 'Create a event',
        path: '/events/create',
        permission: ['admin', 'manager']
      }
    ]
  },
  {
    name: 'Settings',
    icon: 'ti-settings',
    company_route: true,
    permission: ['admin', 'manager', 'accountant', 'product_manager'],
    children: [
      {
        name: 'Shipping Rules',
        path: '/settings/shipping_rules',
        permission: ['admin', 'manager', 'accountant', 'product_manager']
      }
    ]
  },
  {
    name: 'Payments',
    icon: 'fa fa-exchange',
    company_route: true,
    permission: ['admin', 'manager'],
    children: [
      {
        name: 'Payment APIs',
        path: '/channels/payments/view',
        permission: ['admin', 'manager']
      }
    ]
  }
]
