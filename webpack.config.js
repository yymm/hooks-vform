const path = require("path");
const webpack = require("webpack");
var rootDir = path.resolve(__dirname);

// dts-bundleの設定
function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
  compiler.plugin("done", function() {
    var dts = require("dts-bundle");

    dts.bundle({
      name: "hooks-vform",
      main: rootDir + "/lib/**/*.d.ts",
      out: rootDir + "/types/index.d.ts",
      removeSource: true,
      outputAsModuleFolder: true
    });
  });
};

module.exports = {
  entry: "./src/VForm.tsx",
  output: {
    filename: "index.min.js",
    path: path.join(__dirname, "./lib/"),
    library: "hooks-vform",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  plugins: [new DtsBundlePlugin()],
  cache: true
};
