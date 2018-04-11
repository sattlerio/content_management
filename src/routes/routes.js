import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
import DashboardGeneralLayout from '../components/Dashboard/Layout/DashboardGeneralLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
import ServerError from '../components/GeneralViews/ServerErrorPage.vue'
// Dashboard pages
import Overview from 'src/components/Dashboard/Views/Dashboard/Overview.vue'

// Pages
import Lock from 'src/components/Dashboard/Views/Pages/Lock.vue'

// User
import UserProfile from 'src/components/Dashboard/Views/Pages/UserProfile/UserProfile.vue'
import EditUser from 'src/components/Dashboard/Views/Pages/UserProfile/EditUser.vue'
import UserPassword from 'src/components/Dashboard/Views/Pages/UserProfile/EditUserPassword.vue'

// Company
import CompanyDetails from 'src/components/Dashboard/Views/Company/Details.vue'
import CompanySettings from 'src/components/Dashboard/Views/Company/Settings.vue'
import ComanyContacts from 'src/components/Dashboard/Views/Company/Contacts.vue'

// Accounting
import TaxIndex from 'src/components/Dashboard/Views/Accounting/TaxIndex.vue'
import TaxCreate from 'src/components/Dashboard/Views/Accounting/TaxCreate.vue'
import TaxEdit from 'src/components/Dashboard/Views/Accounting/TaxEdit.vue'
import TaxView from 'src/components/Dashboard/Views/Accounting/TaxView.vue'
import TaxRuleCreate from 'src/components/Dashboard/Views/Accounting/TaxRuleCreate.vue'
import TaxRuleEdit from 'src/components/Dashboard/Views/Accounting/TaxRuleEdit.vue'
import TaxTestConfiguration from 'src/components/Dashboard/Views/Accounting/TaxTestConfiguration.vue'

// Auth Components
import Login from 'src/components/Dashboard/Views/Pages/Login.vue'
import Logout from 'src/components/Dashboard/Views/Pages/Logout.vue'
import CompanySelector from 'src/components/Dashboard/Views/CompanySelector.vue'


let userMenu = {
  path: '/user',
  component: DashboardGeneralLayout,
  meta: {
    auth: true
  },
  redirect: '/user/profile',
  children: [
    {
      path: 'profile',
      name: 'My User',
      component: UserProfile
    },
    {
      path: 'edit',
      name: 'Edit my user',
      component: EditUser
    },
    {
      path: 'password',
      name: 'Change password',
      component: UserPassword
    }
  ]
}

let taxMenu = {
  path: '/accounting/:company_id',
  component: DashboardLayout,
  meta: {
    auth: true
  },
  permission: ['admin', 'manager', 'accountant'],
  redirect: '/company/details/:company_id',
  children: [
    {
      path: '/accounting/tax/:company_id',
      name: 'Tax Settings',
      component: TaxIndex,
      meta: {
        permission: ['admin', 'manager', 'accountant']
      }
    },
    {
      path: '/accounting/tax/create/:company_id',
      name: 'Create New Tax',
      component: TaxCreate,
      meta: {
        permission: ['admin', 'manager', 'accountant']
      }
    },
    {
      path: '/accounting/tax/rule/create/:tax_id/:company_id',
      name: 'Create new tax rule',
      component: TaxRuleCreate,
      meta: {
        permission: ['admin', 'manager', 'accountant']
      }
    },
    {
      path: '/accounting/tax/details/:tax_id/:company_id',
      name: 'View Tax',
      component: TaxView,
      meta: {
        permission: ['admin', 'manager', 'accountant']
      }
    },
    {
      path: '/accounting/tax/rule/edit/:tax_rule_id/:tax_id/:company_id',
      name: 'Edit Tax Rule',
      component: TaxRuleEdit,
      meta: {
        permission: ['admin', 'manager', 'accountant']
      }
    },
    {
      path: '/accounting/tax/edit/:tax_id/:company_id',
      name: 'Edit Tax',
      component: TaxEdit,
      meta: {
        permission: ['admin', 'manager', 'accountant']
      }
    },
    {
      path: '/accounting/tax/test/:tax_id/:company_id',
      name: 'Test Tax Configuration',
      component: TaxTestConfiguration,
      meta: {
        permission: ['admin', 'manager', 'accountant']
      }
    }
  ]

}

let companyMenu = {
  path: '/company/:company_id',
  component: DashboardLayout,
  meta: {
    auth: true
  },
  redirect: '/company/details/:company_id',
  children: [
    {
      path: '/company/details/:company_id',
      name: 'Company Details',
      component: CompanyDetails
    },
    {
      path: '/company/settings/:company_id',
      name: 'Edit Company Settings',
      component: CompanySettings,
      meta: {
        auth: true,
        permission: ['admin', 'manager']
      }
    },
    {
      path: '/company/contacts/:company_id',
      name: 'Manage Company Contacts',
      component: ComanyContacts,
      meta: {
        auth: true,
        permission: ['admin', 'manager']
      }
    }
  ]
}

let loginPage = {
  path: '/login',
  name: 'Login',
  meta: {
    auth: false
  },
  component: Login
}


let lockPage = {
  path: '/lock',
  name: 'Lock',
  component: Lock
}

const routes = [
  {
    path: '/',
    component: DashboardGeneralLayout,
    redirect: '/select-company',
    meta: {
      auth: true
    }
  },
  loginPage,
  {
    path: '/logout',
    component: Logout,
    name: 'logout',
    meta: {
      auth: true
    }
  },
  lockPage,
  userMenu,
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/select-company',
    meta: {
      auth: true
    },
    children: [
      {
        path: '/admin/select-company',
        redirect: '/select-company'
      },
      {
        path: 'overview/:company_id',
        name: 'Overview with Company id',
        component: Overview
      }

    ]
  },
  companyMenu,
  taxMenu,
  {
    path: '/',
    component: DashboardGeneralLayout,
    redirect: '/select-company',
    meta: {
      auth: true
    },
    children: [
      {
        path: 'select-company',
        name: 'Select Your Company',
        component: CompanySelector
      },
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      }
    ]
  },
  {path: '*', name: 'Not Found', component: NotFound},
  {path: '/server-error', component: ServerError}
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
