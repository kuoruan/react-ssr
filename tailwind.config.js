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
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
