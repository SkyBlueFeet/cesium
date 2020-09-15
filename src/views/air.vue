
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
  Math as cMath,
  HeightReference,
  JulianDate
} from "cesium";
import data from "@src/data/A0007.cfg";
import { getCesiumViewer } from "@src/utils/cesium";
import { typeConvert } from "@root/utils/typings";
// import img from "@static/image/logo.png";

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
      name: "目标方位",
      description: `<h1>目标方位</h1>`,
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
        backgroundColor: new Color(0.5, 0.6, 1, 1.0),
        show: false
      }
    });

    this.runner(airEntity);
    this.instance.dataSources.add(CzmlDataSource.load(czmlLine));

    const handler = new ScreenSpaceEventHandler(this.instance.scene.canvas);
    const _this = this;
    handler.setInputAction(function(movement) {
      const pick = _this.instance.scene.pick(movement.position);
      const camera = _this.instance.camera;
      // _this.runner(airEntity, false);

      // _this.instance.zoomTo(airEntity);
      // camera.flyTo(typeConvert<Entity, any>(airEntity));

      if (defined(pick) && pick.id.id === "air") {
        console.log("抓到飞机啦");
        // const camera = _this.instance.camera;
        // viewer.trackedEntity = airEntity;
        // camera.flyTo({
        //   destination: typeConvert<Entity, any>(airEntity)._position._value
        // });
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  }

  runner = (entity: any, flag: boolean = true) => {
    let listenerIndex = 0;
    const _this = this;

    if (_this.flag) clearInterval(_this.flag);

    if (flag) {
      _this.flag = setInterval(() => {
        const $data = data[listenerIndex];
        const _position = Cartesian3.fromDegrees(
          $data.longitude,
          $data.latitude,
          $data.height
        );

        const _orientation = Transforms.headingPitchRollQuaternion(
          _position,
          new HeadingPitchRoll(
            $data.heading - cMath.toRadians(_this.offset),
            cMath.toRadians($data.pitch),
            cMath.toRadians($data.roll)
          )
        );

        entity.position = _position;
        entity.orientation = _orientation;
        const content: any = `<h1>纬度：${$data.longitude}</h1><h1>经度：${$data.latitude}</h1><h1>高度：${$data.height}</h1>`;
        entity.description = content;

        listenerIndex = listenerIndex + 5;
        if (listenerIndex >= data.length) listenerIndex = 0;
      }, 1);
    }
  };
}
</script>
<style lang="scss" scoped>
@import url("../style/normal.scss");
</style>