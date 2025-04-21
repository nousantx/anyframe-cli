export default {
  include: ['app/**/*.{js,jsx,ts,tsx}'],
  exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  outDir: 'css',
  outputFile: 'styles.css',
  css: {
    preflight: true,
    showLayerDirective: true
  },
  rules: [/class="([^"]*)"/]
}
