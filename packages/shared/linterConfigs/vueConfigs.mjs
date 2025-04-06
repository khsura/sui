export const vueConfigs = {
  files: ['**/*.vue'],
  rules: {
    'vue/no-unused-properties': [
      'warn',
      {
        groups: ['data', 'computed', 'methods', 'setup'],
        deepData: true,
      },
    ],
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
