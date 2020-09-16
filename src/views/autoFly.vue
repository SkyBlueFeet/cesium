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
import AirFlyData from "@src/data/A0007.cfg";

@Component
export default class AutoFlyVue extends Vue {
  msg = "Hello Cesium";
  truckId: string;
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
    const duration = 100;

    const oPosi = AirFlyData[0];

    const entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromRadians(
        oPosi.longitude,
        oPosi.latitude,
        oPosi.height
      ),
      model: {
        uri: "/static/models/Cesium_Air.glb"
      }
    });

    this.truckId = entity.id;

    const cartographic = new Cesium.Cartographic();

    let newSecond: number = 0;

    const currentIndex = 0;

    const callbackProperty: Cesium.CallbackProperty.Callback = (
      time,
      result
    ) => {
      const offset = (time.secondsOfDay % duration) / duration;
      cartographic.longitude = longitude;
      cartographic.latitude = latitude - range + offset * range * 2.0;
      const _t = time.secondsOfDay - newSecond;

      console.log(_t);

      newSecond = time.secondsOfDay;

      entity.position = typeConvert<any, any>(
        Cesium.Cartesian3.fromDegrees(
          oPosi.longitude,
          oPosi.latitude,
          oPosi.height
        )
      );
      // console.log(entity.position);

      let height;
      if (scene.sampleHeightSupported) {
        height = scene.sampleHeight(cartographic, [point]);
      }

      if (Cesium.defined(height)) {
        cartographic.height = height;
        point.label.text = typeConvert(
          Math.abs(height)
            .toFixed(2)
            .toString() + " m"
        );
        point.label.show = typeConvert(true);
      } else {
        cartographic.height = 0.0;
        point.label.show = typeConvert(false);
      }

      return Cesium.Cartographic.toCartesian(
        cartographic,
        Cesium.Ellipsoid.WGS84,
        result
      );
    };

    const point = viewer.entities.add({
      position: typeConvert<Cesium.CallbackProperty, Cesium.Cartesian3>(
        new Cesium.CallbackProperty(callbackProperty, false)
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

    viewer.trackedEntity = entity;
  }
}
</script>