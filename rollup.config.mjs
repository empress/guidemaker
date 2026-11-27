import { babel } from "@rollup/plugin-babel";
import { Addon } from "@embroider/addon-dev/rollup";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const addon = new Addon({
  srcDir: "src",
  destDir: "dist",
});

const rootDirectory = dirname(fileURLToPath(import.meta.url));

export default {
  output: addon.output(),

  plugins: [
    addon.publicEntrypoints(["**/*.js"]),

    /**
     * Guidemaker's routes, models and services are the app's own, so they
     * land in the app as before.
     */
    addon.appReexports([
      "adapters/**/*.js",
      "components/**/*.js",
      "controllers/**/*.js",
      "helpers/**/*.js",
      "initializers/**/*.js",
      "instance-initializers/**/*.js",
      "locations/**/*.js",
      "models/**/*.js",
      "routes/**/*.js",
      "serializers/**/*.js",
      "services/**/*.js",
    ]),

    addon.dependencies(),

    babel({
      extensions: [".js"],
      babelHelpers: "bundled",
      configFile: resolve(rootDirectory, "./babel.publish.config.cjs"),
    }),

    addon.hbs(),

    addon.clean(),
  ],
};
