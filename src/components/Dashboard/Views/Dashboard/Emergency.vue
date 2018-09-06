<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card" v-show="reported_emergency === false">
        <div class="card-header">
          <h4 class="card-title">Report Emergency</h4>
        </div>
        <div class="card-content">
          <form method="get" action="/" class="form-horizontal">
            <form>
              <div class="col-sm-12 form-group">
                <label for="reporter">Reporter
                  <i class="ti-help help_text"
                     v-tooltip="{
                     content: 'This value is based on your login',
                  }"
                  ></i>
                </label>
                <input type="text" name="reporter" v-model="model.reporter" disabled v-validate="modelValidations.reporter"
                       class="form-control"
                >
                <small class="text-danger" v-show="reporter.invalid">
                  {{ getError('reporter') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <label for="report">Report
                  <i class="ti-help help_text"
                     v-tooltip="{
                     content: 'Please write a detailed incident report',
                  }"
                  ></i>
                </label>
                <textarea name="report" v-model="model.report" v-validate="modelValidations.report" placeholder="Detailed report" class="form-control"></textarea>

                <small class="text-danger" v-show="report.invalid">
                  {{ getError('report') }}
                </small>
              </div>
              <div class="clearfix"></div>
              <div class="row">
                <div class="form-group col-md-12">
                  <p class="text-center"><strong>Please think it before you submit, every report will alert oncall</strong></p>
                  <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="validate">
                    Alert Emergency Response Team
                  </button>
                </div>
              </div>
              <div class="clearfix"></div>
            </form>
          </form>
        </div>
      </div>  <!-- end card -->
      <div class="card" v-show="reported_emergency">
        <div class="card-header">
          <h4 class="card-title">You sent an alert to the emergency response team</h4>
        </div>
        <div class="card-content">
          <div class="row">
            <div class="col-sm-12">
              <h4>Thanks for your emergency report!</h4>
              <p>The emergency response team will get in touch with you as soon as possible.</p>
            </div>
          </div>
        </div>
      </div>

    </div> <!-- end col-md-12 -->
  </div>
</template>
<script>
  import Vue from 'vue'
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import axios from 'axios'
  import {mapFields} from 'vee-validate'

  export default {
    components: {
      Spinner
    },
    computed: {
      ...mapFields(['reporter', 'report'])
    },
    data () {
      return {
        model: {
          reporter: this.$auth.user().email,
          report: ''
        },
        modelValidations: {
          reporter: {
            required: true,
            email: true
          },
          report: {
            required: true
          }
        },
        reported_emergency: false
      }
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
                reporter: self.model.reporter,
                report: self.model.report
              })
              self.axios.post('/auth/report/emergency', data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function (response) {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You successfully alerted the emergency response team</span>`
                    },
                    icon: 'ti-check',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'success'  // info | success | warning | danger
                  })
                  self.reported_emergency = true
                })
                .catch(function (error) {
                  var status = error.response.status
                  self.$notify({
                    component: {
                      template: `<span><b> Error! </b> - An unexpected error happened</span>`
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
    }
  }
</script>
<style>
</style>
