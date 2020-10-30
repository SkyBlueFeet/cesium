import {
  Entity,
  CallbackProperty,
  Cartesian3,
  Color,
  Rectangle as CesiumRectangle,
  JulianDate,
  RectangleGraphics
} from "cesium";
import BasicGraphices, { LifeCycle } from "./base";
import { Movement } from "@lib/typings/Event";
import Painter from "./painter";
import merge from "lodash.merge";

export default class Rectangle extends BasicGraphices implements LifeCycle {
  private _options: RectangleGraphics.ConstructorOptions = {};
  constructor(
    painter: Painter,
    options: RectangleGraphics.ConstructorOptions = {}
  ) {
    super(painter);
    this._options = options;
  }

  dropPoint(move: Movement): void {
    this._dropPoint(move, this.createShape.bind(this));
  }

  playOff(): void {
    this._playOff(this.createShape.bind(this));
  }

  createShape(
    hierarchy: Cartesian3[] | CallbackProperty,
    isDynamic = false
  ): Entity {
    const target = Array.isArray(hierarchy)
      ? hierarchy
      : hierarchy.getValue(JulianDate.now());

    const rectangle = merge({}, this._options, {
      coordinates: new CallbackProperty(function() {
        const obj = CesiumRectangle.fromCartesianArray(target);
        // if(obj.west==obj.east){ obj.east+=0.000001};
        // if(obj.south==obj.north){obj.north+=0.000001};
        return obj;
      }, false)
    });
    return new Entity({ rectangle });
  }
}
