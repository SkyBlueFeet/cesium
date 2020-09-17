<template>
  <div id="interface-container"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { appKey, InitViewer, Test } from "@src/lib/init";

@Component
export default class InterfaceVue extends Vue {
  mounted() {
    class ITest extends InitViewer {
      key = appKey;
      id = "interface-container";
    }
    const y = new ITest("interface-container");
    y.init();
  }
}
</script>