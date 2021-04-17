<template>
  <transition name="fade">
    <div class="toast_back" v-show="show_message">
      <div class="toast">
        <p>{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
  data: () => ({
    message: '',
    show_message: false,
  }),
  methods: {
    show(message) {
      this.message = message;
      this.show_message = true;
      setTimeout(() => this.show_message = false, 1500);
    }
  }
};
</script>

<style>
.toast_back {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.toast {
  padding: 0.5em;
  border-radius: 2em;
  background-color: #333;
  color: white;
  text-align: center;

  margin-bottom: 10%;
  width: 60%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>