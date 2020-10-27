import * as Cesium from "cesium";
import { Entity } from "cesium";

export interface DrawOption {
  viewer: Cesium.Viewer;
  type?: "POLYGON" | "LINE" | "POINT";
  terrain?: boolean;
  once?: boolean;
}

export default class Painter {
  _viewer: Cesium.Viewer;
  _type: DrawOption["type"];

  _activeShapePoints: Cesium.Cartesian3[] = [];
  _activePoint: Cesium.Cartesian3 = new Cesium.Cartesian3();

  _activeShape: Entity;
  _floatingPoint: Entity;

  constructor(options: DrawOption) {
    this._viewer = options.viewer;

    this._type = options.type || "POLYGON";

    // Zoom in to an area with mountains
    this.setCamera();
  }

  setCamera(): void {
    this._viewer.camera.lookAt(
      Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
      new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
    );
    this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }

  finalized(entity: Entity | Entity.ConstructorOptions): Cesium.Entity {
    return this._viewer.entities.add(entity);
  }

  createPoint(worldPosition: Cesium.Cartesian3): Cesium.Entity {
    return this._viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }
}
