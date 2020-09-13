<!--
 * @Date: 2020-09-13 14:21:41
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-14 00:28:55
 * @repository: https://github.com/SkyBlueFeet
-->
<template>
  <div id="container">
    <div id="cesium-container"></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { VNode } from "vue";
import { getCesiumViewer } from "@src/utils/cesium";
import { Viewer } from "cesium";

@Component
export default class App extends Vue {
  key: string;
  viewer: Viewer;
  created(): void {}

  mounted() {
    this.viewer = getCesiumViewer("cesium-container");
  }
}
</script>
<style lang="scss">
html,
body,
#cesium-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
