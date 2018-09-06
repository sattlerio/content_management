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
import VTooltip from 'v-tooltip'

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
Vue.use(VTooltip)
Vue.axios.defaults.baseURL = 'http://localhost:5000'

locale.use(lang)

// configure router
const router = new VueRouter({
  routes: routes, // short for routes: routes
  linkActiveClass: 'active'
})

Vue.router = router


Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x'),
  fetchData: {url: '/auth/user', method: 'GET', enabled: true},
  tokenDefaultName: 'access_token',
  tokenStore: ['localStorage'],
  refreshData: {
    url: '/auth/refresh',
    method: 'GET',
    enabled: true
  }
})

Vue.mixin({
  methods: {
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
