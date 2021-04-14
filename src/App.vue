<template>
  <div id="title">
    <h1>Hello, world</h1>
    <GroupResultInput />
    <PlayerSelector :players="data.players" />
  </div>
</template>

<script>
import GroupResultInput from "./components/GroupResultInput.vue";
import PlayerSelector from "./components/PlayerSelector.vue";
import sample_data from "./data/sample.json";

export default {
  name: "App",
  components: {
    GroupResultInput,
    PlayerSelector,
  },
  data: function () {
    return {
      view: "top",
      scrollParam: {},
      data: sample_data,
    };
  },
  methods: {
    windowLoad: function () {
      //      this.scrollParam.target = document.querySelector("#navi");
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
  margin: 3em;
}
</style>