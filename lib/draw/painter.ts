import * as Cesium from "cesium";
import { Entity } from "cesium";
import { Movement } from "@lib/typings/Event";

interface DrawOption {
  viewer: Cesium.Viewer;
  terrain?: boolean;
}

export default class Painter {
  _viewer: Cesium.Viewer;
  _terrain: boolean;

  _activeShapePoints: Cesium.Cartesian3[] = [];
  _activePoint: Cesium.Cartesian3 = Cesium.Cartesian3.ZERO;

  _dynamicEntity: Entity;
  _floatingPoint: Entity;

  constructor(options: DrawOption) {
    this._viewer = options.viewer;
    this._terrain = options.terrain;
  }

  addView(entity: Entity | Entity.ConstructorOptions): Cesium.Entity {
    return this._viewer.entities.add(entity);
  }

  createPoint(worldPosition: Cesium.Cartesian3): Cesium.Entity {
    return new Entity({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }

  calcPositions(event: Movement): Cesium.Cartesian3 {
    return this._terrain
      ? this._viewer.scene.pickPosition(event.position)
      : this._viewer.camera.pickEllipsoid(event.position);
  }

  reset(): void {
    this._viewer.entities.remove(this._floatingPoint);
    this._viewer.entities.remove(this._dynamicEntity);

    this._floatingPoint = undefined;
    this._dynamicEntity = undefined;

    this._activeShapePoints = [];
    this._activePoint = Cesium.Cartesian3.ZERO;
  }
}
