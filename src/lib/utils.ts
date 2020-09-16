import * as Cesium from "cesium";
import Random from "@src/utils/radromPosition";

export function getRandomCartesian3(): Cesium.Cartesian3 {
  const _random = Random();
  return Cesium.Cartesian3.fromDegrees(
    _random.longitude,
    _random.latitude,
    // _random.height
    0
  );
}
