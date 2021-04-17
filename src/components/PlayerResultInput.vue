<template>
  <div class="root">
    <div class="player_result">
      <p class="player_name">{{ info.name }}</p>
      <p class="icon"><img v-bind:src="require(`../assets/image/${info.image}.png`)" /></p>
      <p>{{ result }}</p>
      <div v-if="editable" class="edit">
        <label class="a1 rank"><input type="radio" :name="info.name + 'rank'" ><span><span>1</span></span></label>
        <label class="a2 rank"><input type="radio" :name="info.name + 'rank'" ><span><span>2</span></span></label>
        <label class="a3 rank"><input type="radio" :name="info.name + 'rank'" ><span><span>3</span></span></label>
        <label class="a4 rank"><input type="radio" :name="info.name + 'rank'" ><span><span>4</span></span></label>
        <label class="a5 rank"><input type="radio" :name="info.name + 'rank'" ><span><span>5</span></span></label>
        <label class="ao rank"><input type="radio" :name="info.name + 'rank'" ><span><span>外</span></span></label>
        <p class="score"><input type="number"></p>
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
    info: { type: Object, default: () => ({ name: '未設定', image: 'mob', result: [] }) },
    editable: { type: Boolean, default: true },
  },
  data: function () {
    return {
      view: "top",
    };
  },
  computed: {
    borderGraph() {
      const graph = [0, 0, 0, 0, 0];
      graph[0] = this.info.result.filter(x => x.ranking == 1).length;
      graph[1] = this.info.result.filter(x => x.ranking == 2).length;
      graph[2] = this.info.result.filter(x => x.ranking == 3).length;
      graph[3] = this.info.result.filter(x => x.ranking <= 5).length;
      graph[4] = this.info.result.length - graph[3];
      graph[3] -= graph[0] + graph[1] + graph[2];

      return {
        '--flex-grow-1': graph[0],
        '--flex-grow-2': graph[1],
        '--flex-grow-3': graph[2],
        '--flex-grow-4': graph[3],
        '--flex-grow-5': graph[4],
      };
    },
    result() {
      const graph = [0, 0, 0, 0, 0];
      graph[0] = this.info.result.filter(x => x.ranking == 1).length;
      graph[1] = this.info.result.filter(x => x.ranking == 2).length;
      graph[2] = this.info.result.filter(x => x.ranking == 3).length;
      graph[3] = this.info.result.filter(x => x.ranking <= 5).length;
      graph[4] = this.info.result.length - graph[3];
      graph[3] -= graph[0] + graph[1] + graph[2];

      return `${graph[0]}-${graph[1]}-${graph[2]}-${graph[3]}-${graph[4]} (${this.info.result.length})`;
    },
  },
  methods: {
    windowLoad: function () {
      //      this.scrollParam.target = document.querySelector("#navi");
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
  width: 100%;
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
  background-color: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;

  font-size: 80%;
  
  color: gray;
}

.rank input {
  display: none;
}

.rank input:checked + span {
  background-color: #ccc;
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
}

.graph > * {
  border-right-style: solid;
  border-right-width: 8px;
}

.graph > *:nth-child(1) {
  border-right-color: orange;
  flex-grow: var(--flex-grow-1);
}
.graph > *:nth-child(2) {
  border-right-color: black;
  flex-grow: var(--flex-grow-2);
}
.graph > *:nth-child(3) {
  border-right-color: blue;
  flex-grow: var(--flex-grow-3);
}
.graph > *:nth-child(4) {
  border-right-color: lightgray;
  flex-grow: var(--flex-grow-4);
}
.graph > *:nth-child(5) {
  border-right-color: yellow;
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
</style>