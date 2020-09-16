import * as Cesium from "cesium";

const appKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOGE3M2Q0YS1iNDNkLTRlNzktYjI2ZC0zNzQxOTA4ZTE0YzkiLCJpZCI6MzM1NzIsImlhdCI6MTU5ODkzMTM0OX0.0smZopUOejbfDQ9zrX87y5aelApZCXwWXLm7_UuJRAA";

export const getCesiumViewer = (
  id: string,
  option: Cesium.Viewer.ConstructorOptions = {}
): Cesium.Viewer => {
  Cesium.Ion.defaultAccessToken = appKey;

  return new Cesium.Viewer(id, option);
};

export type addEntityOption = {
  focus?: boolean;
};

export function addEntityToViewer(
  eViewer: Cesium.Viewer,
  entity: Cesium.Entity,
  options: addEntityOption = {}
): void {
  eViewer.entities.add(entity);

  if (options.focus) eViewer.flyTo(entity);
}
