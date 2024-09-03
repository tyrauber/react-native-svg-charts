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

// src/line-chart/line-chart-grouped.tsx
var line_chart_grouped_exports = {};
__export(line_chart_grouped_exports, {
  default: () => line_chart_grouped_default
});
module.exports = __toCommonJS(line_chart_grouped_exports);
var shape = __toESM(require("d3-shape"));

// src/chart/chart-grouped.tsx
var array = __toESM(require("d3-array"));
var import_react2 = __toESM(require("react"));
var import_react_native2 = require("react-native");
var import_react_native_svg2 = __toESM(require("react-native-svg"));

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

// src/chart/chart-grouped.tsx
var ChartGrouped = class extends import_react2.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      width: 0,
      height: 0
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
  createPaths() {
    throw new Error('Extending "ChartGrouped" requires you to override "createPaths"');
  }
  render() {
    const {
      data,
      xAccessor,
      yAccessor,
      yScale,
      xScale,
      style,
      animate,
      animationDuration,
      numberOfTicks,
      contentInset: { top = 0, bottom = 0, left = 0, right = 0 },
      gridMax,
      gridMin,
      clampX,
      clampY,
      svg,
      children
    } = this.props;
    const { width, height } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style });
    }
    const mappedData = data.map(
      (dataArray) => dataArray.data.map((item, index) => ({
        y: yAccessor({ item, index }),
        x: xAccessor({ item, index })
      }))
    );
    const yValues = array.merge(mappedData).map((item) => item.y);
    const xValues = array.merge(mappedData).map((item) => item.x);
    const yExtent = array.extent([...yValues, gridMin, gridMax]);
    const xExtent = array.extent([...xValues]);
    const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props;
    const y = yScale().domain([yMin, yMax]).range([height - bottom, top]).clamp(clampY);
    const x = xScale().domain([xMin, xMax]).range([left, width - right]).clamp(clampX);
    const paths = this.createPaths({
      data: mappedData,
      x,
      y
    });
    const ticks = y.ticks(numberOfTicks);
    const extraProps = {
      x,
      y,
      data,
      ticks,
      width,
      height,
      ...paths
    };
    return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style }, /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.default, { style: { height, width } }, import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }), paths.path.map((path, index) => {
      const { svg: pathSvg } = data[index];
      const key = `${path}-${index}`;
      return /* @__PURE__ */ import_react2.default.createElement(
        animated_path_default,
        {
          key,
          fill: "none",
          ...svg,
          ...pathSvg,
          d: path,
          animate,
          animationDuration
        }
      );
    }), import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && !child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var chart_grouped_default = ChartGrouped;

// src/line-chart/line-chart-grouped.tsx
var LineChartGrouped = class extends chart_grouped_default {
  createPaths({ data, x, y }) {
    const { curve = shape.curveLinear } = this.props;
    const lines = data.map(
      (line2) => shape.line().x((d) => x(d.x)).y((d) => y(d.y)).defined((item) => typeof item.y === "number").curve(curve)(line2)
    );
    return {
      path: lines,
      lines
    };
  }
};
var line_chart_grouped_default = LineChartGrouped;
