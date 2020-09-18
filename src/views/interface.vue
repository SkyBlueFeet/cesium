<template>
  <div id="interface-container"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { appKey, InitViewer } from "@src/lib/init";
import { getRandomCartesian3 } from "../lib/utils";
import { MilitaryUnitType } from "../lib/MilitaryUnit/type";
import * as Cesium from "cesium";
import { Callback } from "../lib/MilitaryUnit";

@Component
export default class InterfaceVue extends Vue {
  mounted() {
    // class ITest extends InitViewer {
    //   key = appKey;
    //   id = "interface-container";
    //   constructor() {
    //     super();
    //     this.init();
    //   }
    // }

    // const y = new ITest();

    const y = new InitViewer(appKey, "interface-container");

    const options = {
      entityOption: {
        name: "测试机场01",
        position: getRandomCartesian3()
      },
      type: MilitaryUnitType.Airport
    };

    const entityCallback: Callback = function(entity) {
      this.flyTo(entity);
      return entity;
    };

    y.entities.createUnit(options, entityCallback).addEventListener(i => {
      console.log(i);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}
</script>