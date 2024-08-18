import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: ["./index.tsx", "./jsx-runtime.ts", "./jsx-dev-runtime.ts"],
  cache: true,

  output: [
    {
      dir: ".",
      format: "cjs",
      generatedCode: { constBindings: true }
    },
    {
      dir: ".",
      format: "esm",
      entryFileNames: "[name].mjs"
    }
  ],
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    {
      name: "fix typescript removing reference in index.tsx",
      generateBundle(_options, bundle) {
        const file = bundle["index.d.ts"];

        if (file) {
          file.source = `/// <reference path="./global.d.ts" />\n${file.source}`;
        }
      }
    }
  ]
});
