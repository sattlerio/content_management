<template>
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
      {{ this.$auth.user().permission }}
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

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      UserMenu,
      MobileMenu
    },
    methods: {
      getUserPermission () {
        const self = this
        let routeParams = self.$route.params
        if (routeParams.company_id) {
          alert('dash')
          self.axios.get('http://localhost:5000/auth/user/permission/' + routeParams.company_id)
            .then(function (response) {
              let permission = response.data.permission
              self.$auth.user().permission = permission
              console.log(self.$auth.user())
            })
            .catch(function (error) {
              console.log(error.data)
              self.router.push('/server-error')
            })
        } else {
          self.router.push('/')
        }
      },
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },
    mounted () {
      this.getUserPermission()
    }
  }

</script>
