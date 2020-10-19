/*
 * @Date: 2020-09-13 11:09:03
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-13 14:35:54
 * @repository: https://github.com/SkyBlueFeet
 */
import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@src/components/HelloWorld.tsx";
import Air from "../views/fly-air.vue";
import Draw from "../views/draw.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Hello",
      component: HelloWorld
    },
    {
      path: "/air",
      name: "air",
      component: Air
    },
    {
      path: "/draw",
      name: "Draw",
      component: Draw
    }
  ]
});
