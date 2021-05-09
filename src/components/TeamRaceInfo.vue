<template>
  <div class="team_info" v-show="showing" v-on:click="showing = false">
    <div v-on:click.stop="() => {}">
      <h1>{{ ({sprinter: '短距離', mile: 'マイル', middle: '中距離', stayer: '長距離', dirt: 'ダート'})[name] }}</h1>
      <p>全{{ formatted.length }}戦</p>

      <div class="count">
        <div class="rotation">
          <h4>回り</h4>
          <div class="ratio_graph"><span v-for="f in count.field.filter(x => x[1])" :style="`flex-grow: ${f[1]};`" :key="f[0]">{{ f[0] }} {{ f[1] }}</span></div>
        </div>

        <div class="weather">
          <h4>天気</h4>
          <div class="ratio_graph"><span v-for="f in count.weather.filter(x => x[1])" :style="`flex-grow: ${f[1]};`" :key="f[0]">{{ f[0] }} {{ f[1] }}</span></div>
          <h4>天気別勝利比率</h4>
          <ul class="ratio_length">
            <li v-for="l in count.weather" :key="l[0]" :title="`${l[1]}戦 ${l[2]}勝 ${(l[2] / l[1] * 100).toFixed(1)}%`">
              <span :style="`width: ${l[1] > 0 ? l[2] / l[1] * 100 : 0}%;`">{{ l[0] }}</span>
            </li>
          </ul>
        </div>

        <div class="weight">
          <h4>バ場</h4>
          <div class="ratio_graph"><span v-for="f in count.weight.filter(x => x[1])" :style="`flex-grow: ${f[1]};`" :key="f[0]">{{ f[0] }} {{ f[1] }}</span></div>
          <h4>バ場別勝利比率</h4>
          <ul class="ratio_length">
            <li v-for="l in count.weight" :key="l[0]" :title="`${l[1]}戦 ${l[2]}勝 ${(l[2] / l[1] * 100).toFixed(1)}%`">
              <span :style="`width: ${l[1] > 0 ? l[2] / l[1] * 100 : 0}%;`">{{ l[0] }}</span>
            </li>
          </ul>
        </div>

        <div class="season">
          <h4>季節</h4>
          <div class="ratio_graph"><span v-for="f in count.season.filter(x => x[1])" :style="`flex-grow: ${f[1]};`" :key="f[0]">{{ f[0] }} {{ f[1] }}</span></div>
          <h4>季節別勝利比率</h4>
          <ul class="ratio_length">
            <li v-for="l in count.season" :key="l[0]" :title="`${l[1]}戦 ${l[2]}勝 ${(l[2] / l[1] * 100).toFixed(1)}%`">
              <span :style="`width: ${l[1] > 0 ? l[2] / l[1] * 100 : 0}%;`">{{ l[0] }}</span>
            </li>
          </ul>
        </div>
        
        <div class="length">
          <h4>根幹</h4>
          <div class="ratio_graph"><span v-for="f in count.root" :style="`flex-grow: ${f[1]};`" :key="f[0]">{{ f[0] }} {{ f[1] }}</span></div>
          <h4>距離別出現頻度</h4>
          <ul class="ratio_length">
            <li v-for="l in count.length" :key="l[0]">
              <span :style="`width: ${l[1] > 0 ? l[1] / count.all * 100 : 0}%;`">{{ l[0] }}</span>
            </li>
          </ul>
          <h4>距離別勝利比率</h4>
          <ul class="ratio_length">
            <li v-for="l in count.length" :key="l[0]" :title="`${l[1]}戦 ${l[2]}勝 ${(l[2] / l[1] * 100).toFixed(1)}%`">
              <span :style="`width: ${l[1] > 0 ? l[2] / l[1] * 100 : 0}%;`">{{ l[0] }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeamRaceInfo",
  props: {
    name: String,
    results: Array,
  },
  components: {},
  data: function () {
    return { showing: false, };
  },
  computed: {
    formatted() {
      const indecies = this.results.map(x => x.race_index).filter((x, i, a) => a.indexOf(x) == i);
      return indecies.map(x => {
          const t = this.results.filter(r => r.race_index == x);
          const ranking = t.map(r => r.ranking);
          return {
            length: t[0].length,
            field: t[0].field,
            clockwise: t[0].clockwise,
            best: Math.min(...ranking),
            weather: t[0].weather,
            weight: t[0].weight,
            season: t[0].season,
            ranking
          };
      });
    },
    count() {
      if (!this.formatted) return {};

      const r = {
        all: this.formatted.length,
      };
      
      r.field = [
        ['右', this.formatted.filter(x => x.clockwise == true).length],
        ['左', this.formatted.filter(x => x.clockwise == false).length],
        ['直', 0]
      ];
      r.field[2][1] = r.all - r.field[0][1] - r.field[1][1];

      [
        ['weather', ['晴れ', '曇り', '雨', '雪']],
        ['weight', ['良', '稍重', '重', '不良']],
        ['season', ['春', '夏', '秋', '冬']]
      ].forEach(q => {
        r[q[0]] = q[1].map(x => {
          const t = this.formatted.filter(r => r[q[0]] == x);
          return [
            x,
            t.length,
            t.filter(r => r.best == 1).length];
        });
      });

      const length = this.formatted.map(x => x.length);
      r.root = [
        ['根幹', length.filter(x => x % 400 == 0).length],
      ];
      r.root.push(['非根幹', r.all - r.root[0][1]]);

      const length_index = length.filter((x, i, a) => a.indexOf(x) == i)
                                 .sort((a, b) => a - b);
      r.length = length_index.map(x => [
                                          x,
                                          length.filter(y => y == x).length,
                                          this.formatted.filter(r => r.length == x && r.best == 1).length
                                       ]);

      return r;
    }
  },
  methods: {
    windowLoad: function () {},
    show() { this.showing = true; },
    hide() { this.showing = false; },
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
.team_info {
  display: flex;
  position: fixed;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(64, 64, 64, 0.4);
  align-items: center;
  justify-content: center;
}

.team_info > * {
  max-width: 80%;
  max-height: 75%;
  overflow-y: scroll;
  background-color: white;
  border-radius: 1em;
  padding: 1em;
}

.ratio_graph {
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: gray;
}

.ratio_graph > * {
  --color: darkgray;
  border-top: 1px solid var(--color);
  border-right: 1px solid var(--color);
  border-bottom: 1px solid var(--color);
  flex-basis: 0;
  overflow: hidden;
}

.ratio_graph > *:first-child {
  border-left: 1px solid darkgray;
}

.ratio_length {
  text-align: left;
  padding: 0;
  margin: 0;
  list-style-type: none;
  width: 100%;
}

.ratio_length > li {
  margin: 0 0;
  border: 1px solid lightgray;
}

.ratio_length > li span {
  display: inline-block;
  ; border-right: 1px solid darkgray;
}

.ratio_graph > span:nth-child(2), 
.ratio_length > li:nth-child(1) span {
  background-color: hsla(30, 70%, 70%, 1.0);
}

.ratio_graph > span:nth-child(3), 
.ratio_length > li:nth-child(2) span {
  background-color: hsla(100, 70%, 70%, 1.0);
}

.ratio_graph > span:nth-child(4), 
.ratio_length > li:nth-child(3) span {
  background-color: hsla(170, 70%, 70%, 1.0);
}

.ratio_graph > span:nth-child(5), 
.ratio_length > li:nth-child(4) span {
  background-color: hsla(240, 70%, 70%, 1.0);
}

.ratio_graph > span:nth-child(6), 
.ratio_length > li:nth-child(5) span {
  background-color: hsla(310, 70%, 70%, 1.0);
}

.ratio_graph > span:nth-child(7), 
.ratio_length > li:nth-child(6) span {
  background-color: hsla(20, 70%, 70%, 1.0);
}

.ratio_graph > span:nth-child(1), 
.ratio_length > li:nth-child(7) span {
  background-color: hsla(90, 70%, 70%, 1.0);
}

.count {
  display: grid;
}

.count > * {
  margin : 2em;
  width: 12em;
}

.rotation {
  grid-row: 1/2;
  grid-column: 1/2;
}

.weather {
  grid-row: 2/4;
  grid-column: 1/2;
}

.season {
  grid-row: 1/3;
  grid-column: 2/3;
}

.weight {
  grid-row: 3/5;
  grid-column: 2/3;
}

.length {
  grid-row: 1/4;
  grid-column: 3/4;
}

</style>