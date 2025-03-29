import tsParser from '@typescript-eslint/parser'
import pluginVitest from '@vitest/eslint-plugin'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
// import oxlint from 'eslint-plugin-oxlint'
import prettier from 'eslint-plugin-prettier/recommended'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import * as linterConfigs from './linterConfigs/index.mjs'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx,cjs,cts,mjs}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/@types/**',
      '**/storybook-static/**',
    ],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ...pluginVitest.configs.recommended,
    files: ['test/**/*'],
  },
  // ...oxlint.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: true,
        parser: tsParser,
      },
    },
  },
  linterConfigs.jsConfigs,
  linterConfigs.tsConfigs,
  linterConfigs.vueConfigs,
  linterConfigs.importConfigs,
  prettier,
  // skipFormatting,
)
