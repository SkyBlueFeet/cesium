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
      type: DrawType.CIRCLE,
      terrain: true,
      keyboard: {
        // END: "LEFT_DOUBLE_CLICK",
        DESTROY: "MIDDLE_CLICK"
      },
      dynamicGraphicsOptions: {
        POLYGON: {
          material: Cesium.Color.PINK.withAlpha(0.6)
        },
        POINT: {
          color: Cesium.Color.BLUE.withAlpha(0.5)
        },
        CIRCLE: {
          outlineColor: Cesium.Color.ORANGE.withAlpha(0.7)
        }
      }
    });
    t.start({ type: "POLYGON" }, undefined);

    // viewer.entities.add(circleEntity);
  }
}
</script>