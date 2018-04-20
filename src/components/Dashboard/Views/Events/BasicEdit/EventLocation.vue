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
            <h4 class="title pull-left">Edit Event</h4>
            <div class="clearfix"></div>
          </div>
          <div class="card-content">
            <form>
              <h5 class="text-center">Update Event - {{ event.event_name }}</h5>
              <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="form-group">
                    <label class="control-label">
                      Event name
                    </label>
                    <input class="form-control"
                           type="text"
                           name="name"
                           v-validate="modelValidations.name"
                           v-model="event.event_name"
                    />
                    <small class="text-danger" v-show="name.invalid">
                      {{ getError('name') }}
                    </small>
                  </div>
                </div>
                <div class="col-sm-6 col-md-offset-1">
                  <div class="form-group" id="gmap_container">
                    <vuetify-google-autocomplete
                      :id="'map'"
                      :ref="address"
                      :clearable="false"
                      :disabled="false"
                      :name="'address'"
                      :enable-geolocation="false"
                      :label="'Search Address'"
                      :placeholder="''"
                      :enableGeolocation="true"
                      :class="'form-group'"
                      :types="'geocode'"
                      :required="true"
                      v-on:no-results-found="noResultsFound"
                      v-on:placechanged="getAddressData"
                      v-on:>
                    </vuetify-google-autocomplete>
                    <small class="text-danger" v-show="location_error">{{ location_error }}</small>
                    <p><strong>Current address:</strong> {{ address.street }} {{ address.street_number }}, {{ address.city }} {{ address.postal_code }} - {{ address.country_id }}</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="control-label">
                      Revenue Name
                    </label>
                    <input class="form-control"
                           type="text"
                           name="revenue"
                           v-validate="modelValidations.revenue"
                           v-model="event.location_name"
                    />
                    <small class="text-danger" v-show="revenue.invalid">
                      {{ getError('revenue') }}
                    </small>
                  </div>
                </div>
                <div class="form-group col-md-12">
                  <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="validate">
                    Update
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
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import {mapFields} from 'vee-validate'
  import Vue from 'vue'
  import Vuetify from 'vuetify'
  import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

  Vue.use(Vuetify)
  Vue.use(VuetifyGoogleAutocomplete, {
    apiKey: 'AIzaSyAM5_0On4wCjR4jemYa1KgRJzP7djuJJ6k'
  })

  export default {
    components: {
      Spinner
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
            self.address = {
              street_number: self.event.street_number,
              street: self.event.street,
              country_id: self.event.country_id,
              latitude: self.event.latitude,
              longitude: self.event.longitude,
              postal_code: self.event.postal_code,
              city: self.event.city,
              venue: self.event.location_name
            }
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      validate () {
        var locationTouched = self.locationTouched
        this.location_error = ''
        var modelLocation = this.model.location
        if (!locationTouched || (locationTouched && modelLocation.street && modelLocation.country_id && modelLocation.latitude &&
          modelLocation.longitude && modelLocation.postal_code && modelLocation.city)) {
          this.$validator.validateAll()
            .then((result) => {
              const self = this
              alert(locationTouched)
              if (!locationTouched) {
                self.model.location = null
              }
              if (result) {
                let data = JSON.stringify({
                  event_name: self.event.event_name,
                  location_name: self.event.location_name,
                  location: self.model.location
                })
                self.axios.put('/api/events/event/edit/basic/' + self.$route.params.event_id + '/' + self.$route.params.company_id, data, {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
                  .then(function () {
                    self.$notify({
                      component: {
                        template: `<span><b> Success </b> - You successfully edited the event.</span>`
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
        if (self.locationTouched) {
          this.location_error = 'Please select a valid address for your event'
          return false
        }
      },
      getAddressData: function (addressData, placeResultData) {
        this.location_error = ''
        this.event.location = {
          street_number: '',
          street: '',
          country_id: '',
          latitude: 0.00,
          longitude: 0.00,
          postal_code: '',
          city: '',
          venue: ''
        }
        placeResultData = placeResultData.address_components
        for (var i = 0; i < placeResultData.length; i++) {
          switch (placeResultData[i].types[0]) {
            case 'street_number':
              this.model.location.street_number = placeResultData[i].long_name
              break
            case 'postal_code':
              this.model.location.postal_code = placeResultData[i].long_name
              break
            case 'country':
              this.model.location.country_id = placeResultData[i].short_name
          }
        }
        this.model.location.latitude = addressData.latitude
        this.model.location.city = addressData.locality
        this.model.location.longitude = addressData.longitude
        this.model.location.street = addressData.route
        this.model.location.venue = this.model.revenue
        self.locationTouched = true
      },
      noResultsFound: function () {
        this.location_error = 'The submitted address does not exist'
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
        company_id: '',
        model: {
          location: {}
        },
        locationTouched: false,
        event: {},
        address: '',
        loading: false,
        edit_permission: ['admin', 'manager', 'product_manager'],
        location_error: '',
        modelValidations: {
          name: {
            required: true
          },
          revenue: {
            required: true
          }
        }
      }
    }
  }
</script>
