import * as Cesium from "cesium";

export type billboard = {
  uri: string;
};

export function createBillboard(
  billboardOptions: Cesium.BillboardGraphics.ConstructorOptions
): Cesium.BillboardGraphics {
  return new Cesium.BillboardGraphics({
    ...billboardOptions
  });
}
