import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
import DashboardGeneralLayout from '../components/Dashboard/Layout/DashboardGeneralLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
import ServerError from '../components/GeneralViews/ServerErrorPage.vue'
// Dashboard pages
import Overview from 'src/components/Dashboard/Views/Dashboard/Overview.vue'

// Emergency
import Emergency from 'src/components/Dashboard/Views/Dashboard/Emergency.vue'

// Auth Components
import Login from 'src/components/Dashboard/Views/Pages/Login.vue'
import Logout from 'src/components/Dashboard/Views/Pages/Logout.vue'

let loginPage = {
  path: '/login',
  name: 'Login',
  meta: {
    auth: false
  },
  component: Login
}


const routes = [
  {
    path: '/',
    component: DashboardGeneralLayout,
    redirect: '/overview',
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
  {
    path: '/',
    component: DashboardGeneralLayout,
    redirect: '/overview',
    meta: {
      auth: true
    },
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: 'emergency',
        name: 'Report Emergency',
        component: Emergency
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
