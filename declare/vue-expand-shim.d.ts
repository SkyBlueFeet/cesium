/*
 * @Date: 2020-09-13 11:09:03
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-13 23:52:41
 * @repository: https://github.com/SkyBlueFeet
 */
import lodash from "lodash";
import VueRouter, { Route } from "vue-router";
import { Store as Vuex } from "vuex";

// 全局变量设置
declare global {
  const _: typeof lodash;
}

// 扩充
declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $store: Vuex<any>;
  }
}
