import { defineConfig } from "vite";
import { extensions, classicEmberSupport, ember } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";
import { guidemaker } from "guidemaker/vite";

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    guidemaker(),
    babel({
      babelHelpers: "runtime",
      extensions,
    }),
  ],
});
