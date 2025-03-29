export const vueConfigs = {
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
