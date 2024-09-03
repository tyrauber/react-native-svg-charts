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

// src/chart-decorators/index.tsx
var chart_decorators_exports = {};
__export(chart_decorators_exports, {
  HorizontalLine: () => horizontal_line_default,
  Point: () => point_default,
  Tooltip: () => tooltip_default
});
module.exports = __toCommonJS(chart_decorators_exports);

// src/chart-decorators/horizontal-line.tsx
var import_react = __toESM(require("react"));
var import_react_native_svg = require("react-native-svg");
var HorizontalLine = ({ y, value, stroke = "black", ...other }) => {
  return /* @__PURE__ */ import_react.default.createElement(import_react_native_svg.Line, { x1: "0%", x2: "100%", y1: y(value), y2: y(value), stroke, ...other });
};
var horizontal_line_default = HorizontalLine;

// src/chart-decorators/point.tsx
var import_react2 = __toESM(require("react"));
var import_react_native_svg2 = require("react-native-svg");
var Point = ({ x, y, value, index, radius = 4, color = "black" }) => {
  if (isNaN(value)) {
    return /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.Circle, null);
  }
  return /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.Circle, { cx: x(index), cy: y(value), r: radius, stroke: color, fill: "white" });
};
var point_default = Point;

// src/chart-decorators/tooltip.tsx
var import_react3 = __toESM(require("react"));
var import_react_native_svg3 = require("react-native-svg");
var Tooltip = ({ x, y, value, index, height, text, stroke, pointStroke }) => {
  return /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.G, null, /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.Line, { x1: x(index), y1: height, x2: x(index), y2: 20, stroke }), /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.Circle, { cx: x(index), cy: y(value), r: 4, stroke: pointStroke, strokeWidth: 2, fill: "white" }), /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.G, { x: x(index) < 40 ? 40 : x(index), y: 10 }, /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.Rect, { x: -40, y: 1, width: 80, height: 20, fill: "rgba(0, 0, 0, 0.2)", rx: 2, ry: 2 }), /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.Rect, { x: -40, y: 0, width: 80, height: 20, fill: "white", rx: 2, ry: 2 }), /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.Text, { fontSize: "12", textAnchor: "middle" }, text)));
};
var tooltip_default = Tooltip;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HorizontalLine,
  Point,
  Tooltip
});
