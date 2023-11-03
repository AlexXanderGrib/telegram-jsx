import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "./runtime.ts",
  output: [
    { file: "./runtime.js", format: "cjs" },
    { file: "./runtime.mjs", format: "esm" },
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.json" })]
})
