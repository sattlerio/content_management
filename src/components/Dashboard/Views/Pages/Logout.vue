<template>
  <router-view></router-view>
</template>
<script>

  export default {
    methods: {
      logout: function () {
        const self = this
        self.$auth.logout()
        self.$router.push('/login')
      }
    },
    mounted () {
      this.logout()
    }
  }
</script>
<style>
</style>
