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
                <span v-if="props.row.sandbox">Test Environment only</span>
                <span v-else>Live Environment</span>
              </div>
            </div>
            <div class="action_container" slot="action" slot-scope="props">
              <a @click="showModal(props.row)" class="glyphicon glyphicon-eye-open"></a>

              <router-link class="fa fa-edit black"
                           :to="{ name: 'Edit Payment Channel', params: { company_id: company_id, channel_id: props.row.channel_uuid }}"
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
    <modal v-show="isModalVisible" @close="closeModal">
      <div class="djsklad" slot="header" slot-scope="header">
        View Channel Details
      </div>
      <div slot-scope="body" slot="body" v-if="channel">

        <div class="row">
          <div class="col-md-12">
            <h4 class="center text-center">{{ channel.name }}</h4>
            <hr>
            <p class="text-center"><strong>Details</strong></p>
          </div>
          <div class="col-md-6">
            <ul class="list-unstyled">
              <li>Name: <strong>{{ channel.name }}</strong></li>
              <li>Channel: <strong v-if="channel">{{ channel.channel_id.replace(/\b\w/g, l => l.toUpperCase()) }}</strong></li>
              <li>Status: <strong v-if="channel.sandbox">Test only</strong><strong v-else>Production (Live)</strong></li>
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="list-unstyled">
              <li v-show="channel.key">Key: <strong>{{ channel.key }}</strong></li>
              <li v-show="channel.private_key">Secret: <strong>{{ channel.private_key }}</strong></li>
            </ul>
          </div>
        </div>

      </div>
    </modal>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import Modal from 'src/components/UIComponents/Modal'

  import {ClientTable} from 'vue-tables-2'
  import Vue from 'vue'
  import swal from 'sweetalert2'
  import 'sweetalert2/dist/sweetalert2.css'

  Vue.use(ClientTable)

  export default {
    data () {
      return {
        isModalVisible: false,
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
          highlightMatches: true,
          channel: false
        }
      }
    },
    components: {
      Spinner,
      Modal
    },
    computed: {},
    methods: {
      showModal (channel) {
        const self = this
        self.channel = channel
        self.isModalVisible = true
      },
      closeModal () {
        const self = this
        self.isModalVisible = false
        self.channel = false
      },
      showDeleteModal (row) {
        const self = this
        swal({
          title: 'Are you sure?',
          text: 'Are you sure you want to delete the shipping rule ' + row.name + '? You can not revert the rule after its deleted, also make sure the Channel is not in use anymore.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete'
        }).then((result) => {
          if (result) {
            let routeParams = self.$route.params
            self.axios.delete('/api/channels/delete/payment/' + routeParams.company_id + '/' + row.channel_uuid)
              .then(function (response) {
                self.$refs.channelRuleTable.$parent.fetchData()
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
    }
  }
</script>
