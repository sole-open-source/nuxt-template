// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default withNuxt(
  eslintConfigPrettier,
  {
    rules: {
      'no-console': ['error', { allow: [] }],
    },
  },
  {
    files: ['app/lib/helpers/logger.ts'],
    rules: { 'no-console': 'off' },
  },
)
