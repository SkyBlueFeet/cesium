import { Entity } from "cesium";
import Painter from "./painter";

export default class BasicGraphices {
  result: Entity;
  pointer: Painter;
  _terrain: boolean;
  constructor(pointer: Painter, terrain: boolean) {
    this.pointer = pointer;
    this._terrain = terrain;
  }
}
