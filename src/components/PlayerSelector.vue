<template>
  <div>
    <button type="button">Add</button>
    <div class="player_selector">
      <PlayerResultInput
        v-for="player in active_players"
        :key="player.name"
        :info="player"
        :editable="false"
      />
    </div>
  </div>
</template>

<script>
import PlayerResultInput from "./PlayerResultInput.vue";
export default {
  name: "PlayerSelector",
  components: {
    PlayerResultInput,
  },
  props: {
    players: Array,
  },
  computed: {
    active_players: function () {
      return this.players.filter((x) => !x.archived);
    },
  },
  data: function () {
    return {};
  },
  methods: {
    windowLoad: function () {},
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
.player_selector {
  display: flex;
  padding: 0.5em;
  background-color: #eee;
  width: fit-content;
  height: fit-content;
}

.player_selector > * {
  margin: 1em;
}
</style>