<template>
  <div class="card">
    <div class="row card-content">
      <div class="col-md-12">
        <h5 class="card-title text-center">Name your Design and Select a theme</h5>
        <div class="form-group">
          <label class="control-label">
            Event name
          </label>
          <input class="form-control"
                 type="text"
                 name="name"
                 v-validate="modelValidations.name"
                 v-model="model.name"
          />
          <small class="text-danger" v-show="name.invalid">
            {{ getError('name') }}
          </small>
        </div>
        <div class="form-group">
          <label for="images">Select Theme</label>
          <vue-select-image :dataImages="dataImages"
                            :w="400"
                            @onselectimage="onSelectImage">
          </vue-select-image>
          <div class="col-md-12" v-show="error_msg">
            <div class="alert alert-danger" >
              <h5>{{ error_msg }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'
  import VueSelectImage from 'vue-select-image'
  require('vue-select-image/dist/vue-select-image.css')


  export default {
    components: {
      VueSelectImage
    },
    computed: {
      ...mapFields(['name'])
    },
    data () {
      return {
        error_msg: '',
        model: {
          name: '',
          images: ''
        },
        modelValidations: {
          name: {
            required: true
          }
        },
        dataImages: [{
          id: '1',
          src: 'https://unsplash.it/200?random',
          alt: 'Alt Image 1'
        }, {
          id: '2',
          src: 'https://unsplash.it/200?random',
          alt: 'Alt Image 2'
        }]
      }
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        this.error_msg = ''
        if (this.model.images) {
          return this.$validator.validateAll()
        }
        this.error_msg = 'You have to select a theme'
        return false
      },
      onSelectImage: function (data) {
        this.error_msg = ''
        this.model.images = Object.assign({}, this.model.images, data)
      }
    }
  }
</script>
<style>
</style>
