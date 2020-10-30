import {
  Entity,
  CallbackProperty,
  Cartesian3,
  defined,
  ConstantPositionProperty,
  Color,
  Rectangle as CesiumRectangle,
  JulianDate
} from "cesium";
import BasicGraphices, { LifeCycle } from "./base";
import { Movement } from "@lib/typings/Event";

export default class Rectangle extends BasicGraphices implements LifeCycle {
  private pointEntities: Entity[] = [];
  dropPoint(move: Movement): void {
    const earthPosition = this.pointer.calcPositions(move);

    console.log(earthPosition, this.pointer.calcPositions(move));

    if (!defined(earthPosition)) return;

    if (!this.pointer._activeShapePoints.length) {
      this.pointer._floatingPoint = this.pointer.createPoint(earthPosition);
      this.pointer._activeShapePoints.push(earthPosition);

      // 将动态绘制的图形加入Viewer
      const dynamicPositions = new CallbackProperty(() => {
        return this.pointer._activeShapePoints;
      }, false);
      this.pointer._dynamicEntity = this.createShape(dynamicPositions);
      this.pointer.addView(this.pointer._dynamicEntity);
    }
    this.pointer._activeShapePoints.push(earthPosition);

    const $point = this.pointer.createPoint(earthPosition);

    this.pointEntities.push($point);

    this.pointer.addView($point);
  }

  moving(event: Movement): void {
    if (defined(this.pointer._floatingPoint)) {
      const newPosition = this._terrain
        ? this.pointer._viewer.scene.pickPosition(event.endPosition)
        : this.pointer._viewer.camera.pickEllipsoid(event.endPosition);

      if (defined(newPosition)) {
        this.pointer._floatingPoint.position = new ConstantPositionProperty(
          newPosition
        );
        this.pointer._activeShapePoints.pop();
        this.pointer._activeShapePoints.push(newPosition);
      }
    }
  }

  playOff(): void {
    this.pointer._activeShapePoints.pop();

    this.result = this.createShape(this.pointer._activeShapePoints);

    while (this.pointEntities.length) {
      this.pointer._viewer.entities.remove(this.pointEntities.pop());
    }

    this.pointer.reset();
  }

  createShape(hierarchy: Cartesian3[] | CallbackProperty): Entity {
    const target = Array.isArray(hierarchy)
      ? hierarchy
      : hierarchy.getValue(JulianDate.now());
    return new Entity({
      name: "Blue translucent, rotated, and extruded ellipse with outline",
      rectangle: {
        coordinates: new CallbackProperty(function() {
          const obj = CesiumRectangle.fromCartesianArray(target);
          // if(obj.west==obj.east){ obj.east+=0.000001};
          // if(obj.south==obj.north){obj.north+=0.000001};
          return obj;
        }, false),
        material: Color.RED.withAlpha(0.5)
      }
    });
  }
}
