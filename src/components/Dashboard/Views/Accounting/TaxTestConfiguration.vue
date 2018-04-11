<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'View Tax', params: { tax_id: $route.params.tax_id,
                       company_id: $route.params.company_id }}">Back
          </router-link>
          <h4 class="title pull-left">Test the configuration for the tax {{ tax.name }}</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <div class="row">
            <div class="col-md-12">
              <form class="form-group">
                <h4>
                  I am a
                  <select name="tax_option" class="form-control" v-validate="modelValidations.tax_option" v-model="config_test.tax_option">
                    <option disabled selected value=""> </option>
                    <option value="b2c">Individual Customer (B2C)</option>country
                    <option value="b2b">Company with a VAT (B2B)</option>
                  </select> and I come from
                  <select
                    name="country" class="form-control" v-model="config_test.country" v-validate="modelValidations.country">
                    <option disabled selected value=""></option>
                    <option v-for="country in countries" v-bind:value="country.id">{{ country.name }}</option>
                  </select>
                </h4>
                <small class="text-danger" v-show="country.invalid || tax_option.invalid">
                  {{ getError('country') }} <br>
                  {{ getError('tax_option') }}
                </small>
                <div v-show="tax_rate">
                  <hr>
                  <h4>With your settings you would get a tax rate of <u>{{ tax_rate}}%</u> from the Rule <u>{{ tax_name }}</u>.</h4>
                </div>
                <hr>
                  <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="validate">
                    Test Configuration
                  </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import {mapFields} from 'vee-validate'

  export default {
    components: {
      Spinner
    },
    computed: {
      ...mapFields(['tax_option', 'country'])
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
      this.company_id = this.$route.params.company_id
      this.tax_id = this.$route.params.tax_id
      this.fetchData()
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
              let data = JSON.stringify({
                tax_option: self.config_test.tax_option,
                country: self.config_test.country
              })
              self.axios.post('/api/accounting/tax/test/' + self.$route.params.tax_id + '/' + self.$route.params.company_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function (response) {
                  self.tax_rate = response.data.tax_rate
                  if (response.data.tax) {
                    self.tax_name = response.data.tax
                  }
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
      },
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        self.axios.get('/resources/geo/countries')
          .then(function (response) {
            self.countries = response.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
        self.axios.get('/api/accounting/tax/rules/' + routeParams.tax_id + '/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tax.name = response.data.data.name
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      }
    },
    data () {
      return {
        loading: false,
        countries: [],
        tax: {
          name: ''
        },
        modelValidations: {
          tax_option: {
            required: true
          },
          country: {
            required: true
          }
        },
        config_test: {
          tax_option: '',
          country: ''
        },
        tax_rate: '',
        tax_name: 'Tax Default Rate (because no other rule applied)'
      }
    }
  }
</script>
