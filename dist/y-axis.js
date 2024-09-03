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

// src/y-axis.tsx
var y_axis_exports = {};
__export(y_axis_exports, {
  default: () => y_axis_default
});
module.exports = __toCommonJS(y_axis_exports);
var import_react = __toESM(require("react"));
var import_react_native = require("react-native");
var import_react_native_svg = require("react-native-svg");
var d3Scale = __toESM(require("d3-scale"));
var array = __toESM(require("d3-array"));
var YAxis = class extends import_react.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      height: 0,
      width: 0
    };
    this._onLayout = (event) => {
      const {
        nativeEvent: {
          layout: { height, width }
        }
      } = event;
      this.setState({ height, width });
    };
  }
  getY(domain) {
    const {
      scale = d3Scale.scaleLinear,
      spacingInner = 0.05,
      spacingOuter = 0.05,
      contentInset: { top = 0, bottom = 0 } = {}
    } = this.props;
    const { height } = this.state;
    const y = scale().domain(domain).range([height - bottom, top]);
    if (scale === d3Scale.scaleBand) {
      y.range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
      return (value) => y(value) + y.bandwidth() / 2;
    }
    return y;
  }
  render() {
    const {
      style,
      data,
      scale = d3Scale.scaleLinear,
      yAccessor = ({ item }) => item,
      numberOfTicks = 10,
      formatLabel = (value) => value && value.toString(),
      svg = {},
      children
    } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style });
    }
    const values = data.map((item, index) => yAccessor({ item, index }));
    const extent2 = array.extent(values);
    const { min = extent2[0], max = extent2[1] } = this.props;
    const domain = scale === d3Scale.scaleBand ? values : [min, max];
    const y = this.getY(domain);
    const ticks = scale === d3Scale.scaleBand ? values : y.ticks(numberOfTicks);
    const longestValue = ticks.map((value, index) => formatLabel(value, index, ticks)).reduce((prev, curr) => prev.toString().length > curr.toString().length ? prev : curr, 0);
    const extraProps = {
      y,
      ticks,
      width,
      height,
      formatLabel
    };
    return /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style: [style] }, /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style: { flexGrow: 1 }, onLayout: this._onLayout }, /* @__PURE__ */ import_react.default.createElement(
      import_react_native.Text,
      {
        style: {
          opacity: 0,
          fontSize: svg.fontSize,
          fontFamily: svg.fontFamily,
          fontWeight: svg.fontWeight
        }
      },
      longestValue
    ), height > 0 && width > 0 && /* @__PURE__ */ import_react.default.createElement(
      import_react_native_svg.Svg,
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          height,
          width
        }
      },
      /* @__PURE__ */ import_react.default.createElement(
        import_react_native_svg.G,
        null,
        import_react.default.Children.map(children, (child) => {
          return import_react.default.cloneElement(child, extraProps);
        }),
        // don't render labels if width isn't measured yet,
        // causes rendering issues
        height > 0 && ticks.map((value, index) => {
          return /* @__PURE__ */ import_react.default.createElement(
            import_react_native_svg.Text,
            {
              originY: y(value),
              textAnchor: "middle",
              x: "50%",
              alignmentBaseline: "middle",
              ...svg,
              key: y(value),
              y: y(value)
            },
            formatLabel(value, index, ticks)
          );
        })
      )
    )));
  }
};
var y_axis_default = YAxis;
