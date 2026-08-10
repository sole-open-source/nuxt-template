// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(prettier, {
  ignores: ['template/**', 'example/**', 'app/components/ui/**', 'app/components/gandalf/**'],
})
