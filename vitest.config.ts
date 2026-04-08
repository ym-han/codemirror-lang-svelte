import { defineConfig } from 'vitest/config'
import LezerGrammarPlugin from './dev/plugins/lezer-grammar-plugin'

export default defineConfig({
  plugins: [LezerGrammarPlugin()],
  test: {
    include: ['src/**/__tests__/**/*.test.ts'],
  },
})
