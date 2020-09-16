<!--
 * @Date: 2020-09-13 11:09:03
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-13 14:51:07
 * @repository: https://github.com/SkyBlueFeet
-->
<script lang="tsx">
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  created(): void {}
  mounted() {}

  render(h: CreateElement): VNode {
    return (
      <div id="app">
        <router-view />
      </div>
    );
  }
}
</script>
<style lang="postcss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
