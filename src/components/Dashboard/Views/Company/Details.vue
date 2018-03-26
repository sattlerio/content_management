<template>
  <spinner v-if="loading"></spinner>
  <div class="row" v-else>
    <div class="col-lg-4 col-md-5">
      <div class="card card-user">
        <div class="clearfix"></div>
        <div class="card-content">
          <div class="author">
            <img class="avatar border-white" v-bind:src="company_logo" width="100px" alt="">
            <h4 class="title">Chet Faker
              <br>
              <a href="#">
                <small>@chetfaker</small>
              </a>
            </h4>
          </div>
          <p class="description text-center">
            "I like the way you work it
            <br> No diggity
            <br> I wanna bag it up"
          </p>
        </div>
        <hr>
        <div class="text-center">
          <div class="row">
            <div v-for="(info,index) in details" :class="getClasses(index)">
              <h5>{{info.title}}
                <br>
                <small>{{info.subTitle}}</small>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-8 col-md-7">
      <div class="card">
        <div class="card-header">
          <h4 class="title">Edit Profile</h4>
        </div>
        <div class="card-content">
          <form>
            <div class="row">
              <div class="col-md-5">
                <fg-input type="text"
                          label="Company"
                          :disabled="true"
                          placeholder="Paper dashboard"
                >
                </fg-input>
              </div>
              <div class="col-md-3">

                <fg-input type="text"
                          label="Username"
                          placeholder="Username"
                >
                </fg-input>
              </div>
              <div class="col-md-4">
                <fg-input type="email"
                          label="Username"
                          placeholder="Email"
                >
                </fg-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <fg-input type="text"
                          label="First Name"
                          placeholder="First Name"
                >
                </fg-input>
              </div>
              <div class="col-md-6">
                <fg-input type="text"
                          label="Last Name"
                          placeholder="Last Name"
                >
                </fg-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <fg-input type="text"
                          label="Address"
                          placeholder="Home Address"
                >
                </fg-input>
              </div>
            </div>


            <div class="text-center">
              <button type="submit" class="btn btn-info btn-fill btn-wd">
                Update Profile
              </button>
            </div>
            <div class="clearfix"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/UIComponents/Spinner.vue'
  import axios from 'axios'
  export default {
    components: {
      Spinner
    },
    methods: {
      loadUserData: function () {
        const self = this
        let routeParams = self.$route.params
        axios.get('/api/company/details/' + routeParams.company_id)
          .then(function (response) {
            self.loading = false
            self.user = response.data.data
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
            self.$router.push('/server-error')
          })
      }
    },
    mounted () {
      this.loadUserData()
    },
    data () {
      return {
        loading: true,
        company_logo: 'static/img/default-company-logo.jpg',
        user: {
          company: 'Paper Dashboard',
          username: 'michael23',
          email: '',
          lastName: 'Faker',
          address: 'Melbourne, Australia',
          city: 'melbourne',
          postalCode: '',
          aboutMe: `Oh so, your weak rhyme. You doubt I'll bother, reading into it.I'll probably won't, left to my own devicesBut that's the difference in our opinions.`
        }
      }
    }
  }

</script>
