<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h4 class="title">Edit Tax</h4>
        </div>
        <div class="card-content">
          <form>
            <h5>Update Tax - {{ tax.name }}</h5>
            <div class="row">
              <div class="col-sm-12 form-group">
                <label for="tax_name">Tax Rule Name
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'The name will be used only internal and will not be shown in public',
                    }"
                  ></i>
                </label>
                <input type="text" name="name" v-model="tax.name" v-validate="modelValidations.name"
                       class="form-control"
                >
                <small class="text-danger" v-show="name.invalid">
                  {{ getError('name') }}
                </small>
              </div>
              <div class="col-sm-12 form-group">
                <div class="col-sm-12">
                  <label for="default_tax">Default Tax Value
                    <i class="ti-help help_text"
                       v-tooltip="{
                         content: 'This value will be used if no other rule overwrites it. The value is in percentage (%)',
                      }"
                    ></i>
                  </label>
                </div>
                <div class="col-sm-10">
                  <input type="text" name="default_rate" v-model="tax.default_rate"
                         v-validate="modelValidations.default_rate"
                         class="form-control"
                  >
                </div>
                <div class="col-sm-2">
                  <label class="form-control-feedback left text-left">%</label>
                </div>
              </div>
              <div class="col-sm-12">
                <small class="text-danger" v-show="default_rate.invalid">
                  {{ getError('default_rate') }}
                </small>
              </div>
            </div>
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
      ...mapFields(['name', 'default_rate'])
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
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/accounting/tax/' + routeParams.tax_id + '/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tax = response.data.data
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
                tax_name: self.tax.name,
                default_tax: self.tax.default_rate
              })
              self.axios.post('/api/accounting/tax/edit/' + self.$route.params.company_id + '/' + self.$route.params.tax_id, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function () {
                  self.$notify({
                    component: {
                      template: `<span><b> Success </b> - You successfully edited this tax.</span>`
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
        loading: false,
        modelValidations: {
          name: {
            required: true
          },
          default_rate: {
            required: true,
            decimal: 2,
            min_value: 0.00,
            max_value: 100.00
          }
        }
      }
    }
  }
</script>
