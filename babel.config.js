module.exports = {
  presets: [
    ["@babel/env"],
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties", 
    "@babel/plugin-transform-runtime"
  ],
  sourceMaps: "inline",
  retainLines: true
};