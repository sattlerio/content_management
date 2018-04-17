<template>
  <div>
    <h5 class="text-center">Please select the day and the type of the event</h5>
    <hr>
    <div class="row">
      <div class="col-md-6 col-md-offset-1">
        <div class="form-group">
          <label class="control-label">
            Type of Event
          </label>
          <p-radio v-model="model.multidayevent" v-validate="modelValidations.multidayevent" name="multidayevent" label="false">This event is a single events</p-radio>
          <p-radio v-model="model.multidayevent" v-validate="modelValidations.multidayevent" name="multidayevent" label="true">The event has multiple events</p-radio>
          <small class="text-danger" v-show="multidayevent.invalid">
            {{ getError('multidayevent') }}
          </small>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label class="control-label">
            <i class="fa fa-question"></i>Help
          </label>
          <p class="smaller help_text">
            <strong><u>Single Event:</u></strong> If you select <i>This event is a single event</i> the event has one
            day it happens
          </p>
          <p class="smaller help_text">
            <strong><u>Multiday Event:</u></strong> If you select <i>This event has multiple events</i> you can schedule multiple days and
            chooce which kind of timeslots your event has.
          </p>
        </div>
      </div>
    </div>
    <hr>
    <div class="row" v-show="model.multidayevent == 'false'">
      <div class="col-md-10 col-md-offset-1">
        <div class="form-group">
          <p>Goes the event over multiple days? <p-switch v-model="model.multible_dates" type="primary" on-text="YES" off-text="NO"></p-switch></p>
        </div>
      </div>
      <hr>
      <div v-if="model.multible_dates===false">
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
      <div v-else="model.multible_dates===true">
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
    <div class="row" v-show="model.multidayevent == 'true'">
      <div class="col-md-10 col-md-offset-1">
        <div class="form-group">
            <label class="control-label">
              Selected Event Dates
            </label>
            <div class="col-sm-12">
              <el-table :data="model.multidayevent_dates">
                <el-table-column type="index">

                </el-table-column>
                <el-table-column prop="name"
                                 label="Name">
                </el-table-column>
                <el-table-column prop="start_date"
                                 label="Start Date">
                </el-table-column>
                <el-table-column prop="end_date"
                                 label="End Date">
                </el-table-column>
                <el-table-column
                  label="Actions">
                  <template slot-scope="props">
                    <a class="btn btn-simple btn-danger btn-xs btn-icon remove"  @click="handleDelete(props.$index, props.row)"><i class="ti-close"></i></a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import PSwitch from 'src/components/UIComponents/Switch.vue'
  import {mapFields} from 'vee-validate'
  import {DatePicker, TimeSelect, Slider, Tag, Input, Button, Select, Option} from 'element-ui'


  export default {
    components: {
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
      PSwitch
    },
    computed: {
      ...mapFields(['multidayevent', 'start_date', 'end_date', 'name', 'tmp_start_date', 'tmp_end_date', 'start_time'])
    },
    data () {
      return {
        location_error: '',
        model: {
          name: '',
          revenue: '',
          event_day: null,
          multible_dates: false,
          multidayevent: 'false',
          start_date: null,
          end_date: null,
          start_time: null,
          end_time: null,
          multidayevent_dates: [],
          date_range: []
        },
        modelValidations: {
          multidayevent: {
            required: true
          }
        },
        date_errors: [],
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
    },
    ready () {
      this.$el.flatpickr()
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
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
        if (this.model.multible_dates) {
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
        return this.$validator.validate()
      }
    }
  }
</script>
<style>
</style>
