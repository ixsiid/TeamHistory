<template>
  <div>
    <h1>登録ウマ娘<button class="add_player_button" type="button" v-on:click="showing_add_dialog = true" title="追加" /></h1>
    <div class="player_selector_container">
      <div>
        <input type="text" v-model="player_filter_name" placeholder="名前でフィルタ" />
        <h5>出走履歴</h5>
        <div class="filter_race">
          <label v-for="r in ['短距離', 'マイル', '中距離', '長距離', 'ダート']" :key="r"
            ><input type="checkbox"
            v-model="player_filter_race" :value="r" /><span>{{ r[0] }}</span>
          </label>
        </div>
        <h5>キャラクター</h5>
        <ul>
          <li class="icon_filter" v-for="chara in player_filter_character_list" :key="chara">
            <label><input type="checkbox" v-model="player_filter_characters" :value="chara" />{{ chara }}</label>
          </li>
        </ul>
      </div>
      <PlayerSelector class="selector" :players="filtered_players" />
    </div>
      
    <div class="dialog_background" v-show="showing_add_dialog" v-on:click="showing_add_dialog = false">
      <div class="dialog" v-on:click.stop="()=>{}">
        <h2>登録ウマ娘を追加</h2>
        <PlayerAdd :icons="characters" :callback="onAddPlayer" />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerSelector from './PlayerSelector.vue';
import PlayerAdd from './PlayerAdd.vue';
export default {
  name: "PlayerList",
  components: {
    PlayerSelector,
    PlayerAdd,
  },
  props: {
    onAddPlayer: { type: Function, default: () => {} },
    players: { type: Array, default: () => ([]) },
    characters: { type: Array, default: () => ([]) },
  },
  data: function () {
    return {
      showing_add_dialog: false,
      player_filter_name: '',
      player_filter_characters: [],
      player_filter_race: [],
    };
  },
  computed: {
    filtered_players() {
      const filters = [];
      if (this.player_filter_name)
      filters.push(x => x.name.includes(this.player_filter_name));
      
      if (this.player_filter_characters.length > 0)
        filters.push(x => this.player_filter_characters.indexOf(x.image) >= 0);

      const race_filter = {
        '短距離': p => p.field == 'turf' && p.length <= 1400,
        'マイル': p => p.field == 'turf' && p.length > 1400 && p.length <= 1800,
        '中距離': p => p.field == 'turf' && p.length > 1800 && p.length <= 2400,
        '長距離': p => p.field == 'turf' && p.length > 2400,
        'ダート': p => p.field == 'dirt',
      };
      if (this.player_filter_race.length > 0)
        filters.push(x => this.player_filter_race.reduce((q, r) => q || x.result.find(race_filter[r]), false));
        
      return filters.reduce((array, filter) => array.filter(filter), this.players);
    },
    player_filter_character_list() {
      return this.characters.filter(x => this.players.find(p => p.image == x));
    },
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


<style scoped>
h1 {
  text-align: center;
  margin: 1em;
}

h1 > button {
  margin-left: 3em;
}

.dialog_background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background-color: #eff;
  padding: 2em;
  border-radius: 5em;
  width: 60%;
  text-align: center;
}

.selector {
  margin: 0.5em 3em;
  background-color: #ffe;
  border-radius: 2em;
}

.player_selector_container {
  display: flex;
  width: 90%;
  margin: 0 auto;
}

.icon_filter {
  white-space: nowrap;
}

.add_player_button {
  width: 2em;
  height: 2em;
  padding: 0.5em;
  margin: 0 0 0 1em;
  background-image: url('../assets/icon/plus.png');
  background-size: 2em;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  border-radius: 50%;
  background-color: white;
}

.add_player_button:hover {
  background-color: rgb(36, 233, 240);
}

.filter_race {
  display: flex;
  flex-direction: row;
}

.filter_race input {
  display: none;
}

.filter_race span {
  display: flex;
  background-color: #eee;
  border: 1px solid black;
  border-radius: 50%;
  font-size: 105%;
  width: 1.2em;
  height: 1.2em;
  padding: 0.3em;
  margin: 0 0.2em;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.filter_race input:checked + span {
  background-color: lightgreen;
}

.filter_race input + span:hover {
  background-color: yellow;
}

.filter_race input:checked + span:hover {
  background-color: rgb(194, 255, 194);
}





</style>