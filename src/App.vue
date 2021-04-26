<template>
  <div id="title">
    <div>
      <h1>チームレース履歴</h1>
      <GroupResultInput :key="group_render_count"
                        :players="data.players"
                        :races="races"
                        :teams="data.teams"
                        :onPlayerChange="change_player"
                        :onAddResult="add_result" />
    </div>
    <PlayerList
      :onAddPlayer="add_player"
      :players="data.players"
      :characters="icons"
      />
    <div class="change_player_dialog" v-show="change_player_info.showing" v-on:click="change_player_info.showing = false">
      <div v-on:click.stop="()=>{}">
        <h3>変更するウマ娘を選択してください</h3>
        <PlayerSelector class="selector" ref="change_player" :players="data.players" :selectable="true" />
        <button type="button" v-on:click="change_player(
          change_player_info.race,
          change_player_info.index,
          $refs.change_player.get())">決定</button>
      </div>
    </div>
    <div class="data">
      <h1>データ管理</h1>
      今の記録を<button type="button" v-on:click="save(true)">ダウンロード</button>
      ローカル<input type="file" v-on:change="load" />
      <label><input type="checkbox" checked v-model="auto_save">ファイルの読み込み前に今の記録を自動でダウンロードする</label>
      <textarea v-show="false" v-model="encoded_data"></textarea>
      <p>リポジトリ: <a href="https://github.com/ixsiid/TeamHistory">Github</a></p>
    </div>
    <Toast ref="toast" />
    <DebugView v-show="debug" />
  </div>
</template>

<script>
import GroupResultInput from "./components/GroupResultInput.vue";
import PlayerSelector from "./components/PlayerSelector.vue";
import PlayerList from './components/PlayerList.vue';

import Toast from './components/Toast.vue';
import DebugView from './components/DebugView.vue';

import initial_data from "./data/initial.json";
import icons from './data/icons.json';
import races from './data/races.json';

export default {
  name: "App",
  components: {
    GroupResultInput,
    PlayerSelector,
    PlayerList,
    Toast,
    DebugView,
  },
  data: function () {
    return {
      version: [1,0,2],
      view: "top",
      scrollParam: {},
      data: initial_data,
      icons,
      change_player_info: {
        showing: false,
        race: '',
        name: '',
        index: -1,
      },
      encoded_data: '',
      group_render_count: 0,
      auto_save: true,
    };
  },
  computed: {
    races: () => races.map(x => ({
      length: x.length,
      field: x.field,
      clockwise: x.clockwise,
      label: `${x.length} ${x.field == 'turf' ? '芝': (x.field == 'dirt' ? 'D' : '不')} ${x.clockwise == null ? '直' : (x.clockwise ? '右' : '左')}`
    })).filter((x, i, a) => a.findIndex(y => y.label == x.label) == i),
    debug: () => window.location.hostname.startsWith('localhost'),
  },
  methods: {
    load: function (event) {
      this.save(this.auto_save);

      const file = event.target.files[0];
      if (!file) return false;
      const reader = new FileReader();
      reader.addEventListener('load', e => {
        try {
          this.data = JSON.parse(e.target.result);
        } catch(err) {
          this.toast('ファイルの読み込みに失敗しました');
        }
      });
      reader.readAsText(file);
    },
    save: function(download_json) {
      this.data.version = this.version.join(".");
      this.encoded_data = JSON.stringify(this.data, null, 2);
      localStorage.setItem('data', this.encoded_data);

      if (download_json) {
        const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'application/json'});
        const a = document.createElement('a');
        a.setAttribute('href', URL.createObjectURL(blob));
        a.setAttribute('download', `${this.debug ? 'debug_' : ''}uma_team_${new Date().toISOString().substr(0, 10)}_${new Date().getTime()}.json`);
        a.click();
      }
    },
    toast: function(message) {
      this.$refs.toast.show(message);
    },
    windowLoad: function () {
      // this.scrollParam.target = document.querySelector("#navi");
    },
    add_player: function (player) {
      if (!player.name || typeof(player.name) != 'string' || player.name == '') {
        this.toast('選手登録時の名前は省略できません');
        return false;
      }
      if (this.data.players.find(x => x.name == player.name)) {
        this.toast('選手登録時の名前は重複できません');
        return false;
      }
      this.data.players.push(Object.assign(player, {
        archived: false,
        result: [],
        regist_date: new Date().toISOString().substr(0, 10),
      }));
      this.save(false);
      this.toast(`'${player.name}'を登録しました。`);
      return true;
    },
    change_player: function(race, index, name) {
      this.change_player_info.race = race;
      this.change_player_info.index = index;
      
      if (name) {
        this.change_player_info.showing = false;
        const new_team = this.data.teams.findIndex(x => x.name == race);
        const old_team = this.data.teams.findIndex(x => x.members.indexOf(name) >= 0);
        if (old_team >= 0) {
          const old_team_index = this.data.teams[old_team].members.indexOf(name);
          this.data.teams[old_team].members[old_team_index] = this.data.teams[new_team].members[index];
        }
        this.data.teams[new_team].members[index] = name;
        this.group_render_count++;

        this.save(false);
      } else {
        this.change_player_info.name = this.data.teams.find(x => x.name == race).members[index];
        this.$refs.change_player.set(this.change_player_info.name);
        this.change_player_info.showing = true;
      }
    },
    add_result: function (results) {
      const race_index = this.data.players.reduce((a, b) => Math.max(a, b.result.reduce((a, b) => Math.max(a, b.race_index), -1)), -1) + 1;
      const result = ['sprinter', 'mile', 'middle', 'stayer', 'dirt'].map(x => {
        const race = results[x].race;
        if (!race) {
          this.toast(`レースが選択されていません [${x}]`);
          return [x, false];
        }
        const players = results[x].players.filter(x => x.name);
        if (players.length == 0) return [x, false];
        if (players.length == 2 && (players[0].name == players[1].name)) {
          this.toast(`1つのレースで同じ順位は入力できません [${players[0].name}, ${players[1].name}]`);
          return [x, false];
        }
        if (players.length == 3) {
          if ( (players[0].name == players[1].name) ||
               (players[0].name == players[2].name) ||
               (players[1].name == players[2].name) ) {
            this.toast(`1つのレースで同じ順位は入力できません`);
            return [x, false];
          }
        }

        players.forEach(p => {
          const q = this.data.players.find(x => x.name == p.name);
          if (q) {
            q.result.push({
              race_index,
              length: race.length,
              field: race.field,
              clockwise: race.clockwise,
              ranking: p.ranking,
              score: p.score,
              season: race.season,
              weather: race.weather,
              weight: race.weight,
            });
          }
        });

        return [x, true];
      });

      this.save(false);

      return Object.fromEntries(result);
    },
  },
  mounted: function () {
    try {
      const loadData = JSON.parse(localStorage.getItem('data'));
      if (loadData.players instanceof Array && loadData.teams instanceof Array) {
        this.data = loadData;
      }
    } catch (e) {
      this.toast('LocalStorageにデータがありません');
    }
    this.save(false);

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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html {
  overflow-y: scroll;
}
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: #ccc;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 6px;
}

body {
  margin: 0;
}

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

.change_player_dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}

.change_player_dialog > * {
  background-color: white;
  padding: 2em;
  border-radius: 3em;
  width: 87%;
}

.data {
  width: 90%;
  margin: 1em auto;
  text-align: center;
}

.data > textarea {
  width: 100%;
  height: 20em;
}

.data > button,
.data > input,
.data > label {
  margin: 0.2em 2em 0.2em 0.05em;
}

</style>