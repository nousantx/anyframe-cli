import Ngurai from 'nguraijs'
import Cs from '@anyframe/css'

const ui = new Cs()
const pattern = ui.main.generateClassNameRegEx()

function extract(code) {
  try {
    const cn = new Ngurai({
      custom: {
        classNames: [
          /(cn|clsx|classname|className)\s*\([^)]*\)/, // function calls
          /(class|className|\:class)\s*=\s*"[^"]*"/, // static attributes
          /className\s*=\s*{[^}]*}/, // dynamic JSX
          /class:\s*{\s*['"][^'"]*['"]\s*:/, // class directives (Vue, Svelte)
          /classList\.(add|toggle|remove)\(['"][^'"]*['"]\)/ // DOM classList
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

console.log(extract('<div class="bg-red flex"></div>'))

const urai = new Ngurai({
  // customOnly: true,
  custom: {
    classNames: [pattern]
  }
})

console.log(urai.tokenize('bg-red-500 flex hover:bg-blue-500 hover:flex hover:flex-1'))
