<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Create new Event', params: { company_id: company_id }}">Create new Event
          </router-link>
          <h4 class="title pull-left">All Events</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <v-client-table :data="tableData" ref="eventTable" :columns="columns" :options="options">
            <div class="multi_day_event" slot="multi_day_event" slot-scope="props">
              <span v-if="props.row.multi_day_event">
                Is multiday Event
              </span>
              <span v-else="!props.row.multi_day_event">One time Event</span>
            </div>
            <div class="start_date" slot="start_date" slot-scope="props">
              <span>{{ formatDate(props.row.start_date) }}</span>
            </div>
            <div class="active" slot="active" slot-scope="props">
              <span v-if="props.row.active">
                Active
              </span>
              <span v-else="!props.row.active">Inactive</span>
            </div>
            <div class="action_container" slot="action" slot-scope="props">
              <router-link class="glyphicon glyphicon-eye-open"
                           :to="{ name: 'Event details', params: { event_id: props.row.event_id, company_id: company_id }}"
              ></router-link>
            </div>
          </v-client-table>

          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'

  import {ClientTable} from 'vue-tables-2'
  import Vue from 'vue'
  import swal from 'sweetalert2'
  import 'sweetalert2/dist/sweetalert2.css'
  import moment from 'moment-timezone'

  Vue.use(ClientTable)

  export default {
    components: {
      Spinner
    },
    computed: {},
    methods: {
      formatDate: function (value) {
        return moment(value).format('DD. MMMM, YYYY hh:mm a')
      },
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/events/event/get/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tableData = response.data
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
      this.tableData = this.fetchData()
    },
    data () {
      return {
        company_id: null,
        loading: false,
        columns: ['event_name', 'multi_day_event', 'start_date', 'location_name', 'active', 'action'],
        perPage: 25,
        tableData: [],
        options: {
          headings: {
            event_name: 'Event Name',
            multi_day_event: 'Multiday Event',
            start_date: 'Start Date',
            location_name: 'Location',
            active: 'Active',
            action: '#'
          },
          uniqueKey: 'event_id',
          sortable: ['event_name', 'multi_day_event', 'start_date', 'location_name', 'active'],
          filterable: ['event_name', 'start_date', 'location_name'],
          highlightMatches: true
        }
      }
    }
  }
</script>
