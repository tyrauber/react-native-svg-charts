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

// src/progress-circle.tsx
var progress_circle_exports = {};
__export(progress_circle_exports, {
  default: () => progress_circle_default
});
module.exports = __toCommonJS(progress_circle_exports);
var import_react2 = __toESM(require("react"));
var import_react_native2 = require("react-native");
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

// src/progress-circle.tsx
var import_react_native_svg2 = __toESM(require("react-native-svg"));
var ProgressCircle = class extends import_react2.PureComponent {
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
    const pieSlices = shape.pie().value((d) => d.value).sort((a) => a.key === "rest" ? 1 : -1).startAngle(startAngle).endAngle(endAngle)(data);
    const arcs = pieSlices.map((slice, index) => ({
      ...data[index],
      ...slice,
      path: shape.arc().outerRadius(outerDiameter / 2).innerRadius(outerDiameter / 2 - strokeWidth).startAngle(index === 0 ? startAngle : slice.startAngle).endAngle(index === 0 ? endAngle : slice.endAngle).cornerRadius(cornerRadius)()
    }));
    const extraProps = {
      width,
      height
    };
    return /* @__PURE__ */ import_react2.default.createElement(import_react_native2.View, { style, onLayout: this._onLayout }, height > 0 && width > 0 && /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.default, { style: { height, width } }, /* @__PURE__ */ import_react2.default.createElement(import_react_native_svg2.G, { x: width / 2, y: height / 2 }, import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }), arcs.map((shape2, index) => /* @__PURE__ */ import_react2.default.createElement(
      animated_path_default,
      {
        key: index,
        fill: shape2.color,
        d: shape2.path,
        animate,
        animationDuration: animateDuration
      }
    )), import_react2.default.Children.map(children, (child) => {
      if (import_react2.default.isValidElement(child) && !child.props.belowChart) {
        return import_react2.default.cloneElement(child, extraProps);
      }
      return null;
    }))));
  }
};
var progress_circle_default = ProgressCircle;
