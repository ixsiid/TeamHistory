<template>
  <div id="title">
    <div>
      <h1>チームレース履歴</h1>
      <GroupResultInput :key="group_render_count" :players="data.players" :races="races" :teams="data.teams" :onPlayerChange="change_player" :onAddResult="add_result" />
    </div>
    <div>
      <h1>登録ウマ娘<button type="button" v-on:click="showing_add_dialog = true">追加</button></h1>
      <PlayerSelector class="selector" :players="data.players" />      
    </div>
    <div class="dialog_background" v-show="showing_add_dialog" v-on:click="showing_add_dialog = false">
      <div class="dialog" v-on:click.stop="()=>{}">
        <h2>登録ウマ娘を追加</h2>
        <PlayerAdd :icons="icons" :callback="add_player" />
      </div>
    </div>
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
      <button type="button" v-on:click="save(true)">ダウンロード</button>
      <input type="file" v-on:change="load" />
      <label><input type="checkbox" checked>ファイルの読み込み前に自動保存する</label>
      <textarea v-model="encoded_data"></textarea>
    </div>
    <Toast ref="toast" />
  </div>
</template>

<script>
import GroupResultInput from "./components/GroupResultInput.vue";
import PlayerSelector from "./components/PlayerSelector.vue";
import PlayerAdd from './components/PlayerAdd.vue';
import Toast from './components/Toast.vue';

import sample_data from "./data/sample.json";
import icons from './data/icons.json';
import races from './data/races.json';

export default {
  name: "App",
  components: {
    GroupResultInput,
    PlayerSelector,
    PlayerAdd,
    Toast,
  },
  data: function () {
    return {
      view: "top",
      scrollParam: {},
      data: sample_data,
      icons,
      showing_add_dialog: false,
      change_player_info: {
        showing: false,
        race: '',
        name: '',
        index: -1,
      },
      encoded_data: '',
      group_render_count: 0,
    };
  },
  computed: {
    races: () => races.map(x => ({
      length: x.length,
      field: x.field,
      clockwise: x.clockwise,
      label: `${x.length} ${x.field == 'turf' ? '芝': (x.field == 'dirt' ? 'D' : '不')} ${x.clockwise ? '右' : '左'}`
    })).filter((x, i, a) => a.findIndex(y => y.label == x.label) == i),
  },
  methods: {
    load: function (event) {
      this.save(true);

      const file = event.target.files[0];
      if (!file) return false;
      const reader = new FileReader();
      reader.addEventListener('load', e => {
        console.log(e);
        console.log(e.target);
        console.log(e.target.result);
        try {
          console.log(JSON.parse(e.target.result));
          this.data = JSON.parse(e.target.result);
        } catch(err) {
          this.toast('ファイルの読み込みに失敗しました');
        }
      });
      reader.readAsText(file);
    },
    save: function(download_json) {
      this.encoded_data = JSON.stringify(this.data, null, 2);
      if (download_json) {
        const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'application/json'});
        const a = document.createElement('a');
        a.setAttribute('href', URL.createObjectURL(blob));
        a.setAttribute('download', `umamusume_team_history_${new Date().getTime()}.json`);
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
      this.data.players.push(Object.assign(player, { archived: false, result: []}));
      this.save(false);
      this.toast(`'${player.name}'を登録しました。`);
      return true;
    },
    change_player: function(race, index, name) {
      this.change_player_info.race = race;
      this.change_player_info.index = index;
      console.log(name);
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
      console.log(results);

      this.save(false);
    },
  },
  mounted: function () {
    try {
      const loadData = JSON.parse(localStorage.data);
      if (loadData.players instanceof Array && loadData.teams instanceof Array) {
        this.data = loadData;
      }
    } catch (e) {
      console.log('Cannot read from localstorage');
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

.selector {
  margin: 0.5em 3em;
  overflow-x: scroll;
  background-color: #ffe;
  border-radius: 2em;
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
}

.data {
  width: 90%;
  margin: 1em auto;
}

.data > textarea {
  width: 100%;
  height: 20em;
}

.data > button,
.data > input,
.data > label {
  margin: 0.2em 2em;
}

</style>