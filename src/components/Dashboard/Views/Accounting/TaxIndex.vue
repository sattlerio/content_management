<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import axios from 'axios'
  import {mapFields} from 'vee-validate'


  export default {
    components: {
      Spinner
    },
    computed: {
      ...mapFields(['phone_number', 'email_address', 'accounting_email', 'technical_email'])
    },
    methods: {},
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
    },
    data () {
      return {
        loading: false
      }
    }
  }
</script>
