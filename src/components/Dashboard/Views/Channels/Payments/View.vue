<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else="!loading">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <router-link class="pull-right btn btn-default"
                       :to="{ name: 'Create Payment Channel', params: { company_id: company_id }}">New Payment Channel
          </router-link>
          <h4 class="title pull-left">All Payment Channels</h4>
          <div class="clearfix"></div>
        </div>
        <div class="card-content">
          <v-client-table :data="tableData" ref="channelRuleTable" :columns="columns" :options="options">
            <div class="action_container" slot="channel_id" slot-scope="props">
              {{ props.row.channel_id.replace(/\b\w/g, l => l.toUpperCase()) }}
            </div>
            <div class="action_container" slot="sandbox" slot-scope="props">
              <div>
                <span v-if="sandbox">Test Environment only</span>
                <span v-else>Live Environment</span>
              </div>
            </div>
            <div class="action_container" slot="action" slot-scope="props">
              <router-link class="glyphicon glyphicon-eye-open"
                           :to="{ name: 'Shipping Rule Details', params: { channel_uuid: props.row.channel_uuid, company_id: company_id }}"
              ></router-link>

              <router-link class="fa fa-edit black"
                           :to="{ name: 'Edit Shipping Rule', params: { channel_uuid: props.row.channel_uuid, company_id: company_id }}"
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
        const self = this
        let routeParams = self.$route.params
        this.axios.get('/api/channels/fetch/payment/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.tableData = response.data.Channels
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
        loading: true,
        columns: ['name', 'channel_id', 'sandbox', 'action'],
        perPage: 25,
        tableData: [],
        options: {
          headings: {
            name: 'Name',
            channel_id: 'Channel',
            sandbox: 'Production',
            action: '#'
          },
          uniqueKey: 'channel_uuid',
          filterable: ['name', 'channel_id'],
          sortable: ['channel_id', 'sandbox'],
          highlightMatches: true
        }
      }
    }
  }
</script>
