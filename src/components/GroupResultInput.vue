<template>
  <div>
    <div class="group_result">
      <div class="team"><TeamResultInput /></div>
      <div class="team"><TeamResultInput /></div>
      <div class="team"><TeamResultInput /></div>
      <div class="team"><TeamResultInput /></div>
      <div class="team"><TeamResultInput /></div>
    </div>
    <button type="button">Regist</button>
  </div>
</template>

<script>
import TeamResultInput from "./TeamResultInput.vue";
export default {
  name: "GroupResultInput",
  components: {
    TeamResultInput,
  },
  data: function () {
    return {
      view: "top",
    };
  },
  methods: {
    windowLoad: function () {
      //      this.scrollParam.target = document.querySelector("#navi");
    },
  },
  mounted: function () {
    window.addEventListener("load", this.windowLoad, {
      once: true,
      passive: true,
    });
    dispatchEvent(new PopStateEvent("popstate", {}));
  },
  destroyed: function () {
    window.removeEventListener("load", this.windowLoad, {
      once: true,
      passive: true,
    });
  },
};
</script>

<style>
.group_result {
  text-align: center;
}

.team {
  display: inline-block;
  margin: 0.5em;
}
</style>