import { Movement } from "@lib/typings/Event";
import { Cartesian3, defined, Entity, Color, PointGraphics } from "cesium";
import BasicGraphices, { LifeCycle } from "./base";
import Painter from "./painter";
import merge from "lodash.merge";
export default class Point extends BasicGraphices implements LifeCycle {
  _options: PointGraphics.ConstructorOptions;

  constructor(
    painter: Painter,
    options: PointGraphics.ConstructorOptions = {}
  ) {
    super(painter);
    this._options = options;
  }

  dropPoint(event: Movement): void {
    const earthPosition = this.pointer.calcPositions(event.position);

    if (defined(earthPosition))
      this.result = this.createDynamicShape(earthPosition);
  }

  moving(): void {
    return undefined;
  }

  playOff(): void {
    this.pointer.reset();
    return undefined;
  }

  createDynamicShape(position: Cartesian3, isDynamic = false): Entity {
    const point = merge({}, this._options);
    return new Entity({ position, point });
  }
}
