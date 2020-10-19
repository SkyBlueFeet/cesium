<template>
  <div id="cesium-container"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Cesium from "cesium";
import Draw from "@lib/draw";

@Component
export default class CeaiumDraw extends Vue {
  mounted() {
    const viewer = new Cesium.Viewer("cesium-container", {
      selectionIndicator: false,
      infoBox: false
      // terrainProvider: Cesium.createWorldTerrain()
    });

    const t = new Draw({
      viewer,
      type: "POLYGON"
      // terrain: true
    });
    t.start();
  }
}
</script>