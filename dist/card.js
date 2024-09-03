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

// src/card.tsx
var card_exports = {};
__export(card_exports, {
  default: () => card_default
});
module.exports = __toCommonJS(card_exports);
var import_react = __toESM(require("react"));
var import_react_native = require("react-native");
var Card = class extends import_react.default.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      hasError: false
    };
  }
  componentDidCatch(error, info) {
    console.warn(error, info);
    this.setState({ hasError: true });
  }
  render() {
    const { hasError } = this.state;
    const { style, children } = this.props;
    return /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style: [styles.container, style] }, hasError ? /* @__PURE__ */ import_react.default.createElement(import_react_native.Text, null, "Something went wrong") : children);
  }
};
var styles = import_react_native.StyleSheet.create({
  container: {
    backgroundColor: "white",
    shadowOffset: {
      height: 2,
      width: 2
    },
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.5,
    padding: 16
  }
});
var card_default = Card;
