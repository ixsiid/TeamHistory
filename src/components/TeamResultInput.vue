<template>
  <div>
    <div class="team_container">
      <h3 class="team_title">{{
        team.label
        }}<span class="team_rate"
        >勝率<span
          :class="rate > 0.8 ? 'perfect' : rate > 0.6 ? 'good' : rate > 0.3 ? 'normal' : 'bad'"
          >{{
            (rate * 100).toFixed(0)
          }}</span>%</span>
        <button type="button" class="info_button" v-on:click="$refs.info.show()">i</button>
      </h3>
      <div class="team_result">
        <div class="player" v-for="(member, i) in team.members" :key="team.name + '_' + member + '_' + i">
          <button class="change_button" type="button" v-on:click="onPlayerChange(team.name, i)" title="入れ替え"></button>
          <PlayerResultInput ref="player" :info="players.find(x => x.name == member)" :editable="!!member" />
        </div>
      </div>
      <select class="race_selector" v-model="race">
        <option hidden value="null">レースを選択</option>
        <option v-for="race in races" :key="race.label" :value="race">{{ race.label }}</option>
      </select>
    </div>
    <TeamRaceInfo :results="results" :name="team.name" ref="info" />
  </div>
</template>

<script>
import PlayerResultInput from "./PlayerResultInput.vue";
import TeamRaceInfo from './TeamRaceInfo.vue';

const race_filter = {
  sprinter: race => race.field == 'turf' && race.length <= 1400,
  mile: race => race.field == 'turf' && race.length > 1400 && race.length <= 1800,
  middle: race => race.field == 'turf' && race.length > 1800 && race.length <= 2400,
  stayer: race => race.field == 'turf' && race.length > 2400,
  dirt: race => race.field == 'dirt',
};

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
    TeamRaceInfo,
  },
  data: function () {
    return { race: null };
  },
  computed: {
    results() {
      if (this.players.length == 0) return [];
      
      return this.players.map(x => x.result)
              .flat()
              .filter(race_filter[this.team.name])
              .sort((a, b) => a.race_index - b.race_index);
    },
    rate() {
      if (this.players.length == 0) return NaN;
      
      const results = this.team.members.map(x =>
                              this.players
                                  .find(y => y.name == x)
                                  .result
                                  .filter(race_filter[this.team.name]))
                              .reduce((a, b) => a.concat(b), []);
                                       
      // race_indexの索引
      const indecies = results.map(x => x.race_index)
                              .filter((x, i, a) => a.indexOf(x) == i)
                              .sort((a, b) => b - a) // 降順ソートして先頭から20こ(勝率計算対象)を切り出す
                              .slice(0, 20);
      
      // チームの最高順位
      const team_result = indecies.map(x => results.filter(r => r.race_index == x))
                                  .map(x => x.map(r => r.ranking))
                                  .map(x => Math.min(...x));
      return team_result.filter(x => x == 1).length / indecies.length;
    }
  },
  methods: {
    windowLoad: function () {},
    get_result: function () {
      return {
        players: this.$refs.player.map(x => ({ name: x.info.name, score: parseInt(x.score), ranking: parseInt(x.ranking) })),
        race: this.race,
      };
    },
    set_result(result) {
      const label = `${result.length} ${result.field == 'turf' ? '芝' : 'D'} ${result.clockwise == null ? '直' : result.clockwise ? '右' : '左'}`;
      this.race = this.races.find(x => x.label == label);
      result.ranking.forEach((x, i) => this.$refs.player[i].set_ranking(x));
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

.team_title {
  font-size: 170%;
  margin: 0em auto 0.3em auto;
  border-bottom: 4px solid rgb(253, 22, 119);
  width: 100%;
}

.team_rate {
  font-size: 50%;
  margin-left: 1em;
  color: rgb(71, 71, 71);
}

.team_rate > span {
  font-size: 190%;
  margin: 0 0.15em;
  color: rgb(71, 22, 2);
}

.team_rate > span.bad {
  color: rgb(71, 22, 2);
}

.team_rate > span.normal {
  color: rgb(177, 22, 112);
}

.team_rate > span.good {
  color: rgb(49, 145, 255);
}

.team_rate > span.perfect {
  color: rgb(255, 52, 147);
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

.change_button {
  width: 2.5em;
  height: 2.5em;
  background-image: url('../assets/icon/reload.png');
  background-repeat: no-repeat;
  background-size: 1.5em;
  background-position: center;
  vertical-align: middle;
  padding: 0.2em;
  margin-bottom: 0.5em;
  border: none;
  border-radius: 50%;

  background-color: #eee;
}

.change_button:hover {
  background-color: rgb(248, 248, 139);
}

.info_button {
  margin-left: 1em;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  border: none;
  background-color: white;
  font-weight: 900;
  vertical-align: middle
}

.info_button:hover {
  background-color: lightgray;
}
</style>