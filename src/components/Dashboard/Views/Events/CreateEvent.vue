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


  export default {
    components: {
      FormWizard,
      TabContent,
      FirstStep,
      Spinner
    },
    methods: {
      validateFirstStep () {
        return this.$refs.firstStep.validate()
      },
      wizardComplete () {
        const self = this
        self.wizardModel = {
          ...self.$refs.firstStep.model
        }
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
