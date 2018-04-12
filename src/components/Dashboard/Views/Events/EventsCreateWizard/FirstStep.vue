<template>
  <div>
    <h5 class="text-center">Please give us some basic informations about your event</h5>
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
                 v-model="model.name"
          />
          <small class="text-danger" v-show="name.invalid">
            {{ getError('name') }}
          </small>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-md-offset-1">
        <div class="form-group" id="gmap_container">
          <vuetify-google-autocomplete
            :id="'map'"
            :clearable="true"
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
            v-on:placechanged="getAddressData">
          </vuetify-google-autocomplete>
          <small class="text-danger" v-show="location_error">{{ location_error }}</small>
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
                 v-model="model.revenue"
          />
          <small class="text-danger" v-show="revenue.invalid">
            {{ getError('revenue') }}
          </small>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
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
      VuetifyGoogleAutocomplete
    },
    computed: {
      ...mapFields(['name', 'revenue'])
    },
    data () {
      return {
        location_error: '',
        model: {
          name: '',
          revenue: '',
          location: {
            street_number: '',
            street: '',
            country_id: '',
            latitude: 0.00,
            longitude: 0.00,
            postal_code: '',
            city: ''
          }
        },
        modelValidations: {
          name: {
            min: 3,
            required: true
          },
          revenue: {
            min: 3,
            required: true
          }
        }
      }
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        this.location_error = ''
        var modelLocation = this.model.location
        if (modelLocation.street_number && modelLocation.street && modelLocation.country_id && modelLocation.latitude &&
            modelLocation.longitude && modelLocation.postal_code && modelLocation.city) {
          return this.$validator.validateAll()
        }
        this.location_error = 'Please select a valid address for your event'
      },
      getAddressData: function (addressData, placeResultData) {
        console.log(placeResultData)
        this.location_error = ''
        this.model.location = {
          street_number: '',
          street: '',
          country_id: '',
          latitude: 0.00,
          longitude: 0.00,
          postal_code: '',
          city: ''
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
      },
      noResultsFound: function () {
        this.location_error = 'The submitted address does not exist'
      }
    }
  }
</script>
<style>
</style>
