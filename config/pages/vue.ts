/*
 * @Date: 2020-09-14 00:37:15
 * @LastEditors: skyblue
 * @LastEditTime: 2020-09-14 01:00:36
 * @repository: https://github.com/SkyBlueFeet
 */
import { Entry } from "webpack";
import { resolve } from "../utils";
import { Options as PageOptions } from "html-webpack-plugin";
import { MixingPagesOption } from ".";
import { environment } from "../assembly";

export default function(env: environment): MixingPagesOption {
  const vueEntry: Entry = {
    app: resolve("src/main.ts")
  };

  const vuePages: PageOptions[] = [
    {
      filename: "index.html",
      template: resolve("src/index.html")
    }
  ];

  return {
    entries: vueEntry,
    htmlOptions: vuePages
  };
}
