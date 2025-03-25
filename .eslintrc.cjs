module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['@antfu', 'plugin:prettier/recommended'],
  rules: {
    'no-console': 'off',
    'no-empty': 'off',
    'unused-imports/no-unused-vars': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-dupe-keys': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: [['template', 'script'], 'style'],
      },
    ],
    'antfu/if-newline': 'off',
    'vue/no-reserved-component-names': 'off',
    'import/no-mutable-exports': 'off',
  },
}
