import BasicGraphices, { LifeCycle } from "./base";
import { Movement } from "@lib/typings/Event";
import {
  defined,
  CallbackProperty,
  ConstantPositionProperty,
  Entity,
  Cartesian3,
  Color,
  JulianDate
} from "cesium";

export default class Circle extends BasicGraphices implements LifeCycle {
  private pointEntities: Entity[] = [];

  dropPoint(move: Movement): void {
    const earthPosition = this._terrain
      ? this.pointer._viewer.scene.pickPosition(move.position)
      : this.pointer._viewer.camera.pickEllipsoid(move.position);

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

    this.pointer.addView($point);

    this.pointEntities.push($point);
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
        console.log(
          "this.pointer._activeShapePoints: ",
          this.pointer._activeShapePoints
        );
      }
    }
    // throw new Error("Method not implemented.");
  }

  playOff(): void {
    this.pointer._activeShapePoints.pop();

    this.result = this.createShape(this.pointer._activeShapePoints);

    while (this.pointEntities.length) {
      this.pointer._viewer.entities.remove(this.pointEntities.pop());
    }

    this.pointer.reset();

    this.pointEntities = [];
  }

  createShape(hierarchy: Cartesian3[] | CallbackProperty): Entity {
    const target: Cartesian3[] = Array.isArray(hierarchy)
      ? hierarchy
      : hierarchy.getValue(JulianDate.now());

    return new Entity({
      position: this.pointer._activeShapePoints[0],
      name: "Blue translucent, rotated, and extruded ellipse with outline",
      ellipse: {
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
        }, false),
        material: Color.BLUE.withAlpha(0.5),
        outline: true
      }
    });
  }
}
