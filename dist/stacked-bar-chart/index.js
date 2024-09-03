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

// src/stacked-bar-chart/index.tsx
var stacked_bar_chart_exports = {};
__export(stacked_bar_chart_exports, {
  default: () => stacked_bar_chart_default2
});
module.exports = __toCommonJS(stacked_bar_chart_exports);
var import_react4 = __toESM(require("react"));

// src/stacked-bar-chart/stacked-bar-chart.tsx
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
    const extent3 = this.calcExtent(values);
    const ticks3 = array.ticks(extent3[0], extent3[1], numberOfTicks);
    const xDomain = horizontal ? extent3 : indexes;
    const yDomain = horizontal ? indexes : extent3;
    const x = this.calcXScale(xDomain);
    const y = this.calcYScale(yDomain);
    const bandwidth = horizontal ? y.bandwidth() : x.bandwidth();
    const areas = this.calcAreas(x, y, series);
    const extraProps = {
      x,
      y,
      width,
      height,
      ticks: ticks3,
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

// src/stacked-bar-chart/stacked-bar-grouped.tsx
var import_react3 = __toESM(require("react"));
var import_react_native3 = require("react-native");
var import_react_native_svg3 = __toESM(require("react-native-svg"));
var array2 = __toESM(require("d3-array"));
var scale2 = __toESM(require("d3-scale"));
var shape2 = __toESM(require("d3-shape"));
var StackedBarGrouped = class extends import_react3.PureComponent {
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
    this.coordinatesToPathCommands = (x0, y0, x1, y1, borderRadius, showTopBorder, showBottomBorder) => {
      const commands = [];
      commands.push({ marker: "M", values: [x0, y0] });
      if (showTopBorder) {
        const topLeft1 = [x0 + borderRadius, y0];
        const topLeft2 = [x0, y0 + borderRadius];
        commands.push({ marker: "L", values: topLeft1 });
        commands.push({
          marker: "C",
          values: [...topLeft1, x0, y0, ...topLeft2]
        });
        commands.push({ marker: "L", values: topLeft2 });
      } else {
        commands.push({ marker: "L", values: [x0, y0] });
      }
      if (showBottomBorder) {
        const bottomLeft1 = [x0, y1 - borderRadius];
        const bottomLeft2 = [x0 + borderRadius, y1];
        commands.push({ marker: "L", values: bottomLeft1 });
        commands.push({
          marker: "C",
          values: [...bottomLeft1, x0, y1, ...bottomLeft2]
        });
        commands.push({ marker: "L", values: bottomLeft2 });
        const bottomRight1 = [x1 - borderRadius, y1];
        const bottomRight2 = [x1, y1 - borderRadius];
        commands.push({ marker: "L", values: bottomRight1 });
        commands.push({
          marker: "C",
          values: [...bottomRight1, x1, y1, ...bottomRight2]
        });
        commands.push({ marker: "L", values: bottomRight2 });
      } else {
        commands.push({ marker: "L", values: [x0, y1] });
        commands.push({ marker: "L", values: [x1, y1] });
      }
      if (showTopBorder) {
        const topRight1 = [x1, y0 + borderRadius];
        const topRight2 = [x1 - borderRadius, y0];
        commands.push({ marker: "L", values: topRight1 });
        commands.push({
          marker: "C",
          values: [...topRight1, x1, y0, ...topRight2]
        });
        commands.push({ marker: "L", values: topRight2 });
      } else {
        commands.push({ marker: "L", values: [x1, y0] });
      }
      commands.push({ marker: "Z", values: [] });
      return commands;
    };
    this.commandsToSvgPath = (commands) => commands.map((command) => `${command.marker} ${command.values.join(",")}`).join(" ").trim();
  }
  calcXScale(domain) {
    const {
      horizontal,
      contentInset: { left = 0, right = 0 } = {},
      spacingInner = 0.05,
      spacingOuter = 0.05
    } = this.props;
    const { width } = this.state;
    if (horizontal) {
      return scale2.scaleLinear().domain(domain).range([left, width - right]);
    }
    return scale2.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
  }
  calcYScale(domain) {
    const {
      horizontal,
      contentInset: { top = 0, bottom = 0 } = {},
      spacingInner = 0.05,
      spacingOuter = 0.05
    } = this.props;
    const { height } = this.state;
    if (horizontal) {
      return scale2.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale2.scaleLinear().domain(domain).range([height - bottom, top]);
  }
  calcAreas(x, y, series) {
    const { horizontal, colors, keys, data, borderRadius: initialBorderRadius = 0, innerBarSpace = 0 } = this.props;
    let areas;
    let barWidth;
    if (horizontal) {
      barWidth = y.bandwidth() / data.length;
      areas = series.map((stack3, stackIndex) => {
        return stack3.map((serie, keyIndex) => {
          return serie.map((entry, entryIndex) => {
            const leftMargin = series.length > 1 ? innerBarSpace / 2 : 0;
            const path = shape2.area().x0((d) => x(d[0])).x1((d) => x(d[1])).y(
              (d, _index) => (_index === 0 ? y(entryIndex) + barWidth * stackIndex + leftMargin : y(entryIndex) + barWidth + barWidth * stackIndex) - leftMargin
            ).defined((d) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry]);
            return {
              path,
              color: colors[stackIndex][keyIndex],
              key: keys[stackIndex][keyIndex]
            };
          });
        });
      });
    } else {
      barWidth = x.bandwidth() / data.length;
      areas = series.map((stack3, stackIndex) => {
        return stack3.map((serie, keyIndex) => {
          return serie.map((entry, entryIndex) => {
            const leftMargin = series.length > 1 ? innerBarSpace / 2 : 0;
            const x0 = x(entryIndex) + barWidth * stackIndex + leftMargin;
            const x1 = x(entryIndex) + barWidth + barWidth * stackIndex - leftMargin;
            const y0 = y(entry[1]);
            const y1 = y(entry[0]);
            const barHeight = y1 - y0;
            const borderRadius = initialBorderRadius * 2 > barHeight ? barHeight / 2 : initialBorderRadius;
            const showTopBorder = keyIndex === stack3.length - 1;
            const showBottomBorder = keyIndex === 0;
            const commands = this.coordinatesToPathCommands(
              x0,
              y0,
              x1,
              y1,
              borderRadius,
              showTopBorder,
              showBottomBorder
            );
            return {
              path: this.commandsToSvgPath(commands),
              color: colors[stackIndex][keyIndex],
              key: keys[stackIndex][keyIndex]
            };
          });
        });
      });
    }
    return array2.merge(areas);
  }
  calcExtent(values) {
    const { gridMax, gridMin } = this.props;
    const mergedValues = array2.merge(values);
    return array2.extent([...mergedValues, gridMin, gridMax]);
  }
  calcIndexes() {
    const { data } = this.props;
    return data[0].data.map((_, index) => index);
  }
  getSeries() {
    const {
      data,
      keys,
      offset = shape2.stackOffsetNone,
      order = shape2.stackOrderNone,
      valueAccessor = ({ item, key }) => item[key]
    } = this.props;
    return data.map(
      (obj, index) => shape2.stack().keys(keys[index]).value((item, key) => valueAccessor({ item, key })).order(order).offset(offset)(obj.data)
    );
  }
  render() {
    const { data, animate, animationDuration, style, numberOfTicks = 10, children, horizontal } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react3.default.createElement(import_react_native3.View, { style });
    }
    const series = this.getSeries();
    const values = array2.merge(array2.merge(series));
    const indexes = this.calcIndexes();
    const extent3 = this.calcExtent(values);
    const ticks3 = array2.ticks(extent3[0], extent3[1], numberOfTicks);
    const xDomain = horizontal ? extent3 : indexes;
    const yDomain = horizontal ? indexes : extent3;
    const x = this.calcXScale(xDomain);
    const y = this.calcYScale(yDomain);
    const bandwidth = horizontal ? y.bandwidth() : x.bandwidth();
    const stacks = this.calcAreas(x, y, series);
    const extraProps = {
      x,
      y,
      width,
      height,
      ticks: ticks3,
      data,
      bandwidth
    };
    return /* @__PURE__ */ import_react3.default.createElement(import_react_native3.View, { style }, /* @__PURE__ */ import_react3.default.createElement(import_react_native3.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react3.default.createElement(import_react_native_svg3.default, { style: { height, width } }, import_react3.default.Children.map(children, (child) => {
      if (import_react3.default.isValidElement(child) && child.props.belowChart) {
        return import_react3.default.cloneElement(child, extraProps);
      }
      return null;
    }), stacks.map((areas, indexStack) => {
      const areaIndex = indexStack % data.length;
      return areas.map((bar, indexArea) => {
        const keyIndex = indexArea % data[areaIndex].data.length;
        const key = `${areaIndex}-${keyIndex}-${bar.key}`;
        const { svg } = data[areaIndex].data[keyIndex][bar.key];
        return /* @__PURE__ */ import_react3.default.createElement(
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
      });
    }), import_react3.default.Children.map(children, (child) => {
      if (import_react3.default.isValidElement(child) && !child.props.belowChart) {
        return import_react3.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var stacked_bar_grouped_default = StackedBarGrouped;

// src/stacked-bar-chart/index.tsx
var StackedBarChartGate = (props) => {
  const { data } = props;
  if (data[0] && data[0].hasOwnProperty("data")) {
    return /* @__PURE__ */ import_react4.default.createElement(stacked_bar_grouped_default, { ...props });
  }
  return /* @__PURE__ */ import_react4.default.createElement(stacked_bar_chart_default, { ...props });
};
var stacked_bar_chart_default2 = StackedBarChartGate;
