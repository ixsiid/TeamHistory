<template>
  <div class="root">
    <div class="player_result">
      <p class="player_name">{{ info.name ? info.name : '未設定' }}</p>
      <p class="icon"><img v-bind:src="require(`../assets/character/${info.image}.png`)" :alt="info.image" :title="info.image" /></p>
      <p class="player_desc" :title="`[${grade.join('-')}]`">{{ result }}</p>
      <p v-if="editable" class="player_desc">{{ point[0].toFixed(2) }} pt</p>
      <div v-if="editable" class="edit">
        <label class="a1 rank"><input type="radio" :name="info.name + 'rank'" v-model="ranking" value="1"><span><span>1</span></span></label>
        <label class="a2 rank"><input type="radio" :name="info.name + 'rank'" v-model="ranking" value="2"><span><span>2</span></span></label>
        <label class="a3 rank"><input type="radio" :name="info.name + 'rank'" v-model="ranking" value="3"><span><span>3</span></span></label>
        <label class="a4 rank"><input type="radio" :name="info.name + 'rank'" v-model="ranking" value="4"><span><span>4</span></span></label>
        <label class="a5 rank"><input type="radio" :name="info.name + 'rank'" v-model="ranking" value="5"><span><span>5</span></span></label>
        <label class="ao rank"><input type="radio" :name="info.name + 'rank'" v-model="ranking" value="6"><span><span>外</span></span></label>
        <p class="score"><input type="number" v-model="score"></p>
      </div>
    </div>
    <div class="graph">
      <div class="graph-1" :style="borderGraph"></div>
      <div class="graph-2" :style="borderGraph"></div>
      <div class="graph-3" :style="borderGraph"></div>
      <div class="graph-5" :style="borderGraph"></div>
      <div class="graph-o" :style="borderGraph"></div>
    </div>
  </div>
</template>

<script>
// import Article from "./components/Article.vue";
export default {
  name: "PlayerResultInput",
  components: {
    //    Article,
  },
  props: {
    info: { type: Object, default: () => ({ name: undefined, image: 'mob', result: [] }) },
    editable: { type: Boolean, default: true },
    count: { type: Number, default: 20 },
  },
  data: function () {
    return {
      ranking: -1,
      score: 0,
    };
  },
  computed: {
    grade() {
      const grade = [0, 0, 0, 0, 0];
      grade[0] = this.info.result.filter(x => x.ranking == 1).length;
      grade[1] = this.info.result.filter(x => x.ranking == 2).length;
      grade[2] = this.info.result.filter(x => x.ranking == 3).length;
      grade[3] = this.info.result.filter(x => x.ranking <= 5).length;
      grade[4] = this.info.result.length - grade[3];
      grade[3] -= grade[0] + grade[1] + grade[2];

      return grade;
    },
    borderGraph() {
      if (!this.grade) return {};
      
      return {
        '--flex-grow-1': this.grade[0],
        '--flex-grow-2': this.grade[1],
        '--flex-grow-3': this.grade[2],
        '--flex-grow-4': this.grade[3],
        '--flex-grow-5': this.grade[4],
      };
    },
    result() {
      if (!this.grade) return '';

      return `${this.info.result.length}戦 ${this.grade[0]}勝`;
    },
    point() {
      const p = value => {
        if (value == 1) return 5;
        if (value == 2) return 3;
        if (value == 3) return 2;
        if (value == 4) return 1;
        if (value == 5) return 1;
        return 0;
      };
      const result = this.info.result.slice(-this.count);
      return [result.reduce((a,b) => a + p(b.ranking), 0) / result.length, result.length];
    }
  },
  methods: {
    windowLoad: function () {},
    clear: function () {
      this.ranking = -1;
      this.score = 0;
    },
    set_ranking(value) {
      if (value > 0) this.ranking = Math.min(value, 6);
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
.root {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
}

.player_result {
  display: flex;
  flex-direction: column;
  width: 5em;
}

.player_result > * {
  margin: 0;
  padding: 0;
}

.edit {
  display: grid;
  grid-template-rows: 15fr 15fr 15fr 30fr;
  grid-template-columns: 15fr 15fr 15fr 15fr 15fr 15fr;
}

.icon img {
  width: 95%;
  border-radius: 1.5em;
  border: 1px solid rgb(66, 0, 0);
}

.a1 {
  grid-row: 1;
  grid-column: 1 / span 2;
}

.a2 {
  grid-row: 1;
  grid-column: 3 / span 2;
}

.a3 {
  grid-row: 1;
  grid-column: 5 / span 2;
}

.a4 {
  grid-row: 2;
  grid-column: 2 / span 2;
}

.a5 {
  grid-row: 2;
  grid-column: 4 / span 2;
}

.ao {
  grid-row: 3;
  grid-column: 3 / span 2;
}

.rank {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank > span {
  border: 1px solid gray;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;

  font-size: 100%;
  
  color: gray;
}

.rank > span:hover {
  background-color: #ddd;;
}

.rank input {
  display: none;
}

.rank input:checked + span {
  background-color: rgb(255, 118, 27);
  font-weight: bold;
  color: white;
}

.score {
  grid-row: 4;
  grid-column: 1 / span 6;
}

.score > input {
  width: 80%;
}

.graph {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column-reverse;
  flex-grow: 1;
  margin-left: 0.1em;
}

.graph > * {
  border-right-style: solid;
  border-right-width: 8px;
}

.graph > *:nth-child(1) {
  border-right-color: rgb(255, 187, 0);
  flex-grow: var(--flex-grow-1);
}
.graph > *:nth-child(2) {
  border-right-color: rgb(224, 2, 176);
  flex-grow: var(--flex-grow-2);
}
.graph > *:nth-child(3) {
  border-right-color: rgb(62, 29, 251);
  flex-grow: var(--flex-grow-3);
}
.graph > *:nth-child(4) {
  border-right-color: rgb(133, 133, 133);
  flex-grow: var(--flex-grow-4);
}
.graph > *:nth-child(5) {
  border-right-color: rgb(36, 36, 36);
  flex-grow: var(--flex-grow-5);
}

.player_name {
  font-size: 80%;
  font-weight: bold;
  margin-bottom: 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.player_desc {
  font-size: 80%;
}
</style>