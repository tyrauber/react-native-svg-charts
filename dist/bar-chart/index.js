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

// src/bar-chart/index.tsx
var bar_chart_exports = {};
__export(bar_chart_exports, {
  default: () => bar_chart_default2
});
module.exports = __toCommonJS(bar_chart_exports);
var import_react3 = __toESM(require("react"));

// src/bar-chart/bar-chart.tsx
var array = __toESM(require("d3-array"));
var scale = __toESM(require("d3-scale"));
var shape = __toESM(require("d3-shape"));
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

// src/bar-chart/bar-chart.tsx
var BarChart = class extends import_react2.PureComponent {
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
  calcXScale(domain) {
    const {
      horizontal,
      contentInset: { left = 0, right = 0 },
      spacingInner = 0.05,
      spacingOuter = 0.05,
      clamp = false
    } = this.props;
    const { width } = this.state;
    if (horizontal) {
      return scale.scaleLinear().domain(domain).range([left, width - right]).clamp(clamp);
    }
    return scale.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
  }
  calcYScale(domain) {
    const {
      horizontal,
      contentInset: { top = 0, bottom = 0 },
      spacingInner = 0.05,
      spacingOuter = 0.05,
      clamp = false
    } = this.props;
    const { height } = this.state;
    if (horizontal) {
      return scale.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale.scaleLinear().domain(domain).range([height - bottom, top]).clamp(clamp);
  }
  calcAreas(x, y) {
    const { horizontal, data, yAccessor = ({ item }) => item } = this.props;
    const values = data.map((item) => yAccessor({ item }));
    if (horizontal) {
      return data.map((bar, index) => ({
        bar,
        path: shape.area().y((value, _index) => _index === 0 ? y(index) : y(index) + y.bandwidth()).x0(x(0)).x1((value) => x(value)).defined((value) => typeof value === "number")([values[index], values[index]])
      }));
    }
    return data.map((bar, index) => ({
      bar,
      path: shape.area().y0(y(0)).y1((value) => y(value)).x((value, _index) => _index === 0 ? x(index) : x(index) + x.bandwidth()).defined((value) => typeof value === "number")([values[index], values[index]])
    }));
  }
  calcExtent() {
    const { data, gridMin, gridMax, yAccessor = ({ item }) => item } = this.props;
    const values = data.map((obj) => yAccessor({ item: obj }));
    const extent3 = array.extent([...values, gridMin, gridMax]);
    const { yMin = extent3[0], yMax = extent3[1] } = this.props;
    return [yMin, yMax];
  }
  calcIndexes() {
    const { data } = this.props;
    return data.map((_, index) => index);
  }
  render() {
    const {
      data,
      animate,
      animationDuration,
      style,
      numberOfTicks = 10,
      svg = {},
      horizontal,
      children,
      contentInset = {}
    } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style });
    }
    const extent3 = this.calcExtent();
    const indexes = this.calcIndexes();
    const ticks2 = array.ticks(extent3[0], extent3[1], numberOfTicks);
    const xDomain = horizontal ? extent3 : indexes;
    const yDomain = horizontal ? indexes : extent3;
    const x = this.calcXScale(xDomain);
    const y = this.calcYScale(yDomain);
    const bandwidth = horizontal ? y.bandwidth() : x.bandwidth();
    const areas = this.calcAreas(x, y).filter(
      (area3) => area3.bar !== null && area3.bar !== void 0 && area3.path !== null
    );
    const extraProps = {
      x,
      y,
      width,
      height,
      bandwidth,
      ticks: ticks2,
      data
    };
    return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style }, /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.default, { style: { height, width } }, import_react2.default.Children.map(children, (child) => {
      if (child && child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
    }), areas.map((area3, index) => {
      const {
        bar: { svg: barSvg = {} },
        path
      } = area3;
      return /* @__PURE__ */ import_react2.default.createElement(
        animated_path_default,
        {
          key: index,
          ...svg,
          ...barSvg,
          d: path,
          animate,
          animationDuration
        }
      );
    }), import_react2.default.Children.map(children, (child) => {
      if (child && !child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
    }))));
  }
};
var bar_chart_default = BarChart;

// src/bar-chart/bar-chart-grouped.tsx
var array2 = __toESM(require("d3-array"));
var scale2 = __toESM(require("d3-scale"));
var shape2 = __toESM(require("d3-shape"));
var BarChartGrouped = class extends bar_chart_default {
  calcXScale(domain) {
    const {
      horizontal,
      contentInset: { left = 0, right = 0 },
      spacingInner,
      spacingOuter,
      clamp = false
    } = this.props;
    const { width } = this.state;
    if (horizontal) {
      return scale2.scaleLinear().domain(domain).range([left, width - right]).clamp(clamp);
    }
    return scale2.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
  }
  calcYScale(domain) {
    const {
      horizontal,
      spacingInner,
      spacingOuter,
      contentInset: { top = 0, bottom = 0 },
      clamp = false
    } = this.props;
    const { height } = this.state;
    if (horizontal) {
      return scale2.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale2.scaleLinear().domain(domain).range([height - bottom, top]).clamp(clamp);
  }
  calcAreas(x, y) {
    const { horizontal, data, yAccessor } = this.props;
    const _data = data.map((obj) => {
      const { svg = {} } = obj;
      return {
        ...obj,
        data: obj.data.map((item) => {
          if (typeof item === "number") {
            return {
              value: item,
              svg
            };
          }
          return {
            ...item,
            svg: {
              ...svg,
              ...item.svg
            },
            value: yAccessor({ item })
          };
        })
      };
    });
    const areas = [];
    if (horizontal) {
      const barWidth = y.bandwidth() / data.length;
      _data.forEach((obj, collectionIndex) => {
        obj.data.forEach((item, valueIndex) => {
          areas.push({
            bar: item,
            path: shape2.area().y(
              (value, _index) => _index === 0 ? y(valueIndex) + barWidth * collectionIndex : y(valueIndex) + barWidth + barWidth * collectionIndex
            ).x0(x(0)).x1((value) => x(value)).defined((value) => typeof value === "number")([item.value, item.value])
          });
        });
      });
    } else {
      const barWidth = x.bandwidth() / data.length;
      _data.forEach((obj, collectionIndex) => {
        obj.data.forEach((item, valueIndex) => {
          areas.push({
            bar: item,
            path: shape2.area().x(
              (value, _index) => _index === 0 ? x(valueIndex) + barWidth * collectionIndex : x(valueIndex) + barWidth + barWidth * collectionIndex
            ).y0(y(0)).y1((value) => y(value)).defined((value) => typeof value === "number")([item.value, item.value])
          });
        });
      });
    }
    return areas;
  }
  calcExtent() {
    const { data, yAccessor, gridMin, gridMax } = this.props;
    const dataExtent = array2.merge(data.map((obj) => obj.data.map((item) => yAccessor({ item }))));
    const extent3 = array2.extent([...dataExtent, gridMin, gridMax]);
    const { yMin = extent3[0], yMax = extent3[1] } = this.props;
    return [yMin, yMax];
  }
  calcIndexes() {
    const { data } = this.props;
    return data[0].data.map((_, index) => index);
  }
};
var bar_chart_grouped_default = BarChartGrouped;

// src/bar-chart/index.tsx
var BarChartGate = ({ data, ...props }) => {
  if (data[0] && data[0].hasOwnProperty("data")) {
    return /* @__PURE__ */ import_react3.default.createElement(bar_chart_grouped_default, { data, ...props });
  }
  return /* @__PURE__ */ import_react3.default.createElement(bar_chart_default, { data, ...props });
};
var bar_chart_default2 = BarChartGate;
