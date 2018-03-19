<template>
  <div class="row">
    <div class="col-md-12">
      <form class="form-horizontal">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Change your password</h4>
            <p class="category">If you change your password you will be logged out and you have to login again</p>
          </div>
          <div class="card-content">
            <div class="form-group">
              <label class="col-md-2 control-label">Old Password</label>
              <div class="col-md-10">
                <input type="password" name="oldpassword" v-model="model.oldpassword" v-validate="modelValidations.oldpassword"
                       class="form-control">
                <small class="text-danger" v-show="oldpassword.invalid">
                  {{ getError('oldpassword') }}
                </small>
              </div>
            </div>
            <div class="form-group">
              <label class="col-md-2 control-label">New Password</label>
              <div class="col-md-10">
                <input type="password" name="new_password" v-model="model.new_password" v-validate="modelValidations.new_password"
                       class="form-control">
                <small class="text-danger" v-show="new_password.invalid">
                  {{ getError('new_password') }}
                </small>
              </div>
            </div>
            <div class="form-group">
              <label class="col-md-2 control-label">Confirm new password</label>
              <div class="col-md-10">
                <input type="password" name="new_password_confirm" v-model="model.new_password_confirm" v-validate="modelValidations.new_password_confirm"
                       class="form-control">
                <small class="text-danger" v-show="new_password_confirm.invalid">
                  {{ getError('new_password_confirm') }}
                </small>
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <div class="col-sm-12">
              <small class="text-danger" v-show="model.error_msg">
                {{ model.error_msg }}
              </small>
            </div>
            <button type="submit" @click.prevent="validate" class="btn btn-fill btn-info btn-wd">Submit</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'

  export default {
    computed: {
      ...mapFields(['oldpassword', 'new_password', 'new_password_confirm'])
    },
    data: function () {
      return {
        model: {
          oldpassword: '',
          new_password: '',
          new_password_confirm: '',
          error_msg: ''
        },
        modelValidations: {
          oldpassword: {
            required: true
          },
          new_password: {
            required: true,
            min: 5
          },
          new_password_confirm: {
            required: true,
            min: 5
          }
        }
      }
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        this.$validator.validateAll()
          .then((result) => {
            const self = this
            if (result) {
              if (self.model.new_password === self.model.new_password_confirm) {
                let data = JSON.stringify({
                  old_password: self.model.oldpassword,
                  password: self.model.new_password
                })
                self.axios.put('http://localhost:5000/auth/change-password', data, {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
                  .then(function () {
                    self.$notify({
                      component: {
                        template: `<span><b> Success </b> - You changed your password. Please confirm your identity and login again.</span>`
                      },
                      icon: 'ti-check',
                      horizontalAlign: 'right', // right | center | left
                      verticalAlign: 'top', // top | bottom
                      type: 'success'  // info | success | warning | danger
                    })
                    self.$router.push('/logout')
                  })
                  .catch(function (error) {
                    console.log(error)
                    if (error.response.status === 500) {
                      self.model.error_msg = 'Your old password is wrong!'
                    } else {
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
                    }
                  })
              } else {
                self.model.error_msg = 'The new and the confirmation password are not matching'
              }
            }
          })
      }
    }
  }

</script>
