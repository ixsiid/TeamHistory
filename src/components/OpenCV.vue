<template>
  <div class="opencv">
    <img  :id="id" ref="source" />
    <img  id="template_allow" :src="allow" />
    <img  id="template_ranking" :src="ranking" />
    <img  id="template_field" :src="field" />
    <img  id="template_length" :src="length" />
    <img  id="template_rotate" :src="rotate" />
    <canvas id="result" />
  </div>
</template>

<script>
export default {
  name: "OpenCV",
  components: {},
  props: {
    allow: String,
    ranking: String,
    field: String,
    length: String,
    rotate: String,
    callback: { type: Function, default: () => {} },
  },
  computed: {},
  data: function () {
    return { id: new Date().getTime() + '_temp' };
  },
  methods: {
    windowLoad: function () {},
    run: async function (file) {
      this.$refs.source.setAttribute('src', file);
    },
    process: function () {
      console.log('start');

      const cv = window.cv;
      if (!window.cv) {
        console.log('OpenCVが有効じゃありません');
        
        this.callback();
        return;
      }

      const src = cv.imread(this.id);
      const template = Object.fromEntries(
        ['allow', 'ranking', 'field', 'length', 'rotate'].map(x => [x, cv.imread(`template_${x}`)])
        );

      const scaled = new cv.Mat();

      const finish = result => {
        cv.imshow("result", scaled);

        src.delete();
        scaled.delete();

        this.callback(result);
      };
      
      
      const match = (source, rect, template, color) => {
        const r = new cv.Rect(rect.x, rect.y, rect.w, rect.h);
        const crop = source.roi(r);
        
        const rd = new cv.Mat();
        const rm = new cv.Mat();
        cv.matchTemplate(template, crop, rd, cv.TM_CCOEFF, rm);
        const place = cv.minMaxLoc(rd, rm);
        
        crop.delete();
        rd.delete();
        rm.delete();
        
        if (color) {
          const rect_lt = new cv.Point(rect.x, rect.y);
          const rect_rb = new cv.Point(rect.x + rect.w, rect.y + rect.h);

          cv.rectangle(source, rect_lt, rect_rb, color, 2, cv.LINE_8, 0);
        }

        return {
          x: place.maxLoc.x,
          y: place.maxLoc.y,
          value: place.maxVal,
        };
      };

      const red = new cv.Scalar(255, 0, 0, 255);
      const blue = new cv.Scalar(0, 0, 255, 255);
      const green = new cv.Scalar(0, 255, 0, 255);

      const allows = Array(4).fill(null).map(() => {
        const dest = new cv.Mat();
        const mask = new cv.Mat();

        cv.matchTemplate(src, template.allow, dest, cv.TM_CCOEFF, mask);
        const result = cv.minMaxLoc(dest, mask);
        const maxPoint = result.maxLoc;

        const rect_lt = new cv.Point(maxPoint.x + 3, maxPoint.y + 3);
        const rect_rb = new cv.Point(
          maxPoint.x + template.allow.cols - 3,
          maxPoint.y + template.allow.rows - 3
        );
        cv.rectangle(src, rect_lt, rect_rb, red, 2, cv.LINE_8, 0);
        dest.delete();
        mask.delete();

        return [maxPoint.x + template.allow.cols / 2, maxPoint.y + template.allow.rows / 2];
      }).sort((a, b) => a[1] - b[1]);

      let scale = 1;
      {
        // X座標ずれが大きい時は失敗
        const x = allows.map(x => x[0]);
        if ((Math.max(...x) - Math.min(...x)) > 10) {
          console.log('矢印の場所がおかしい');
          finish();
          return;
        }

        // Y座標の間隔のずれが大きい時は失敗
        const dy = allows.map(x => x[1])
                        .map((x, i, a) => a[i + 1] - x)
                        .filter((x, i, a) => i < a.length - 1)
                        .sort((a, b) => a - b);

        if (dy[2] - dy[0] > 10) {
          console.log('矢印の間隔がおかしい');
          finish();
          return;
        }

        scale = 212 / dy[1];
      }
      cv.resize(src, scaled, new cv.Size(src.cols * scale, src.rows * scale));
      const center = [0, 1].map(t => Math.ceil(allows.reduce((a,b) => a + b[t], 0) / 4));
      const base_points = Array(5).fill(0).map((_, i) => [center[0] - 330, center[1] - 500 + 212 * i]);

      // ランキングをテンプレートマッチングで取得
      const rank = base_points.map(([x, y]) => {
        const rect_lt = new cv.Point(x, y);
        const rect_rb = new cv.Point(x + 660, y + 150);
        cv.rectangle(scaled, rect_lt, rect_rb, blue, 2, cv.LINE_8, 0);

        return Array(3).fill(null).map((_, i) => {
          const rect = { x: x + 165 + i * 74, y: y + 115, w: 36, h: 24 };
          const rank_match = match(scaled, rect, template.ranking, green);

          return rank_match.value > 3000000 ? {
            rank: Math.floor(rank_match.x / 45) + 1,
            won: !(Math.floor(rank_match.y / 32))
          } : {
            rank: 0, won: null
          };
        });
      });
      
      // レース種別をテンプレートマッチングで取得
      const race = base_points.map(([_x, _y]) => {
        const y = _y + 12;
        const h = 24;
        let x = _x + 192;

        const field_match = match(scaled, { x, w:25, y, h }, template.field, red);
        const field = field_match.value > 4000000 ? (['turf', 'dirt'])[Math.floor(field_match.y / 32)] : undefined;

        x += field == 'turf' ? 30 : 73;
        const length_match = match(scaled, { x, w:80, y, h }, template.length, red);
        const length = ([
          0,
          1000, 1200, 1400,
          1500, 1600, 1700, 1800,
          2000, 2200, 2300, 2400,
          2500, 2600, 3000, 3200, 3400, 3600])[
            length_match.value > 18000000 ? Math.floor(length_match.y / 32) + 1 : 0
          ];

        x += 177;
        const rotate_match = match(scaled, {x, w: 25, y, h}, template.rotate, red);
        const clockwise = ([true, false, null])[Math.floor(rotate_match.x / 32)];
        return { field, length, clockwise };
      });

      const index = [
        race.findIndex(x => x.field == 'turf' && x.length <= 1400),
        race.findIndex(x => x.field == 'turf' && x.length > 1400 && x.length <= 1800),
        race.findIndex(x => x.field == 'turf' && x.length > 1800 && x.length <= 2400),
        race.findIndex(x => x.field == 'turf' && x.length > 2400),
        race.findIndex(x => x.field == 'dirt')
      ]
      if (index.filter(x => x < 0).length > 0) {
        console.log('認識失敗');
        finish();
        return;
      }

      finish({
        sprinter: Object.assign(race[index[0]], { ranking: rank[index[0]].map(x => x.rank) }),
        mile: Object.assign(race[index[1]], { ranking: rank[index[1]].map(x => x.rank) }),
        middle: Object.assign(race[index[2]], { ranking: rank[index[2]].map(x => x.rank) }),
        stayer: Object.assign(race[index[3]], { ranking: rank[index[3]].map(x => x.rank) }),
        dirt: Object.assign(race[index[4]], { ranking: rank[index[4]].map(x => x.rank) }),
      });

      return;
    },
  },
  mounted: function () {
    window.addEventListener("load", this.windowLoad, {
      once: true,
      passive: true,
    });
    dispatchEvent(new PopStateEvent("popstate", {}));

    this.$refs.source.addEventListener('load', this.process, {once: false, passive: true});
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
.opencv {
}
</style>