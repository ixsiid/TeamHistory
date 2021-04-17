<template>
  <div>
    <div class="group_result">
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" :races="sprinter" :team="formatted_teams.find(x => x.name == 'sprinter')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" :races="mile" :team="formatted_teams.find(x => x.name == 'mile')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" :races="middle" :team="formatted_teams.find(x => x.name == 'middle')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" :races="stayer" :team="formatted_teams.find(x => x.name == 'stayer')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" :races="dirt" :team="formatted_teams.find(x => x.name == 'dirt')" />
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
  props: {
    players: Array,
    races: Array,
    teams: Array,
    onPlayerChange: Function,
  },
  data: function () {
    return {};
  },
  computed: {
    sprinter: function () { return this.races.filter(x => x.field == 'turf' && x.length <= 1400); },
    mile: function () { return this.races.filter(x => x.field == 'turf' && x.length > 1400 && x.length <= 1800); },
    middle: function () { return this.races.filter(x => x.field == 'turf' && x.length > 1800 && x.length <= 2400); },
    stayer: function () { return this.races.filter(x => x.field == 'turf' && x.length > 2400); },
    dirt: function () { return this.races.filter(x => x.field == 'dirt' && x.length >= 1600 && x.length <= 1800); },
    formatted_teams: function () {
      return this.teams.map(x => {
        x.members = x.members.filter((_, i) => i < 3);
        while(x.members.length < 3) x.members.push(undefined);
        return x;
      });
    },
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
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: stretch;
}

.group_result > * {
  background-color: #fee;
  border-radius: 1.5em;
  padding: 1em 0.5em;
  margin: 0.5em 0.3em;
}
</style>