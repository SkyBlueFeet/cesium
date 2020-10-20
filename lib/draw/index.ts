import * as Cesium from "cesium";
import { Entity } from "cesium";
import Subscriber from "@lib/subscriber";
import { Movement } from "@lib/typings/Event";
import Painter from "./painter";
import Polygon from "./polygon";
import Line from "./line";

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

  private _painter: Painter;

  private _events: string[] = [];

  private _typeClass;

  private readonly _startDraw: (Movement) => void;
  private readonly _drawing: (Movement) => void;
  private readonly _endDraw: (Movement) => void;

  get status(): Status {
    return this._status;
  }

  constructor(options: DrawOption) {
    this._viewer = options.viewer;
    this._terrain = options.terrain || false;

    const painterOptions = {
      viewer: this._viewer,
      handler: undefined
    };

    this._type = options.type || "POLYGON";

    if (this._type === "POLYGON") {
      painterOptions.handler = Polygon.handler;
      this._painter = new Painter(painterOptions);
      this._typeClass = new Polygon(this._painter, this._terrain);
    } else if (this._type === "LINE") {
      painterOptions.handler = Line.handler;
      this._painter = new Painter(painterOptions);
      this._typeClass = new Line(this._painter, this._terrain);
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

  start(): void {
    if (this._status === "START") return;

    const startId = this._subscriber.addExternal(
      this._startDraw.bind(this._typeClass),
      "LEFT_CLICK"
    );

    const moveId = this._subscriber.addExternal(
      this._drawing.bind(this._typeClass),
      "MOUSE_MOVE"
    );
    // Redraw the shape so it's not dynamic and remove the dynamic shape.

    const endId = this._subscriber.addExternal(
      this._endDraw.bind(this._typeClass),
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
