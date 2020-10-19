import * as Cesium from "cesium";
import { Entity } from "cesium";
import Subscriber from "@lib/subscriber";

export interface DrawOption {
  viewer: Cesium.Viewer;
  mode?: "POLYGON" | "LINE" | "POINT";
  terrain?: boolean;
}

export default class Draw {
  viewer: Cesium.Viewer;
  mode: DrawOption["mode"];
  terrain: boolean;
  subscriber: Subscriber;

  activeShapePoints: Cesium.Cartesian3[] = [];

  activeShape: Entity;
  floatingPoint: Entity;
  constructor(options: DrawOption) {
    this.viewer = options.viewer;

    this.mode = options.mode || "POLYGON";

    this.terrain = options.terrain || false;

    this.subscriber = new Subscriber(this.viewer);

    // console.log(picker);
    if (this.terrain && !this.viewer.scene.pickPositionSupported) {
      window.alert("This browser does not support pickPosition.");
    }
    this.operateSubscriber();
  }

  private operateSubscriber(): void {
    Subscriber.removeNative(this.viewer, "LEFT_DOUBLE_CLICK");

    this.subscriber.addExternal(movement => {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      const earthPosition = this.terrain
        ? this.viewer.scene.pickPosition(movement.position)
        : this.viewer.camera.pickEllipsoid(movement.position);
      // we get the correct point when mousing over terrain.
      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (this.activeShapePoints.length === 0) {
          this.floatingPoint = this.createPoint(earthPosition);
          this.activeShapePoints.push(earthPosition);
          const dynamicPositions = new Cesium.CallbackProperty(() => {
            if (this.mode === "POLYGON") {
              return new Cesium.PolygonHierarchy(this.activeShapePoints);
            }
            return this.activeShapePoints;
          }, false);
          this.activeShape = this.drawShape(dynamicPositions);
        }
        this.activeShapePoints.push(earthPosition);
        this.createPoint(earthPosition);
      }
    }, "LEFT_CLICK");

    this.subscriber.addExternal(event => {
      if (Cesium.defined(this.floatingPoint)) {
        const newPosition = this.terrain
          ? this.viewer.scene.pickPosition(event.endPosition)
          : this.viewer.camera.pickEllipsoid(event.endPosition);

        // const newPosition = picker(event.endPosition);
        if (Cesium.defined(newPosition)) {
          this.floatingPoint.position = new Cesium.ConstantPositionProperty(
            newPosition
          );
          this.activeShapePoints.pop();
          this.activeShapePoints.push(newPosition);
        }
      }
    }, "MOUSE_MOVE");
    // Redraw the shape so it's not dynamic and remove the dynamic shape.

    this.subscriber.addExternal(() => {
      this.terminateShape();
    }, "RIGHT_CLICK");

    // Zoom in to an area with mountains
    this.viewer.camera.lookAt(
      Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
      new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
    );
    this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }

  private createPoint(worldPosition: Cesium.Cartesian3): Cesium.Entity {
    return this.viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }

  private drawShape(
    hierarchy: Cesium.Cartesian3[] | Cesium.CallbackProperty
  ): Cesium.Entity {
    let shape: Cesium.Entity;
    if (this.mode === "LINE") {
      shape = this.viewer.entities.add({
        polyline: {
          positions: hierarchy,
          clampToGround: true,
          width: 3
        }
      });
    } else if (this.mode === "POLYGON") {
      shape = this.viewer.entities.add({
        polygon: {
          hierarchy: Array.isArray(hierarchy)
            ? new Cesium.PolygonHierarchy(hierarchy)
            : hierarchy,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.WHITE.withAlpha(0.7)
          )
        }
      });
    }
    return shape;
  }

  private terminateShape(): void {
    this.activeShapePoints.pop();
    this.drawShape(this.activeShapePoints);
    this.viewer.entities.remove(this.floatingPoint);
    this.viewer.entities.remove(this.activeShape);
    this.floatingPoint = undefined;
    this.activeShape = undefined;
    this.activeShapePoints = [];
  }
}
