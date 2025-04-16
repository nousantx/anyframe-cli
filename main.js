import { ClassNameExtractor, FileScanner, CSSGenerator, Logger } from './src/index.js'
import { AnyCSS } from '@anyframe/css'

const logger = new Logger({
  minimal: true
})

const scanner = new FileScanner(
  {
    include: ['app/**/*.{js,jsx}'],
    exclude: ['**/tests/**']
  },
  logger
)

const generator = new CSSGenerator(new AnyCSS())

const extractor = new ClassNameExtractor({
  scanner,
  generator,
  logger
})

await extractor.run()
