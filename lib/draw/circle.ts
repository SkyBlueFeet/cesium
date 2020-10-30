import BasicGraphices, { LifeCycle } from "./base";
import { Movement } from "@lib/typings/Event";
import {
  CallbackProperty,
  Entity,
  Cartesian3,
  Color,
  JulianDate,
  EllipseGraphics
} from "cesium";
import Painter from "./painter";

import merge from "lodash.merge";

export default class Circle extends BasicGraphices implements LifeCycle {
  _options: EllipseGraphics.ConstructorOptions;

  constructor(
    painter: Painter,
    options: EllipseGraphics.ConstructorOptions = {}
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
    const target: Cartesian3[] = Array.isArray(hierarchy)
      ? hierarchy
      : hierarchy.getValue(JulianDate.now());

    const ellipse = merge({}, this._options, {
      semiMinorAxis: new CallbackProperty(function() {
        // 半径 两点间距离
        const radius = Math.sqrt(
          Math.pow(target[0].x - target[target.length - 1].x, 2) +
            Math.pow(target[0].y - target[target.length - 1].y, 2)
        );
        return radius || radius + 1;
      }, false),
      semiMajorAxis: new CallbackProperty(function() {
        const radius = Math.sqrt(
          Math.pow(target[0].x - target[target.length - 1].x, 2) +
            Math.pow(target[0].y - target[target.length - 1].y, 2)
        );
        return radius || radius + 1;
      }, false)
    });

    const position = this.pointer._activeShapePoints[0];

    return new Entity({ position, ellipse });
  }
}
