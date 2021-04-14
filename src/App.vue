<template>
	<div id="title">
		<h1>Hello, world</h1>
	</div>
</template>

<script>
// import Article from "./components/Article.vue";
export default {
  name: "App",
  components: {
//    Article,
  },
  data: function() {
    return {
      view: "top",
      articlePath: "",
      isColorEdit: false,
      scrollParam: {}
    };
  },
  methods: {
    windowLoad: function() {
//      this.scrollParam.target = document.querySelector("#navi");
    },
  },
  mounted: function() {
    window.addEventListener("load", this.windowLoad, {
      once: true,
      passive: true
    });
    dispatchEvent(new PopStateEvent("popstate", {}));
  },
  destroyed: function() {
    window.removeEventListener("load", this.windowLoad, {
      once: true,
      passive: true
    });
  }
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
#title {
  z-index: 100;
  overflow-x: hidden;
}
#title,
#navi {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  position: sticky;
  top: 0;
}
#logoA {
  filter: drop-shadow(2px 2px 3px #ccc);
}
#navi {
  align-items: center;
  background-color: #93b6dd;
  color: #333;
  box-shadow: 0 2px 6px 0 #82b2ef;
  margin-bottom: 2.5em;
}
#navi li:hover {
  color: #000;
}
#navi li {
  list-style-type: none;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0.7em 2.3ex;
  padding: 0.3em 0;
  cursor: pointer;
}
#logo {
  width: 320px;
  height: 320px;
}
#title_message {
  font-family: "Baloo Tamma 2", cursive;
  font-size: 200%;
}
#title_info {
  display: flex;
  flex-direction: column;
}
#title_message {
  flex: 1;
  display: flex;
  align-items: center;
}
#title_info input {
  margin-right: 0.5em;
}
#title_info label {
  font-weight: bold;
  cursor: pointer;
  font-size: 100%;
}
#title_info button {
  font-size: 100%;
  margin: 0.1em 2em;
  font-weight: bold;
  padding: 0.2ex;
  border: none;
  background-color: unset;
  cursor: pointer;
}
@media screen and (max-width: 400px) {
  #logo {
    width: 240px;
    height: 240px;
  }
  #title_message {
    writing-mode: vertical-lr;
    margin: 1em 0;
  }
  #title_info label,
  #title_info button {
    display: none;
  }
}
@media screen and (max-width: 300px) {
  #logo {
    width: 180px;
    height: 180px;
  }
  #title_message {
    writing-mode: vertical-lr;
    margin: 1em 0;
  }
  #title_info label,
  #title_info button {
    display: none;
  }
}
</style>