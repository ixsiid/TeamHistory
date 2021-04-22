<template>
  <div class="debug_view">
    <div class="debug_header" v-show="!hideHeader">{{ header }}</div>
    <div class="debug_footer" v-show="!hideFooter">{{ footer }}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: {
    hideHeader: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
    header: { type: String, default: 'DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   ' },
    footer: { type: String, default: 'DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   DEBUG MODE....   ' },
  },
  data: () => ({
    message: '',
    show_message: false,
  }),
  methods: {}
};
</script>

<style>
.debug_view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  text-align: center;

  pointer-events:none;
}

.debug_view > * {
  background-color: rgba(255,0,0,0.4);
  color: white;
  font-weight: bold;
  height: 1em;
  padding: 0.2em 0 0.5em 0;
}
</style>