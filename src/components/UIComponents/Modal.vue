<script>
  export default {
    name: 'modal',
    methods: {
      close () {
        this.$emit('close')
      }
    }
  }
</script>
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal-dialog modal-small"
           role="dialog"
           aria-labelledby="modalTitle"
           aria-describedby="modalDescription"
      >
        <div class="modal-content">
          <header
            class="modal-header"
            id="modalTitle"
          >
            <div class="pull-left">
              <slot name="header">
                This is the default tile!

              </slot>
            </div>
            <button
              type="button"
              class="  pull-right"
              @click="close"
              aria-label="Close modal"
            >
              x
            </button>
          </header>
          <section
            class="modal-body"
            id="modalDescription"
          >
            <slot name="body">
              I'm the default body!
            </slot>
          </section>
          <footer class="modal-footer">
            <slot name="footer">
              <div class="text-left">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="close"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </div>
            </slot>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>
<style>

  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    text-align: center;
  }




</style>
