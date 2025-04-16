export default {
  include: ['**/*.{js,jsx,ts,tsx}'],
  exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  rootDir: 'app',
  outputDir: '.generated',
  outputFile: 'styles.css',
  anyframe: {
    preflight: true,
    showLayerDirective: true
  }
}
