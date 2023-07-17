import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  dts: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
})
