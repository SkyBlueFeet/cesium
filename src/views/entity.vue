<template>
  <div id="entity">
    <div id="container"></div>
    <div class="toolbar">
      <el-dropdown placement="bottom" @command="addEntityCommand">
        <el-button type="primary">
          添加模型<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(value, index) of modelInfo"
            :key="index"
            :command="index"
            >{{ value.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button plane type="success" @click="addBillboardCommand">
        添加广告牌
      </el-button>
      <el-button plane type="success" @click="addPointCommand">
        添加点
      </el-button>
      <el-dropdown placement="bottom" @command="selectEntity">
        <el-button type="primary">
          查看
          <i
            v-show="entities.length > 0"
            class="el-icon-arrow-down el-icon--right"
          >
          </i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(value, index) of entities"
            :key="index"
            :command="index"
          >
            {{ value.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown placement="bottom" @command="removeEntity">
        <el-button type="primary">
          移除
          <i
            v-show="entities.length > 0"
            class="el-icon-arrow-down el-icon--right"
          >
          </i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(value, index) of entities"
            :key="index"
            :command="index"
          >
            {{ value.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { getCesiumViewer } from "@src/utils/cesium";
import * as Cesium from "cesium";
import { Component, Vue, Watch } from "vue-property-decorator";
import Random from "@src/utils/radromPosition";
import { typeConvert } from "@root/utils/typings";
import cesiumIco from "@static/image/cesium.ico";
import { removeByIndex } from "@utils/array";

type entityAttribute = {
  name: string;
  id: string;
};

@Component
export default class EntityVue extends Vue {
  eViewer: Cesium.Viewer;
  modelType = {
    Aircraft: "飞机",
    "Skinned Character": "人",
    "Milk Truck": "卡车",
    "Hot Air Balloon": "热气球",
    "Ground Vehicle": "货车"
  };

  modelInfo = {
    Aircraft: {
      name: "飞机",
      uri: "/static/models/Cesium_Air.glb"
    },
    "Skinned Character": {
      name: "人类",
      uri: "/static/models/Cesium_Man.glb"
    },
    "Milk Truck": {
      name: "卡车",
      uri: "/static/models/Cesium_MilkTruck.glb"
    },
    "Hot Air Balloon": {
      name: "热气球",
      uri: "/static/models/Cesium_Balloon.glb"
    },
    "Ground Vehicle": {
      name: "货车",
      uri: "/static/models/GroundVehicle.glb"
    }
  };

  entities: entityAttribute[] = [];

  mounted() {
    this.eViewer = getCesiumViewer("container", {
      terrainProvider: Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
      }),
      shouldAnimate: true
    });

    const eventHandler = new Cesium.ScreenSpaceEventHandler(
      this.eViewer.canvas
    );

    const handler = () => {
      console.log(this.AssertViewer());
    };
    eventHandler.setInputAction(
      handler.bind(this),
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
  }

  getRandomCartesian3() {
    const _random = Random();
    return Cesium.Cartesian3.fromDegrees(
      _random.longitude,
      _random.latitude,
      _random.height
    );
  }

  AssertViewer() {
    return !!this.eViewer;
  }

  addEntityCommand(command: string) {
    const _entity = this.createEntity(command);
    this.eViewer.entities.add(_entity);
    this.eViewer.flyTo(_entity);

    this.entities.push({
      name: _entity.name,
      id: _entity.id
    });
  }

  // 添加广告牌
  addBillboardCommand() {
    const _random = Random();
    const _billboard = this.eViewer.entities.add({
      billboard: new Cesium.BillboardGraphics({
        image: cesiumIco,
        scale: 1.0,
        width: 50, // default: undefined
        height: 50, // default: undefined
        color: Cesium.Color.NAVAJOWHITE
      }),
      position: this.getRandomCartesian3()
    });
    this.eViewer.flyTo(_billboard);

    this.entities.push({
      name: "广告牌",
      id: _billboard.id
    });
  }

  addPointCommand() {
    const _random = Random();
    const _point = this.eViewer.entities.add({
      point: {
        color: Cesium.Color.MINTCREAM,
        pixelSize: 10
      },
      position: this.getRandomCartesian3()
    });

    this.eViewer.flyTo(_point);

    this.entities.push({
      name: "点",
      id: _point.id
    });
  }

  /**
   * @description 创建实体
   * @param command 实体Id
   * @returns Cesium.Entity
   */
  createEntity(command: string): Cesium.Entity {
    const _random = Random();
    const _info = this.modelInfo[command];

    const _position = this.getRandomCartesian3();

    const _orientation = Cesium.Transforms.headingPitchRollQuaternion(
      _position,
      new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(135), 0, 0)
    );

    const entity = new Cesium.Entity({
      name: _info.name,
      model: {
        uri: _info.uri,
        minimumPixelSize: 128,
        maximumScale: 20000
      },
      position: _position,
      orientation: typeConvert<Cesium.Quaternion, Cesium.Property>(_orientation)
    });
    return entity;
  }

  @Watch("entities")
  onChangeEntities(newVal, oldVal) {
    console.log(newVal);
  }

  selectEntity(index: number) {
    this.eViewer.flyTo(this.eViewer.entities.getById(this.entities[index]?.id));
  }

  removeEntity(index: number) {
    this.eViewer.entities.removeById(this.entities[index].id);
    this.entities = removeByIndex(this.entities, index);
  }

  msg = "Cesium Entity";
}
</script>

<style>
#cesium-container {
  height: 60%;
  width: 60%;
  margin: 0 auto;
}
.toolbar {
  width: 60%;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>