import Ngurai from 'nguraijs'
import Moxie from '@tenoxui/moxie'

export class Extractor {
  constructor(config = [], cssConfig = {}) {
    this.config = config
    this.cssConfig = cssConfig
    this.regexp = new Moxie(cssConfig).regexp()
  }
  extractClassNames(code) {
    try {
      const cn = new Ngurai({
        customOnly: true,
        noUnknownToken: true,
        noSpace: true,
        custom: {
          className: [
            new RegExp(this.regexp.all), // catch all possible class names with value
            new RegExp('(?:(' + this.regexp.prefix + '):)?' + this.regexp.type), // catch only valueless class name such as `flex` from `moxie.classes`
            ...this.config
          ]
        }
      })

      const classNames = cn
        .tokenize(code)
        .flatMap((line) => line.filter((token) => token.type === 'className'))
        .map((token) => token.value)

      if (classNames.length === 0) return []

      return [...new Set(classNames)]
    } catch (error) {
      console.error('Error extracting class names:', error)
      return []
    }
  }
}
