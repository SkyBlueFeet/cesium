<template>
  <div id="container">
    <div :id="cId"></div>
    <el-button @click="addBillboard">添加据点</el-button>
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

import { getRandomCartesian3 } from "@src/lib/utils";
import { getCesiumViewer } from "@src/utils/cesium";
import {
  createBillboardToViewer,
  addEventListenerToViewer
} from "@src/lib/entity";

import Unit from "@src/lib/MilitaryUnit/addunit";
import { iconPath, MilitaryUnitType } from "@src/lib/MilitaryUnit/type";

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
  uInstance: Unit;
  mounted() {
    this.pViewer = getCesiumViewer(this.cId);

    this.uInstance = new Unit({
      viewer: this.pViewer
    });
  }

  addBillboard(): Cesium.Viewer {
    this.uInstance.createUnit(
      {
        entityOption: {
          name: "安达尔港",
          position: getRandomCartesian3()
        },
        icon: MilitaryUnitType.Airport,
        sizeInMeters: true,
        width: 48,
        height: 48
      },
      entity => {
        this.pViewer.flyTo(entity);
        return entity;
      }
    );

    this.entityCollector.push(this.uInstance.id);

    return this.pViewer;
  }

  addEventListener(command: string): void {
    this.uInstance.addEventListener((movement, entity) => {
      console.log(entity.id, entity);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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