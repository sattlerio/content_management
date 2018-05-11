<template>
  <div class="card">
    <nav class="navbar navbar-default card-content">
      <div class="container-fluid">
        <div class="">
          <ul class="nav navbar-nav navbar-left">
            <li class="open">
              <router-link
                :to="{ name: 'Event details', params: { event_id: $route.params.event_id, company_id: $route.params.company_id }}"
                class="dropdown-toggle btn-magnify" v-bind:class="{ active: ($route.name === 'Event details')}" data-toggle="dropdown">
                <i class="ti-home"></i>
                <p>Overview</p>
              </router-link>
            </li>
            <drop-down tag="li" v-bind:class="{ active: ($route.name.includes('Ticket'))}" title="Tickets" icon="ti-ticket">
              <li>
                <router-link :to="{ name: 'Ticket Design', params: { event_id: $route.params.event_id, company_id: $route.params.company_id }}">Design</router-link>
              </li>
            </drop-down>
            <li>
              <router-link to="/admin/overview" class="btn-rotate">
                <i class="ti-settings"></i>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>

  export default {
    data () {
      return {
      }
    },
    methods: {
    }
  }
</script>
