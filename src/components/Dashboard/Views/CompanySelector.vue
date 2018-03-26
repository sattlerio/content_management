<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Select your company</h4>
        </div>
        <div class="card-content">
          <form method="get" action="/" class="form-horizontal">
            <fieldset>
              <div class="form-group">
                <label class="col-sm-2 control-label">With help</label>
                <div class="col-sm-10">
                  <el-select class="select-default"
                             size="large"
                             filterable
                             placeholder="Select your company"
                             @change="access_company"
                             v-model="selects.selected_comapny">
                    <el-option v-for="option in selects.companies"
                               class="select-default"
                               :value="option.company_id"
                               :label="option.name + ' (' + option.company_id + ')'"
                               :key="option.name">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>  <!-- end card -->

      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Your companies</h4>
        </div>
        <div class="card-content">
          <el-collapse class="panel-group">
            <el-collapse-item :title="'You can manage ' + selects.companies.length + ' companies'" name="1">
              <div class="col-md-12 card clickable_company_select" v-for="company in selects.companies" v-on:click="access_company(company.company_id)">
                <div class="card-content">
                  <h4 class="title">{{ company.name }}</h4>
                  <p>{{ company.company_id }}</p>
                </div>

              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>  <!-- end card -->


    </div> <!-- end col-md-12 -->
  </div>
</template>
<script>
  import Vue from 'vue'
  import axios from 'axios'
  import {Select, Option, Collapse, CollapseItem} from 'element-ui'
  import VueTabs from 'vue-nav-tabs'

  Vue.use(VueTabs)
  Vue.use(Collapse)
  Vue.use(CollapseItem)

  export default {
    components: {
      [Option.name]: Option,
      [Select.name]: Select
    },
    data () {
      return {
        selects: {
          selected_comapny: '',
          simple: '',
          companies: ''
        }
      }
    },
    methods: {
      access_company: function (companyId) {
        Vue.router.push('/admin/overview/' + companyId)
      }
    },
    beforeRouteEnter (to, from, next) {
      axios.get('/auth/fetch/user_companies')
        .then(function (response) {
          if (response.data.single_company) {
            next(false)
          }
          next(vm => {
            vm.selects.companies = response.data.companies
          })
        })
        .catch(function (error) {
          console.log(error)
          next('/server-error')
        })
    }
  }
</script>
<style>
</style>
