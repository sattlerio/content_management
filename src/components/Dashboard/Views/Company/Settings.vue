<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12">
      <div class="card">
        <div class="card-header">
          <h4 class="title">Edit Company Settings</h4>
        </div>
        <div class="card-content">
          <form>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="name">Company Name</label>
                <input type="text" name="name" v-model="company.name" v-validate="modelValidations.name"
                       class="form-control">
                <small class="text-danger" v-show="name.invalid">
                  {{ getError('name') }}
                </small>
              </div>
              <div class="col-md-12 form-group">
                <label for="vat">VAT</label>
                <input type="text" name="vat" v-model="company.vat" v-validate="modelValidations.vat"
                       class="form-control">
                <small class="text-danger" v-show="vat.invalid">
                  {{ getError('vat') }}
                </small>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="address">Company Address</label>
                <input type="text" name="address" v-model="company.address" v-validate="modelValidations.address"
                       class="form-control">
                <small class="text-danger" v-show="address.invalid">
                  {{ getError('address') }}
                </small>
              </div>
              <div class="col-md-8 form-group">
                <label for="city">City</label>
                <input type="text" name="city" v-model="company.city" v-validate="modelValidations.city"
                       class="form-control">
                <small class="text-danger" v-show="city.invalid">
                  {{ getError('city') }}
                </small>
              </div>
              <div class="col-md-4 form-group">
                <label for="zip">ZIP</label>
                <input type="text" name="zip" v-model="company.zip" v-validate="modelValidations.zip"
                       class="form-control">
                <small class="text-danger" v-show="zip.invalid">
                  {{ getError('zip') }}
                </small>
              </div>
              <div class="col-md-12 form-group">
                <label for="country">Country</label>
                <select name="country" class="form-control" v-model="company.country_id" v-validate="modelValidations.country">
                  <option v-for="country in countries" v-bind:value="country.id">{{ country.name }}</option>
                </select>
                <small class="text-danger" v-show="country.invalid">
                  {{ getError('country') }}
                </small>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-md-12 form-group">

                <label for="language">Language </label>
                <select
                  v-tooltip="{
                    content: 'The language of your company represents the default language and can be changed any time',
                    placement: 'bottom',
                  }"
                  name="language" class="form-control" v-model="company.language_id" v-validate="modelValidations.language">
                  <option v-for="language in languages" v-bind:value="language.id">{{ language.name }}</option>
                </select>
                <small class="text-danger" v-show="language.invalid">
                  {{ getError('language') }}
                </small>
              </div>
            </div>
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
      ...mapFields(['name', 'address', 'city', 'zip', 'country', 'language', 'vat'])
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
        axios.get('/resources/geo/countries')
          .then(function (response) {
            self.countries = response.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
        axios.get('/resources/geo/languages')
          .then(function (response) {
            self.languages = response.data
          })
          .catch(function (error) {
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
                name: self.company.name,
                vat: self.company.vat,
                address: self.company.address,
                zip: self.company.zip,
                city: self.company.city,
                country_id: self.company.country_id,
                language_id: self.company.language_id
              })
              self.axios.put('/api/company/details/' + self.$route.params.company_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function () {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You updated successfully your company</span>`
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
        msg: 'ddsadada',
        modelValidations: {
          name: {
            required: true,
            min: 3
          },
          vat: {},
          address: {
            required: true
          },
          city: {
            required: true
          },
          zip: {
            required: true
          },
          country: {
            required: true
          },
          language: {
            required: true
          }
        },
        loading: false,
        user_permission: this.$auth.user().permission,
        edit_permission: ['admin', 'manager']
      }
    }
  }

</script>
