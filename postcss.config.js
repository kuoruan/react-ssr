module.exports = ({ env }) => {
  const isProduction = env === "production";
  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      "postcss-flexbugs-fixes": {},
      cssnano: isProduction
        ? {
            preset: "default",
          }
        : false,
    },
  };
};
