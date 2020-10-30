import { Entity, Cartesian3, CallbackProperty } from "cesium";
import Painter from "./painter";
import { Movement } from "@lib/typings/Event";

export interface LifeCycle {
  dropPoint(move: Movement): void;
  moving(move: Movement): void;
  playOff(move: Movement): void;
  createShape: Function;
}

export default class BasicGraphices {
  result: Entity;
  pointer: Painter;
  _terrain: boolean;
  constructor(pointer: Painter) {
    this.pointer = pointer;
    this._terrain = pointer._terrain;
  }
}
