<template>
  <div id="container">
    <div id="cesium-container"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  Viewer,
  Scene,
  Property,
  Entity,
  Cartesian3,
  Transforms,
  HeadingPitchRoll,
  PolylineGlowMaterialProperty,
  LabelStyle,
  Color,
  Cartesian2,
  CzmlDataSource,
  ScreenSpaceEventHandler,
  defined,
  ScreenSpaceEventType,
  Math as cMath
} from "cesium";
import data from "@src/data/A0007.cfg";
import { getCesiumViewer } from "@src/utils/cesium";

@Component
export default class VueCesium extends Vue {
  msg = "Hello Cesium";
  instance: Viewer;
  scene: Scene;
  offset = 90;
  airEntity: any;
  flag: any;

  mounted() {
    const viewer = getCesiumViewer("cesium-container", {
      baseLayerPicker: true
    });
    const finalData = data.map(v => {
      return [v.longitude, v.latitude, v.height];
    });

    const czmlLine = [
      {
        id: "document",
        name: "CZML Geometries: Polyline",
        version: "1.0"
      },
      {
        id: "dashedLine",
        name: "Blue dashed line",
        polyline: {
          positions: {
            cartographicDegrees: finalData
              .join(",")
              .split(",")
              .map(v => parseFloat(v))
          },
          material: {
            polylineDash: {
              color: {
                rgba: [255, 0, 0, 255]
              }
            }
          },
          width: 2
        }
      }
    ];

    this.instance = viewer;
    const ori = data[0];

    const position = Cartesian3.fromDegrees(
      ori.latitude,
      ori.longitude,
      ori.height
    );

    const orientation: any = Transforms.headingPitchRollQuaternion(
      position,
      new HeadingPitchRoll(
        ori.heading - cMath.toRadians(this.offset),
        cMath.toRadians(ori.pitch),
        cMath.toRadians(ori.roll)
      )
    );
    const airEntity = this.instance.entities.add({
      id: "air",
      position,
      orientation,
      path: {
        resolution: 1,
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Color.RED
        }),
        width: 10
      },
      model: {
        uri: "/static/models/Cesium_Air.glb",
        minimumPixelSize: 100
      },
      label: {
        text: "飞机",
        font: "500 15px Helvetica", // 15pt monospace
        scale: 1,
        style: LabelStyle.FILL,
        fillColor: Color.WHITE,
        pixelOffset: new Cartesian2(35, 35), // 偏移量
        showBackground: true,
        backgroundColor: new Color(0.5, 0.6, 1, 1.0)
      }
    });
    this.runner(airEntity);
    this.instance.dataSources.add(CzmlDataSource.load(czmlLine));

    const handler = new ScreenSpaceEventHandler(this.instance.scene.canvas);
    const _this = this;
    handler.setInputAction(function(movement) {
      const pick = _this.instance.scene.pick(movement.position);

      if (defined(pick) && pick.id.id === "air") {
        console.log("抓到飞机啦");
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  }

  runner = (entity: any) => {
    let listenerIndex = 0;
    const _this = this;

    if (_this.flag) clearInterval(_this.flag);

    _this.flag = setInterval(() => {
      var _data = data[listenerIndex];
      var _position = Cartesian3.fromDegrees(
        _data.longitude,
        _data.latitude,
        _data.height
      );

      var _orientation = Transforms.headingPitchRollQuaternion(
        _position,
        new HeadingPitchRoll(
          _data.heading - cMath.toRadians(_this.offset),
          cMath.toRadians(_data.pitch),
          cMath.toRadians(_data.roll)
        )
      );
      // console.log(entity);

      entity.position = _position;
      entity.orientation = _orientation;

      listenerIndex = listenerIndex + 5;
      if (listenerIndex >= data.length) listenerIndex = 0;
    }, 1);
  };
}
</script>
<style lang="scss" scoped>
@import url("../style/normal.scss");
</style>