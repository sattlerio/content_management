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
              <el-table-column prop="human_rule"
                               label="Tax rate">
              </el-table-column>
              <el-table-column
                label="Conditions">
                <template slot-scope="props">
                  <div>
                  <span v-show="props.row.countries.length > 0" v-for="country in props.row.countries">{{ country }}, </span>
                  <span v-show="props.row.countries.length === 0">Rest of the world</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="Actions">
                <template slot-scope="props">
                  <a class="btn btn-simple btn-info btn-xs btn-icon view"
                     @click="handleView(props.row)"><i class="ti-search"></i></a>
                  <a class="btn btn-simple btn-warning btn-xs btn-icon edit"
                     @click="handleDelete (props.$index, props.row)"><i class="ti-pencil-alt"></i></a>
                  <a class="btn btn-simple btn-danger btn-xs btn-icon remove"
                     @click="showDeleteModal(props.row)"><i class="ti-close"></i></a>
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
  import swal from 'sweetalert2'
  import 'sweetalert2/dist/sweetalert2.css'

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
      },
      handleView (row) {
        const self = this
        self.axios.get('/resources/geo/countries')
          .then(function (response) {
            self.countries = response.data
            var content = ''
            var availCountries = row.countries
            if (availCountries.length > 0) {
              console.log(self.countries)
              for (var country in self.countries) {
                var x = self.countries[country]
                if (availCountries.indexOf(x['id']) !== -1) {
                  content += '<li>' + x['name'] + ' (' + x['emoji'] + ')</li>'
                  console.log(x)
                }
              }
            } else {
              content = '<li>This rule applies for the whole world</li>'
            }
            swal({
              showCloseButton: true,
              confirmButtonText: 'Close',
              width: 700,
              title: '<p>Tax Rule ' + row.name + '</p><hr/>',
              html: '<div class="row text-left"><div class="col-md-6 form-group">' +
              '<label>Tax Rate:</label><input class="form-control" value="ddd" disabled/></div>' +
              '<div class="col-md-6 form-group"><label>Selected countries:</label>' +
              '<ul class="no-apadding">' + content + '</ul></div></div>'
            })
          })
          .catch(function (error) {
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      showDeleteModal (row) {
        const self = this
        swal({
          title: 'Are you sure?',
          text: 'Please confirm that you want to delete the tax group ' + row.name + '. If you delete this entry you cant restore it anymore.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete'
        }).then((result) => {
          if (result) {
            let routeParams = self.$route.params
            self.axios.delete('/api/accounting/tax/delete/taxgroup/' + routeParams.tax_id + '/' + row.rule_id + '/' + routeParams.company_id)
              .then(function (response) {
                swal(
                  'Deleted!',
                  'You deleted the tax group successfully',
                  'success'
                )
                let indexToDelete = self.tableData.findIndex((tableRow) => tableRow.id === row.id)
                if (indexToDelete >= 0) {
                  self.tableData.splice(indexToDelete, 1)
                }
              })
              .catch(function (error) {
                console.log(error)
                swal(
                  'Error!',
                  'Not possible to delete the tax group please try it again later',
                  'error'
                )
              })
          }
        }).catch(function () {
          return false
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
