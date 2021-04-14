<template>
  <div>
    <button type="button">Change</button>
    <div class="team_result">
      <div class="player"><PlayerResultInput /></div>
      <div class="player"><PlayerResultInput /></div>
      <div class="player"><PlayerResultInput /></div>
    </div>
  </div>
</template>

<script>
import PlayerResultInput from "./PlayerResultInput.vue";
export default {
  name: "TeamResultInput",
  components: {
    PlayerResultInput,
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
.team_result {
  text-align: center;
}

.player {
  display: inline-block;
  margin: 0.3em;
}
</style>