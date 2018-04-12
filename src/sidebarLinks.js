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
  }
]
