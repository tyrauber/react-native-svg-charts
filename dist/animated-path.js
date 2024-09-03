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

// src/animated-path.tsx
var animated_path_exports = {};
__export(animated_path_exports, {
  default: () => animated_path_default
});
module.exports = __toCommonJS(animated_path_exports);
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
