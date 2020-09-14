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
    }
  ]
});
