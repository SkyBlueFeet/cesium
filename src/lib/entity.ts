import * as Cesium from "cesium";

export interface BillboardEntity
  extends Cesium.BillboardGraphics.ConstructorOptions {
  entityOption: Cesium.Entity.ConstructorOptions;
}

export type Callback = (entity: Cesium.Entity) => Cesium.Entity;

export function createBillboardToViewer(
  viewer: Cesium.Viewer,
  billboardOptions: BillboardEntity,
  callback?: Callback
): Cesium.Entity {
  const _entityOption = billboardOptions.entityOption;

  const _billboard = new Cesium.BillboardGraphics(billboardOptions);

  let _entity = viewer.entities.add({
    ..._entityOption,
    billboard: _billboard
  });

  if (typeof callback === "function") _entity = callback(_entity);

  return _entity;
}

type addEntityOption = {
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

/**
 *
 * @param viewer
 * @param entity
 * @param callback
 * @param eventType
 *
 * @returns void
 */
export function addEventListenerToViewer(
  viewer: Cesium.Viewer,
  entity: Cesium.Entity,
  callback: Function,
  eventType: Cesium.ScreenSpaceEventType
): void {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function(movement) {
    const pick = viewer.scene.pick(movement.position);

    if (!!pick && pick.id.id === entity.id) {
      callback(movement, entity);
    }
  }, eventType);
}
