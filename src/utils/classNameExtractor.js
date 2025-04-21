import Ngurai from 'nguraijs'

export class Extractor {
  constructor(config = []) {
    this.config = config
  }
  extractClassNames(code) {
    try {
      const cn = new Ngurai({
        custom: {
          classNames: [
            /(cn|clsx|classname|className)\s*\([^)]*\)/, // function calls
            /(class|className|\:class)\s*=\s*"[^"]*"/, // static attributes
            /className\s*=\s*{[^}]*}/, // dynamic JSX
            /class:\s*{\s*['"][^'"]*['"]\s*:/, // class directives (Vue, Svelte)
            /classList\.(add|toggle|remove)\(['"][^'"]*['"]\)/, // DOM classList
            ...this.config
          ]
        }
      })

      const tokens = cn
        .tokenize(code)
        .flatMap((line) => line.filter((token) => token.type === 'classNames'))
        .map((token) => token.value)

      if (tokens.length === 0) return []

      const classNames = new Ngurai()
        .tokenize(tokens.join('\n'))
        .flatMap((line) => line.filter((token) => token.type === 'string'))
        .map((token) => token.value.slice(1, -1))
        .flatMap((str) => str.split(/\s+/))
        .filter((className) => className.trim().length > 0)

      return [...new Set(classNames)]
    } catch (error) {
      console.error('Error extracting class names:', error)
      return []
    }
  }
}
