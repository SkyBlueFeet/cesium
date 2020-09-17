import * as Cesium from "cesium";

export const appKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOGE3M2Q0YS1iNDNkLTRlNzktYjI2ZC0zNzQxOTA4ZTE0YzkiLCJpZCI6MzM1NzIsImlhdCI6MTU5ODkzMTM0OX0.0smZopUOejbfDQ9zrX87y5aelApZCXwWXLm7_UuJRAA";

export const getCesiumViewer = (
  id: string,
  option: Cesium.Viewer.ConstructorOptions = {}
): Cesium.Viewer => {
  Cesium.Ion.defaultAccessToken = appKey;

  return new Cesium.Viewer(id, option);
};

export class InitViewer {
  viewer: Cesium.Viewer;

  key: string;

  id: string;

  initViewerOptions: Cesium.Viewer.ConstructorOptions;

  constructor(id: string, options: Cesium.Viewer.ConstructorOptions = {}) {
    this.id = id;
    this.initViewerOptions = options;
  }

  init(): Cesium.Viewer {
    if (!this.id || !this.key) {
      console.warn(`id and key`);
      return;
    }
    this.viewer = new Cesium.Viewer(this.id, this.initViewerOptions);
    return this.viewer;
  }
}

export class Test extends InitViewer {
  key = appKey;
}
