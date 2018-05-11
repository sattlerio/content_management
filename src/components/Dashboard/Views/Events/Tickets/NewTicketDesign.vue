<template>
  <spinner v-if="loading"></spinner>
  <div v-else="!loading">
    <div class="row">
      <div class="col-md-12">
        <event-menu></event-menu>
      </div>
    </div>
    <div class="row">
      <form-wizard shape="tab"
                   @on-complete="wizardComplete"
                   title="New Ticket Design"
                   subtitle="Create a new Design for Print@Home Tickets"
                   back-button-text="Next"
                   next-button-text="Back"
                   finish-button-text="Create Ticket Design"
                   error-color="#EB5E28"
                   color="#66615B">


        <tab-content title="Details"
                     :before-change="validateFirstStep"
                     icon="ti-pencil">
          <first-step ref="firstStep"></first-step>
        </tab-content>

        <tab-content title="Last step"
                     icon="ti-check">
          <h2 class="text-center text-space">Yuhuuu!
            <br>
            <small>Click on "<b>Finish</b>" to join our community</small>
          </h2>
        </tab-content>

        <button slot="prev" class="btn btn-default btn-fill btn-wd btn-back">Back</button>
        <button slot="next" class="btn btn-info btn-fill btn-wd btn-next">Next</button>
        <button slot="finish" class="btn btn-info btn-fill btn-wd">Finish</button>
      </form-wizard>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import EventMenu from 'src/components/Dashboard/Views/Events/EventMenu/topMenu.vue'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  import FirstStep from './CreateDesignWizard/FirstStep'
  export default {
    components: {
      Spinner,
      EventMenu,
      FormWizard,
      TabContent,
      FirstStep
    },
    computed: {},
    methods: {
      validateFirstStep () {
        return this.$refs.firstStep.validate()
      },
      wizardComplete () {
        const self = this
        self.wizardModel = {
          ...self.$refs.firstStep.model,
          ...self.$refs.secondStep.model,
          ...self.$refs.thirdStep.model
        }
        var timezone = moment.tz.guess()
        var formattedStartDate = moment.tz(self.wizardModel.start_date, timezone)
        var formattedEndDate = moment.tz(self.wizardModel.end_date, timezone)
        let data = JSON.stringify({
          default_currency_id: self.wizardModel.default_currency_id,
          default_language_id: self.wizardModel.default_language_id,
          end_date: self.wizardModel.end_date, // timezone
          language_ids: self.wizardModel.language_ids,
          location: self.wizardModel.location,
          multidayevent: self.wizardModel.multidayevent,
          multidayevent_dates: self.wizardModel.multidayevent_dates,
          multilanguage: self.wizardModel.multilanguage,
          name: self.$refs.firstStep.model.name,
          venue: self.$refs.firstStep.model.revenue,
          start_date: self.wizardModel.start_date, // timezone
          company_id: self.$route.params.company_id
        })
        self.axios.post('/api/events/event/create', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(function (response) {
            self.$notify({
              component: {
                template: `<span><b> Success </b> - You successfully created a new event</span>`
              },
              icon: 'ti-check',
              horizontalAlign: 'right', // right | center | left
              verticalAlign: 'top', // top | bottom
              type: 'success'  // info | success | warning | danger
            })
            self.$router.push('/events/overview/' + response.data.tax_id + '/' + self.$route.params.company_id)
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
      },
      checkUserPermission: function () {
        const self = this
        if (self.edit_permission.includes(self.$auth.user().permission)) {
          return true
        } else {
          return false
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
        wizardModel: {},
        company_id: null,
        loading: false,
        country: '',
        currency: '',
        languages: [],
        edit_permission: ['admin', 'manager', 'product_manager', 'accountant']
      }
    },
    mounted () {
    }
  }
</script>
<style>
  .vue-form-wizard .wizard-icon-circle.tab_shape {
    background-color: #9A9A9A !important;
    color: white;
  }
</style>

