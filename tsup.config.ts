import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // Gera os formatos ESM e CJS
  splitting: false, // Desativa o splitting para facilitar a compatibilidade
  sourcemap: false, // Mantém o sourcemap para debugging
  clean: true, // Limpa a pasta dist antes de compilar
  minify: true, // Minifica o código
  dts: true, // Gera arquivos de declaração de tipos (TypeScript)
  outDir: 'dist', // Define o diretório de saída como 'dist'
})
