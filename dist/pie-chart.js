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

// src/pie-chart.tsx
var pie_chart_exports = {};
__export(pie_chart_exports, {
  default: () => pie_chart_default
});
module.exports = __toCommonJS(pie_chart_exports);
var import_react = __toESM(require("react"));
var import_react_native = require("react-native");
var shape = __toESM(require("d3-shape"));
var import_react_native_svg = __toESM(require("react-native-svg"));
var PieChart = class extends import_react.PureComponent {
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
  _calculateRadius(arg, max, defaultVal) {
    if (typeof arg === "string") {
      return parseInt(arg) / 100 * max;
    } else if (arg) {
      return arg;
    } else {
      return defaultVal;
    }
  }
  render() {
    const {
      data,
      innerRadius = "50%",
      outerRadius = "100%",
      labelRadius,
      padAngle = 0.05,
      animate,
      animationDuration,
      style,
      sort = (a, b) => b.value - a.value,
      valueAccessor = ({ item }) => item.value,
      children,
      startAngle = 0,
      endAngle = Math.PI * 2
    } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style });
    }
    const maxRadius = Math.min(width, height) / 2;
    if (Math.min(...data.map((obj) => valueAccessor({ item: obj }))) < 0) {
      console.error("don't pass negative numbers to pie-chart, it makes no sense!");
    }
    const _outerRadius = this._calculateRadius(outerRadius, maxRadius, maxRadius);
    const _innerRadius = this._calculateRadius(innerRadius, maxRadius, 0);
    const _labelRadius = this._calculateRadius(labelRadius, maxRadius, _outerRadius);
    if (_innerRadius >= _outerRadius) {
      console.warn("innerRadius is equal to or greater than outerRadius");
    }
    const arcs = data.map((item) => {
      const arc2 = shape.arc().outerRadius(_outerRadius).innerRadius(_innerRadius).padAngle(padAngle);
      if (item.arc) {
        Object.entries(item.arc).forEach(([key, value]) => {
          if (typeof arc2[key] === "function") {
            if (typeof value === "string") {
              arc2[key](parseInt(value) / 100 * _outerRadius);
            } else {
              arc2[key](value);
            }
          }
        });
      }
      return arc2;
    });
    const labelArcs = data.map((item, index) => {
      if (labelRadius) {
        return shape.arc().outerRadius(_labelRadius).innerRadius(_labelRadius).padAngle(padAngle);
      }
      return arcs[index];
    });
    const pieSlices = shape.pie().value((d) => valueAccessor({ item: d })).sort(sort).startAngle(startAngle).endAngle(endAngle)(data);
    const slices = pieSlices.map((slice, index) => ({
      ...slice,
      pieCentroid: arcs[index].centroid(slice),
      labelCentroid: labelArcs[index].centroid(slice)
    }));
    const extraProps = {
      width,
      height,
      data,
      slices
    };
    return /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { pointerEvents: "box-none", style }, /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { pointerEvents: "box-none", style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react.default.createElement(
      import_react_native_svg.default,
      {
        pointerEvents: import_react_native.Platform.OS === "android" ? "box-none" : void 0,
        style: { height, width }
      },
      /* @__PURE__ */ import_react.default.createElement(import_react_native_svg.G, { x: width / 2, y: height / 2 }, import_react.default.Children.map(children, (child) => {
        if (import_react.default.isValidElement(child) && child.props.belowChart) {
          return import_react.default.cloneElement(child, extraProps);
        }
        return null;
      }), pieSlices.map((slice, index) => {
        const { key, onPress, svg } = data[index];
        return /* @__PURE__ */ import_react.default.createElement(
          import_react_native_svg.Path,
          {
            key,
            onPress,
            ...svg,
            d: arcs[index](slice),
            animate,
            animationDuration
          }
        );
      }), import_react.default.Children.map(children, (child) => {
        if (import_react.default.isValidElement(child) && !child.props.belowChart) {
          return import_react.default.cloneElement(child, extraProps);
        }
        return null;
      }))
    )));
  }
};
var pie_chart_default = PieChart;
