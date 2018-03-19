import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
import VeeValidate from 'vee-validate'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import App from './App.vue'

// Plugins
import GlobalComponents from './gloablComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'

// router setup
import routes from './routes/routes'

// http
import axios from 'axios'
import VueAxios from 'vue-axios'

// library imports

import './assets/sass/paper-dashboard.scss'
import './assets/sass/element_variables.scss'
import './assets/sass/demo.scss'

import sidebarLinks from './sidebarLinks'
// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(VeeValidate)
Vue.use(VueAxios, axios)
locale.use(lang)

// configure router
const router = new VueRouter({
  routes: routes, // short for routes: routes
  linkActiveClass: 'active'
})


router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next(true)
  } else {
    next(true)
  }

  if (to.params['company_id']) {
    let company = to.params['company_id']

    Vue.axios.get('http://localhost:5000/auth/validate/user_company/' + company)
      .then(function (response) {
        alert('allowed to access')
        next(true)
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 400) {
            if (error.response.data.single_company) {
              next('/home/' + error.response.data.company)
            } else {
              next('/select-company')
            }
            console.log(error.response)
          }
        } else {
          next('/404')
        }
      })
  }
})

Vue.router = router


Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x'),
  fetchData: {url: 'http://localhost:5000/auth/user', method: 'GET', enabled: true},
  tokenDefaultName: 'access_token',
  tokenStore: ['localStorage'],
  refreshData: {
    url: 'http://localhost:5000/auth/refresh',
    method: 'GET',
    enabled: true
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
