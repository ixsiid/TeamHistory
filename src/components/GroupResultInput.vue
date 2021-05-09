<template>
  <div style="text-align: center">
    <label><input type="radio" name="team_result_kind" v-model="team_result_kind" value="rate" />勝率</label>
    <label><input type="radio" name="team_result_kind" v-model="team_result_kind" value="point" />勝ち点</label>
    <div class="group_result">
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" ref="sprinter" :kind="team_result_kind" :races="sprinter" :team="formatted_teams.find(x => x.name == 'sprinter')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" ref="mile" :kind="team_result_kind" :races="mile" :team="formatted_teams.find(x => x.name == 'mile')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" ref="middle" :kind="team_result_kind" :races="middle" :team="formatted_teams.find(x => x.name == 'middle')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" ref="stayer" :kind="team_result_kind" :races="stayer" :team="formatted_teams.find(x => x.name == 'stayer')" />
      <TeamResultInput :players="players" :onPlayerChange="onPlayerChange" ref="dirt" :kind="team_result_kind" :races="dirt" :team="formatted_teams.find(x => x.name == 'dirt')" />
    </div>
    <OpenCV style="display: none;" ref="opencv"
       :allow="require('../assets/template/allow.png')"
       :ranking="require('../assets/template/ranking.png')"
       :field="require('../assets/template/field.png')"
       :length="require('../assets/template/length.png')"
       :rotate="require('../assets/template/rotate.png')"
       :weather="require('../assets/template/weather.png')"
       :weight="require('../assets/template/weight.png')"
       :season="require('../assets/template/season.png')"
       :callback="onImageDone" />
    <label style="margin-right: 3em;">
      <input type="text" @paste="onPaste" style="width: 18em;" placeholder="スクリーンショットをここにペースト" />
      {{ opencv_status }}
      <label><input type="checkbox" v-model="save_image" />ペースト画像を保存</label>
    </label>

    <button type="button" v-on:click="regist_result">レース結果を登録</button>
  </div>
</template>

<script>
import TeamResultInput from "./TeamResultInput.vue";
import OpenCV from './OpenCV.vue';

export default {
  name: "GroupResultInput",
  components: {
    TeamResultInput,
    OpenCV,
  },
  props: {
    players: Array,
    races: Array,
    teams: Array,
    onPlayerChange: Function,
    onAddResult: Function,
  },
  data: function () {
    return { opencv_status: 'ペースト可能', save_image: false, team_result_kind: "rate" };
  },
  computed: {
    sprinter: function () { return this.races.filter(x => x.field == 'turf' && x.length <= 1400).sort((a, b) => a.length == b.length ? a.clockwise - b.clockwise : a.length - b.length); },
    mile: function () { return this.races.filter(x => x.field == 'turf' && x.length > 1400 && x.length <= 1800).sort((a, b) => a.length == b.length ? a.clockwise - b.clockwise : a.length - b.length); },
    middle: function () { return this.races.filter(x => x.field == 'turf' && x.length > 1800 && x.length <= 2400).sort((a, b) => a.length == b.length ? a.clockwise - b.clockwise : a.length - b.length); },
    stayer: function () { return this.races.filter(x => x.field == 'turf' && x.length > 2400).sort((a, b) => a.length == b.length ? a.clockwise - b.clockwise : a.length - b.length); },
    dirt: function () { return this.races.filter(x => x.field == 'dirt' && x.length >= 1600 && x.length <= 1800).sort((a, b) => a.length == b.length ? a.clockwise - b.clockwise : a.length - b.length); },
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
      // this.scrollParam.target = document.querySelector("#navi");
    },
    regist_result: function () {
      const results = ['sprinter', 'mile', 'middle', 'stayer', 'dirt'].map(x => ([x, this.$refs[x].get_result()]));
      Object.entries(this.onAddResult(Object.fromEntries(results))).forEach(([key, r]) => {
        if (r) this.$refs[key].clear();
      });
    },
    onPaste(event) {
      this.opencv_status = '画像処理中';
      
      if (event.clipboardData.items.length == 0) return false;

      const item = event.clipboardData.items[0];
      if(!item.type.startsWith('image')) return false;

      const image = URL.createObjectURL(item.getAsFile());
      this.$refs.opencv.run(image);

      if (this.save_image) {
        const a = document.createElement('a');
        a.setAttribute('href', image);
        a.setAttribute('download', `source_${new Date().getTime()}.png`);
        a.click();
      }
      
      return false;
    },
    opencv() {
      // Test function
      console.log(this.$refs.opencv.run(require('../assets/template/sample3.png')));
    },
    onImageDone(result) {
      this.opencv_status = result ? '読み取り成功' : '読み取り失敗';
      if (result) {
        ['sprinter', 'mile', 'middle', 'stayer', 'dirt'].forEach(x => this.$refs[x].set_result(result[x]));
      }
      setTimeout(() => this.opencv_status = 'ペースト可能', 3000);
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
  justify-content: center;
}

.group_result > * {
  background-color: rgb(211, 245, 195);
  border-radius: 1.5em;
  padding: 1em 0.5em;
  margin: 0.5em 0.3em;
}
</style>