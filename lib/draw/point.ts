import { Movement } from "@lib/typings/Event";
import * as Cesium from "cesium";
import BasicGraphices from "./base";

export default class Point extends BasicGraphices {
  startDraw(event: Movement): void {
    const earthPosition = this._terrain
      ? this.pointer._viewer.scene.pickPosition(event.position)
      : this.pointer._viewer.camera.pickEllipsoid(event.position);

    if (Cesium.defined(earthPosition)) this.result = this.create(earthPosition);
  }

  drawing(): void {
    return undefined;
  }

  endDraw(): void {
    return undefined;
  }

  create(hierarchy: Cesium.Cartesian3): Cesium.Entity {
    return new Cesium.Entity({
      position: hierarchy,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10
      }
    });
  }
}
