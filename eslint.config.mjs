import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Los .dc.html y sus scripts son referencia de diseño, no código de la
    // app: no se compilan ni se despliegan. Analizarlos solo genera ruido.
    "diseno/**",
  ]),
]);

export default eslintConfig;
