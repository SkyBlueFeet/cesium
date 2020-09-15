/*
 * @Date: 2020-09-13 15:05:04
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-14 01:00:16
 * @repository: https://github.com/SkyBlueFeet
 */
import webpack from "webpack";
import * as utils from "../utils";
import CoptWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import { environment } from "./.";
import { cfgLoader } from "../rules/loaders";

const cesiumWebpackConfig = (env: environment): webpack.Configuration => {
  const result: webpack.Configuration = {
    output: {
      sourcePrefix: ""
    },
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    module: {
      rules: [
        {
          test: /\.(cfg)$/,
          loader: [cfgLoader],
          include: [utils.resolve("src")]
        }
        // {
        //   test: /\.(glb|gltf)$/,
        //   loader: "url-loader",
        //   options: {
        //     limit: 10000,
        //     name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        //   }
        // }
      ],
      unknownContextCritical: false
    },
    resolve: {
      alias: {}
    },
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
