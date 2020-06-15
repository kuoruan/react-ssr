module.exports = ({ env }) => {
  const isProduction = env === "production";
  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      "postcss-flexbugs-fixes": {},
      "@fullhuman/postcss-purgecss": isProduction
        ? {
            content: ["./src/**/*.tsx", "./src/**/*.ts"],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
          }
        : false,
      cssnano: isProduction
        ? {
            preset: "default",
          }
        : false,
    },
  };
};
