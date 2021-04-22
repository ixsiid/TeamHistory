<template>
  <div class="team_info" v-show="showing" v-on:click="showing = false">
    <div v-on:click.stop="() => {}">
      <h1>{{ ({sprinter: '短距離', mile: 'マイル', middle: '中距離', stayer: '長距離', dirt: 'ダート'})[name] }}</h1>
      <p>全{{ formatted.length }}戦</p>
      <p><span v-for="f in count.field" :key="f[0]">{{ f[0] }} {{ f[1] }}</span></p>
      <p><span v-for="f in count.root" :key="f[0]">{{ f[0] }} {{ f[1] }}</span></p>
      <p>{{ count.length }}</p>
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
        ['他', 0]
      ];
      r.field[2][1] = r.all - r.field[0][1] - r.field[1][1];

      r.root = [
        ['根幹', this.formatted.filter(x => x.length % 400 == 0).length],
      ];
      r.root.push(['非根幹', r.all - r.root[0][1]]);


      r.length = {
        [1200]: 1500,
      };

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

<style>
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
</style>