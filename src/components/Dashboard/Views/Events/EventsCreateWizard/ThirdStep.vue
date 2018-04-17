<template>
  <div>
    <h5 class="text-center">Please set some advanced informations</h5>
    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <div class="form-group">
          <label class="control-label" >
            Support Multiple Languages
            <i class="fa fa-question help help_text"
               v-tooltip="{
                         content: 'If you select multiple languages, you can support translations for your visitors.',
                    }"
            ></i>:
          </label>
          <p-switch v-model="model.multilanguage" type="primary" on-text="YES" off-text="NO"></p-switch>
        </div>
      </div>
      <div class="col-md-5 col-md-offset-1" v-if="model.multilanguage">
        <div class="form-group">
          <label class="control-label" >
            Default Language
            <i class="fa fa-question help help_text"
               v-tooltip="{
                         content: 'If there is no other translation we will use the default language.',
                    }"
            ></i>:
          </label>
          <el-select class="select-default"
                     filterable
                     size="large"
                     name="default_language_id"
                     v-validate="modelValidations.default_language_id"
                     placeholder="Default Language"
                     v-model="model.default_language_id">
            <el-option v-for="option in languages"
                       class="select-default"
                       :value="option.id"
                       :label="option.name"
                       :key="option.name">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="col-md-5" v-if="model.multilanguage">
        <div class="form-group">
          <label class="control-label" >
            Support Multiple Languages
            <i class="fa fa-question help help_text"
               v-tooltip="{
                         content: 'If you select multiple languages, you can support translations for your visitors.',
               }"
            ></i>:
          </label>
          <el-select multiple class="select-default"
                     filterable clearable
                     size="large"
                     name=""languages
                     v-model="model.language_ids"
                     placeholder="Languages">
            <el-option v-for="option in languages"
                       class="select-default"
                       :value="option.id"
                       :label="option.name"
                       :key="option.name">
            </el-option>
          </el-select>
        </div>
      </div>
      <hr>
      <div class="col-md- el-col-md-offset-1">
        <div class="form-group">
          <label class="control-label">
            Default Currency <i class="fa fa-question"
             v-tooltip="{
                   content: 'The default currency is the currency used for your tickets and for your shops',
              }"
          ></i>
          </label>
          <el-select class="select-default"
                     filterable
                     size="large"
                     name="default_currency_id"
                     v-validate="modelValidations.default_currency_id"
                     placeholder="Default Currency"
                     v-model="model.default_currency_id">
            <el-option v-for="option in currencies"
                       class="select-default"
                       :value="option.currency_id"
                       :label="option.name"
                       :key="option.name">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'
  import axios from 'axios'
  import PSwitch from 'src/components/UIComponents/Switch.vue'
  import {Select, Option} from 'element-ui'

  export default {
    components: {
      PSwitch,
      [Option.name]: Option,
      [Select.name]: Select
    },
    computed: {
      ...mapFields(['multilanguage', 'default_language_id', 'default_currency_id'])
    },
    data () {
      return {
        location_error: '',
        model: {
          multilanguage: false,
          default_language_id: '',
          language_ids: [],
          default_currency_id: ''
        },
        modelValidations: {
          default_language_id: {
            required: true
          },
          default_currency_id: {
            required: true
          }
        },
        currencies: [],
        languages: [],
        company_data: {}
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
    methods: {
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        axios.get('/api/company/details/' + routeParams.company_id)
          .then(function (response) {
            self.company_data = response.data
            self.model.default_language_id = response.data.language_id
            self.model.default_currency_id = response.data.currency_id
            self.loading = false
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            axios.$router.push('/server-error')
          })
        axios.get('/resources/geo/languages')
          .then(function (response) {
            self.languages = response.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
        axios.get('/resources/money/currency/currencies')
          .then(function (response) {
            self.currencies = response.data.data
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        return this.$validator.validateAll()
      }
    }
  }
</script>
<style>
  .el-select {
    width: 100%;
    margin-bottom: 30px;
  }
</style>
