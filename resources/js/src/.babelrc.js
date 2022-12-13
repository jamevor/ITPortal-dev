module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          browsers: "last 2 versions",
        },
        useBuiltIns: "entry",
        corejs: 2
      },
    ]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties"
  ],
};