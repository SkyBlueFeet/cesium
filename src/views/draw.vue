<template>
  <div id="cesium-container"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Cesium from "cesium";
import Draw, { DrawType } from "@lib/draw";

@Component
export default class CeaiumDraw extends Vue {
  mounted() {
    const viewer = new Cesium.Viewer("cesium-container", {
      selectionIndicator: false,
      infoBox: false,
      terrainProvider: Cesium.createWorldTerrain()
    });

    viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH
    ];

    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.PINCH,
      Cesium.CameraEventType.RIGHT_DRAG
    ];

    const t = new Draw({
      viewer,
      terrain: true,
      sameStyle: true
    });
    t.start(
      {
        type: "RECTANGLE"
      },
      (action, entity) => {
        console.log(action, entity);
        return entity;
      }
    );

    // viewer.entities.add(circleEntity);
  }
}
</script>