import StyleDictionary from "style-dictionary";
import { makeSdTailwindConfig } from "sd-tailwindcss-transformer";

const tailwindConfig = makeSdTailwindConfig({
  type: "all",
  buildPath: "build/",
});

const sd = new StyleDictionary({
  ...tailwindConfig,
  source: ["tokens/**/*.json"],
  platforms: {
    ...tailwindConfig.platforms,
    css: {
      transformGroup: "css",
      buildPath: "build/",
      files: [{ destination: "tokens.css", format: "css/variables" }],
    },
    js: {
      transformGroup: "js",
      buildPath: "build/",
      files: [{ destination: "tokens.js", format: "javascript/es6" }],
    },
  },
});

await sd.buildAllPlatforms();
