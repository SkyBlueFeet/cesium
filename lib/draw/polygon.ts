import * as Cesium from "cesium";
import { RectangleGraphics } from "cesium";

import { Movement } from "@lib/typings/Event";

import BasicGraphices, { LifeCycle } from "./base";

import merge from "lodash.merge";
import Painter from "./painter";

export default class Polygon extends BasicGraphices implements LifeCycle {
  private _options: RectangleGraphics.ConstructorOptions = {};
  constructor(
    painter: Painter,
    options: RectangleGraphics.ConstructorOptions = {}
  ) {
    super(painter);
    this._options = options;
  }

  dropPoint(event: Movement): void {
    const earthPosition = this.pointer.calcPositions(event.position);

    if (Cesium.defined(earthPosition)) {
      if (!this.pointer._activeShapePoints.length) {
        this.pointer._activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(
          () => new Cesium.PolygonHierarchy(this.pointer._activeShapePoints),
          false
        );
        this.pointer._dynamicShapeEntity = this.pointer.addView(
          this.createShape(dynamicPositions)
        );
      }

      this.SetBreakpoint(earthPosition);
    }
  }

  playOff(): void {
    this._playOff(this.createShape.bind(this));
  }

  createShape(
    hierarchy: Cesium.Cartesian3[] | Cesium.CallbackProperty,
    isDynamic = false
  ): Cesium.Entity {
    const polygon = merge({}, this._options, {
      hierarchy: Array.isArray(hierarchy)
        ? new Cesium.PolygonHierarchy(hierarchy)
        : hierarchy
    });
    return new Cesium.Entity({ polygon });
  }
}
