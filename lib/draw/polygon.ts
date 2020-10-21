import * as Cesium from "cesium";

import Painter from "./painter";
import { Movement } from "@lib/typings/Event";

export default class Polygon {
  pointer: Painter;
  _terrain: boolean;
  constructor(pointer: Painter, terrain: boolean) {
    this.pointer = pointer;
    this._terrain = terrain;
  }

  startDraw(event: Movement): void {
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    const earthPosition = this._terrain
      ? this.pointer._viewer.scene.pickPosition(event.position)
      : this.pointer._viewer.camera.pickEllipsoid(event.position);

    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (Cesium.defined(earthPosition)) {
      if (this.pointer._activeShapePoints.length === 0) {
        this.pointer._floatingPoint = this.pointer.createPoint(earthPosition);
        this.pointer._activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(
          () => new Cesium.PolygonHierarchy(this.pointer._activeShapePoints),
          false
        );
        this.pointer._activeShape = this.pointer.finalized(
          this.handler(dynamicPositions)
        );
      }
      this.pointer._activeShapePoints.push(earthPosition);
      this.pointer.createPoint(earthPosition);
    }
  }

  drawing(event: Movement): void {
    if (Cesium.defined(this.pointer._floatingPoint)) {
      const newPosition = this._terrain
        ? this.pointer._viewer.scene.pickPosition(event.endPosition)
        : this.pointer._viewer.camera.pickEllipsoid(event.endPosition);

      if (Cesium.defined(newPosition)) {
        this.pointer._floatingPoint.position = new Cesium.ConstantPositionProperty(
          newPosition
        );
        this.pointer._activeShapePoints.pop();
        this.pointer._activeShapePoints.push(newPosition);
      }
    }
  }

  endDraw(): void {
    this.pointer._activeShapePoints.pop();
    this.pointer.finalized(this.handler(this.pointer._activeShapePoints));
    this.pointer._viewer.entities.remove(this.pointer._floatingPoint);
    this.pointer._viewer.entities.remove(this.pointer._activeShape);
    this.pointer._floatingPoint = undefined;
    this.pointer._activeShape = undefined;
    this.pointer._activeShapePoints = [];
  }

  handler(
    hierarchy: Cesium.Cartesian3[] | Cesium.CallbackProperty
  ): Cesium.Entity.ConstructorOptions {
    return {
      polygon: {
        hierarchy: Array.isArray(hierarchy)
          ? new Cesium.PolygonHierarchy(hierarchy)
          : hierarchy,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.7)
        )
      }
    };
  }
}
