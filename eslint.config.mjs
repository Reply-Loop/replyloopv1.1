import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Node CommonJS scripts (scripts/*.cjs) use require() on purpose.
  {
    files: ["scripts/**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The brand film is its own Remotion project with its own lint setup.
    "video/**",
    // Wrangler local dev state and generated shims.
    ".wrangler/**",
    // The Worker bundle copies the built site into worker/site.
    "worker/site/**",
    "worker/files.generated.js",
  ]),
]);

export default eslintConfig;
