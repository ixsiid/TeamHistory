<template>
  <div>
    <div class="team_container">
      <div class="team_title">{{ team.label }}</div>
      <div class="team_result">
        <div class="player" v-for="(member, i) in team.members" :key="team.name + '_' + member + '_' + i">
          <button type="button" v-on:click="onPlayerChange(team.name, i)">Change</button>
          <PlayerResultInput ref="player" :info="players.find(x => x.name == member)" :editable="!!member" />
        </div>
      </div>
      <select class="race_selector" v-model="race">
        <option value="null"></option>
        <option v-for="race in races" :key="race.label" :value="race">{{ race.label }}</option>
      </select>
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
    return { race: null };
  },
  methods: {
    windowLoad: function () {
      // this.scrollParam.target = document.querySelector("#navi");
    },
    get_result: function () {
      return {
        players: this.$refs.player.map(x => ({ name: x.info.name, score: parseInt(x.score), ranking: parseInt(x.ranking) })),
        race: this.race,
      };
    },
    clear: function () {
      this.race = null;
      this.$refs.player.forEach(x => x.clear());
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

.race_selector {
  font-size: 130%;
}
</style>