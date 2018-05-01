<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Create new Shipping Rule', params: { company_id: company_id }}">New Shipping Rule
          </router-link>
          <h4 class="title pull-left">All Shipping Rules</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <v-client-table :data="tableData" ref="shippingRuleTable" :columns="columns" :options="options">
            <div class="multi_day_event" slot="manual_shipping" slot-scope="props">
              <span v-if="props.row.manual_shipping">
                Manual Shipping
              </span>
              <span v-else="!props.row.manual_shipping">Automatic Shipping (Print@Home)</span>
            </div>
            <div class="action_container" slot="action" slot-scope="props">
              <router-link class="glyphicon glyphicon-eye-open"
                           :to="{ name: 'Shipping Rule Details', params: { shipping_rule_id: props.row.shipping_rule_id, company_id: company_id }}"
              ></router-link>

              <a @click="showDeleteModal(props.row)"><i class="fa fa-trash red" v-tooltip="{
                    content: 'Delete this shipping rule',
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
      showDeleteModal (row) {
        const self = this
        swal({
          title: 'Are you sure?',
          text: 'Are you sure you want to delete the shipping rule ' + row.name + '? You can not revert the rule after its deleted, also make sure the Shipping Rule is not in use anymore.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete'
        }).then((result) => {
          if (result) {
            let routeParams = self.$route.params
            self.axios.delete('/api/shipping/delete/' + row.shipping_rule_id + '/' + routeParams.company_id)
              .then(function (response) {
                self.$refs.shippingRuleTable.$parent.fetchData()
                swal(
                  'Deleted!',
                  'You deleted the shipping rule successfully',
                  'success'
                )
              })
              .catch(function (error) {
                console.log(error)
                swal(
                  'Error!',
                  'Not possible to delete the shipping rule please try it again later',
                  'error'
                )
              })
          }
        }).catch(function () {
          return false
        })
      },
      fetchData: function () {
        this.loading = true
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/shipping/all/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tableData = response.data.body
            return response.data.body
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
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
        columns: ['name', 'manual_shipping', 'action'],
        perPage: 25,
        tableData: [],
        options: {
          headings: {
            name: 'Name',
            manual_shipping: 'Manual Shipping',
            action: '#'
          },
          uniqueKey: 'shipping_rule_id',
          filterable: ['name'],
          sortable: ['manual_shipping'],
          highlightMatches: true
        }
      }
    }
  }
</script>
