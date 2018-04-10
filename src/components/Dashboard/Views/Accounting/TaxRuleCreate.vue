<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'View Tax', params: { tax_id: $route.params.tax_id,
                       company_id: $route.params.company_id }}">Back
          </router-link>
          <h4 class="title pull-left">New rule for {{ tax.name }} </h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <form>
            <h5>Tax Rule</h5>
            <div class="row">
              <div class="col-sm-12 form-group">
                <label for="name">Identifier
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'The tax rule name is only for internal usage and can help you to structure your tax rules',
                    }"
                  ></i>
                </label>
                <input type="text" name="name" v-model="tax_rule.name" v-validate="modelValidations.name"
                       class="form-control"
                >
                <small class="text-danger" v-show="name.invalid">
                  {{ getError('name') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <label for="value">Tax Percentage (Value)
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'With this value you override the tax default value if the rule applies.',
                    }"
                  ></i>
                </label>
                <input type="number" name="value" v-model="tax_rule.value" v-validate="modelValidations.value"
                       class="form-control"
                >
                <small class="text-danger" v-show="value.invalid">
                  {{ getError('value') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <label for="value">Do you want to create a b2c tax?
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'If you select this option this tax rule wont apply for companies (VAT) required. Instead the tax will only be charged for Regular Customers',
                    }"
                  ></i>
                </label>
                <p-checkbox v-model="tax_rule.b2c_rule">Charge Tax only for B2C customers</p-checkbox>
              </div>
              <div class="col-sm-12 form-group">
                <label for="value">ddd
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'If you select this option this tax rule wont apply for companies (VAT) required. Instead the tax will only be charged for Regular Customers',
                    }"
                  ></i>
                </label>
                <el-select multiple class="select-primary" v-if="tax_rule.b2c_rule"
                           size="large"
                           filterable
                           clearable
                           v-model="tax_rule.b2c_countries"
                           placeholder="Select countries for who the rule should apply">
                  <el-option v-for="option in countries"
                             class="select-primary"
                             :value="option.id"
                             :label="option.name"
                             :key="option.id">
                  </el-option>
                </el-select>

                <el-select multiple class="select-primary" v-else="!tax_rule.b2c_rule"
                           size="large"
                           v-model="tax_rule.countries"
                           filterable
                           clearable
                           placeholder="Select countries for who the rule should apply">
                  <el-option v-for="option in countries"
                             class="select-primary"
                             :value="option.id"
                             :label="option.name"
                             :key="option.id">
                  </el-option>
                </el-select>
                <small class="text-danger" v-show="tax_rule.b2c_rule && tax_rule.b2c_countries.length == 0 && tax.b2c_without_countries !== 0">
                  You have already one Tax Rule for B2C and without Countries, please select a country.
                </small>
                <small class="text-danger" v-show="!tax_rule.b2c_rule && tax_rule.countries == 0 && tax.rules_without_countries !== 0">
                  You have already one Tax Rule and without Countries, please select a country.
                </small>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-12">
                <p class="center text-danger">{{ error_message }}</p>
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
      ...mapFields(['name', 'value'])
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
      this.company_id = this.$route.params.company_id
      this.fetchData()
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      fetchData: function () {
        this.loading = true
        const self = this
        axios.get('/resources/geo/countries')
          .then(function (response) {
            self.countries = response.data
          })
          .catch(function (error) {
            loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
        let routeParams = self.$route.params
        this.axios.get('/api/accounting/tax/rule/configuration/data/' + routeParams.tax_id + '/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tax = response.data.tax
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
                rule_name: self.tax_rule.name,
                value: self.tax_rule.value,
                b2c_rule: self.tax_rule.b2c_rule,
                b2c_countries: self.tax_rule.b2c_countries,
                countries: self.tax_rule.countries
              })
              if ((self.tax_rule.b2c_rule && self.tax_rule.b2c_countries.length === 0 && self.tax.b2c_without_countries !== 0) ||
                !self.tax_rule.b2c_rule && self.tax_rule.countries === 0 && self.tax.rules_without_countries !== 0) {
                return false
              }
              self.axios.post('/api/accounting/tax/' + self.$route.params.tax_id + '/create/rule/' + self.$route.params.company_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function () {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You successfully created a new tax</span>`
                    },
                    icon: 'ti-check',
                    horizontalAlign: 'right', // right | center | left
                    verticalAlign: 'top', // top | bottom
                    type: 'success'  // info | success | warning | danger
                  })
                  self.$router.push('/accounting/tax/' + self.$route.params.company_id)
                })
                .catch(function (error) {
                  console.log(error)
                  console.log(error.response)

                  if (error.response && error.response.data && error.response.data.error_code) {
                    if (error.response.data.error_code === 9000) {
                      self.error_message = 'In this tax group exists already a tax rule without countries and with b2c settings'
                      return true
                    }
                    if (error.response.data.error_code === 8000) {
                      self.error_message = 'The country with ID ' + error.response.data.country_id + ' exists already with this settings in the tax group'
                      return false
                    }
                  }

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
    data () {
      return {
        error_message: '',
        loading: false,
        modelValidations: {
          b2c_rule: {},
          name: {
            required: true
          },
          value: {
            required: true,
            decimal: 2,
            min_value: 0.00,
            max_value: 100.00
          }
        },
        tax_rule: {
          name: '',
          value: 0.00,
          b2c_rule: false,
          b2c_countries: [],
          countries: [],
          b2c_without_countries: 0,
          rules_without_countries: 0
        },
        countries: [],
        selects: {
          multiple: 'ARS'
        }
      }
    }
  }
</script>

<style>
  .el-select {
    width: 100% !important;
    margin-bottom: 30px;
  }
</style>
