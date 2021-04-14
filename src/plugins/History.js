// SPA化するための履歴操作なんだけど何やってたか忘れた

export default {
	install: (Vue, options) => {
		window.addEventListener("popstate", () => {
			const [view, ...query] = window.location.search
				.split("/")
				.map((x, i) => (i == 0 ? x.substr(1) : x))
				.filter(x => x);

			options.query.forEach(callback => {
				callback(view, query);
			});
		}, { once: false, passive: true });

		Vue.prototype.$go = (url, title = "", state = undefined) => {
			history.pushState(state, title, url);
			dispatchEvent(new PopStateEvent("popstate", {}));
		};
	},
};