import _ from "lodash";

export type postionRange = {
  min: number;
  max: number;
};

export type positionResult = {
  latitude: number;
  longitude: number;
  height: number;
};

export type positionOption = {
  longRange?: postionRange;
  latRange?: postionRange;
  heightRange?: postionRange;
};

function getRandomNum(range: postionRange): number {
  const { max, min } = range;
  const _range = max - min;
  const _random = Math.random();
  return min + Math.round(_random * _range);
}

export default function(range?: positionOption): positionResult {
  const defaultOption: positionOption = {
    heightRange: { min: 0, max: 180000 },
    longRange: { min: -180, max: 180 },
    latRange: { min: -90, max: 90 }
  };

  range = _.assign(range, defaultOption);

  return {
    longitude: getRandomNum(range.longRange),
    latitude: getRandomNum(range.latRange),
    height: getRandomNum(range.heightRange)
  };
}
