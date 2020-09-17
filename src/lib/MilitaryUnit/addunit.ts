import { typeConvert } from "@root/utils/typings";
import { MilitaryUnitType, iconPath } from "@src/lib/MilitaryUnit/type";
import * as Cesium from "cesium";
import { cartesian3ToLngLat, locationType } from "../utils";

export type Callback = (entity: Cesium.Entity | Cesium.Entity) => Cesium.Entity;

export interface BillboardEntity
  extends Cesium.BillboardGraphics.ConstructorOptions {
  icon: MilitaryUnitType;
  entityOption: Cesium.Entity.ConstructorOptions;
}

export interface UnitaireConstructorOption {
  viewer: Cesium.Viewer;
}

const defaultOptions: BillboardEntity = {
  icon: MilitaryUnitType.Suspicious,
  sizeInMeters: true,
  disableDepthTestDistance: Number.POSITIVE_INFINITY, // 去掉地形遮挡
  entityOption: {}
};

// export function

export default class Unitaire {
  private _entity: Cesium.Entity;
  private _viewer: Cesium.Viewer;
  private _entityOption: Cesium.Entity.ConstructorOptions = {};
  private _unitOption: Cesium.BillboardGraphics.ConstructorOptions = {};
  private _option: BillboardEntity = defaultOptions;

  /**
   * @description 单元ID,由Cesium生成，未生成单元时不可用，也可在entityOption中自定义
   */
  id: string;

  /**
   * @description 单元命名，在entityOption中自定义
   */
  name: string;

  /**
   * 单元类型
   */
  type: MilitaryUnitType;

  /**
   *  @description 单元位置，坐标类型为经纬度
   */
  position: LngLatHgt;

  constructor(option: UnitaireConstructorOption) {
    this._viewer = option.viewer;
  }

  /**
   *
   * @description 根据属性创建相应单位并添加到视图中
   * 
   * @param unitOptions 单位属性

   * @param callback 创建完成后的回调
   *
   * @returns `回调函数返回值`即为方法返回值 @link callback
   */
  createUnit(unitOptions: BillboardEntity, callback?: Callback): Cesium.Entity {
    this.position = cartesian3ToLngLat(
      typeConvert(unitOptions.entityOption.position)
    );
    this.type = unitOptions.icon;
    this.name = unitOptions.entityOption.name;

    this._entityOption = unitOptions.entityOption;

    this._unitOption = {
      ...this._option,
      image: iconPath[this._option.icon]
    };

    this._unitOption.image = iconPath[unitOptions.icon];
    this._unitOption.disableDepthTestDistance = Number.POSITIVE_INFINITY; // 去掉地形遮挡

    const _billboard = new Cesium.BillboardGraphics(this._unitOption);

    this._entity = this._viewer.entities.add({
      description: "",
      ...this._entityOption,
      billboard: _billboard
    });

    this._entity.description = `<h1>编号：</h1><small>${
      this._entity.id
    }</small><h1>名称：${this._entityOption.name}</h1><h1>类型：${locationType(
      this.type
    )}</h1><h2>经度: ${this.position.latitude}</h2><h2>纬度：${
      this.position.longitude
    }</h2><h2>高度：${this.position.height}</h2>`;

    this.id = this._entity.id;

    if (typeof callback === "function") this._entity = callback(this._entity);

    console.log(_billboard.sizeInMeters);

    return this._entity;
  }

  addEventListener(
    callback: Function,
    eventType: Cesium.ScreenSpaceEventType
  ): void {
    if (!this._entity || !this._viewer) {
      console.warn("添加事件前请先创建实体");
      return;
    }

    const _handler = new Cesium.ScreenSpaceEventHandler(
      this._viewer.scene.canvas
    );

    _handler.setInputAction(movement => {
      const pick = this._viewer.scene.pick(movement.position);

      if (pick && pick.id.id === this._entity.id)
        callback(movement, this._entity);
    }, eventType);
  }
}
