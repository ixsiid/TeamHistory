<template>
  <div class="version">{{ version }}</div>
</template>

<script>
import p from '../../package.json';

export default {
  name: "Version",
  data: () => ({ version: p.version }),
};
</script>

<style scoped>
.version {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 1em;
  font-size: small;
}
</style>