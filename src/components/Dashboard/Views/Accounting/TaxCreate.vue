<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Tax Settings', params: { company_id: $route.params.company_id }}">Back
          </router-link>
          <h4 class="title pull-left">Create new tax group</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <form>
            <h5>Basic Configuration</h5>
            <div class="row">
              <div class="col-sm-12 form-group">
                <label for="tax_name">Tax Rule Name
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'The name will be used only internal and will not be shown in public',
                    }"
                  ></i>
                </label>
                <input type="text" name="tax_name" v-model="tax.tax_name" v-validate="modelValidations.tax_name"
                       class="form-control"
                >
                <small class="text-danger" v-show="tax_name.invalid">
                  {{ getError('tax_name') }}
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
                  <input type="text" name="default_tax" v-model="tax.default_tax"
                         v-validate="modelValidations.default_tax"
                         class="form-control"
                  >
                </div>
                <div class="col-sm-2">
                  <label class="form-control-feedback left text-left">%</label>
                </div>
              </div>
              <div class="col-sm-12">
                <small class="text-danger" v-show="default_tax.invalid">
                  {{ getError('default_tax') }}
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
      ...mapFields(['tax_name', 'default_tax'])
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        this.$validator.validateAll()
          .then((result) => {
            const self = this
            if (result) {
              let data = JSON.stringify({
                tax_name: self.tax.tax_name,
                default_tax: self.tax.default_tax
              })
              self.axios.post('/api/accounting/tax/create/' + self.$route.params.company_id, data, {
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
          tax_name: {
            required: true
          },
          default_tax: {
            required: true,
            decimal: 2,
            min_value: 0.00,
            max_value: 100.00
          }
        },
        tax: {
          tax_name: '',
          default_tax: 0.00
        }
      }
    }
  }
</script>
