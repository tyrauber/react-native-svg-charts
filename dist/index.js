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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AreaChart: () => area_chart_default,
  BarChart: () => bar_chart_default2,
  Grid: () => grid_default,
  LineChart: () => line_chart_default2,
  Path: () => animated_path_default,
  PieChart: () => pie_chart_default,
  ProgressCircle: () => progress_circle_default,
  StackedAreaChart: () => stacked_area_chart_default,
  StackedBarChart: () => stacked_bar_chart_default2,
  XAxis: () => x_axis_default,
  YAxis: () => y_axis_default
});
module.exports = __toCommonJS(src_exports);

// src/area-chart.tsx
var import_react3 = __toESM(require("react"));
var shape2 = __toESM(require("d3-shape"));

// src/chart/index.tsx
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

// src/chart/index.tsx
var Chart = class extends import_react2.PureComponent {
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
    throw new Error('Extending "Chart" requires you to override "createPaths"');
  }
  render() {
    const {
      data,
      xAccessor = ({ index }) => index,
      yAccessor = ({ item }) => item,
      yScale = scale.scaleLinear,
      xScale = scale.scaleLinear,
      style,
      animate,
      animationDuration,
      svg = {},
      curve = shape.curveLinear,
      contentInset = {},
      numberOfTicks = 10,
      gridMax,
      gridMin,
      clampX,
      clampY,
      children
    } = this.props;
    const { width, height } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style });
    }
    const { top = 0, bottom = 0, left = 0, right = 0 } = contentInset;
    const mappedData = data.map((item, index) => ({
      y: yAccessor({ item, index }),
      x: xAccessor({ item, index })
    }));
    const yValues = mappedData.map((item) => item.y);
    const xValues = mappedData.map((item) => item.x);
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
    const ticks4 = y.ticks(numberOfTicks);
    const extraProps = {
      x,
      y,
      data,
      ticks: ticks4,
      width,
      height,
      ...paths
    };
    return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style }, /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.default, { style: { height, width } }, import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }), /* @__PURE__ */ import_react2.default.createElement(
      animated_path_default,
      {
        fill: "none",
        ...svg,
        d: paths.path,
        animate,
        animationDuration
      }
    ), import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && !child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var chart_default = Chart;

// src/area-chart.tsx
var AreaChart = ({ start = 0, ...props }) => {
  const createPaths = ({ data, x, y }) => {
    const { curve } = props;
    const area7 = shape2.area().x((d) => x(d.x)).y0(y(start)).y1((d) => y(d.y)).defined((item) => typeof item.y === "number").curve(curve)(data);
    const line4 = shape2.line().x((d) => x(d.x)).y((d) => y(d.y)).defined((item) => typeof item.y === "number").curve(curve)(data);
    return {
      path: area7,
      area: area7,
      line: line4
    };
  };
  return /* @__PURE__ */ import_react3.default.createElement(chart_default, { ...props, createPaths });
};
var area_chart_default = AreaChart;

// src/stacked-area-chart.tsx
var import_react4 = __toESM(require("react"));
var import_react_native3 = require("react-native");
var import_react_native_svg3 = require("react-native-svg");
var array2 = __toESM(require("d3-array"));
var scale2 = __toESM(require("d3-scale"));
var shape3 = __toESM(require("d3-shape"));
var StackedAreaChart = class extends import_react4.PureComponent {
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
      curve = shape3.curveLinear,
      offset = shape3.stackOffsetNone,
      order = shape3.stackOrderNone,
      svgs = [],
      animate,
      animationDuration,
      style,
      numberOfTicks = 10,
      contentInset = {},
      gridMin,
      gridMax,
      children,
      xScale = scale2.scaleLinear,
      xAccessor = ({ index }) => index,
      showGrid = true,
      clampY,
      clampX
    } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react4.default.createElement(import_react_native3.View, { style });
    }
    const { top = 0, bottom = 0, left = 0, right = 0 } = contentInset;
    const series = shape3.stack().keys(keys).order(order).offset(offset)(data);
    const yValues = array2.merge(array2.merge(series));
    const xValues = data.map((item, index) => xAccessor({ item, index }));
    const yExtent = array2.extent([...yValues, gridMin, gridMax]);
    const xExtent = array2.extent(xValues);
    const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props;
    const y = scale2.scaleLinear().domain([yMin, yMax]).range([height - bottom, top]).clamp(clampY);
    const x = xScale().domain([xMin, xMax]).range([left, width - right]).clamp(clampX);
    const ticks4 = y.ticks(numberOfTicks);
    const areas = series.map((serie, index) => {
      const path = shape3.area().x((d, index2) => x(xAccessor({ item: d.data, index: index2 }))).y0((d) => y(d[0])).y1((d) => y(d[1])).curve(curve)(data.map((_, index2) => serie[index2]));
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
      ticks: ticks4,
      areas
    };
    return /* @__PURE__ */ import_react4.default.createElement(import_react_native3.View, { style }, /* @__PURE__ */ import_react4.default.createElement(import_react_native3.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react4.default.createElement(import_react_native_svg3.Svg, { style: { height, width } }, import_react4.default.Children.map(children, (child) => {
      if (import_react4.default.isValidElement(child) && child.props.belowChart) {
        return import_react4.default.cloneElement(child, extraProps);
      }
      return null;
    }), areas.map((area7, index) => /* @__PURE__ */ import_react4.default.createElement(
      animated_path_default,
      {
        key: area7.key,
        fill: area7.color,
        ...svgs[index],
        animate,
        animationDuration,
        d: area7.path
      }
    )), import_react4.default.Children.map(children, (child) => {
      if (import_react4.default.isValidElement(child) && !child.props.belowChart) {
        return import_react4.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var stacked_area_chart_default = StackedAreaChart;

// src/bar-chart/index.tsx
var import_react6 = __toESM(require("react"));

// src/bar-chart/bar-chart.tsx
var array3 = __toESM(require("d3-array"));
var scale3 = __toESM(require("d3-scale"));
var shape4 = __toESM(require("d3-shape"));
var import_react5 = __toESM(require("react"));
var import_react_native4 = require("react-native");
var import_react_native_svg4 = __toESM(require("react-native-svg"));
var BarChart = class extends import_react5.PureComponent {
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
      return scale3.scaleLinear().domain(domain).range([left, width - right]).clamp(clamp);
    }
    return scale3.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
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
      return scale3.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale3.scaleLinear().domain(domain).range([height - bottom, top]).clamp(clamp);
  }
  calcAreas(x, y) {
    const { horizontal, data, yAccessor = ({ item }) => item } = this.props;
    const values = data.map((item) => yAccessor({ item }));
    if (horizontal) {
      return data.map((bar, index) => ({
        bar,
        path: shape4.area().y((value, _index) => _index === 0 ? y(index) : y(index) + y.bandwidth()).x0(x(0)).x1((value) => x(value)).defined((value) => typeof value === "number")([values[index], values[index]])
      }));
    }
    return data.map((bar, index) => ({
      bar,
      path: shape4.area().y0(y(0)).y1((value) => y(value)).x((value, _index) => _index === 0 ? x(index) : x(index) + x.bandwidth()).defined((value) => typeof value === "number")([values[index], values[index]])
    }));
  }
  calcExtent() {
    const { data, gridMin, gridMax, yAccessor = ({ item }) => item } = this.props;
    const values = data.map((obj) => yAccessor({ item: obj }));
    const extent10 = array3.extent([...values, gridMin, gridMax]);
    const { yMin = extent10[0], yMax = extent10[1] } = this.props;
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
      return /* @__PURE__ */ import_react5.default.createElement(import_react_native4.View, { style });
    }
    const extent10 = this.calcExtent();
    const indexes = this.calcIndexes();
    const ticks4 = array3.ticks(extent10[0], extent10[1], numberOfTicks);
    const xDomain = horizontal ? extent10 : indexes;
    const yDomain = horizontal ? indexes : extent10;
    const x = this.calcXScale(xDomain);
    const y = this.calcYScale(yDomain);
    const bandwidth = horizontal ? y.bandwidth() : x.bandwidth();
    const areas = this.calcAreas(x, y).filter(
      (area7) => area7.bar !== null && area7.bar !== void 0 && area7.path !== null
    );
    const extraProps = {
      x,
      y,
      width,
      height,
      bandwidth,
      ticks: ticks4,
      data
    };
    return /* @__PURE__ */ import_react5.default.createElement(import_react_native4.View, { style }, /* @__PURE__ */ import_react5.default.createElement(import_react_native4.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react5.default.createElement(import_react_native_svg4.default, { style: { height, width } }, import_react5.default.Children.map(children, (child) => {
      if (child && child.props.belowChart) {
        return import_react5.default.cloneElement(child, extraProps);
      }
    }), areas.map((area7, index) => {
      const {
        bar: { svg: barSvg = {} },
        path
      } = area7;
      return /* @__PURE__ */ import_react5.default.createElement(
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
    }), import_react5.default.Children.map(children, (child) => {
      if (child && !child.props.belowChart) {
        return import_react5.default.cloneElement(child, extraProps);
      }
    }))));
  }
};
var bar_chart_default = BarChart;

// src/bar-chart/bar-chart-grouped.tsx
var array4 = __toESM(require("d3-array"));
var scale4 = __toESM(require("d3-scale"));
var shape5 = __toESM(require("d3-shape"));
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
      return scale4.scaleLinear().domain(domain).range([left, width - right]).clamp(clamp);
    }
    return scale4.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
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
      return scale4.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale4.scaleLinear().domain(domain).range([height - bottom, top]).clamp(clamp);
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
            path: shape5.area().y(
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
            path: shape5.area().x(
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
    const dataExtent = array4.merge(data.map((obj) => obj.data.map((item) => yAccessor({ item }))));
    const extent10 = array4.extent([...dataExtent, gridMin, gridMax]);
    const { yMin = extent10[0], yMax = extent10[1] } = this.props;
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
    return /* @__PURE__ */ import_react6.default.createElement(bar_chart_grouped_default, { data, ...props });
  }
  return /* @__PURE__ */ import_react6.default.createElement(bar_chart_default, { data, ...props });
};
var bar_chart_default2 = BarChartGate;

// src/stacked-bar-chart/index.tsx
var import_react9 = __toESM(require("react"));

// src/stacked-bar-chart/stacked-bar-chart.tsx
var array5 = __toESM(require("d3-array"));
var scale5 = __toESM(require("d3-scale"));
var shape6 = __toESM(require("d3-shape"));
var import_react7 = __toESM(require("react"));
var import_react_native5 = require("react-native");
var import_react_native_svg5 = __toESM(require("react-native-svg"));
var StackedBarChart = class extends import_react7.PureComponent {
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
      return scale5.scaleLinear().domain(domain).range([left, width - right]);
    }
    return scale5.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
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
      return scale5.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale5.scaleLinear().domain(domain).range([height - bottom, top]);
  }
  calcAreas(x, y, series) {
    const { horizontal, colors, keys } = this.props;
    if (horizontal) {
      return array5.merge(
        series.map((serie, keyIndex) => {
          return serie.map((entry, entryIndex) => {
            const path = shape6.area().x0((d) => x(d[0])).x1((d) => x(d[1])).y(
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
    return array5.merge(
      series.map((serie, keyIndex) => {
        return serie.map((entry, entryIndex) => {
          const path = shape6.area().y0((d) => y(d[0])).y1((d) => y(d[1])).x((d, _index) => _index === 0 ? x(entryIndex) : x(entryIndex) + x.bandwidth()).defined((d) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry]);
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
    return array5.extent([...values, gridMin, gridMax]);
  }
  calcIndexes() {
    const { data } = this.props;
    return data.map((_, index) => index);
  }
  getSeries() {
    const { data, keys, offset, order, valueAccessor } = this.props;
    return shape6.stack().keys(keys).value((item, key) => valueAccessor({ item, key })).order(order).offset(offset)(data);
  }
  render() {
    const { data, animate, animationDuration, style, numberOfTicks, children, horizontal } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react7.default.createElement(import_react_native5.View, { style });
    }
    const series = this.getSeries();
    const values = array5.merge(array5.merge(series));
    const indexes = this.calcIndexes();
    const extent10 = this.calcExtent(values);
    const ticks4 = array5.ticks(extent10[0], extent10[1], numberOfTicks);
    const xDomain = horizontal ? extent10 : indexes;
    const yDomain = horizontal ? indexes : extent10;
    const x = this.calcXScale(xDomain);
    const y = this.calcYScale(yDomain);
    const bandwidth = horizontal ? y.bandwidth() : x.bandwidth();
    const areas = this.calcAreas(x, y, series);
    const extraProps = {
      x,
      y,
      width,
      height,
      ticks: ticks4,
      data,
      bandwidth
    };
    return /* @__PURE__ */ import_react7.default.createElement(import_react_native5.View, { style }, /* @__PURE__ */ import_react7.default.createElement(import_react_native5.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react7.default.createElement(import_react_native_svg5.default, { style: { height, width } }, import_react7.default.Children.map(children, (child) => {
      if (import_react7.default.isValidElement(child) && child.props.belowChart) {
        return import_react7.default.cloneElement(child, extraProps);
      }
      return null;
    }), areas.map((bar, index) => {
      const keyIndex = index % data.length;
      const key = `${keyIndex}-${bar.key}`;
      const { svg } = data[keyIndex][bar.key];
      return /* @__PURE__ */ import_react7.default.createElement(
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
    }), import_react7.default.Children.map(children, (child) => {
      if (import_react7.default.isValidElement(child) && !child.props.belowChart) {
        return import_react7.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var stacked_bar_chart_default = StackedBarChart;

// src/stacked-bar-chart/stacked-bar-grouped.tsx
var import_react8 = __toESM(require("react"));
var import_react_native6 = require("react-native");
var import_react_native_svg6 = __toESM(require("react-native-svg"));
var array6 = __toESM(require("d3-array"));
var scale6 = __toESM(require("d3-scale"));
var shape7 = __toESM(require("d3-shape"));
var StackedBarGrouped = class extends import_react8.PureComponent {
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
      return scale6.scaleLinear().domain(domain).range([left, width - right]);
    }
    return scale6.scaleBand().domain(domain).range([left, width - right]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
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
      return scale6.scaleBand().domain(domain).range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
    }
    return scale6.scaleLinear().domain(domain).range([height - bottom, top]);
  }
  calcAreas(x, y, series) {
    const { horizontal, colors, keys, data, borderRadius: initialBorderRadius = 0, innerBarSpace = 0 } = this.props;
    let areas;
    let barWidth;
    if (horizontal) {
      barWidth = y.bandwidth() / data.length;
      areas = series.map((stack4, stackIndex) => {
        return stack4.map((serie, keyIndex) => {
          return serie.map((entry, entryIndex) => {
            const leftMargin = series.length > 1 ? innerBarSpace / 2 : 0;
            const path = shape7.area().x0((d) => x(d[0])).x1((d) => x(d[1])).y(
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
      areas = series.map((stack4, stackIndex) => {
        return stack4.map((serie, keyIndex) => {
          return serie.map((entry, entryIndex) => {
            const leftMargin = series.length > 1 ? innerBarSpace / 2 : 0;
            const x0 = x(entryIndex) + barWidth * stackIndex + leftMargin;
            const x1 = x(entryIndex) + barWidth + barWidth * stackIndex - leftMargin;
            const y0 = y(entry[1]);
            const y1 = y(entry[0]);
            const barHeight = y1 - y0;
            const borderRadius = initialBorderRadius * 2 > barHeight ? barHeight / 2 : initialBorderRadius;
            const showTopBorder = keyIndex === stack4.length - 1;
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
    return array6.merge(areas);
  }
  calcExtent(values) {
    const { gridMax, gridMin } = this.props;
    const mergedValues = array6.merge(values);
    return array6.extent([...mergedValues, gridMin, gridMax]);
  }
  calcIndexes() {
    const { data } = this.props;
    return data[0].data.map((_, index) => index);
  }
  getSeries() {
    const {
      data,
      keys,
      offset = shape7.stackOffsetNone,
      order = shape7.stackOrderNone,
      valueAccessor = ({ item, key }) => item[key]
    } = this.props;
    return data.map(
      (obj, index) => shape7.stack().keys(keys[index]).value((item, key) => valueAccessor({ item, key })).order(order).offset(offset)(obj.data)
    );
  }
  render() {
    const { data, animate, animationDuration, style, numberOfTicks = 10, children, horizontal } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react8.default.createElement(import_react_native6.View, { style });
    }
    const series = this.getSeries();
    const values = array6.merge(array6.merge(series));
    const indexes = this.calcIndexes();
    const extent10 = this.calcExtent(values);
    const ticks4 = array6.ticks(extent10[0], extent10[1], numberOfTicks);
    const xDomain = horizontal ? extent10 : indexes;
    const yDomain = horizontal ? indexes : extent10;
    const x = this.calcXScale(xDomain);
    const y = this.calcYScale(yDomain);
    const bandwidth = horizontal ? y.bandwidth() : x.bandwidth();
    const stacks = this.calcAreas(x, y, series);
    const extraProps = {
      x,
      y,
      width,
      height,
      ticks: ticks4,
      data,
      bandwidth
    };
    return /* @__PURE__ */ import_react8.default.createElement(import_react_native6.View, { style }, /* @__PURE__ */ import_react8.default.createElement(import_react_native6.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react8.default.createElement(import_react_native_svg6.default, { style: { height, width } }, import_react8.default.Children.map(children, (child) => {
      if (import_react8.default.isValidElement(child) && child.props.belowChart) {
        return import_react8.default.cloneElement(child, extraProps);
      }
      return null;
    }), stacks.map((areas, indexStack) => {
      const areaIndex = indexStack % data.length;
      return areas.map((bar, indexArea) => {
        const keyIndex = indexArea % data[areaIndex].data.length;
        const key = `${areaIndex}-${keyIndex}-${bar.key}`;
        const { svg } = data[areaIndex].data[keyIndex][bar.key];
        return /* @__PURE__ */ import_react8.default.createElement(
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
    }), import_react8.default.Children.map(children, (child) => {
      if (import_react8.default.isValidElement(child) && !child.props.belowChart) {
        return import_react8.default.cloneElement(child, extraProps);
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
    return /* @__PURE__ */ import_react9.default.createElement(stacked_bar_grouped_default, { ...props });
  }
  return /* @__PURE__ */ import_react9.default.createElement(stacked_bar_chart_default, { ...props });
};
var stacked_bar_chart_default2 = StackedBarChartGate;

// src/line-chart/index.tsx
var import_react11 = __toESM(require("react"));

// src/line-chart/line-chart.tsx
var shape8 = __toESM(require("d3-shape"));
var LineChart = class extends chart_default {
  createPaths({ data, x, y }) {
    const { curve = shape8.curveLinear } = this.props;
    const line4 = shape8.line().x((d) => x(d.x)).y((d) => y(d.y)).defined((item) => typeof item.y === "number").curve(curve)(data);
    return {
      path: line4,
      line: line4
    };
  }
};
var line_chart_default = LineChart;

// src/line-chart/line-chart-grouped.tsx
var shape9 = __toESM(require("d3-shape"));

// src/chart/chart-grouped.tsx
var array7 = __toESM(require("d3-array"));
var import_react10 = __toESM(require("react"));
var import_react_native7 = require("react-native");
var import_react_native_svg7 = __toESM(require("react-native-svg"));
var ChartGrouped = class extends import_react10.PureComponent {
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
      return /* @__PURE__ */ import_react10.default.createElement(import_react_native7.View, { style });
    }
    const mappedData = data.map(
      (dataArray) => dataArray.data.map((item, index) => ({
        y: yAccessor({ item, index }),
        x: xAccessor({ item, index })
      }))
    );
    const yValues = array7.merge(mappedData).map((item) => item.y);
    const xValues = array7.merge(mappedData).map((item) => item.x);
    const yExtent = array7.extent([...yValues, gridMin, gridMax]);
    const xExtent = array7.extent([...xValues]);
    const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props;
    const y = yScale().domain([yMin, yMax]).range([height - bottom, top]).clamp(clampY);
    const x = xScale().domain([xMin, xMax]).range([left, width - right]).clamp(clampX);
    const paths = this.createPaths({
      data: mappedData,
      x,
      y
    });
    const ticks4 = y.ticks(numberOfTicks);
    const extraProps = {
      x,
      y,
      data,
      ticks: ticks4,
      width,
      height,
      ...paths
    };
    return /* @__PURE__ */ import_react10.default.createElement(import_react_native7.View, { style }, /* @__PURE__ */ import_react10.default.createElement(import_react_native7.View, { style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react10.default.createElement(import_react_native_svg7.default, { style: { height, width } }, import_react10.default.Children.map(children, (child) => {
      if (import_react10.default.isValidElement(child) && child.props.belowChart) {
        return import_react10.default.cloneElement(child, extraProps);
      }
      return null;
    }), paths.path.map((path, index) => {
      const { svg: pathSvg } = data[index];
      const key = `${path}-${index}`;
      return /* @__PURE__ */ import_react10.default.createElement(
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
    }), import_react10.default.Children.map(children, (child) => {
      if (import_react10.default.isValidElement(child) && !child.props.belowChart) {
        return import_react10.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var chart_grouped_default = ChartGrouped;

// src/line-chart/line-chart-grouped.tsx
var LineChartGrouped = class extends chart_grouped_default {
  createPaths({ data, x, y }) {
    const { curve = shape9.curveLinear } = this.props;
    const lines = data.map(
      (line4) => shape9.line().x((d) => x(d.x)).y((d) => y(d.y)).defined((item) => typeof item.y === "number").curve(curve)(line4)
    );
    return {
      path: lines,
      lines
    };
  }
};
var line_chart_grouped_default = LineChartGrouped;

// src/line-chart/index.tsx
var LineChartGate = ({ data, ...props }) => {
  if (data[0] && "data" in data[0]) {
    return /* @__PURE__ */ import_react11.default.createElement(line_chart_grouped_default, { data, ...props });
  }
  return /* @__PURE__ */ import_react11.default.createElement(line_chart_default, { data, ...props });
};
var line_chart_default2 = LineChartGate;

// src/pie-chart.tsx
var import_react12 = __toESM(require("react"));
var import_react_native8 = require("react-native");
var shape10 = __toESM(require("d3-shape"));
var import_react_native_svg8 = __toESM(require("react-native-svg"));
var PieChart = class extends import_react12.PureComponent {
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
      return /* @__PURE__ */ import_react12.default.createElement(import_react_native8.View, { style });
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
      const arc3 = shape10.arc().outerRadius(_outerRadius).innerRadius(_innerRadius).padAngle(padAngle);
      if (item.arc) {
        Object.entries(item.arc).forEach(([key, value]) => {
          if (typeof arc3[key] === "function") {
            if (typeof value === "string") {
              arc3[key](parseInt(value) / 100 * _outerRadius);
            } else {
              arc3[key](value);
            }
          }
        });
      }
      return arc3;
    });
    const labelArcs = data.map((item, index) => {
      if (labelRadius) {
        return shape10.arc().outerRadius(_labelRadius).innerRadius(_labelRadius).padAngle(padAngle);
      }
      return arcs[index];
    });
    const pieSlices = shape10.pie().value((d) => valueAccessor({ item: d })).sort(sort).startAngle(startAngle).endAngle(endAngle)(data);
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
    return /* @__PURE__ */ import_react12.default.createElement(import_react_native8.View, { pointerEvents: "box-none", style }, /* @__PURE__ */ import_react12.default.createElement(import_react_native8.View, { pointerEvents: "box-none", style: { flex: 1 }, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react12.default.createElement(
      import_react_native_svg8.default,
      {
        pointerEvents: import_react_native8.Platform.OS === "android" ? "box-none" : void 0,
        style: { height, width }
      },
      /* @__PURE__ */ import_react12.default.createElement(import_react_native_svg8.G, { x: width / 2, y: height / 2 }, import_react12.default.Children.map(children, (child) => {
        if (import_react12.default.isValidElement(child) && child.props.belowChart) {
          return import_react12.default.cloneElement(child, extraProps);
        }
        return null;
      }), pieSlices.map((slice, index) => {
        const { key, onPress, svg } = data[index];
        return /* @__PURE__ */ import_react12.default.createElement(
          import_react_native_svg8.Path,
          {
            key,
            onPress,
            ...svg,
            d: arcs[index](slice),
            animate,
            animationDuration
          }
        );
      }), import_react12.default.Children.map(children, (child) => {
        if (import_react12.default.isValidElement(child) && !child.props.belowChart) {
          return import_react12.default.cloneElement(child, extraProps);
        }
        return null;
      }))
    )));
  }
};
var pie_chart_default = PieChart;

// src/progress-circle.tsx
var import_react13 = __toESM(require("react"));
var import_react_native9 = require("react-native");
var shape11 = __toESM(require("d3-shape"));
var import_react_native_svg9 = __toESM(require("react-native-svg"));
var ProgressCircle = class extends import_react13.PureComponent {
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
      style,
      progressColor,
      backgroundColor,
      strokeWidth,
      startAngle,
      endAngle,
      animate,
      animateDuration,
      children,
      cornerRadius
    } = this.props;
    let { progress } = this.props;
    const { height, width } = this.state;
    const outerDiameter = Math.min(width, height);
    if (!isFinite(progress) || isNaN(progress)) {
      progress = 0;
    }
    const data = [
      {
        key: "rest",
        value: 1 - progress,
        color: backgroundColor
      },
      {
        key: "progress",
        value: progress,
        color: progressColor
      }
    ];
    const pieSlices = shape11.pie().value((d) => d.value).sort((a) => a.key === "rest" ? 1 : -1).startAngle(startAngle).endAngle(endAngle)(data);
    const arcs = pieSlices.map((slice, index) => ({
      ...data[index],
      ...slice,
      path: shape11.arc().outerRadius(outerDiameter / 2).innerRadius(outerDiameter / 2 - strokeWidth).startAngle(index === 0 ? startAngle : slice.startAngle).endAngle(index === 0 ? endAngle : slice.endAngle).cornerRadius(cornerRadius)()
    }));
    const extraProps = {
      width,
      height
    };
    return /* @__PURE__ */ import_react13.default.createElement(import_react_native9.View, { style, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react13.default.createElement(import_react_native_svg9.default, { style: { height, width } }, /* @__PURE__ */ import_react13.default.createElement(import_react_native_svg9.G, { x: width / 2, y: height / 2 }, import_react13.default.Children.map(children, (child) => {
      if (import_react13.default.isValidElement(child) && child.props.belowChart) {
        return import_react13.default.cloneElement(child, extraProps);
      }
      return null;
    }), arcs.map((shape12, index) => /* @__PURE__ */ import_react13.default.createElement(
      animated_path_default,
      {
        key: index,
        fill: shape12.color,
        d: shape12.path,
        animate,
        animationDuration: animateDuration
      }
    )), import_react13.default.Children.map(children, (child) => {
      if (import_react13.default.isValidElement(child) && !child.props.belowChart) {
        return import_react13.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var progress_circle_default = ProgressCircle;

// src/x-axis.tsx
var import_react14 = __toESM(require("react"));
var import_react_native10 = require("react-native");
var d3Scale = __toESM(require("d3-scale"));
var array8 = __toESM(require("d3-array"));
var import_react_native_svg10 = __toESM(require("react-native-svg"));
var XAxis = class extends import_react14.PureComponent {
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
      scale: scale7 = d3Scale.scaleLinear,
      spacingInner = 0.05,
      spacingOuter = 0.05,
      contentInset: { left = 0, right = 0 } = {}
    } = this.props;
    const { width } = this.state;
    const x = scale7().domain(domain).range([left, width - right]);
    if (scale7 === d3Scale.scaleBand) {
      x.paddingInner([spacingInner]).paddingOuter([spacingOuter]);
      return (value) => x(value) + x.bandwidth() / 2;
    }
    return x;
  }
  render() {
    const {
      style,
      scale: scale7 = d3Scale.scaleLinear,
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
      return /* @__PURE__ */ import_react14.default.createElement(import_react_native10.View, { style });
    }
    const values = data.map((item, index) => xAccessor({ item, index }));
    const extent10 = array8.extent(values);
    const domain = scale7 === d3Scale.scaleBand ? values : [min || extent10[0], max || extent10[1]];
    const x = this._getX(domain);
    const ticks4 = numberOfTicks ? x.ticks(numberOfTicks) : values;
    const extraProps = {
      x,
      ticks: ticks4,
      width,
      height,
      formatLabel
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react_native10.View, { style }, /* @__PURE__ */ import_react14.default.createElement(import_react_native10.View, { style: { flexGrow: 1 }, onLayout: this._onLayout }, /* @__PURE__ */ import_react14.default.createElement(
      import_react_native10.Text,
      {
        style: {
          opacity: 0,
          fontSize: svg.fontSize,
          fontFamily: svg.fontFamily,
          fontWeight: svg.fontWeight
        }
      },
      formatLabel(ticks4[0], 0)
    ), height > 0 && width > 0 && /* @__PURE__ */ import_react14.default.createElement(
      import_react_native_svg10.default,
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          height,
          width
        }
      },
      /* @__PURE__ */ import_react14.default.createElement(import_react_native_svg10.G, null, import_react14.default.Children.map(children, (child) => {
        if (import_react14.default.isValidElement(child)) {
          return import_react14.default.cloneElement(child, extraProps);
        }
        return null;
      }), width > 0 && ticks4.map((value, index) => {
        const { svg: valueSvg = {} } = data[index] || {};
        return /* @__PURE__ */ import_react14.default.createElement(
          import_react_native_svg10.Text,
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

// src/y-axis.tsx
var import_react15 = __toESM(require("react"));
var import_react_native11 = require("react-native");
var import_react_native_svg11 = require("react-native-svg");
var d3Scale2 = __toESM(require("d3-scale"));
var array9 = __toESM(require("d3-array"));
var YAxis = class extends import_react15.PureComponent {
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
      scale: scale7 = d3Scale2.scaleLinear,
      spacingInner = 0.05,
      spacingOuter = 0.05,
      contentInset: { top = 0, bottom = 0 } = {}
    } = this.props;
    const { height } = this.state;
    const y = scale7().domain(domain).range([height - bottom, top]);
    if (scale7 === d3Scale2.scaleBand) {
      y.range([top, height - bottom]).paddingInner([spacingInner]).paddingOuter([spacingOuter]);
      return (value) => y(value) + y.bandwidth() / 2;
    }
    return y;
  }
  render() {
    const {
      style,
      data,
      scale: scale7 = d3Scale2.scaleLinear,
      yAccessor = ({ item }) => item,
      numberOfTicks = 10,
      formatLabel = (value) => value && value.toString(),
      svg = {},
      children
    } = this.props;
    const { height, width } = this.state;
    if (data.length === 0) {
      return /* @__PURE__ */ import_react15.default.createElement(import_react_native11.View, { style });
    }
    const values = data.map((item, index) => yAccessor({ item, index }));
    const extent10 = array9.extent(values);
    const { min = extent10[0], max = extent10[1] } = this.props;
    const domain = scale7 === d3Scale2.scaleBand ? values : [min, max];
    const y = this.getY(domain);
    const ticks4 = scale7 === d3Scale2.scaleBand ? values : y.ticks(numberOfTicks);
    const longestValue = ticks4.map((value, index) => formatLabel(value, index, ticks4)).reduce((prev, curr) => prev.toString().length > curr.toString().length ? prev : curr, 0);
    const extraProps = {
      y,
      ticks: ticks4,
      width,
      height,
      formatLabel
    };
    return /* @__PURE__ */ import_react15.default.createElement(import_react_native11.View, { style: [style] }, /* @__PURE__ */ import_react15.default.createElement(import_react_native11.View, { style: { flexGrow: 1 }, onLayout: this._onLayout }, /* @__PURE__ */ import_react15.default.createElement(
      import_react_native11.Text,
      {
        style: {
          opacity: 0,
          fontSize: svg.fontSize,
          fontFamily: svg.fontFamily,
          fontWeight: svg.fontWeight
        }
      },
      longestValue
    ), height > 0 && width > 0 && /* @__PURE__ */ import_react15.default.createElement(
      import_react_native_svg11.Svg,
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          height,
          width
        }
      },
      /* @__PURE__ */ import_react15.default.createElement(
        import_react_native_svg11.G,
        null,
        import_react15.default.Children.map(children, (child) => {
          return import_react15.default.cloneElement(child, extraProps);
        }),
        // don't render labels if width isn't measured yet,
        // causes rendering issues
        height > 0 && ticks4.map((value, index) => {
          return /* @__PURE__ */ import_react15.default.createElement(
            import_react_native_svg11.Text,
            {
              originY: y(value),
              textAnchor: "middle",
              x: "50%",
              alignmentBaseline: "middle",
              ...svg,
              key: y(value),
              y: y(value)
            },
            formatLabel(value, index, ticks4)
          );
        })
      )
    )));
  }
};
var y_axis_default = YAxis;

// src/chart-decorators/horizontal-line.tsx
var import_react16 = __toESM(require("react"));
var import_react_native_svg12 = require("react-native-svg");

// src/chart-decorators/point.tsx
var import_react17 = __toESM(require("react"));
var import_react_native_svg13 = require("react-native-svg");

// src/chart-decorators/tooltip.tsx
var import_react18 = __toESM(require("react"));
var import_react_native_svg14 = require("react-native-svg");

// src/grid.tsx
var import_react19 = __toESM(require("react"));
var import_react_native_svg15 = require("react-native-svg");
var Horizontal = ({ ticks: ticks4 = [], y = (v) => v, svg = {} }) => {
  return /* @__PURE__ */ import_react19.default.createElement(import_react_native_svg15.G, null, ticks4.map((tick) => /* @__PURE__ */ import_react19.default.createElement(
    import_react_native_svg15.Line,
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
var Vertical = ({ ticks: ticks4 = [], x = (v) => v, svg = {} }) => {
  return /* @__PURE__ */ import_react19.default.createElement(import_react_native_svg15.G, null, ticks4.map((tick, index) => /* @__PURE__ */ import_react19.default.createElement(
    import_react_native_svg15.Line,
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
  return /* @__PURE__ */ import_react19.default.createElement(import_react_native_svg15.G, null, /* @__PURE__ */ import_react19.default.createElement(Horizontal, { ...props }), /* @__PURE__ */ import_react19.default.createElement(Vertical, { ...props }));
};
var Direction = {
  VERTICAL: "VERTICAL",
  HORIZONTAL: "HORIZONTAL",
  BOTH: "BOTH"
};
var Grid = ({ direction = Direction.HORIZONTAL, ...props }) => {
  switch (direction) {
    case Direction.VERTICAL:
      return /* @__PURE__ */ import_react19.default.createElement(Vertical, { ...props });
    case Direction.HORIZONTAL:
      return /* @__PURE__ */ import_react19.default.createElement(Horizontal, { ...props });
    case Direction.BOTH:
      return /* @__PURE__ */ import_react19.default.createElement(Both, { ...props });
    default:
      return null;
  }
};
Grid.Direction = Direction;
var grid_default = Grid;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AreaChart,
  BarChart,
  Grid,
  LineChart,
  Path,
  PieChart,
  ProgressCircle,
  StackedAreaChart,
  StackedBarChart,
  XAxis,
  YAxis
});
