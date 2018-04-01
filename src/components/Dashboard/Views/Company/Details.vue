<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else-if="company && company_country && company_currency && company_language">
    {{ checkUserPermission() }}
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
      </div>
    </div>
    <div class="col-lg-8 col-md-7" v-if="company && company_country">
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
              <h4 class="title">Settings</h4>
            </div>
            <div class="col-md-12">
              <fg-input type="text"
                        label="Currency"
                        v-bind:value="company_currency.data.name"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="col-md-12">
              <fg-input type="text"
                        label="Language"
                        v-bind:value="company_language.language.name"
                        :disabled="true"
              >
              </fg-input>
            </div>
            <div class="col-md-12 text-right" v-if="checkUserPermission()">
              <router-link class="btn btn-default ":to="{ name: 'Edit Company Settings', params: { company_id: company_id }}">Edit Settings</router-link>
            </div>
            <div class="clearfix"></div>
            <div class="card-header">
              <h4 class="title">Contact</h4>
            </div>
            <div class="col-md-12 ">
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
            <div class="col-md-12" v-if="checkUserPermission()">
              <a href="" class="btn btn-default right">Edit Contacts</a>
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
            self.fetchCountryInformation(response.data.country_id)
            self.fetchLanguageInformation(response.data.language_id)
            self.fetchCurrencyInformation(response.data.currency_id)
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
        axios.get('/resources/geo/country/' + countryId)
          .then(function (response) {
            self.company_country = response.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      fetchCurrencyInformation: function (currencyId) {
        const self = this
        axios.get('/resources/money/currency/' + currencyId)
          .then(function (response) {
            self.company_currency = response.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      fetchLanguageInformation: function (languageId) {
        const self = this
        axios.get('/resources/geo/language/' + languageId)
          .then(function (response) {
            self.company_language = response.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      checkUserPermission: function () {
        const self = this
        if (self.edit_permission.includes(self.$auth.user().permission)) {
          return true
        } else {
          return false
        }
      }
    },
    created () {
      this.company_id = this.$route.params.company_id
      this.loadUserData()
    },
    data () {
      return {
        loading: true,
        company_id: null,
        company_logo: 'static/img/default-company-logo.jpg',
        company: null,
        company_country: null,
        company_language: null,
        company_currency: null,
        edit_permission: ['admin', 'manager']
      }
    }
  }

</script>
