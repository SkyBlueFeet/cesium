import * as Cesium from "cesium";
import Random from "@src/utils/radromPosition";
import { MilitaryUnitType } from "./MilitaryUnit/type";

export function getRandomCartesian3(): Cesium.Cartesian3 {
  const _random = Random();
  return Cesium.Cartesian3.fromDegrees(
    _random.longitude,
    _random.latitude,
    _random.height
  );
}

export function cartesian3ToLngLat(cartesian3: Cesium.Cartesian3): LngLatHgt {
  const catographic = Cesium.Cartographic.fromCartesian(cartesian3);

  return {
    latitude: Number(Cesium.Math.toDegrees(catographic.latitude).toFixed(6)),
    longitude: Number(Cesium.Math.toDegrees(catographic.longitude).toFixed(6)),
    height: Number(catographic.height.toFixed(2))
  };
}

export function locationType(militaryUnitType: MilitaryUnitType): string {
  let _type = "";
  switch (militaryUnitType) {
    case 0:
      _type = "军事基地";
      break;
    case 1:
      _type = "机场";
      break;
    case 2:
      _type = "港口";
      break;
    case 3:
      _type = "侦察站";
      break;
    case 4:
      _type = "可疑或重点目标";
      break;
  }
  return _type;
}
