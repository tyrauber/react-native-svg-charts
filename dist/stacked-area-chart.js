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

// src/stacked-area-chart.tsx
var stacked_area_chart_exports = {};
__export(stacked_area_chart_exports, {
  default: () => stacked_area_chart_default
});
module.exports = __toCommonJS(stacked_area_chart_exports);
var import_react2 = __toESM(require("react"));
var import_react_native2 = require("react-native");
var import_react_native_svg2 = require("react-native-svg");
var array = __toESM(require("d3-array"));
var scale = __toESM(require("d3-scale"));
var shape = __toESM(require("d3-shape"));

// src/animated-path.tsx
var import_react = __toESM(require("react"));
var import_react_native = require("react-native");
var import_react_native_svg = require("react-native-svg");
var interpolate = __toESM(require("d3-interpolate-path"));
var AnimatedPath = class extends import_react.Component {
  constructor(props) {
    super(props);
    this._animate = (start) => {
      cancelAnimationFrame(this.animation);
      this.animation = requestAnimationFrame((timestamp) => {
        var _a, _b;
        if (!start) {
          this._clearInteraction();
          this.handle = import_react_native.InteractionManager.createInteractionHandle();
          start = timestamp;
        }
        const delta = (timestamp - start) / (this.props.animationDuration || 300);
        if (delta > 1) {
          (_a = this.component) == null ? void 0 : _a.setNativeProps({ d: this.newD });
          this._clearInteraction();
          return;
        }
        const d = this.interpolator(delta);
        (_b = this.component) == null ? void 0 : _b.setNativeProps({ d });
        this.setState(this.state, () => {
          this._animate(start);
        });
      });
    };
    this._clearInteraction = () => {
      if (this.handle) {
        import_react_native.InteractionManager.clearInteractionHandle(this.handle);
        this.handle = null;
      }
    };
    this.state = { d: props.d || "" };
    this.newD = "";
    this.interpolator = () => "";
    this.animation = 0;
    this.handle = null;
    this.component = null;
  }
  componentDidUpdate(prevProps) {
    const { d: newD, animate } = this.props;
    const { d: oldD } = prevProps;
    if (newD === oldD || !animate || newD === null || oldD === null) {
      return;
    }
    this.newD = newD;
    this.interpolator = interpolate.interpolatePath(oldD, newD);
    this._animate();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.animation);
    this._clearInteraction();
  }
  render() {
    const { animate, d, ...rest } = this.props;
    return /* @__PURE__ */ import_react.default.createElement(
      import_react_native_svg.Path,
      {
        ref: (ref) => this.component = ref,
        ...rest,
        d: animate ? this.state.d : d
      }
    );
  }
};
var animated_path_default = AnimatedPath;

// src/stacked-area-chart.tsx
var StackedAreaChart = class extends import_react2.PureComponent {
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
  render() {
    const {
      data,
      keys,
      colors,
      curve = shape.curveLinear,
      offset = shape.stackOffsetNone,
      order = shape.stackOrderNone,
      svgs = [],
      animate,
      animationDuration,
      style,
      numberOfTicks = 10,
      contentInset = {},
      gridMin,
      gridMax,
      children,
      xScale = scale.scaleLinear,
      xAccessor = ({ index }) => index,
      showGrid = true,
      clampY,
      clampX
    } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style });
    }
    const { top = 0, bottom = 0, left = 0, right = 0 } = contentInset;
    const series = shape.stack().keys(keys).order(order).offset(offset)(data);
    const yValues = array.merge(array.merge(series));
    const xValues = data.map((item, index) => xAccessor({ item, index }));
    const yExtent = array.extent([...yValues, gridMin, gridMax]);
    const xExtent = array.extent(xValues);
    const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props;
    const y = scale.scaleLinear().domain([yMin, yMax]).range([height - bottom, top]).clamp(clampY);
    const x = xScale().domain([xMin, xMax]).range([left, width - right]).clamp(clampX);
    const ticks = y.ticks(numberOfTicks);
    const areas = series.map((serie, index) => {
      const path = shape.area().x((d, index2) => x(xAccessor({ item: d.data, index: index2 }))).y0((d) => y(d[0])).y1((d) => y(d[1])).curve(curve)(data.map((_, index2) => serie[index2]));
      return {
        path,
        key: keys[index],
        color: colors[index]
      };
    });
    const extraProps = {
      x,
      y,
      width,
      height,
      ticks,
      areas
    };
    return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style }, /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.Svg, { style: { height, width } }, import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }), areas.map((area2, index) => /* @__PURE__ */ import_react2.default.createElement(
      animated_path_default,
      {
        key: area2.key,
        fill: area2.color,
        ...svgs[index],
        animate,
        animationDuration,
        d: area2.path
      }
    )), import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && !child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var stacked_area_chart_default = StackedAreaChart;
