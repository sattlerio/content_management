<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Shipping Rules', params: { company_id: $route.params.company_id }}">Back
          </router-link>
          <h4 class="title pull-left">Create new Shipping Rule</h4>
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
                <input type="text" name="name" v-model="shippingRule.name" v-validate="modelValidations.name"
                       class="form-control"
                >
                <small class="text-danger" v-show="name.invalid">
                  {{ getError('name') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <div class="col-sm-12">
                  <label for="self_shipping">Manual Shipping
                    <i class="ti-help help_text"
                       v-tooltip="{
                         content: 'If you select self shipping the value will be shipped manually by you, in case of print@home the system will send the product automatically',
                      }"
                    ></i>
                  </label>
                </div>
                <div class="col-sm-12">
                  <p-checkbox :checked="false" :name="self_shipping" v-model="shippingRule.self_shipping">Handle the shipment manually</p-checkbox>
                </div>
              </div>
              <div class="col-sm-12">
                <small class="text-danger" v-show="self_shipping.invalid">
                  {{ getError('self_shipping') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <div class="col-sm-12">
                  <label for="price">Shipping costs
                    <i class="ti-help help_text"
                       v-tooltip="{
                         content: 'You can leave the costs empty if you want to make shipping free. The currency is the default currency from your company. You can overwrite it in your product definition',
                      }"
                    ></i>
                  </label>
                  <div class="input-group">
                    <span class="input-group-addon">{{ currencyId }}</span>
                    <input type="number" name="price" step="0.01" min="0.00" v-model="shippingRule.price" v-validate="modelValidations.price"
                           class="form-control">
                  </div>
                </div>
              </div>
              <div class="col-sm-12">
                <small class="text-danger" v-show="price.invalid">
                  {{ getError('price') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <div class="col-sm-12">
                  <label for="countries">Available Countries <small>(Leave this empty to select all countries)</small>
                    <i class="ti-help help_text"
                       v-tooltip="{
                         content: 'You can select countries where the rule should be available. If you leave this field empty the rule will be available for all countries.',
                      }"
                    ></i>
                  </label>
                  <br>
                  <el-select multiple class="select-primary"
                             size="large"
                             filterable
                             clearable
                             v-model="shippingRule.countries"
                             placeholder="Select countries">
                    <el-option v-for="option in availCountries"
                               class="select-primary"
                               :value="option.id"
                               :label="option.name"
                               :key="option.id">
                    </el-option>
                  </el-select>
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
  import {Select, Option} from 'element-ui'


  export default {
    components: {
      Spinner,
      [Option.name]: Option,
      [Select.name]: Select
    },
    computed: {
      ...mapFields(['name', 'price', 'self_shipping', 'countries'])
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      fetchData () {
        const self = this
        axios.get('/api/company/details/' + self.$route.params.company_id)
          .then(function (response) {
            self.currencyId = response.data.currency_id
            axios.get('/resources/geo/countries')
              .then(function (response) {
                self.availCountries = response.data
                self.loading = false
              })
              .catch(function (error) {
                self.loading = false
                console.log(error)
                self.$router.push('/server-error')
              })
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
              var countryObject = []

              for (var c in self.shippingRule.countries) {
                countryObject.push({
                  'country_id': self.shippingRule.countries[c]
                })
              }

              let data = JSON.stringify({
                name: self.shippingRule.name,
                self_shipping: self.shippingRule.self_shipping,
                default_price: parseFloat(self.shippingRule.price),
                countries: countryObject
              })
              self.axios.post('/api/shipping/create/' + self.$route.params.company_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function (response) {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You successfully created a new shipping rule</span>`
                    },
                    icon: 'ti-check',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'success'  // info | success | warning | danger
                  })
                  self.$router.push('/settings/shipping_rules/' + self.$route.params.company_id)
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
        availCountries: [],
        currencyId: '',
        loading: true,
        modelValidations: {
          name: {
            required: true
          },
          price: {
            decimal: 2,
            min_value: 0.00
          },
          self_shipping: {
            required: true
          }
        },
        shippingRule: {
          name: '',
          price: 0.00,
          self_shipping: false,
          countries: []
        }
      }
    }
  }
</script>
