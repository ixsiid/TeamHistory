<template>
  <div>
    <h1>Test page</h1>
    <OpenCV ref="opencv"
       :allow="require('./assets/template/allow.png')"
       :ranking="require('./assets/template/ranking.png')"
       :field="require('./assets/template/field.png')"
       :length="require('./assets/template/length.png')"
       :rotate="require('./assets/template/rotate.png')"
       :callback="onImageDone" />
    <table>
      <tbody>
        <tr v-for="(r, i) in opencv_result_view" :key="i">
          <td>{{ `sample${i + 1} `}}</td>
          <td>{{ r.success }}</td>
          <td>{{ r.opencv }}</td>
          <td>{{ r.template }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import OpenCV from './components/OpenCV.vue';
export default {
  name: "Test",
  components: {
    OpenCV,
  },
  data: function () {
    return {
      opencv_file_index: 0,
      opencv_processing: false,
      opencv_files: Array(8).fill(0).map((_, i) => require(`./assets/template/sample${i + 1}.png`)),
      opencv_results: [{
        sprinter: { field: 'turf', length: 1200, clockwise: true,  ranking: [1,5,7] },
        mile: {     field: 'turf', length: 1600, clockwise: false, ranking: [5,1,6] },
        middle: {   field: 'turf', length: 2000, clockwise: true,  ranking: [2,5,4] },
        stayer: {   field: 'turf', length: 2500, clockwise: true,  ranking: [4,1,6] },
        dirt: {     field: 'dirt', length: 1700, clockwise: true,  ranking: [3,6,4] },
      }, {
        sprinter: { field: 'turf', length: 1000, clockwise: null,  ranking: [4,6,2] },
        mile: {     field: 'turf', length: 1800, clockwise: true,  ranking: [1,2,3] },
        middle: {   field: 'turf', length: 2200, clockwise: false, ranking: [1,2,4] },
        stayer: {   field: 'turf', length: 2600, clockwise: true,  ranking: [2,4,5] },
        dirt: {     field: 'dirt', length: 1700, clockwise: true,  ranking: [3,2,4] },
      }, {
        sprinter: { field: 'turf', length: 1000, clockwise: null,  ranking: [1,5,4] },
        mile: {     field: 'turf', length: 1500, clockwise: true,  ranking: [3,5,4] },
        middle: {   field: 'turf', length: 2000, clockwise: true,  ranking: [6,2,3] },
        stayer: {   field: 'turf', length: 3600, clockwise: true,  ranking: [4,2,1] },
        dirt: {     field: 'dirt', length: 1700, clockwise: true,  ranking: [2,3,5] },
      }, {
        // 4
        sprinter: { field: 'turf', length: 1200, clockwise: false, ranking: [2,4,6] },
        mile: {     field: 'turf', length: 1800, clockwise: false, ranking: [2,6,4] },
        middle: {   field: 'turf', length: 2200, clockwise: true,  ranking: [3,2,7] },
        stayer: {   field: 'turf', length: 3400, clockwise: false, ranking: [2,3,4] },
        dirt: {     field: 'dirt', length: 1800, clockwise: true,  ranking: [1,3,5] },
      }, {
        sprinter: { field: 'turf', length: 1200, clockwise: false, ranking: [3,5,2] },
        mile: {     field: 'turf', length: 1800, clockwise: true,  ranking: [4,3,2] },
        middle: {   field: 'turf', length: 2400, clockwise: true,  ranking: [1,2,3] },
        stayer: {   field: 'turf', length: 2600, clockwise: true,  ranking: [1,3,2] },
        dirt: {     field: 'dirt', length: 1800, clockwise: true,  ranking: [1,5,2] },
      }, {
        sprinter: { field: 'turf', length: 1200, clockwise: true,  ranking: [1,5,6] },
        mile: {     field: 'turf', length: 1600, clockwise: true,  ranking: [5,3,1] },
        middle: {   field: 'turf', length: 2000, clockwise: true,  ranking: [6,4,5] },
        stayer: {   field: 'turf', length: 2600, clockwise: true,  ranking: [1,6,4] },
        dirt: {     field: 'dirt', length: 1800, clockwise: true,  ranking: [3,1,6] },
      }, {
        // 7
        sprinter: { field: 'turf', length: 1200, clockwise: true,  ranking: [3,5,1] },
        mile: {     field: 'turf', length: 1800, clockwise: true,  ranking: [1,3,2] },
        middle: {   field: 'turf', length: 2200, clockwise: true,  ranking: [5,2,6] },
        stayer: {   field: 'turf', length: 2500, clockwise: true,  ranking: [1,2,5] },
        dirt: {     field: 'dirt', length: 1700, clockwise: true,  ranking: [2,1,4] },
      }, {
        sprinter: { field: 'turf', length: 1400, clockwise: true,  ranking: [2,5,1] },
        mile: {     field: 'turf', length: 1800, clockwise: true,  ranking: [1,3,7] },
        middle: {   field: 'turf', length: 2000, clockwise: false, ranking: [5,4,2] },
        stayer: {   field: 'turf', length: 2500, clockwise: false, ranking: [2,6,4] },
        dirt: {     field: 'dirt', length: 1700, clockwise: true,  ranking: [1,4,5] },
      }],
      opencv_result_view: [],
    };
  },
  computed: {
  },
  methods: {
    onImageDone(result) {     
      const r = {};
      r.opencv = result;
      r.template = this.opencv_results[this.opencv_file_index-1];
      r.success = JSON.stringify(r.opencv) == JSON.stringify(r.template);
      this.opencv_result_view.push(r);
      
      this.opencv_processing = false;
    }
  },
  mounted() {
    const timer = setInterval(() => {
      if (!this.opencv_processing) {
        this.$refs.opencv.run(this.opencv_files[this.opencv_file_index++]);
        if (this.opencv_file_index > this.opencv_files.length) {
          clearInterval(timer);
          this.$refs.opencv.run(this.opencv_files[6]);
        }
      }
    }, 500);

  },
  destroyed() {
  },
};
</script>

<style>
</style>