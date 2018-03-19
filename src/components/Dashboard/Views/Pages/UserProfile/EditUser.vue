<template>
  <div class="row">
    <spinner v-show="loading"></spinner>
    <div class="col-md-12" v-show="!loading">
      <form class="form-horizontal">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Hello {{ user.firstname}}!</h4>
            <p class="category">Manage your account</p>
          </div>
          <div class="card-content">
            <div class="form-group">
              <label class="col-md-2 control-label">Firstname</label>
              <div class="col-md-10">
                <input type="text" name="firstname" v-model="model.firstname" v-validate="modelValidations.firstname"
                       class="form-control">
                <small class="text-danger" v-show="firstname.invalid">
                  {{ getError('firstname') }}
                </small>
              </div>
            </div>
            <div class="form-group">
              <label class="col-md-2 control-label">Lastname</label>
              <div class="col-md-10">
                <input type="text" name="lastname" v-model="model.lastname" v-validate="modelValidations.lastname"
                       class="form-control">
                <small class="text-danger" v-show="lastname.invalid">
                  {{ getError('lastname') }}
                </small>
              </div>
            </div>
            <div class="form-group">
              <label class="col-md-2 control-label">Email</label>
              <div class="col-md-10">
                <input type="text" name="email" v-model="model.email" v-validate="modelValidations.email"
                       class="form-control">
                <small class="text-danger" v-show="email.invalid">
                  {{ getError('email') }}
                </small>
              </div>
            </div>
          </div>
      <div class="card-footer text-center">
        <div class="col-sm-12" v-show="">
          <small class="text-danger">
          </small>
        </div>
        <button type="submit" @click.prevent="validate" class="btn btn-fill btn-info btn-wd">Submit
        </button>
      </div>
    </div>
      </form>
  </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'
  import Spinner from 'src/components/UIComponents/Spinner.vue'

  export default {
    components: {
      Spinner
    },
    computed: {
      ...mapFields(['email', 'firstname', 'lastname'])
    },
    data: function () {
      return {
        loading: true,
        user: {},
        model: {
          firstname: '',
          lastname: '',
          email: ''
        },
        modelValidations: {
          email: {
            required: true,
            email: true
          },
          firstname: {
            required: true,
            min: 3
          },
          lastname: {
            required: true,
            min: 3
          }
        }
      }
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      loadUserData: function () {
        const self = this
        self.axios.get('http://localhost:5000/auth/user')
          .then(function (response) {
            self.loading = false
            self.user = response.data.data

            self.model.firstname = self.user.firstname
            self.model.lastname = self.user.lastname
            self.model.email = self.user.email
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      validate () {
        this.$validator.validateAll()
          .then((result) => {
            const self = this
            if (result) {
              let data = JSON.stringify({
                firstname: self.model.firstname,
                lastname: self.model.lastname,
                email: self.model.email
              })
              self.axios.post('http://localhost:5000/auth/user', data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function () {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You updated your user</span>`
                    },
                    icon: 'ti-check',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'success'  // info | success | warning | danger
                  })
                  self.$router.push('/user/profile')
                })
                .catch(function (error) {
                  console.log(error)
                  self.$notify({
                    component: {
                      template: `<span><b> Error! </b> - A unexpected error happened, please try it later again</span>`
                    },
                    icon: 'ti-alert',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'danger'  // info | success | warning | danger
                  })
                })
            }
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
