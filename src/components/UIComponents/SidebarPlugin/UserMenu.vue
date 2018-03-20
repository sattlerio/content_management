<template>
  <div class="user">
    <div class="photo">
      <img src="static/img/faces/face-2.jpg"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" @click="toggleMenu" href="javascript:void(0)">
           <span>
             {{ this.$auth.user().firstname }} {{ this.$auth.user().lastname }}
             <b class="caret"></b>
          </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <el-collapse-transition>
          <ul class="nav" v-show="!isClosed">
            <li>
              <router-link to="/user/profile">
                <span class="sidebar-mini"><i class="ti-user"></i></span>
                <span class="sidebar-normal">My Profile</span>
              </router-link>
            </li>
            <li>
              <router-link to="/user/password">
                <span class="sidebar-mini"><i class="ti-key"></i></span>
                <span class="sidebar-normal">Password</span>
              </router-link>
            </li>
            <li>
              <router-link to="/logout">
                <span class="sidebar-mini"><i class="ti-power-off"></i></span>
                <span class="sidebar-normal">Logout</span>
              </router-link>
            </li>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
  export default {
    components: {
      [CollapseTransition.name]: CollapseTransition
    },
    data () {
      return {
        isClosed: true
      }
    },
    methods: {
      toggleMenu () {
        this.isClosed = !this.isClosed
      }
    }
  }
</script>
<style>
  .collapsed {
    transition: opacity 1s;
  }
</style>
