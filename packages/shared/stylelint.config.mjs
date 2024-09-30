const variablePattern =
  /^(s_)?(([a-z]+[A-Z]?([a-z]+)?)+)(__(([a-z]+[A-Z]?([a-z]+)?)+))?(--(([a-z]+[A-Z]?([a-z]+)?)+))?(__(([a-z]+[A-Z]?([a-z]+)?)+))?$/

/** @type {import('stylelint').Config} */
export default {
  defaultSeverity: 'warning',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue',
  ],
  plugins: ['stylelint-scss'],
  rules: {
    'import-notation': null,
    'color-named': 'never',
    'shorthand-property-no-redundant-values': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-single-line-max-declarations': 1,
    'selector-max-compound-selectors': 3,
    'selector-max-id': 0,
    'max-nesting-depth': 4,
    'color-hex-length': 'long',
    'font-weight-notation': 'numeric',
    'length-zero-no-unit': true,
    'value-keyword-case': ['lower', { ignoreKeywords: /^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$/ }],
    'declaration-empty-line-before': 'never',
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['deep'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'deep'],
      },
    ],
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'scss/no-global-function-names': null,
    // ${prefix}-${block}__${element}--${modifier}__${property}
    'selector-class-pattern': variablePattern,
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        ignoreAtRules: ['import', 'use', 'else'],
        except: ['blockless-after-same-name-blockless', 'blockless-after-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'function-name-case': ['lower', { ignoreFunctions: ['/^(s_)?(([a-z]+[A-Z]?([a-z]+)?)+)$/'] }],
    'scss/dollar-variable-pattern': [variablePattern, { ignore: 'local' }],
    'scss/percent-placeholder-pattern': [variablePattern, { ignore: 'local' }],
    'scss/selector-no-redundant-nesting-selector': null,
    'scss/map-keys-quotes': 'always',
    'scss/at-each-key-value-single-line': true,
    'scss/at-function-parentheses-space-before': 'never',
    'scss/at-function-pattern': /^s_(([a-z]+[A-Z]?([a-z]+)?)+)$/,
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          /map\.(get|merge|has-key)/,
          /meta\.(type-of)/,
          /map-deep-(get|merge)/,
          'v-bind',
          'map-get',
          'if',
          'percentage',
          'index',
          'lighten',
          /s_(breakpointInfix|breakpointMin|borderRadius|typography|isDark|getTextColor|getPresetColor|getAppColor|getThemeColor)/,
          /list\.(nth|append|length)/,
        ],
      },
    ],
    'annotation-no-unknown': [
      true,
      {
        ignoreAnnotations: ['default', 'important'],
      },
    ],
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'scss/at-mixin-pattern': variablePattern,
    'custom-property-pattern':
      /^s-((color-(primary|secondary|success|info|warning|important|error)(--text)?)|(app-color-(border|title)))$/,
    'media-query-no-invalid': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'breakpointXs',
          'breakpointSm',
          'breakpointMd',
          'breakpointLg',
          'breakpointXl',
          'breakpointXxl',
        ],
      },
    ],
  },
  ignoreFiles: [
    'dist/**/*',
    'coverage/**/*',
    '@types/**/*',
    'node_modules/**/*',
    'public/**/*',
    'storybook-static/**/*',
  ],
}
