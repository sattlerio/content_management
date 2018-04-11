<template v-if="$auth.ready()">
  <div class="wrapper">
    <side-bar type="sidebar" :sidebar-links="$sidebar.sidebarLinks">
      <user-menu></user-menu>
      <form class="navbar-form navbar-left navbar-search-form navbar-search-form-mobile" role="search">
        <div class="input-group">
          <span class="input-group-addon"><i class="fa fa-search"></i></span>
          <input type="text" value="" class="form-control" placeholder="Search...">
        </div>
      </form>
      <mobile-menu></mobile-menu>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import UserMenu from 'src/components/UIComponents/SidebarPlugin/UserMenu.vue'
  import MobileMenu from 'src/components/UIComponents/SidebarPlugin/MobileMenu.vue'
  import router from 'vue-router'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      UserMenu,
      MobileMenu
    },
    methods: {
      checkPermissionOnRoute () {
        if (this.$route.meta.permission) {
          if (!this.$auth.user().permission || !this.$route.meta.permission.includes(this.$auth.user().permission)) {
            this.$router.replace('/server-error')
          }
        }
      },
      getUserPermission () {
        const self = this
        let routeParams = this.$router.currentRoute.params
        if (routeParams.company_id) {
          self.axios.get('/auth/user/permission/' + routeParams.company_id)
            .then(function (response) {
              let permission = response.data.permission
              self.$auth.user().permission = permission
              self.checkPermissionOnRoute()
            })
            .catch(function (error) {
              console.log(error.data)
              this.$router.push('/server-error')
            })
        } else {
          this.$router.push('/')
        }
      },
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },
    created () {
      this.getUserPermission()
      if (this.$auth.user().permission) {
        this.checkPermissionOnRoute()
      }
    },
    watch: {
      '$route': 'checkPermissionOnRoute'
    }
  }

</script>
