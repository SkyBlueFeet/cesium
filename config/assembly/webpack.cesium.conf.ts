/*
 * @Date: 2020-09-13 15:05:04
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-13 23:49:12
 * @repository: https://github.com/SkyBlueFeet
 */
import webpack from "webpack";
import * as utils from "../utils";
import CoptWebpackPlugin from "copy-webpack-plugin";
import path from "path";

const cesiumWebpackConfig = (env: env): webpack.Configuration => {
  const result: webpack.Configuration = {
    output: {
      sourcePrefix: ""
    },
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    module: {
      rules: [],
      unknownContextCritical: false
    },
    resolve: {},
    plugins: [
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("")
      }),
      new CoptWebpackPlugin([
        {
          from: path.join(utils.cesiumSource, utils.cesiumWorkers),
          to: "Workers"
        },
        { from: path.join(utils.cesiumSource, "Assets"), to: "Assets" },
        { from: path.join(utils.cesiumSource, "Widgets"), to: "Widgets" }
      ])
    ]
  };
  if (env === "production") {
    result.module.rules.push({
      test: /\.js$/,
      enforce: "pre",
      include: utils.resolve(utils.cesiumSource),
      use: [
        {
          loader: "strip-pragma-loader",
          options: {
            pragmas: {
              debug: false
            }
          }
        }
      ]
    });
  }
  return result;
};

export default cesiumWebpackConfig;
