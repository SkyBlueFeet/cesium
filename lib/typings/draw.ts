import { Movement } from "./Event";
import Cesium, { Cartesian3 } from "cesium";

export type hierarchyHandler = (
  hierarchy: Cesium.Cartesian3[] | Cesium.CallbackProperty | Cartesian3
) => Cesium.Entity.ConstructorOptions;

export interface LifeCycle {
  startDraw: (move: Movement) => void;
  drawing: (move: Movement) => void;
  endDraw: (move: Movement) => void;
  handler: hierarchyHandler;
}
