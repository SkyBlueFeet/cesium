import Painter from "./painter";
import { Movement } from "@lib/typings/Event";
import * as Cesium from "cesium";

export default class Point {
  pointer: Painter;
  _terrain: boolean;
  constructor(pointer: Painter, terrain: boolean) {
    this.pointer = pointer;
    this._terrain = terrain;
  }

  startDraw(event: Movement): void {
    const earthPosition = this._terrain
      ? this.pointer._viewer.scene.pickPosition(event.position)
      : this.pointer._viewer.camera.pickEllipsoid(event.position);

    if (Cesium.defined(earthPosition))
      this.pointer.finalized(this.handler(earthPosition));
  }

  drawing(): void {
    return undefined;
  }

  endDraw(): void {
    return undefined;
  }

  handler(hierarchy: Cesium.Cartesian3): Cesium.Entity.ConstructorOptions {
    return {
      position: hierarchy,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10
      }
    };
  }
}
