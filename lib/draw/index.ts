import * as Cesium from "cesium";
import { Entity } from "cesium";
import Subscriber from "@lib/subscriber";
import { Movement } from "@lib/typings/Event";

export interface DrawOption {
  viewer: Cesium.Viewer;
  type?: "POLYGON" | "LINE" | "POINT";
  terrain?: boolean;
  once?: boolean;
}

type Status = "INIT" | "START" | "PAUSE" | "DESTROY";

export default class Draw {
  private _viewer: Cesium.Viewer;
  private _type: DrawOption["type"];
  private _terrain: boolean;
  private _subscriber: Subscriber;

  private _activeShapePoints: Cesium.Cartesian3[] = [];

  private _activeShape: Entity;
  private _floatingPoint: Entity;
  private _status: Status;

  private _events: string[] = [];

  get status(): Status {
    return this._status;
  }

  constructor(options: DrawOption) {
    this._viewer = options.viewer;

    this._type = options.type || "POLYGON";

    this._terrain = options.terrain || false;

    this._subscriber = new Subscriber(this._viewer);

    this._status = "INIT";

    Subscriber.removeNative(this._viewer, "LEFT_DOUBLE_CLICK");

    // console.log(picker);
    if (this._terrain && !this._viewer.scene.pickPositionSupported) {
      console.warn("This browser does not support pickPosition.");
      this._terrain = false;
    }

    // Zoom in to an area with mountains
    this.setCamera();
  }

  start(): void {
    if (this._status === "START") return;

    const startId = this._subscriber.addExternal(
      this.startDraw.bind(this),
      "LEFT_CLICK"
    );

    const moveId = this._subscriber.addExternal(
      this.drawing.bind(this),
      "MOUSE_MOVE"
    );
    // Redraw the shape so it's not dynamic and remove the dynamic shape.

    const endId = this._subscriber.addExternal(
      this.finalized.bind(this),
      "RIGHT_CLICK"
    );

    this._events.push(startId, moveId, endId);
  }

  private setCamera(): void {
    this._viewer.camera.lookAt(
      Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
      new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
    );
    this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }

  private startDraw(event: Movement): void {
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    const earthPosition = this._terrain
      ? this._viewer.scene.pickPosition(event.position)
      : this._viewer.camera.pickEllipsoid(event.position);

    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (Cesium.defined(earthPosition)) {
      if (this._activeShapePoints.length === 0) {
        this._floatingPoint = this.createPoint(earthPosition);
        this._activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(() => {
          return this._type === "POLYGON"
            ? new Cesium.PolygonHierarchy(this._activeShapePoints)
            : this._activeShapePoints;
        }, false);
        this._activeShape = this.draw(dynamicPositions);
      }
      this._activeShapePoints.push(earthPosition);
      this.createPoint(earthPosition);
    }
  }

  private drawing(event: Movement): void {
    if (Cesium.defined(this._floatingPoint)) {
      const newPosition = this._terrain
        ? this._viewer.scene.pickPosition(event.endPosition)
        : this._viewer.camera.pickEllipsoid(event.endPosition);

      // const newPosition = picker(event.endPosition);
      if (Cesium.defined(newPosition)) {
        this._floatingPoint.position = new Cesium.ConstantPositionProperty(
          newPosition
        );
        this._activeShapePoints.pop();
        this._activeShapePoints.push(newPosition);
      }
    }
  }

  private createPoint(worldPosition: Cesium.Cartesian3): Cesium.Entity {
    return this._viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }

  private draw(
    hierarchy: Cesium.Cartesian3[] | Cesium.CallbackProperty
  ): Cesium.Entity {
    let shape: Cesium.Entity;
    if (this._type === "LINE") {
      shape = this._viewer.entities.add({
        polyline: {
          positions: hierarchy,
          clampToGround: true,
          width: 3
        }
      });
    } else if (this._type === "POLYGON") {
      shape = this._viewer.entities.add({
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

  private finalized(): void {
    this._activeShapePoints.pop();
    this.draw(this._activeShapePoints);
    this._viewer.entities.remove(this._floatingPoint);
    this._viewer.entities.remove(this._activeShape);
    this._floatingPoint = undefined;
    this._activeShape = undefined;
    this._activeShapePoints = [];
  }

  pause(): void {
    this._status = "PAUSE";
    this._subscriber.removeExternal(this._events);
    this._events = [];
  }

  destroy(): void {
    this._status = "DESTROY";
    this._subscriber.destroy();

    this._viewer = undefined;
    this._type = undefined;
    this._terrain = undefined;
    this._activeShapePoints = undefined;
    this._activeShape = undefined;
    this._floatingPoint = undefined;
    this.pause = undefined;
    this.start = undefined;
    this.destroy = undefined;
  }
}
