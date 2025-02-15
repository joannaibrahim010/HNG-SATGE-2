import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["**/*"] // Ignore all files
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: Object.fromEntries(
      Object.keys(compat.configs.all.rules).map(rule => [rule, "off"])
    )
  }
];

export default eslintConfig;