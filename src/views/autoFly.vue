<template>
  <div id="entity">
    <div id="cesium-container"></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as Cesium from "cesium";
import { getCesiumViewer } from "../utils/cesium";
import { typeConvert } from "@root/utils/typings";

@Component
export default class AutoFlyVue extends Vue {
  msg = "Hello Cesium";
  mounted() {
    const viewer = getCesiumViewer("cesium-container", {
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: true
    });
    const scene = viewer.scene;
    scene.globe.depthTestAgainstTerrain = true;

    if (!scene.sampleHeightSupported) {
      window.alert("This browser does not support sampleHeight.");
    }

    const longitude = -2.1480545852753163;
    const latitude = 0.7688240036937101;
    const range = 0.000002;
    const duration = 4.0;

    const _position = Cesium.Cartesian3.fromRadians(longitude, latitude);

    const entity = viewer.entities.add({
      position: _position,
      model: {
        uri: "/static/models/Cesium_MilkTruck.glb"
      }
    });

    const point = viewer.entities.add({
      position: typeConvert<Cesium.CallbackProperty, Cesium.Cartesian3>(
        new Cesium.CallbackProperty(updatePosition, false)
      ),
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      label: {
        show: false,
        showBackground: true,
        font: "14px monospace",
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(5, 5),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });

    const cartographic = new Cesium.Cartographic();

    function updatePosition(time, result) {
      const offset = (time.secondsOfDay % duration) / duration;
      cartographic.longitude = longitude - range + offset * range * 2.0;
      cartographic.latitude = latitude;

      let a = 1.0;
      let b = 2.0;
      let c = 2.0;

      const _orientation: any = Cesium.Transforms.headingPitchRollQuaternion(
        _position,
        new Cesium.HeadingPitchRoll(a, b, c)
      );

      a = a + 1;
      b = b + 1;
      c = c + 0.1;

      entity.orientation = _orientation;

      let height;
      if (scene.sampleHeightSupported) {
        height = scene.sampleHeight(cartographic, [point]);
      }

      if (Cesium.defined(height)) {
        cartographic.height = height;
        point.label.text = typeConvert<string, Cesium.Property>(
          Math.abs(height)
            .toFixed(2)
            .toString() + " m"
        );
        point.label.show = typeConvert<boolean, Cesium.Property>(true);
      } else {
        cartographic.height = 0.0;
        point.label.show = typeConvert<boolean, Cesium.Property>(false);
      }

      return Cesium.Cartographic.toCartesian(
        cartographic,
        Cesium.Ellipsoid.WGS84,
        result
      );
    }
    viewer.trackedEntity = entity;
  }
}
</script>