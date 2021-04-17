<template>
  <div>
    <div class="player_selector" v-if="!selectable">
      <PlayerResultInput
        v-for="player in active_players"
        :key="player.name"
        :info="player"
        :editable="false"
      />
    </div>
    <div class="player_selector" v-if="selectable">
      <label v-for="player in active_players" :key="player.name">
        <input type="radio" name="player_selector" v-model="selected" :value="player.name">
        <div class="player_selector_shade">
          <PlayerResultInput
            :info="player"
            :editable="false"
          />
        </div>
      </label>
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
    selectable: { type: Boolean, default: false },
  },
  computed: {
    active_players: function () {
      return this.players.filter((x) => !x.archived);
    },
  },
  data: function () {
    return { selected: '', };
  },
  methods: {
    windowLoad: function () {},
    set(value) { this.selected = value; },
    get() { return this.selected; },
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
  margin: 0.3em;
}

.player_selector input[type="radio"] {
  display: none;
}

.player_selector_shade {
  display: grid;
}

.player_selector_shade > * {
  grid-row: 1;
  grid-column: 1;
  padding: 0.8em;
}

.player_selector input + .player_selector_shade::after {
  background-color: rgba(0, 0, 0, 0.35);
  content: '';
  grid-row: 1;
  grid-column: 1;
  border: 3px solid gray;
}

.player_selector input:checked + .player_selector_shade::after {
  background-color: rgba(0, 0, 0, 0.0);
  border-color: yellow;
}

</style>