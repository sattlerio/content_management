<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Tax Settings', params: { company_id: company_id }}">Back
          </router-link>
          <h4 class="title pull-left">Tax {{ tax.name }} Settings</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <div class="row">
            <div class="col-md-12">
              <div class="col-sm-6 form-group">
                <label>Tax Name:</label>
                <input class="form-control" v-bind:value="tax.name" disabled/>
              </div>
              <div class="col-sm-6 form-group">
                <label>Default Tax Rate</label>
                <input class="form-control" v-bind:value="tax.default_rate_read" disabled/>
              </div>
            </div>
          </div>
        </div>
        <div class=card-footer>
          <div class="row">
            <div class="col-md-12">
              <router-link class="btn btn-default btn-center"
                           :to="{ name: 'Create new tax rule', params: { tax_id: $route.params.tax_id, company_id: $route.params.company_id }}"
              >Create new tax group</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h4 class="title">Regular Tax Groups</h4>
        </div>
        <div class="card-content">
            <el-table :data="tableData">
              <el-table-column type="index">

              </el-table-column>
              <el-table-column prop="name"
                               label="Name">
              </el-table-column>
              <el-table-column prop="job"
                               label="Job Position">
              </el-table-column>
              <el-table-column prop="salary"
                               label="Salary">
              </el-table-column>
              <el-table-column
                label="Actions">
                <template slot-scope="props">
                  <a class="btn btn-simple btn-info btn-xs btn-icon like"
                     @click="handleLike(props.$index, props.row)"><i class="ti-heart"></i></a>
                  <a class="btn btn-simple btn-warning btn-xs btn-icon edit"
                     @click="handleEdit(props.$index, props.row)"><i class="ti-pencil-alt"></i></a>
                  <a class="btn btn-simple btn-danger btn-xs btn-icon remove"
                     @click="handleDelete(props.$index, props.row)"><i class="ti-close"></i></a>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h4 class="title">B2C Tax Groups</h4>
        </div>
        <div class="card-content">
          <el-table :data="b2c_table_data">
            <el-table-column type="index">

            </el-table-column>
            <el-table-column prop="name"
                             label="Name">
            </el-table-column>
            <el-table-column prop="job"
                             label="Job Position">
            </el-table-column>
            <el-table-column prop="salary"
                             label="Salary">
            </el-table-column>
            <el-table-column
              label="Actions">
              <template slot-scope="props">
                <a class="btn btn-simple btn-info btn-xs btn-icon like"
                   @click="handleLike(props.$index, props.row)"><i class="ti-heart"></i></a>
                <a class="btn btn-simple btn-warning btn-xs btn-icon edit"
                   @click="handleEdit(props.$index, props.row)"><i class="ti-pencil-alt"></i></a>
                <a class="btn btn-simple btn-danger btn-xs btn-icon remove"
                   @click="handleDelete(props.$index, props.row)"><i class="ti-close"></i></a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import {Table, TableColumn} from 'element-ui'
  import Vue from 'vue'

  Vue.use(Table)
  Vue.use(TableColumn)

  export default {
    components: {
      Spinner
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
      this.company_id = this.$route.params.company_id
      this.tax_id = this.$route.params.tax_id
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/accounting/tax/rules/' + routeParams.tax_id + '/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tax = response.data.data
            self.b2c_table_data = self.tax.data_b2c
            self.tableData = self.tax.data
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      }
    },
    data () {
      return {
        loading: false,
        b2c_table_data: [],
        tableData: []
      }
    }
  }
</script>
