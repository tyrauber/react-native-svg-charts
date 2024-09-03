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

// src/x-axis.tsx
var x_axis_exports = {};
__export(x_axis_exports, {
  default: () => x_axis_default
});
module.exports = __toCommonJS(x_axis_exports);
var import_react = __toESM(require("react"));
var import_react_native = require("react-native");
var d3Scale = __toESM(require("d3-scale"));
var array = __toESM(require("d3-array"));
var import_react_native_svg = __toESM(require("react-native-svg"));
var XAxis = class extends import_react.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      width: 0,
      height: 0
    };
    this._onLayout = (event) => {
      const {
        nativeEvent: {
          layout: { width, height }
        }
      } = event;
      if (width !== this.state.width) {
        this.setState({ width, height });
      }
    };
  }
  _getX(domain) {
    const {
      scale = d3Scale.scaleLinear,
      spacingInner = 0.05,
      spacingOuter = 0.05,
      contentInset: { left = 0, right = 0 } = {}
    } = this.props;
    const { width } = this.state;
    const x = scale().domain(domain).range([left, width - right]);
    if (scale === d3Scale.scaleBand) {
      x.paddingInner([spacingInner]).paddingOuter([spacingOuter]);
      return (value) => x(value) + x.bandwidth() / 2;
    }
    return x;
  }
  render() {
    const {
      style,
      scale = d3Scale.scaleLinear,
      data,
      xAccessor = ({ index }) => index,
      formatLabel = (value) => value,
      numberOfTicks,
      svg = {},
      children,
      min,
      max
    } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style });
    }
    const values = data.map((item, index) => xAccessor({ item, index }));
    const extent2 = array.extent(values);
    const domain = scale === d3Scale.scaleBand ? values : [min || extent2[0], max || extent2[1]];
    const x = this._getX(domain);
    const ticks = numberOfTicks ? x.ticks(numberOfTicks) : values;
    const extraProps = {
      x,
      ticks,
      width,
      height,
      formatLabel
    };
    return /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style }, /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style: { flexGrow: 1 }, onLayout: this._onLayout }, /* @__PURE__ */ import_react.default.createElement(
      import_react_native.Text,
      {
        style: {
          opacity: 0,
          fontSize: svg.fontSize,
          fontFamily: svg.fontFamily,
          fontWeight: svg.fontWeight
        }
      },
      formatLabel(ticks[0], 0)
    ), height > 0 && width > 0 && /* @__PURE__ */ import_react.default.createElement(
      import_react_native_svg.default,
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          height,
          width
        }
      },
      /* @__PURE__ */ import_react.default.createElement(import_react_native_svg.G, null, import_react.default.Children.map(children, (child) => {
        if (import_react.default.isValidElement(child)) {
          return import_react.default.cloneElement(child, extraProps);
        }
        return null;
      }), width > 0 && ticks.map((value, index) => {
        const { svg: valueSvg = {} } = data[index] || {};
        return /* @__PURE__ */ import_react.default.createElement(
          import_react_native_svg.Text,
          {
            textAnchor: "middle",
            originX: x(value),
            alignmentBaseline: "hanging",
            ...svg,
            ...valueSvg,
            key: index,
            x: x(value)
          },
          formatLabel(value, index)
        );
      }))
    )));
  }
};
var x_axis_default = XAxis;
