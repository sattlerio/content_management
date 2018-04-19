<template>
  <spinner v-if="loading"></spinner>
  <div v-else="!loading">
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <router-link class="pull-right btn btn-default"
                         :to="{ name: 'Event details', params: { event_id: $route.params.event_id, company_id: company_id }}">Back
            </router-link>
            <h4 class="title pull-left">Edit Event Details</h4>
            <div class="clearfix"></div>
          </div>
          <div class="card-content">
            <form>
              <h5 class="text-center">Update Event Details - {{ event.event_name }}</h5>
              <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="form-group">
                    <label class="control-label" >
                      Support Multiple Languages
                      <i class="fa fa-question help help_text"
                         v-tooltip="{
                         content: 'If you select multiple languages, you can support translations for your visitors.',
                    }"
                      ></i>:
                    </label>
                    <p-switch v-model="event.multi_language" type="primary" on-text="YES" off-text="NO"></p-switch>
                  </div>
                </div>
                <div class="col-md-5 col-md-offset-1" v-if="event.multi_language">
                  <div class="form-group">
                    <label class="control-label" >
                      Default Language
                      <i class="fa fa-question help help_text"
                         v-tooltip="{
                         content: 'If there is no other translation we will use the default language.',
                    }"
                      ></i>:
                    </label>
                    <br>
                    <el-select class="select-default"
                               filterable
                               size="large"
                               name="default_language_id"
                               v-validate="modelValidations.default_language_id"
                               placeholder="Default Language"
                               v-model="event.default_language_id">
                      <el-option v-for="option in languages"
                                 class="select-default"
                                 :value="option.id"
                                 :label="option.name"
                                 :key="option.name">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-md-5" v-if="event.multi_language">
                  <div class="form-group">
                    <label class="control-label" >
                      Support Multiple Languages
                      <i class="fa fa-question help help_text"
                         v-tooltip="{
                         content: 'If you select multiple languages, you can support translations for your visitors.',
               }"
                      ></i>
                    </label>
                    <br>
                    <el-select multiple class="select-default"
                               filterable clearable
                               size="large"
                               name="languages"
                               v-model="event_languages"
                               placeholder="Languages">
                      <el-option v-for="option in languages"
                                 class="select-default"
                                 :value="option.id"
                                 :label="option.name"
                                 :key="option.name">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="clearfix"></div>
                <hr>
                <div class="col-md-5 el-col-md-offset-2">
                  <div class="form-group">
                    <label class="control-label">
                      Default Currency <i class="fa fa-question"
                                          v-tooltip="{
                         content: 'The default currency cant be changed',
                    }"
                    ></i>
                    </label>
                    <br>
                    <input type="text" disabled :value="event.default_currency_id" class="form-control">
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="form-group">
                    <label class="control-label" >
                      Other currencies
                    </label>
                    <br>
                    <el-select multiple class="select-default"
                               filterable
                               size="large"
                               name="default_currency_id"
                               placeholder="Default Currency"
                               v-model="event_currencies">
                      <el-option v-for="option in currencies" v-if="option.currency_id !== event.default_currency_id"
                                 class="select-default"
                                 :value="option.currency_id"
                                 :label="option.name"
                                 :key="option.name">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <hr>
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
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import PSwitch from 'src/components/UIComponents/Switch.vue'
  import {Select, Option} from 'element-ui'

  export default {
    components: {
      Spinner,
      PSwitch,
      [Option.name]: Option,
      [Select.name]: Select
    },
    computed: {},
    methods: {
      checkUserPermission: function () {
        const self = this
        if (self.edit_permission.includes(self.$auth.user().permission)) {
          return true
        } else {
          self.$router.push('/404')
        }
      },
      fetchData: function (callback) {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/events/event/get/' + routeParams.event_id + '/' + routeParams.company_id)
          .then(function (response) {
            self.event = response.data
            self.loading = true
            for (var eventLang in self.event.event_languages) {
              var langCode = self.event.event_languages[eventLang].language_id
              self.event_languages.push(langCode)
            }
            for (var eventCurr in self.event.currencies) {
              var currencyCode = self.event.currencies[eventCurr].currency_id
              self.event_currencies.push(currencyCode)
            }
            self.axios.get('/resources/geo/languages')
              .then(function (response) {
                self.languages = response.data
                self.loading = false
              })
              .catch(function (error) {
                console.log(error)
                self.$router.push('/server-error')
              })
            self.loading = true
            self.axios.get('/resources/geo/country/' + self.event.country_id)
              .then(function (response) {
                self.country = response.data
                self.loading = false
              })
              .catch(function (error) {
                console.log(error)
                self.$router.push('/server-error')
              })
            self.axios.get('/resources/money/currency/currencies')
              .then(function (response) {
                self.currencies = response.data.data
              })
              .catch(function (error) {
                console.log(error)
                self.$router.push('/server-error')
              })
            self.axios.get('/api/events/permission/' + routeParams.event_id + '/' + routeParams.company_id)
              .then(function (response) {
                if (!response.data.access) {
                  self.$router.push('/404')
                }
                self.loading = false
              })
              .catch(function (error) {
                console.log(error)
                self.$router.push('/server-error')
              })
            return response.data
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
              alert('fff')
              let data = JSON.stringify({
                multi_language: self.event.multi_language,
                default_language_id: self.event.default_language_id,
                event_languages: self.event_languages,
                event_currencies: self.event_currencies
              })
              self.axios.put('/api/events/event/edit/detail/' + self.$route.params.event_id + '/' + self.$route.params.company_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function () {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You successfully edited the event details.</span>`
                    },
                    icon: 'ti-check',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'success'  // info | success | warning | danger
                  })
                  self.$router.push('/events/detail/' + self.$route.params.event_id + '/' + self.$route.params.company_id)
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
      this.company_id = this.$route.params.company_id
      this.fetchData()
    },
    data () {
      return {
        event: {},
        company_id: null,
        loading: false,
        country: '',
        event_languages: [],
        currencies: [],
        currency: '',
        languages: [],
        event_currencies: [],
        edit_permission: ['admin', 'manager', 'product_manager'],
        modelValidations: {
          default_language_id: {
            required: true
          },
          default_currency_id: {
            required: true
          }
        }
      }
    }
  }
</script>
