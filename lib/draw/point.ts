import { Movement } from "@lib/typings/Event";
import { Cartesian3, defined, Entity, Color } from "cesium";
import BasicGraphices, { LifeCycle } from "./base";

export default class Point extends BasicGraphices implements LifeCycle {
  createShape: Function;
  dropPoint(event: Movement): void {
    const earthPosition = this._terrain
      ? this.pointer._viewer.scene.pickPosition(event.position)
      : this.pointer._viewer.camera.pickEllipsoid(event.position);

    if (defined(earthPosition)) this.result = this.create(earthPosition);
  }

  moving(): void {
    return undefined;
  }

  playOff(): void {
    this.pointer.reset();
    return undefined;
  }

  create(hierarchy: Cartesian3): Entity {
    return new Entity({
      position: hierarchy,
      point: {
        pixelSize: 10,
        color: Color.RED
      }
    });
  }
}
