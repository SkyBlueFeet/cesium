<!--
 * @Date: 2020-09-13 14:21:41
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-13 23:31:34
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
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
@Component
export default class App extends Vue {
  key: string;
  viewer: Cesium.Viewer;
  created(): void {
    this.key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOGE3M2Q0YS1iNDNkLTRlNzktYjI2ZC0zNzQxOTA4ZTE0YzkiLCJpZCI6MzM1NzIsImlhdCI6MTU5ODkzMTM0OX0.0smZopUOejbfDQ9zrX87y5aelApZCXwWXLm7_UuJRAA";
  }

  mounted() {
    this.viewer = new Cesium.Viewer("cesium-container");
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
