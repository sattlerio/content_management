<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-sm-12">
      <div class="card card-wizard">
        <div class="card-header">
          <router-link class="pull-left btn btn-default"
                       :to="{ name: 'View all Events', params: { company_id: $route.params.company_id }}">Back
          </router-link>
          <div class="clearfix"></div>
        </div>
        <form-wizard shape="tab"
                     @on-complete="wizardComplete"
                     title="Create a new Event"
                     subtitle=""
                     back-button-text="Next"
                     next-button-text="Back"
                     finish-button-text="Create Event"
                     error-color="#EB5E28"
                     color="#66615B">


          <tab-content title="Details"
                       :before-change="validateFirstStep"
                       icon="ti-pencil">
            <first-step ref="firstStep"></first-step>
          </tab-content>

          <tab-content title="Date"
                       :before-change="validateSecondStep"
                       icon="ti-calendar">
            <second-step ref="secondStep"></second-step>
          </tab-content>

          <tab-content title="Settings"
                       :before-change="validateThirdStep"
                       icon="ti-settings">
            <third-step ref="thirdStep"></third-step>
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
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import axios from 'axios'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  import FirstStep from './EventsCreateWizard/FirstStep.vue'
  import SecondStep from './EventsCreateWizard/secondStep.vue'
  import ThirdStep from './EventsCreateWizard/ThirdStep.vue'
  import moment from 'moment-timezone'


  export default {
    components: {
      FormWizard,
      TabContent,
      FirstStep,
      SecondStep,
      ThirdStep,
      Spinner
    },
    methods: {
      validateFirstStep () {
        return this.$refs.firstStep.validate()
      },
      validateSecondStep () {
        return this.$refs.secondStep.validate()
      },
      validateThirdStep () {
        return this.$refs.thirdStep.validate()
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
      }
    },
    data () {
      return {
        loading: false,
        wizardModel: {}
      }
    }
  }
</script>
<style>
  .vue-form-wizard .wizard-icon-circle.tab_shape {
    background-color: #9A9A9A !important;
    color: white;
  }
</style>
