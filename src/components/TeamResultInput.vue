<template>
  <div>
    <div class="team_container">
      <div class="team_title">{{ team.label }}</div>
      <div class="team_result">
        <div class="player" v-for="(member, i) in team.members" :key="team.name + '_' + member + '_' + i">
          <button type="button" v-on:click="onPlayerChange(team.name, i)">Change</button>
          <PlayerResultInput :info="players.find(x => x.name == member)" :editable="!!member" />
        </div>
      </div>
      <select><option v-for="race in races" :key="race.label">{{ race.label }}</option></select>
    </div>
  </div>
</template>

<script>
import PlayerResultInput from "./PlayerResultInput.vue";
export default {
  name: "TeamResultInput",
  props: {
    players: Array,
    races: Array,
    team: Object,
    onPlayerChange: Function,
  },
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
      // this.scrollParam.target = document.querySelector("#navi");
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
  margin: 0.2em;
}

.team_container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>