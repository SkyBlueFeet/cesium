/*
 * @Date: 2020-09-13 11:09:03
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-13 14:46:00
 * @repository: https://github.com/SkyBlueFeet
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { CreateElement, VNode } from "vue/types/umd";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import "normalize.css";

import "cesium/Build/Cesium/Widgets/widgets.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);

const app = new Vue({
  el: "#app",
  store,
  router,
  render: (h: CreateElement): VNode => h(App)
});

export default app;
