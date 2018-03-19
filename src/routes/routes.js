import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
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

// Auth Components
import Login from 'src/components/Dashboard/Views/Pages/Login.vue'
import CompanySelector from 'src/components/Dashboard/Views/CompanySelector.vue'

let userMenu = {
  path: '/user',
  component: DashboardLayout,
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
      path: 'settings',
      name: 'Settings'
    },
    {
      path: 'password',
      name: 'Change password'
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
    component: DashboardLayout,
    redirect: '/admin/select-company',
    meta: {
      auth: true
    }
  },
  loginPage,
  lockPage,
  userMenu,
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/select-company',
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
      },
      {
        path: 'overview/:company_id',
        name: 'Overview with Company id',
        component: Overview
      }
    ]
  },
  {path: '*', component: NotFound},
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
