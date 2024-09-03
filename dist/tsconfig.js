// tsconfig.json
var compilerOptions = {
  target: "es2018",
  module: "commonjs",
  jsx: "react-native",
  declaration: true,
  outDir: "./dist",
  rootDir: "./src",
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  forceConsistentCasingInFileNames: true
};
var include = ["src"];
var exclude = ["node_modules", "dist"];
var tsconfig_default = {
  compilerOptions,
  include,
  exclude
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compilerOptions,
  exclude,
  include
});
