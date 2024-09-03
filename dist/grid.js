"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/grid.tsx
var grid_exports = {};
__export(grid_exports, {
  default: () => grid_default
});
module.exports = __toCommonJS(grid_exports);
var import_react = __toESM(require("react"));
var import_react_native_svg = require("react-native-svg");
var Horizontal = ({ ticks = [], y = (v) => v, svg = {} }) => {
  return /* @__PURE__ */ import_react.default.createElement(import_react_native_svg.G, null, ticks.map((tick) => /* @__PURE__ */ import_react.default.createElement(
    import_react_native_svg.Line,
    {
      key: tick,
      x1: "0%",
      x2: "100%",
      y1: y(tick),
      y2: y(tick),
      strokeWidth: 1,
      stroke: "rgba(0,0,0,0.2)",
      ...svg
    }
  )));
};
var Vertical = ({ ticks = [], x = (v) => v, svg = {} }) => {
  return /* @__PURE__ */ import_react.default.createElement(import_react_native_svg.G, null, ticks.map((tick, index) => /* @__PURE__ */ import_react.default.createElement(
    import_react_native_svg.Line,
    {
      key: index,
      y1: "0%",
      y2: "100%",
      x1: x(tick),
      x2: x(tick),
      strokeWidth: 1,
      stroke: "rgba(0,0,0,0.2)",
      ...svg
    }
  )));
};
var Both = (props) => {
  return /* @__PURE__ */ import_react.default.createElement(import_react_native_svg.G, null, /* @__PURE__ */ import_react.default.createElement(Horizontal, { ...props }), /* @__PURE__ */ import_react.default.createElement(Vertical, { ...props }));
};
var Direction = {
  VERTICAL: "VERTICAL",
  HORIZONTAL: "HORIZONTAL",
  BOTH: "BOTH"
};
var Grid = ({ direction = Direction.HORIZONTAL, ...props }) => {
  switch (direction) {
    case Direction.VERTICAL:
      return /* @__PURE__ */ import_react.default.createElement(Vertical, { ...props });
    case Direction.HORIZONTAL:
      return /* @__PURE__ */ import_react.default.createElement(Horizontal, { ...props });
    case Direction.BOTH:
      return /* @__PURE__ */ import_react.default.createElement(Both, { ...props });
    default:
      return null;
  }
};
Grid.Direction = Direction;
var grid_default = Grid;
