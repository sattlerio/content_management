<template>
  <div class="row">
    <spinner v-show="loading"></spinner>
    <div class="col-md-12" v-show="!loading">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Hello {{ user.firstname}}!</h4>
          <p class="category">Manage your account</p>
        </div>
        <form class="form-horizontal">
          <div class="card-content">
            <div class="form-group">
              <label class="col-md-2 control-label">Firstname</label>
              <div class="col-md-10">
                <input type="text" v-model="user.firstname" disabled class="form-control">
              </div>
            </div>
            <div class="form-group">
              <label class="col-md-2 control-label">Lastname</label>
              <div class="col-md-10">
                <input type="text" v-model="user.lastname" disabled class="form-control">
              </div>
            </div>
            <div class="form-group">
              <label class="col-md-2 control-label">Email</label>
              <div class="col-md-10">
                <input type="text" v-model="user.email" disabled class="form-control">
              </div>
            </div>
          </div>
        </form>
        <div class="card-footer">
          <router-link to="/user/edit" class="btn btn-default">Edit your profile</router-link>
          <button class="btn btn-default">Change Password</button>

        </div>

      </div>
    </div>
    <div class="col-md-12" v-show="!loading">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">You can manage the following companies</h4>
          <p class="category">Manageable accounts: {{ user.companies.length }}</p>
        </div>
        <div class="card-content">
          <ul class="list-group list-group-flush">
            <li class="list-group-item hover-effect" v-for="company in user.companies"
                v-on:click="accessCompany(company.company_uuid)">{{ company.company_name }} ({{ company.company_uuid }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import Spinner from 'src/components/UIComponents/Spinner.vue'

  export default {
    components: {
      Spinner
    },
    data: function () {
      return {
        loading: true,
        user: {}
      }
    },
    methods: {
      loadUserData: function () {
        const self = this
        self.axios.get('/auth/user')
          .then(function (response) {
            self.loading = false
            self.user = response.data.data
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      }
    },
    mounted () {
      this.loadUserData()
    }
  }

</script>
<style>

</style>
