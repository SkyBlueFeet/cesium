<template>
  <div id="container">
    <div :id="cId"></div>
    <el-button @click="addBillboard">添加点</el-button>
    <el-dropdown placement="bottom" @command="addEventListener">
      <el-button type="primary">
        添加事件
        <i
          v-show="entityCollector.length > 0"
          class="el-icon-arrow-down el-icon--right"
        >
        </i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(value, index) of entityCollector"
          :key="index"
          :command="value"
        >
          {{ index }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown placement="bottom" @command="selectPoint">
      <el-button type="primary">
        选择点
        <i
          v-show="entityCollector.length > 0"
          class="el-icon-arrow-down el-icon--right"
        >
        </i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(value, index) of entityCollector"
          :key="index"
          :command="value"
        >
          {{ index }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as Cesium from "cesium";

import { addEntityToViewer } from "@src/lib/viewer";
import { getRandomCartesian3 } from "@src/lib/utils";
import { getCesiumViewer } from "@src/utils/cesium";
import { createBillboard } from "@src/lib/point";

import Airport from "@static/icon/飞机场.png";

type Listener = () => void;

@Component
export default class PointVue extends Vue {
  msg = "Hello Point";
  cId: string = "point-container";
  vId: string;
  pViewer: Cesium.Viewer;
  eventCollector: string[] = [];
  entityCollector: string[] = [];
  mounted() {
    this.pViewer = getCesiumViewer(this.cId);
    this.eventListener();
  }

  addBillboard(): Cesium.Viewer {
    const eEntity = new Cesium.Entity({
      position: getRandomCartesian3(),
      billboard: createBillboard({
        image: Airport,
        sizeInMeters: true,
        width: 48,
        height: 48
      })
    });

    addEntityToViewer(this.pViewer, eEntity, { focus: true });

    this.entityCollector.push(eEntity.id);
    return this.pViewer;
  }

  addEventListener(command: string): void {
    // this.eventCollector.push(command);
    console.log(command);
    const _viewer = this.pViewer;
    const _this = this;
    _this.eventCollector.push(command);
    // const handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
    // handler.setInputAction(function(movement) {
    //   const pick = _viewer.scene.pick(movement.position);

    //   if (Cesium.defined(pick) && _this.eventCollector.includes(pick))
    //     console.log(`抓到${command}`);
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  eventListener() {
    const _viewer = this.pViewer;
    const handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
    const _this = this;

    const _event = function(movement: any) {
      const pick = _viewer.scene.pick(movement.position);
      console.log(`id:${pick.id.id}`);
      console.log("init");

      if (!!pick && this.eventCollector.include(pick.id.id)) {
        console.log(`id:${pick.id.id}`);
      }
    };

    handler.setInputAction(function(movement) {
      _event.bind(this);
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }

  selectPoint(command: string) {
    this.pViewer.flyTo(this.pViewer.entities.getById(command));
  }
}
</script>
<style lang="scss">
html,
body,
#app {
  height: 90%;
  width: 90%;
}
#point-container {
  width: 60%;
  height: 60%;
  margin: 0 auto;
}
</style>