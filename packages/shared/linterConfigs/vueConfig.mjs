/** @type {import('eslint').Linter.Config} */
export const vueConfig = {
  files: ['**/*.vue'],
  rules: {
    'vue/no-unused-properties': ['warn'],
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],
  },
}
