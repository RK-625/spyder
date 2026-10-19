//  @ts-check

import convexPlugin from '@convex-dev/eslint-plugin'
import { tanstackConfig } from '@tanstack/eslint-config'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig([
  ...tanstackConfig,

  // Convex functions run in the Convex runtime rather than the Vite app, so
  // lint them against `convex/tsconfig.json` with the type-checked rules.
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['convex/**/*.ts'],
  })),
  {
    files: ['convex/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: join(rootDir, 'convex', 'tsconfig.json'),
        tsconfigRootDir: rootDir,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },

  // Convex-specific rules, scoped to `convex/**` by the plugin itself.
  ...convexPlugin.configs.recommended,

  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },

  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
  globalIgnores(['convex/_generated']),
])
