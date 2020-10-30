import * as Cesium from "cesium";

import { Movement } from "@lib/typings/Event";
import BasicGraphices from "./base";

export default class Line extends BasicGraphices {
  dropPoint(event: Movement): void {
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
          () => this.pointer._activeShapePoints,
          false
        );
        this.pointer._dynamicEntity = this.pointer.addView(
          this.create(dynamicPositions)
        );
      }
      this.pointer._activeShapePoints.push(earthPosition);
      this.pointer.createPoint(earthPosition);
    }
  }

  moving(event: Movement): void {
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

  playOff(): void {
    this.pointer._activeShapePoints.pop();
    this.result = this.create(this.pointer._activeShapePoints);
    this.pointer.reset();
  }

  create(
    hierarchy: Cesium.Cartesian3[] | Cesium.CallbackProperty
  ): Cesium.Entity {
    return new Cesium.Entity({
      polyline: {
        positions: hierarchy,
        clampToGround: true,
        width: 3
      }
    });
  }
}
