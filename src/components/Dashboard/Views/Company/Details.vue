<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-4 col-md-5">
      <div class="card card-user">
        <div class="clearfix"></div>
        <div class="card-content">
          <div class="author">
            <img class="avatar border-white" v-bind:src="company_logo" width="100px" v-bind:alt="company.name">
            <h4 class="title">{{ company.name }}
              <br>
              <small>{{ company.company_uuid }}</small>
            </h4>
          </div>
          <p class="description text-center">
            {{ company.address}}
            <br> {{ company.zip}} - {{ company.city }}
            <br> {{ company_country.country.name }}
          </p>
        </div>
        <hr>
        <div class="text-center">
          <div class="row">
            <div v-for="(info,index) in details" :class="getClasses(index)">
              <h5>{{info.title}}
                <br>
                <small>{{info.subTitle}}</small>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-8 col-md-7">
      <div class="card">
        <div class="card-header">
          <h4 class="title">Details</h4>
        </div>
        <div class="card-content">
          <div class="row">
            <div class="col-md-12">
              <fg-input type="text"
                        label="Company ID"
                        v-bind:value="company.company_uuid"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="col-md-12" v-show="company.vat">
              <fg-input type="text"
                        label="VAT"
                        v-bind:value="company.vat"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="card-header">
              <h4 class="title">Financial Settings</h4>
            </div>
            <div class="col-md-12" v-show="company.vat">
              <fg-input type="text"
                        label="VAT"
                        v-bind:value="company.vat"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="card-header">
              <h4 class="title">Contact</h4>
            </div>
            <div class="col-md-12">
              <fg-input type="text"
                        label="Phone"
                        v-bind:value="company.phone_number"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="col-md-12">
              <fg-input type="text"
                        label="General Email"
                        v-bind:value="company.email_address"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="col-md-12" v-show="company.accounting_email">
              <fg-input type="text"
                        label="Finance Contact"
                        v-bind:value="company.accounting_email"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="col-md-12" v-show="company.technical_email">
              <fg-input type="text"
                        label="Technical Contact"
                        v-bind:value="company.technical_email"
                        :disabled="true"
              >
              </fg-input>
            </div>
          </div>
          <div class="clearfix"></div>
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
    methods: {
      loadUserData: function () {
        const self = this
        let routeParams = self.$route.params
        axios.get('/api/company/details/' + routeParams.company_id)
          .then(function (response) {
            self.company = response.data
            self.company_country = self.fetchCountryInformation(self.company.country_id)
            self.loading = false
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      fetchCountryInformation: function (countryId) {
        const self = this
        let routeParams = self.$route.params
        axios.get('/resources/geo/country/' + countryId)
          .then(function (response) {
            self.company_country = response.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
      }
    },
    mounted () {
      this.loadUserData()
    },
    data () {
      return {
        loading: true,
        company_logo: 'static/img/default-company-logo.jpg',
        company: null,
        company_country: null
      }
    }
  }

</script>
