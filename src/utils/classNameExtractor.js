import Ngurai from 'nguraijs'
import Moxie from '@tenoxui/moxie'

export class Extractor {
  constructor(config = [], cssConfig = {}) {
    this.config = config
    this.cssConfig = cssConfig
    this.moxie = new Moxie(this.cssConfig)
  }
  extractClassNames(code) {
    try {
      // regexp patterns from Moxie
      const { all, prefix, type } = this.moxie.regexp()

      // tokenize class names using NguraiJS
      const tokenizer = new Ngurai({
        customOnly: true,
        noUnknownToken: true,
        noSpace: true,
        custom: {
          className: [
            new RegExp(all), // catch all possible class names with value
            new RegExp(`(?:(${prefix}):)?${type}`), // catch only valueless class name such as `flex` from `moxie.classes`
            ...this.config
          ]
        }
      })

      // get every className tokens from the tokenizer
      const classNames = [
        ...new Set(
          tokenizer
            .tokenize(code)
            .flatMap(line => line.filter(token => token.type === 'className'))
            .map(token => token.value)
        )
      ]

      // validate the class name to ensure only valid class names processed
      const validatedClassNames = this.moxie.process(classNames).map(item => item.raw[6])

      return validatedClassNames || []
    } catch (error) {
      console.error('Error extracting class names:', error)
      return []
    }
  }
}
