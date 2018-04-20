<template>
  <spinner v-if="loading"></spinner>
  <div v-else="!loading">
    <div class="row">
      <div class="col-md-12">
        <event-menu></event-menu>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-2 col-sm-4" v-if="checkIfDateIsAfterToday(event.end_date)">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-date`" slot="header">
            <i :class="'ti-calendar'"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Event Start in:</p>
            {{ calculateDaysLeft() }} Days
          </div>
        </stats-card>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-4">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              Event - {{ event.event_name }}
            </h4>
          </div>
          <div class="card-content">
            <ul>
              <li><strong>Event Name:</strong> {{ event.event_name }}</li>
              <li><strong>Venue:</strong> {{ event.location_name }}</li>
              <li><strong>Address:</strong> {{ event.street }} {{ event.street_number }}</li>
              <li><strong>City:</strong> {{ event.city }}, {{ event.postal_code }} - {{ country.country.name }}</li>
            </ul>
          </div>
          <div class="card-footer text-right" v-if="checkUserPermission()">
            <router-link class="btn btn-default"
                         :to="{ name: 'Edit event', params: { event_id: $route.params.event_id, company_id: $route.params.company_id }}">Edit Event Details
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-4">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              Event Schedule
            </h4>
          </div>
          <div class="card-content">
            <ul>
              <li><strong>Event Start:</strong> {{ formatDate(event.start_date) }}</li>
              <li><strong>Event End:</strong> {{ formatDate(event.end_date) }}</li>
              <li><strong>Mutliday Event:</strong> <span v-if="event.multi_day_event">This event is has multiple days</span>
              <span v-else="!event.multi_day_event">This event is hold onetime</span></li>
            </ul>
          </div>
          <div class="card-footer text-right" v-if="checkUserPermission()">
            <router-link class="btn btn-default"
                         :to="{ name: 'View all Events', params: { company_id: $route.params.company_id }}">Edit Event Schedule
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-4">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              Event Details
            </h4>
          </div>
          <div class="card-content">
            <ul>
              <li v-show="currency && currency.data"><strong>Default Currency:</strong> {{ currency.data.name }}</li>
              <li><strong>Multiple Languages: </strong> <span v-if="event.multi_language">The event supports multiple languages</span>
                <span v-else="!event.multi_language">The event does not support multible languages</span>
              </li>
              <li v-if="event.multi_language && event.event_languages"><strong>Languages:</strong>
                <ul>
                  <li v-for="language in event.event_languages"> {{ getLanguageName(language.language_id) }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="card-footer text-right" v-if="checkUserPermission()">
            <router-link class="btn btn-default"
                         :to="{ name: 'Event Details Edit', params: { event_id: $route.params.event_id, company_id: $route.params.company_id }}">Edit Event Schedule
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import EventMenu from './EventMenu/topMenu.vue'
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import moment from 'moment-timezone'

  export default {
    components: {
      Spinner,
      EventMenu,
      StatsCard
    },
    computed: {},
    methods: {
      checkIfDateIsAfterToday: function (compareDate) {
        return moment().isBefore(compareDate)
      },
      formatDate: function (dateToFormat) {
        return moment(dateToFormat).format('MMMM Do YYYY, h:mm a')
      },
      getLanguageName: function (languageId) {
        var self = this
        for (var lang in self.languages) {
          if (languageId === self.languages[lang].id) {
            return self.languages[lang].name
          }
        }
      },
      calculateDaysLeft: function () {
        var self = this
        var eventStart = self.event.start_date
        var todaysDate = moment(new Date())
        var oDate = moment(eventStart)
        var diffDays = oDate.diff(todaysDate, 'days')
        return diffDays
      },
      fetchCurrencyInformation: function (currencyId) {
        const self = this
        self.axios.get('/resources/money/currency/' + currencyId)
          .then(function (response) {
            self.currency = response.data
            console.log(self.currency)
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
      },
      fetchData: function (callback) {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/events/event/get/' + routeParams.event_id + '/' + routeParams.company_id)
          .then(function (response) {
            self.event = response.data
            self.loading = true
            self.fetchCurrencyInformation(self.event.default_currency_id)
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
        event: {},
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
