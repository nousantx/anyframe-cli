#!/usr/bin/env node
import { program } from 'commander'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  Logger,
  FileScanner,
  CSSGenerator,
  ClassNameExtractor,
  FileWatcher
} from './dist/index.es.js'

program
  .name('extract-classes')
  .description('Extract class names from source files and generate CSS')
  .version('1.0.0')

program
  .option('-c, --config <path>', 'path to config file', './anyframe.config.js')
  .option('-i, --include <patterns>', 'glob patterns to include files (comma separated)')
  .option('-e, --exclude <patterns>', 'glob patterns to exclude files (comma separated)')
  .option('-d, --dir <path>', 'root directory', '.')
  .option('-o, --output-dir <path>', 'output directory', '.generated')
  .option('-f, --output-file <name>', 'output file name', 'styles.css')
  .option('-w, --watch', 'watch mode', false)
  .option('-v, --verbose', 'verbose output', false)
  .option('-s, --silent', 'silent mode', false)
  .option('-m, --minimal', 'minimap mode', false)
  .parse()

async function main() {
  const options = program.opts()

  const logger = new Logger({
    verbose: options.verbose,
    silent: options.silent,
    minimal: options.minimal
  })

  let config = {
    include: ['**/*.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    rootDir: options.dir,
    outputDir: options.outputDir,
    outputFile: options.outputFile,
    anyframe: {}
  }

  try {
    const configPath = path.resolve(options.config)
    logger.debug(`Looking for config at: ${configPath}`)

    if (fs.existsSync(configPath)) {
      const userConfig = await import(configPath)

      config = { ...config, ...userConfig.default }
      logger.debug(`Loaded config from ${options.config}: ${JSON.stringify(config)}`)
    } else {
      logger.debug(`Config file not found at: ${configPath}`)
    }
  } catch (error) {
    logger.warn(`Could not load config file: ${error.message}`)
  }

  if (options.include) {
    config.include = options.include.split(',').map(p => p.trim())
    logger.debug(`Override include patterns from CLI: ${config.include}`)
  }

  if (options.exclude) {
    config.exclude = options.exclude.split(',').map(p => p.trim())
    logger.debug(`Override exclude patterns from CLI: ${config.exclude}`)
  }

  if (options.dir) {
    config.rootDir = options.dir
    logger.debug(`Override root directory from CLI: ${config.rootDir}`)
  }

  const scanner = new FileScanner(
    {
      include: config.include,
      exclude: config.exclude,
      rootDir: config.rootDir
    },
    logger
  )

  let cssProvider
  try {
    const { AnyCSS } = await import('@anyframe/css')
    cssProvider = new AnyCSS(config.anyframe)
    logger.debug('Initialize AnyCSS')
  } catch (error) {
    logger.error(`Failed to initialize CSS provider: ${error.message}`)
    process.exit(1)
  }

  const generator = new CSSGenerator(
    cssProvider,
    {
      outputDir: config.outputDir,
      outputFile: config.outputFile
    },
    logger
  )

  const extractor = new ClassNameExtractor({
    logger,
    scanner,
    generator
  })

  if (options.watch) {
    const watcher = new FileWatcher(extractor, {
      dirs: [config.rootDir],
      filePatterns: config.include,
      ignorePatterns: config.exclude,
      logger
    })

    await watcher.init()
  } else {
    logger.info('Running in build mode')
    await extractor.run()
  }
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
