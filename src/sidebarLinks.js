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
  }
]
