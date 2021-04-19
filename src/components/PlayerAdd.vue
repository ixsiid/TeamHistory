<template>
  <div>
    <label><h4>名前</h4><input type="text" v-model="name" class="add_player_name_form" /></label>
    <h4>アイコンを選択</h4>
    <div class="icon_list">
      <label class="icon" v-for="icon in icons" :key="icon">
        <input type="radio" name="add_player_icon" :value="icon" v-model="image">
        <div class="shade"><img :src="require(`../assets/character/${icon}.png`)" :alt="icon" :title="icon" /></div>
      </label>
    </div>
    <button type="button" v-on:click="add_player">追加</button>
  </div>
</template>

<script>
export default {
  name: "PlayerAdd",
  components: {
  },
  props: {
    icons: Array,
    callback: { type: Function, default: function (player) { console.log(player); } },
  },
  computed: {},
  data: function () {
    return { name: '', image: null };
  },
  methods: {
    windowLoad: function () {},
    add_player: function () {
      if (this.callback({
        name: this.name,
        image: this.image,
      })) {
        this.name = '';
        this.image = this.icons[0];
      }
    },
  },
  mounted: function () {
    window.addEventListener("load", this.windowLoad, {
      once: true,
      passive: true,
    });
    dispatchEvent(new PopStateEvent("popstate", {}));

    this.image = this.icons[0];
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
.icon_list > * {
  display: inline-block;
}

.shade {
  display: grid;
  grid-template-columns: 5em;
  margin: 0.3em;
}

.shade img {
  grid-row: 1;
  grid-column: 1;
  border-radius: 50%;
}

.icon input + .shade::after {
  background-color: rgba(0, 0, 0, 0.35);
  content: '';
  grid-row: 1;
  grid-column: 1;
  border-radius: 50%;
  border: 3px solid gray;
}

.icon input:checked + .shade::after {
  background-color: rgba(0, 0, 0, 0.0);
  border-color: yellow;
}

.icon > input[type="radio"] {
  display: none;
}

h4 {
  font-size: 110%;
  margin: 1em auto 0.1em auto;
}

.add_player_name_form {
  font-size: 200%;
}
</style>