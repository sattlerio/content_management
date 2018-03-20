<template>
  <div>
    <nav class="navbar navbar-transparent navbar-absolute">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle"
                  data-toggle="collapse"
                  data-target="#navigation-example-2"
                  @click="toggleNavbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" to="/">Paper Dashboard PRO</router-link>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right">
            <router-link to="/register" tag="li">
              <a>Register</a>
            </router-link>
            <router-link to="/admin/overview" tag="li">
              <a>Dashboard</a>
            </router-link>
          </ul>
        </div>
      </div>
    </nav>

    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page" data-color="red"
           data-image="static/img/background/background-2.jpg">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                <form>
                  <div class="card" data-background="color" data-color="blue">
                    <div class="card-header">
                      <h3 class="card-title">Login</h3>
                      <p>Welcome to NAME, to use the platform please login.</p>
                    </div>
                    <div class="card-content">
                      <div class="form-group">
                        <input type="email"
                               name="email"
                               v-validate="modelValidations.email"
                               v-model="model.email"
                               placeholder="enter your email address"
                               class="form-control input-no-border">
                        <small class="text-danger" v-show="email.invalid">
                          {{ getError('email') }}
                        </small>
                      </div>
                      <div class="form-group">
                        <label>Password</label>
                        <input type="password"
                               name="password"
                               placeholder="your password"
                               v-validate="modelValidations.password"
                               v-model="model.password"
                               class="form-control">
                        <small class="text-danger" v-show="password.invalid">
                          {{ getError('password') }}
                        </small>
                      </div>
                    </div>
                    <div class="card-footer text-center">
                      <div class="col-sm-12" v-show="model.error_msg">
                        <small class="text-danger">
                          {{ model.error_msg }}
                        </small>
                      </div>
                      <button type="submit" @click.prevent="validate" class="btn btn-fill btn-info btn-wd">Login
                      </button>
                      <div class="forgot">
                        <router-link to="/register">
                          Forgot your password?
                        </router-link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <footer class="footer footer-transparent">
          <div class="container">
            <div class="copyright">
              &copy; Coded with
              <i class="fa fa-heart heart"></i> by
              <a href="https://github.com/cristijora" target="_blank">Cristi Jora</a>.
              Designed by <a href="https://www.creative-tim.com/?ref=pdf-vuejs" target="_blank">Creative Tim</a>.
            </div>
          </div>
        </footer>
        <div class="full-page-background" style="background-image: url(static/img/background/background-2.jpg) "></div>
      </div>
    </div>
    <div class="collapse navbar-collapse off-canvas-sidebar">
      <ul class="nav nav-mobile-menu">
        <router-link to="/register" tag="li">
          <a>Register</a>
        </router-link>
        <router-link to="/admin/overview" tag="li">
          <a>Dashboard</a>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>

  import {mapFields} from 'vee-validate'

  export default {
    computed: {
      ...mapFields(['email', 'password'])
    },
    data () {
      return {
        model: {
          email: '',
          password: '',
          error_msg: ''
        },
        modelValidations: {
          email: {
            required: true,
            email: true
          },
          password: {
            required: true,
            min: 5
          }
        }
      }
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              this.$auth.login({
                data: {
                  username: this.model.email,
                  password: this.model.password
                },
                rememberMe: true,
                url: 'http://localhost:5000/auth/login',
                redirect: '/',
                fetchUser: true
              })
                .then((data) => {
                  if (data.status === 200) {
                    var accessToken = data.data.access_token
                    var refreshToken = data.data.refresh_token
                    this.$auth.token(accessToken)
                    localStorage.setItem('access_token', accessToken)
                  } else {
                    this.error_msg = 'Wrong username or password'
                    return false
                  }
                }, (res) => {
                  this.model.error_msg = 'Wrong username or password'
                })
            }
          })
      },
      toggleNavbar () {
        document.body.classList.toggle('nav-open')
      },
      closeMenu () {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      }
    },
    beforeDestroy () {
      this.closeMenu()
    }
  }
</script>
<style>
</style>
