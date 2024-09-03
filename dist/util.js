"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/util.tsx
var util_exports = {};
__export(util_exports, {
  Constants: () => Constants,
  default: () => util_default
});
module.exports = __toCommonJS(util_exports);
var util = {
  sortDescending(_array) {
    const array = [..._array];
    return array.sort((a, b) => {
      if (a > b) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
      return 0;
    });
  }
};
var Constants = {
  gridStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  commonProps: {
    svg: {},
    shadowSvg: {},
    shadowWidth: 0,
    shadowOffset: 0,
    style: {},
    animate: false,
    animationDuration: 0,
    curve: () => {
    },
    contentInset: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    numberOfTicks: 0,
    renderGradient: () => {
    },
    gridMin: 0,
    gridMax: 0,
    showGrid: false,
    gridProps: {}
  },
  commonDefaultProps: {
    strokeColor: "#22B6B0",
    strokeWidth: 2,
    contentInset: {},
    numberOfTicks: 10,
    showGrid: true,
    gridMin: 0,
    gridMax: 0,
    gridStroke: "rgba(0,0,0,0.2)",
    gridWidth: 0.5
  }
};
var util_default = util;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Constants
});
