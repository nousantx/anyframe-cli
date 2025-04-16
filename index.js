import { Extractor } from './src/utils/classNameExtractor.js'

console.log(
  'extracted class names: ',
  new Extractor().extractClassNames(
    '<div className="bg-red-500 flex mx-auto hover:bg-blue-500"></div>'
  )
)
