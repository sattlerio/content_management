<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'All Payment Channels', params: { company_id: $route.params.company_id }}">Back
          </router-link>
          <h4 class="title pull-left">Create New Payment Channel</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <form>
            <div class="row">
              <div class="col-sm-12 form-group">
                <label for="name">Name
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'The name will be used only internal and will not be shown in public',
                    }"
                  ></i>
                </label>
                <input type="text" name="name" v-model="channel.name" v-validate="modelValidations.name"
                       class="form-control"
                >
                <small class="text-danger" v-show="name.invalid">
                  {{ getError('name') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <div class="col-sm-12">
                  <label for="channel_id">Payment Channel
                  </label>
                  <select name="channel_id" required class="form-control" v-validate="modelValidations.channel_id" v-model="channel.channel_id">
                    <option v-for="type in channels['payment']" v-bind:value="type.toLowerCase()">{{ type }}</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-12">
                <small class="text-danger" v-show="channel_id.invalid">
                  {{ getError('channel_id') }}
                </small>
              </div>

              <!-- Stripe -->
              <div v-if="channel.channel_id === 'stripe'">
                <div class="col-sm-12 form-group">
                  <div class="col-sm-12">
                    <label for="api_key">Stripe API Key
                    </label>
                    <input type="text" name="api_key" v-model="channel.api_key" v-validate="modelValidations.api_key"
                           class="form-control"
                    >
                  </div>
                </div>
                <div class="col-sm-12">
                  <small class="text-danger" v-show="api_key.invalid">
                    {{ getError('api_key') }}
                  </small>
                </div>
                <div class="col-sm-10 el-col-sm-offset-1">
                  <p class="blockquote"><strong>Stripe Payment Gateway</strong><br>To get
                  a stripe account you just have to register on their website here: <a href="https://stripe.com" target="_blank">https://stripe.com</a>. After the registrationIn the
                  Stripe <a href="https://dashboard.stripe.com/account/apikeys" target="_blank">Dashboard</a> you can request a secret key. <small>(You have to use the secret key and not the Publishable key.)</small>
                  <br>We dont charge any creditcard fee or additional fees for using the Stripe Payment API, you can view the prices from stripe
                  <a href="https://stripe.com/nl/pricing" target="_blank">here</a>. <br>
                    Also if you decide to use Stripe as Payment Gateway we can not offer you support with the Stripe Platform, we are just integrating their API with your account in our system and in case of problems or
                    additional fees we can't offer support.
                  </p>
                </div>
              </div>
              <!-- // Stripe -->
              <!-- Braintree -->
              <div v-if="channel.channel_id === 'braintree'">
                <div class="col-sm-12 form-group">
                  <p-checkbox :checked="false" :name="sandbox" v-model="channel.sandbox">Sandbox (Testing environment)</p-checkbox>
                </div>
                <div class="col-sm-12 form-group">
                  <div class="col-sm-12">
                    <label for="merchant_id">Braintree Merchant ID
                    </label>
                    <input type="text" name="merchant_id" v-model="channel.merchant_id" v-validate="modelValidations.merchant_id"
                           class="form-control"
                    >
                  </div>
                </div>
                <div class="col-sm-12">
                  <small class="text-danger" v-show="merchant_id.invalid">
                    {{ getError('merchant_id') }}
                  </small>
                </div>
                <div class="col-sm-12 form-group">
                  <div class="col-sm-12">
                    <label for="api_key">Braintree Public Key
                    </label>
                    <input type="text" name="api_key" v-model="channel.api_key" v-validate="modelValidations.api_key"
                           class="form-control"
                    >
                  </div>
                </div>
                <div class="col-sm-12">
                  <small class="text-danger" v-show="api_key.invalid">
                    {{ getError('api_key') }}
                  </small>
                </div>
                <div class="col-sm-12 form-group">
                  <div class="col-sm-12">
                    <label for="private_key">Braintree Private Key
                    </label>
                    <input type="text" name="private_key" v-model="channel.private_key" v-validate="modelValidations.private_key"
                           class="form-control"
                    >
                  </div>
                </div>
                <div class="col-sm-12">
                  <small class="text-danger" v-show="private_key.invalid">
                    {{ getError('private_key') }}
                  </small>
                </div>
                <div class="col-sm-10 el-col-sm-offset-1">
                  <p class="blockquote"><strong>Braintree Payment API (Paypal)</strong><br>To get
                    a braintree account you just have to register on their website here: <a href="https://www.braintreepayments.com" target="_blank">https://www.braintreepayments.com</a>.
                    <br>
                    After the successful registration you can get in the Braintree Dashboard the API Credentials. We are supporting for Braintree the Live and the Sandbox Integration.
                    You can use the Sandbox for making test payments in your Shop, without getting charged. <br>
                    Braintree is a Service for Paypal with the Braintree Integration we are also supporting the PayPal Express Checkout.
                  </p>
                </div>
              </div>
              <!-- // Braintree -->

              <div class="col-md-12" v-if="error">
                <div class="alert alert-danger">
                  <span>{{ error_msg }}</span>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="row">
              <div class="form-group col-md-12">
                <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="validate">
                  Save
                </button>
              </div>
            </div>
            <div class="clearfix"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import axios from 'axios'
  import {mapFields} from 'vee-validate'

  export default {
    components: {
      Spinner
    },
    computed: {
      ...mapFields(['name', 'channel_id', 'api_key', 'merchant_id', 'private_key', 'sandbox'])
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      fetchData () {
        const self = this
        axios.get('/api/channels/types/' + self.$route.params.company_id)
          .then(function (response) {
            self.channels = response.data.data
            self.loading = false
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      validate () {
        this.$validator.validateAll()
          .then((result) => {
            const self = this
            if (result) {
              let data = JSON.stringify({
                name: self.channel.name,
                key: self.channel.api_key,
                private_key: self.channel.private_key,
                merchant_id: self.channel.merchant_id,
                sandbox: self.channel.sandbox
              })
              self.axios.post('/api/channels/create/' + self.channel.type + '/' + self.channel.channel_id + '/' + self.$route.params.company_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function (response) {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You successfully created a new channel</span>`
                    },
                    icon: 'ti-check',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'success'  // info | success | warning | danger
                  })
                  self.$router.push('/channels/payments/view/' + self.$route.params.company_id)
                })
                .catch(function (error) {
                  var status = error.response.status

                  if (status === 500) {
                    self.error = true
                    self.error_msg = 'The stripe api responded with an error, please check if your account details are valid'
                  } else if (status === 400) {
                    self.error = true
                    self.error_msg = 'Please check the submitted data, the stripe api responded with invalid credentials'
                  } else {
                    self.error = true
                    self.error_msg = 'Unkown error during communication with the Stripe API.'
                  }

                  self.$notify({
                    component: {
                      template: `<span><b> Error! </b> - Not possible to save Channel. Please check the error messages</span>`
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
        error: false,
        error_msg: '',
        channels: {},
        channel: {
          name: '',
          type: 'payment',
          channel_id: '',
          merchant_id: '',
          private_key: '',
          api_key: '',
          channel: false
        },
        loading: true,
        modelValidations: {
          name: {
            required: true
          },
          channel_id: {
            required: true
          },
          api_key: {
            required: true
          },
          private_key: {
            required: true
          },
          merchant_id: {
            required: true
          }
        }
      }
    }
  }
</script>
