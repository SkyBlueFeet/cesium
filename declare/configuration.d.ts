/*
 * @Date: 2020-09-13 23:47:28
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-14 00:53:14
 * @repository: https://github.com/SkyBlueFeet
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

interface Cfg {
  /**
   * @description 经度
   * @type number
   */
  latitude: number;

  /**
   * @description 纬度
   * @type number
   */
  longitude: number;

  /**
   * @description 高度
   * @type number
   */
  height: number;

  /**
   * @description 俯仰
   * @type number
   */
  pitch: number;

  /**
   * @description 航向
   * @type number
   */
  heading: number;

  /**
   * @description 横滚
   * @type number
   */
  roll: number;
}
