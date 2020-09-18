import * as Cesium from "cesium";
import Unitaire from "../MilitaryUnit";

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

  constructor(
    key?: string,
    id?: string,
    options: Cesium.Viewer.ConstructorOptions = {}
  ) {
    this.key = key;
    this.id = id;
    this.initViewerOptions = options;

    if (!this.viewer && this.id) this.init(this.id);
  }

  init(id?: string): this {
    if (id) this.id = id;

    if (!this.id || !this.key) {
      console.warn(`id and key`);
      return;
    }
    Cesium.Ion.defaultAccessToken = this.key;
    this.viewer = new Cesium.Viewer(this.id, this.initViewerOptions);
    return this;
  }

  get entities(): Unitaire {
    let _unitaire: Unitaire;
    if (this.viewer) {
      _unitaire = new Unitaire({ viewer: this.viewer });
    }

    return _unitaire;
  }
}
