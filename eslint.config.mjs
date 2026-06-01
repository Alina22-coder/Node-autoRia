import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
    eslint.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            import: importPlugin,
            "simple-import-sort": simpleImportSort,
            prettier: prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...prettierConfig.rules,
            "prettier/prettier": "error",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "import/no-duplicates": "error",
            "import/newline-after-import": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
            ],
            "no-console": "warn",
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
];
