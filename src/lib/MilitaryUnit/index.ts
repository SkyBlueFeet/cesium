import { typeConvert } from "@root/utils/typings";
import { MilitaryUnitType, iconPath } from "@src/lib/MilitaryUnit/type";
import * as Cesium from "cesium";
import { cartesian3ToLngLat, locationType } from "../utils";

export type Callback = (
  this: Cesium.Viewer,
  entity: Cesium.Entity
) => Cesium.Entity;

export interface BillboardEntity
  extends Cesium.BillboardGraphics.ConstructorOptions {
  type: MilitaryUnitType;
  entityOption: Cesium.Entity.ConstructorOptions;
}

export interface UnitaireConstructorOption {
  viewer: Cesium.Viewer;
}

const defaultOptions: BillboardEntity = {
  type: MilitaryUnitType.Suspicious,
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
   * 创建的单元类型
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
   * @param unitOptions 单元属性

   * @param callback 创建完成后的回调
   *
   * @returns `回调函数返回值`即为方法返回值 @link callback
   */
  createUnit(unitOptions: BillboardEntity, callback?: Callback): this {
    this.position = cartesian3ToLngLat(
      typeConvert(unitOptions.entityOption.position)
    );
    this.type = unitOptions.type;
    this.name = unitOptions.entityOption.name;

    this._entityOption = unitOptions.entityOption;

    this._unitOption = {
      ...this._option,
      image: iconPath[this._option.type]
    };

    this._unitOption.image = iconPath[unitOptions.type];
    this._unitOption.disableDepthTestDistance = Number.POSITIVE_INFINITY; // 去掉地形遮挡

    const _billboard = new Cesium.BillboardGraphics(this._unitOption);

    this._entity = this._viewer.entities.add({
      description: "",
      ...this._entityOption,
      billboard: _billboard
    });

    /**
     * 点击后的信息框内容
     */
    const content = `<h1>编号：</h1><small>${
      this._entity.id
    }</small><h1>名称：${this._entityOption.name}</h1><h1>类型：${locationType(
      this.type
    )}</h1><h2>经度: ${this.position.latitude}</h2><h2>纬度：${
      this.position.longitude
    }</h2><h2>高度：${this.position.height}</h2>`;

    this._entity.description = typeConvert(content);

    this.id = this._entity.id;

    if (typeof callback === "function")
      this._entity = callback.call(this._viewer, this._entity);

    return this;
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
