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
    </div> <!-- end col-md-12 -->
  </div>
</template>
<script>
  import axios from 'axios'
  import {Select, Option} from 'element-ui'

  export default {
    components: {
      [Option.name]: Option,
      [Select.name]: Select
    },
    data () {
      return {
        selects: {
          simple: '',
          companies: ''
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      axios.get('http://localhost:5000/auth/fetch/user_companies')
        .then(function (response) {
          if (response.data.single_company) {
            alert('tutu')
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
