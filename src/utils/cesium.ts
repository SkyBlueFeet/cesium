/*
 * @Date: 2020-09-14 00:19:32
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-14 00:30:19
 * @repository: https://github.com/SkyBlueFeet
 */
import { Viewer } from "cesium";

import * as Cesium from "cesium";

const appKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOGE3M2Q0YS1iNDNkLTRlNzktYjI2ZC0zNzQxOTA4ZTE0YzkiLCJpZCI6MzM1NzIsImlhdCI6MTU5ODkzMTM0OX0.0smZopUOejbfDQ9zrX87y5aelApZCXwWXLm7_UuJRAA";

export const getCesiumViewer = (
  id: string,
  option: Viewer.ConstructorOptions = {}
): Viewer => {
  Cesium.Ion.defaultAccessToken = appKey;

  return new Cesium.Viewer(id, option);
};
