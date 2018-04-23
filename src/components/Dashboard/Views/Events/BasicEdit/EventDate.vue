<template>
  <spinner v-if="loading"></spinner>
  <div v-else="!loading">
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
          <div class="card-header">
            <router-link class="pull-right btn btn-default"
                         :to="{ name: 'Event details', params: { event_id: $route.params.event_id, company_id: $route.params.company_id }}">Back
            </router-link>
            <h4 class="title pull-left">Edit Schedule</h4>
            <div class="clearfix"></div>
          </div>
          <div class="card-content">
            <form>
              <h5 class="text-center">Update Event - {{ event.event_name }}</h5>
              <div class="row">
                <div>
                  <div class="col-md-10 col-md-offset-1">
                    <div class="form-group">
                      <p>Goes the event over multiple days? <p-switch v-model="multiDay" type="primary" on-text="YES" off-text="NO"></p-switch></p>
                    </div>
                  </div>
                  <div class="clearfix"></div>
                  <hr>
                  <div v-if="multiDay===false">
                    <div class="col-md-5 col-md-offset-1">
                      <div class="form-group">
                        <label class="control-label">
                          Event Day
                        </label>
                        <br>
                        <el-date-picker
                          type="date"
                          v-validate="modelValidations.start_date"
                          format="d. M. yyyy"
                          value-format="yyyy-MM-dd"
                          v-model="model.event_day"
                          placeholder="Select date and time"
                          :picker-options="pickerOptions1">
                        </el-date-picker>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <div class="form-group">
                        <label class="control-label">
                          Set Start and Endtime
                        </label>
                        <br>
                        <el-time-select
                          placeholder="Start time"
                          name="start_time"
                          :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:59'
                }"
                          v-model="model.start_time"
                        >
                        </el-time-select>
                        <el-time-select
                          placeholder="End time"
                          :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:59'
                }"
                          v-model="model.end_time"
                        >
                        </el-time-select>
                        <br>
                      </div>
                    </div>
                    <div class="col-md-10 col-md-offset-1">
                      <small v-for="error in date_errors" class="text-danger">
                        {{ error }} <br>
                      </small>
                    </div>
                  </div>
                  <div v-else="multiDay===true">
                    <div class="col-md-5 col-md-offset-1">
                      <div class="form-group">
                        <label class="control-label">
                          Event Day
                        </label>
                        <br>
                        <el-date-picker
                          type="daterange"
                          v-validate="modelValidations.start_date"
                          format="d. M. yyyy"
                          value-format="yyyy-MM-dd"
                          range-seperatir="-"
                          v-model="model.date_range"
                          start-placeholder="Start Date"
                          end-placeholder="End Date"
                          :picker-options="pickerOptions1">
                        </el-date-picker>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <div class="form-group">
                        <label class="control-label">
                          Set Start and Endtime
                        </label>
                        <br>
                        <el-time-select
                          placeholder="Start time"
                          name="start_time"
                          :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:59'
                }"
                          v-model="model.start_time">
                        </el-time-select>
                        <el-time-select
                          placeholder="End time"
                          :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:59'
                }"
                          v-model="model.end_time">
                        </el-time-select>
                        <br>
                      </div>
                    </div>
                    <div class="col-md-10 col-md-offset-1">
                      <small v-for="error in date_errors" class="text-danger">
                        {{ error }} <br>
                      </small>
                    </div>
                  </div>

                </div>
                <div class="clearfix"></div>
                <hr>
                <div class="form-group col-md-12">
                  <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="validate">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import PSwitch from 'src/components/UIComponents/Switch.vue'
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import {mapFields} from 'vee-validate'
  import {DatePicker, TimeSelect} from 'element-ui'
  import moment from 'moment-timezone'

  export default {
    components: {
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
      Spinner,
      PSwitch
    },
    computed: {
      ...mapFields(['name', 'revenue'])
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
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
            self.loading = false
            // multible_dates
            var startDate = moment(self.event.start_date).format('YYYY-MM-DD')
            var endDate = moment(self.event.end_date).format('YYYY-MM-DD')
            var startTime = moment(self.event.start_date).format('HH:mm')
            var endTime = moment(self.event.end_date).format('HH:mm')

            self.model.event_day = startDate
            self.model.start_date = startDate
            self.model.end_date = endDate
            self.model.start_time = startTime
            self.model.end_time = endTime
            self.model.date_range = [startDate, endDate]

            console.log(startDate)
            console.log(endDate)
            if (startDate === endDate) {
              self.multiDay = false
            } else {
              self.multiDay = true
            }
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      validate () {
        this.date_errors = []

        if (!this.model.start_time) {
          this.date_errors.push('Please fill out the start time from the event')
        }
        if (!this.model.end_time) {
          this.date_errors.push('Please fill out the end time from the event')
        }
        if (this.model.start_time >= this.model.end_time) {
          this.date_errors.push('The start time can not be bigger than the end time')
        }
        if (this.multiDay) {
          if (this.model.date_range.length !== 2) {
            this.date_errors.push('Please select a start and end date')
          }
          var date = this.model.date_range
          this.model.start_date = date[0]
          this.model.end_date = date[1]
        } else {
          if (!this.model.event_day) {
            this.date_errors.push('Please fill out the eventdate')
          } else {
            if (new Date(this.model.event_day) < new Date()) {
              this.date_errors.push('The Eventdate can not be before today')
            } else {
              this.model.start_date = this.model.event_day
              this.model.end_date = this.model.event_day
            }
          }
        }
        var startDate = this.model.start_date + ' ' + this.model.start_time
        var endDate = this.model.end_date + ' ' + this.model.end_time

        this.model.start_date = new Date(startDate)
        this.model.end_date = new Date(endDate)
        if (this.date_errors.length > 0) {
          return false
        }
        const self = this
        var timezone = moment.tz.guess()
        var formattedStartDate = moment.tz(self.model.start_date, timezone)
        var formattedEndDate = moment.tz(self.model.end_date, timezone)
        let data = JSON.stringify({
          end_date: formattedEndDate, // timezone
          multidayevent: self.model.multidayevent,
          multidayevent_dates: self.model.multidayevent_dates,
          start_date: formattedStartDate // timezone
        })
        self.axios.put('/api/events/event/edit/date/' + self.$route.params.event_id + '/' + self.$route.params.company_id, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(function (response) {
            self.$notify({
              component: {
                template: `<span><b> Success </b> - successfully updated event</span>`
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
        date_errors: {},
        multiDay: false,
        company_id: '',
        model: {
          start_date: null,
          end_date: null,
          start_time: null,
          end_time: null,
          date_range: [],
          event_day: null
        },
        locationTouched: false,
        event: {},
        address: '',
        loading: false,
        edit_permission: ['admin', 'manager', 'product_manager'],
        location_error: '',
        modelValidations: {
          multidayevent: {
            required: true
          }
        },
        pickerOptions1: {
          shortcuts: [
            {
              text: 'Today',
              onClick (picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: 'Yesterday',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            }]
        }
      }
    }
  }
</script>
