import * as Cesium from "cesium";
import { PolylineGraphics } from "cesium";
import { Movement } from "@lib/typings/Event";
import BasicGraphices from "./base";
import Painter from "./painter";
import merge from "lodash.merge";
export default class Line extends BasicGraphices {
  _options: PolylineGraphics.ConstructorOptions;

  constructor(
    painter: Painter,
    options: PolylineGraphics.ConstructorOptions = {}
  ) {
    super(painter);
    this._options = options;
  }

  dropPoint(event: Movement): void {
    this._dropPoint(event, this.createShape.bind(this));
  }

  playOff(): void {
    this._playOff(this.createShape.bind(this));
  }

  createShape(
    positions: Cesium.Cartesian3[] | Cesium.CallbackProperty,
    isDynamic = false
  ): Cesium.Entity {
    const polyline = merge({}, this._options, { positions });
    return new Cesium.Entity({ polyline });
  }
}
