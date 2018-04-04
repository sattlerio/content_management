<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h4 class="title">Create new Tax Group</h4>
        </div>
        <div class="card-content">
          <form>
            {{ tax }}
              <h5>Basic Configuration</h5>
            <div class="row">
              <div class="col-md-12 form-group">
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
              <div class="col-md-12 form-group">
                <p-checkbox v-model="tax.b2c_tax">Tax will not be charged to Companies
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'If you select this field the tax wont be charged to companies, only to individual customers.',
                    }"
                  ></i>
                </p-checkbox>

              </div>
              <div class="col-md-12 form-group">
                <label for="default_tax">Default Tax Value
                  <i class="ti-help help_text"
                     v-tooltip="{
                       content: 'This value will be used if no other rule overwrites it.',
                    }"
                  ></i>
                </label>
                <input type="text" name="default_tax" v-model="tax.default_tax" v-validate="modelValidations.default_tax"
                       class="form-control"
                >
                <small class="text-danger" v-show="default_tax.invalid">
                  {{ getError('default_tax') }}
                </small>
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
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
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
            min_value: 0.00
          }
        },
        tax: {
          tax_name: '',
          b2c_tax: false,
          default_tax: 0.00
        }
      }
    }
  }
</script>
