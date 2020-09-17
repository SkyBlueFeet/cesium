/*
 * @Date: 2020-09-13 11:09:03
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-13 14:35:54
 * @repository: https://github.com/SkyBlueFeet
 */
import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@src/components/HelloWorld.tsx";
import Air from "@src/views/air.vue";
import Cesium from "@src/views/cesium.vue";
import Entity from "@src/views/entity.vue";
import AutoFly from "@src/views/autoFly.vue";
import Clamp from "@src/views/clamp.vue";
import Point from "@src/views/point.vue";
import Interface from "@src/views/interface.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Hello",
      component: HelloWorld
    },
    {
      path: "/cesium",
      name: "cesium",
      component: Cesium
    },
    {
      path: "/air",
      name: "air",
      component: Air
    },
    {
      path: "/entity",
      name: "entity",
      component: Entity
    },
    {
      path: "/autofly",
      name: "autofly",
      component: AutoFly
    },
    {
      path: "/clamp",
      name: "Clamp",
      component: Clamp
    },
    {
      path: "/point",
      name: "Point",
      component: Point
    },
    {
      path: "/interface",
      name: "Interface",
      component: Interface
    }
  ]
});
