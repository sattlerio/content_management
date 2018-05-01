<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Shipping Rules', params: { company_id: $route.params.company_id }}">Back
          </router-link>
          <h4 class="title pull-left">Shipping Rule: {{ shippingRule.name }}</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <form>
            <div class="row">
              <div class="col-sm-12 form-group">
                <label for="name">Name
                </label>
                <input type="text" name="name" v-model="shippingRule.name" :disabled="true"
                       class="form-control"
                >
              </div>
              <div class="col-sm-12 form-group">
                <label>Manual Shipping</label>
                <p class="form-control disabled" v-if="shippingRule.self_shipping">Products with this shipping rule must be shipped manually</p>
                <p class="form-control disabled" v-else="!shippingRule.self_shipping">Products with this shipping rule will be send by the system</p>
              </div>
              <div class="col-sm-12">
                <label for="price">Shipping costs
                </label>
                <div class="input-group" v-show="shippingRule.default_price">
                  <span class="input-group-addon">{{ currencyId }}</span>
                  <input type="number" name="price" step="0.01" min="0.00" v-model="shippingRule.default_price" disabled
                         class="form-control">
                </div>
                <p class="form-control disabled" v-show="!shippingRule.default_price">This shipping rule is for free</p>
              </div>
              <div class="col-sm-12">
                <label>Available Countries
                </label>
                <p class="form-control disabled" v-if="!shippingRule.countries">The shipping rule is available worldwide</p>
                <ul class="list" v-else="shippingRule.countries">
                  <li v-for="country in availCountries"  v-if="countryList.includes(country.id)">{{ country.name }}</li>
                </ul>
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

  export default {
    components: {
      Spinner
    },
    computed: {
    },
    methods: {
      fetchData () {
        const self = this
        axios.get('/api/shipping/fetch/' + self.$route.params.company_id + '/' + self.$route.params.shipping_rule_id)
          .then(function (response) {
            self.shippingRule = response.data.body

            if (self.shippingRule.countries) {
              for (let country of self.shippingRule.countries) {
                self.countryList.push(country.country_id)
              }
            }

            self.loading = false
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
        axios.get('/api/company/details/' + self.$route.params.company_id)
          .then(function (response) {
            self.currencyId = response.data.currency_id
            axios.get('/resources/geo/countries')
              .then(function (response) {
                self.availCountries = response.data
                self.loading = false
              })
              .catch(function (error) {
                self.loading = false
                console.log(error)
                self.$router.push('/server-error')
              })
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
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
        shippingRule: {},
        availCountries: [],
        currencyId: '',
        loading: true,
        countryList: []
      }
    }
  }
</script>
