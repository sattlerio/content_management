<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Create New Tax', params: { company_id: company_id }}">Create New Tax
          </router-link>
          <h4 class="title pull-left">Company Taxes</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <v-client-table :data="tableData" ref="taxTable" :columns="columns" :options="options">
            <div class="action_container" slot="action" slot-scope="props">

              <router-link class="glyphicon glyphicon-eye-open"
                           :to="{ name: 'View Tax', params: { tax_id: props.row.tax_id, company_id: company_id }}"
                           v-tooltip="{
                    content: 'View Tax and Tax Rules',
                    placement: 'top',
                  }"
              ></router-link>
              <router-link class="fa fa-edit black"
                           :to="{ name: 'Edit Tax', params: { tax_id: props.row.tax_id, company_id: company_id }}"
                           v-tooltip="{
                    content: 'Edit Tax',
                    placement: 'top',
                  }"
              ></router-link>

              <a @click="showDeleteModal(props.row)"><i class="fa fa-trash red" v-tooltip="{
                    content: 'Delete this tax and all its groups',
                    placement: 'top',
                  }"
              ></i></a>

            </div>
          </v-client-table>

          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'

  import {ClientTable} from 'vue-tables-2'
  import Vue from 'vue'
  import swal from 'sweetalert2'
  import 'sweetalert2/dist/sweetalert2.css'


  Vue.use(ClientTable)


  export default {
    components: {
      Spinner
    },
    computed: {},
    methods: {
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/accounting/tax/all/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tableData = response.data.data
            console.log(response.data.data)
            return response.data.data
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      },
      showDeleteModal (row) {
        const self = this
        swal({
          title: 'Are you sure?',
          text: 'Are you sure you want to delete the tax ' + row.name + '? You can not revert restore the tax after you deleted it.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete'
        }).then((result) => {
          if (result) {
            let routeParams = self.$route.params
            self.axios.delete('/api/accounting/tax/delete/' + row.tax_id + '/' + routeParams.company_id)
              .then(function (response) {
                console.log(self.$refs)
                self.$refs.taxTable.$parent.fetchData()
                swal(
                  'Deleted!',
                  'You deleted the tax successfully',
                  'success'
                )
              })
              .catch(function (error) {
                console.log(error)
                swal(
                  'Error!',
                  'Not possible to delete the tax please try it again later',
                  'error'
                )
              })
          }
        }).catch(function () {
          return false
        })
      }
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
    data () {
      return {
        company_id: null,
        loading: false,
        columns: ['name', 'default_rate_read', 'rules', 'action'],
        perPage: 25,
        tableData: [],
        options: {
          headings: {
            name: 'Tax name',
            default_rate_read: 'Default Taxs rate',
            rules: 'No rule',
            action: '#'
          },
          uniqueKey: 'tax_id',
          sortable: ['name', 'default_rate_read'],
          filterable: ['name', 'default_rate_read'],
          highlightMatches: true
        }
      }
    }
  }
</script>
