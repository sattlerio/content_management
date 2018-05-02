<template>
  <div class="card">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-absolute">
          <ul class="nav navbar-nav navbar-left">
            <li class="open" v-bind:class="$route.name == 'Event details' ? 'active isActive is-active active-class' : ''">
              <router-link to="/admin/stats" class="dropdown-toggle btn-magnify" data-toggle="dropdown">
                <i class="ti-home"></i>
                <p>Overview</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
  export default{
    name: 'drop-down',
    props: {
    },
    computed: {
    },
    methods: {
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      minimizeSidebar () {
        this.$sidebar.toggleMinimize()
      }
    },
    data () {
      return {
      }
    }
  }
</script>
