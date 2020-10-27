import * as Cesium from "cesium";

import Subscriber from "@lib/subscriber";
import { Movement } from "@lib/typings/Event";
import Painter from "./painter";
import Polygon from "./polygon";
import Line from "./line";
import Point from "./point";

export interface DrawOption {
  viewer: Cesium.Viewer;
  type?: "POLYGON" | "LINE" | "POINT";
  terrain?: boolean;
  keyboard?: {
    START?: Cesium.ScreenSpaceEventType;
    END?: Cesium.ScreenSpaceEventType;
  };
}

export type DrawCallback = (entity: Cesium.Entity) => Cesium.Entity;

type Status = "INIT" | "START" | "PAUSE" | "DESTROY";

export default class Draw {
  private _viewer: Cesium.Viewer;
  private _type: DrawOption["type"];
  private _terrain: boolean;
  private _subscriber: Subscriber;

  private _status: Status;

  private _painter: Painter;

  private _events: string[] = [];

  private _typeClass: Line | Polygon | Point;

  private readonly _startDraw: (move: Movement) => void;
  private readonly _drawing: (move: Movement) => void;
  private readonly _endDraw: (move: Movement) => void;

  get status(): Status {
    return this._status;
  }

  constructor(options: DrawOption) {
    this._viewer = options.viewer;
    this._terrain = options.terrain || false;

    const painterOptions = {
      viewer: this._viewer
    };

    this._type = options.type || "POLYGON";
    this._painter = new Painter(painterOptions);

    if (this._type === "POLYGON") {
      this._typeClass = new Polygon(this._painter, this._terrain);
    } else if (this._type === "LINE") {
      this._typeClass = new Line(this._painter, this._terrain);
    } else if (this._type === "POINT") {
      this._typeClass = new Point(this._painter, this._terrain);
    } else {
      throw new Error(`the type '${this._type}' is not support`);
    }

    this._startDraw = this._typeClass.startDraw;
    this._drawing = this._typeClass.drawing;
    this._endDraw = this._typeClass.endDraw;

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

  start(callback?: DrawCallback, once = false): void {
    if (this._status === "START") return;

    const startId = this._subscriber.addExternal(move => {
      this._startDraw.call(this._typeClass, move);

      if (this._type !== "POINT") return;

      once && this.pause();

      callback =
        typeof callback === "function"
          ? callback
          : (val: Cesium.Entity): Cesium.Entity => val;
      this._viewer.entities.add(callback(this._typeClass.result));
    }, "LEFT_CLICK");

    const moveId = this._subscriber.addExternal(move => {
      this._drawing.call(this._typeClass, move);
    }, "MOUSE_MOVE");
    // Redraw the shape so it's not dynamic and remove the dynamic shape.

    const endId = this._subscriber.addExternal(move => {
      this._endDraw.call(this._typeClass, move);

      if (this._type === "POINT") return;

      once && this.pause();
      // 如果不是点，此时result会有一个实体生成
      this._viewer.entities.add(callback(this._typeClass.result));
    }, "RIGHT_CLICK");

    this._events.push(startId, moveId, endId);
  }

  private setCamera(): void {
    this._viewer.camera.lookAt(
      Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
      new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
    );
    this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
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
    this.pause = undefined;
    this.start = undefined;
    this.destroy = undefined;
  }
}
