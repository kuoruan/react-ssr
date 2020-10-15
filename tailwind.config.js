module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.tsx"],
  },
  theme: {},
  variants: {
    appearance: [],
  },
  plugins: [],
  corePlugins: {
    float: false,
  },
  future: {
    defaultLineHeights: true,
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
    standardFontWeights: true,
  },
};
