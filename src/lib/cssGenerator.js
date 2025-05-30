import fs from 'fs'
import path from 'path'

export class CSSGenerator {
  constructor(cssProvider, config = {}, logger) {
    this.cssProvider = cssProvider
    this.outputDir = config.outputDir || '.generated'
    this.outputFile = config.outputFile || 'styles.css'
    this.logger = logger
  }

  /**
   * Generate CSS from class names
   * @param {string[]} classNames - Array of class names
   * @returns {Object} - Object with generation metrics
   */
  async generate(classNames) {
    const metrics = {}

    try {
      // Process classes
      const processStart = performance.now()
      const uniqueClassNames = [...new Set(classNames)]
      const processEnd = performance.now()
      metrics.processingTime = processEnd - processStart

      // Generate CSS
      const renderStart = performance.now()
      const generatedCSS = this.cssProvider.render(uniqueClassNames)
      const renderEnd = performance.now()
      metrics.renderingTime = renderEnd - renderStart

      // Write file
      const writeStart = performance.now()

      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true })
      }

      const outputPath = path.join(this.outputDir, this.outputFile)
      fs.writeFileSync(outputPath, generatedCSS)

      const writeEnd = performance.now()
      metrics.writingTime = writeEnd - writeStart

      metrics.totalTime = metrics.processingTime + metrics.renderingTime + metrics.writingTime

      return {
        success: true,
        classCount: uniqueClassNames.length,
        outputPath,
        metrics
      }
    } catch (error) {
      this.logger.error(`Error generating CSS: ${error.message}`)
      return {
        success: false,
        error: error.message
      }
    }
  }
}
