import Draw from "@lib/draw";
import { Movement } from "./Event";
import Cesium, { Entity } from "cesium";

export type hierarchyHandler = (
  hierarchy: Cesium.Cartesian3[] | Cesium.CallbackProperty
) => Cesium.Entity.ConstructorOptions;

export interface LifeCycle {
  startDraw: (move: Movement) => void;
  drawing: (move: Movement) => void;
  endDraw: (move: Movement) => void;
  handler: hierarchyHandler;
}
