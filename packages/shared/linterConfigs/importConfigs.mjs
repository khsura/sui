import importPlugin from 'eslint-plugin-import'

export const importConfigs = {
  plugins: { import: importPlugin },
  rules: {
    ...importPlugin.configs.recommended.rules,
    'import/no-unresolved': ['off'],
    'import/named': ['off'],
    'import/default': ['off'],
    'import/order': ['error'],
  },
}
