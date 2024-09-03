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

// src/stacked-bar-chart/stacked-bar-chart.tsx
var stacked_bar_chart_exports = {};
__export(stacked_bar_chart_exports, {
  default: () => stacked_bar_chart_default
});
module.exports = __toCommonJS(stacked_bar_chart_exports);
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

// src/stacked-bar-chart/stacked-bar-chart.tsx
var StackedBarChart = class extends import_react2.PureComponent {
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
      spacingOuter = 0.05
    } = this.props;
    const { width } = this.state;
    if (horizontal) {
      return scale.scaleLinear().domain(domain).range([left, width - right]);
    }
    return scale.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
  }
  calcYScale(domain) {
    const {
      horizontal,
      contentInset: { top = 0, bottom = 0 },
      spacingInner,
      spacingOuter
    } = this.props;
    const { height } = this.state;
    if (horizontal) {
      return scale.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale.scaleLinear().domain(domain).range([height - bottom, top]);
  }
  calcAreas(x, y, series) {
    const { horizontal, colors, keys } = this.props;
    if (horizontal) {
      return array.merge(
        series.map((serie, keyIndex) => {
          return serie.map((entry, entryIndex) => {
            const path = shape.area().x0((d) => x(d[0])).x1((d) => x(d[1])).y(
              (d, _index) => _index === 0 ? y(entryIndex) : y(entryIndex) + y.bandwidth()
            ).defined((d) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry]);
            return {
              path,
              color: colors[keyIndex],
              key: keys[keyIndex]
            };
          });
        })
      );
    }
    return array.merge(
      series.map((serie, keyIndex) => {
        return serie.map((entry, entryIndex) => {
          const path = shape.area().y0((d) => y(d[0])).y1((d) => y(d[1])).x((d, _index) => _index === 0 ? x(entryIndex) : x(entryIndex) + x.bandwidth()).defined((d) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry]);
          return {
            path,
            color: colors[keyIndex],
            key: keys[keyIndex]
          };
        });
      })
    );
  }
  calcExtent(values) {
    const { gridMin, gridMax } = this.props;
    return array.extent([...values, gridMin, gridMax]);
  }
  calcIndexes() {
    const { data } = this.props;
    return data.map((_, index) => index);
  }
  getSeries() {
    const { data, keys, offset, order, valueAccessor } = this.props;
    return shape.stack().keys(keys).value((item, key) => valueAccessor({ item, key })).order(order).offset(offset)(data);
  }
  render() {
    const { data, animate, animationDuration, style, numberOfTicks, children, horizontal } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style });
    }
    const series = this.getSeries();
    const values = array.merge(array.merge(series));
    const indexes = this.calcIndexes();
    const extent2 = this.calcExtent(values);
    const ticks2 = array.ticks(extent2[0], extent2[1], numberOfTicks);
    const xDomain = horizontal ? extent2 : indexes;
    const yDomain = horizontal ? indexes : extent2;
    const x = this.calcXScale(xDomain);
    const y = this.calcYScale(yDomain);
    const bandwidth = horizontal ? y.bandwidth() : x.bandwidth();
    const areas = this.calcAreas(x, y, series);
    const extraProps = {
      x,
      y,
      width,
      height,
      ticks: ticks2,
      data,
      bandwidth
    };
    return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style }, /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.default, { style: { height, width } }, import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }), areas.map((bar, index) => {
      const keyIndex = index % data.length;
      const key = `${keyIndex}-${bar.key}`;
      const { svg } = data[keyIndex][bar.key];
      return /* @__PURE__ */ import_react2.default.createElement(
        animated_path_default,
        {
          key,
          fill: bar.color,
          ...svg,
          d: bar.path,
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
var stacked_bar_chart_default = StackedBarChart;
