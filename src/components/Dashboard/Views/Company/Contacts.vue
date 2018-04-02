<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12">
      <div class="card">
        <div class="card-header">
          <h4 class="title">Edit Company Contacts</h4>
        </div>
        <div class="card-content">
          <form>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="phone_number">Phone Number*</label>
                <input type="text" name="phone_number" v-model="company.phone_number"
                       v-validate="modelValidations.phone_number"
                       v-tooltip="{
                    content: 'Phone number must have a format with +43 676 0000000',
                    placement: 'top',
                  }"
                       class="form-control">
                <small class="text-danger" v-show="phone_number.invalid">
                  {{ getError('phone_number') }}
                </small>
              </div>
              <div class="col-md-12 form-group">
                <label for="email_address">General Email*</label>
                <input type="text" name="email_address" v-model="company.email_address"
                       v-validate="modelValidations.email_address"
                       class="form-control">
                <small class="text-danger" v-show="email_address.invalid">
                  {{ getError('email_address') }}
                </small>
              </div>
              <div class="col-md-12 form-group">
                <label for="accounting_email">Finance Email Address</label>
                <input type="text" name="accounting_email" v-model="company.accounting_email"
                       v-validate="modelValidations.accounting_email"
                       v-tooltip="{
                    content: 'If you set this email all financial related informations will go to this email address.',
                    placement: 'top',
                  }"
                       class="form-control">
                <small class="text-danger" v-show="accounting_email.invalid">
                  {{ getError('accounting_email') }}
                </small>
              </div>
              <div class="col-md-12 form-group">
                <label for="technical_email">Technical Email Address</label>
                <input type="text" name="technical_email"
                       v-tooltip="{
                    content: 'If you set this email all information about technical integration will go to this email address',
                    placement: 'top',
                  }"
                       v-model="company.technical_email" v-validate="modelValidations.technical_email"
                       class="form-control">
                <small class="text-danger" v-show="technical_email.invalid">
                  {{ getError('technical_email') }}
                </small>
              </div>
            </div>
            <hr>
            <div class="clearfix"></div>
            <div class="row">
              <div class="form-group col-md-12">
                <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="validate">
                  Save
                </button>
              </div>
            </div>

            <div class="clearfix"></div>
          </form>
        </div>
      </div>
    </div>
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
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        axios.get('/api/company/details/' + routeParams.company_id)
          .then(function (response) {
            self.company = response.data
            self.loading = false
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            axios.$router.push('/server-error')
          })
      },
      validate () {
        this.$validator.validateAll()
          .then((result) => {
            const self = this
            if (result) {
              let data = JSON.stringify({
                phone_number: self.company.phone_number,
                email_address: self.company.email_address,
                accounting_email: self.company.accounting_email,
                technical_email: self.company.technical_email
              })
              self.axios.put('/api/company/contacts/' + self.$route.params.company_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function () {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You updated successfully your company contacts</span>`
                    },
                    icon: 'ti-check',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'success'  // info | success | warning | danger
                  })
                  self.$router.push('/company/details/' + self.$route.params.company_id)
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
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
      this.fetchData()
    },
    data () {
      return {
        languages: '',
        countries: '',
        msg: '',
        modelValidations: {
          phone_number: {
            required: true,
            regex: /^[\s()+-]*([0-9][\s()+-]*){6,20}$/
          },
          email_address: {
            required: true,
            email: true
          },
          accounting_email: {
            required: false,
            email: true
          },
          technical_email: {
            required: false,
            email: true
          }
        },
        loading: false,
        user_permission: this.$auth.user().permission,
        edit_permission: ['admin', 'manager']
      }
    }
  }

</script>
