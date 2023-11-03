import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "./jsx-runtime.ts",
  output: [
    { file: "./jsx-runtime.js", format: "cjs" },
    { file: "./jsx-runtime.mjs", format: "esm" },
    { file: "./jsx-dev-runtime.js", format: "cjs" },
    { file: "./jsx-dev-runtime.mjs", format: "esm" }
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.json" })]
});
