import { js_beautify } from 'js-beautify'

export default function beautify(code) {
  let val = js_beautify(code, {
    e4x: false,
  })
  val = val.replaceAll('# # ', '##')
  val = val.replaceAll('# #', '##')
  val =  val.replaceAll('@ @ ', '@@')
  val =  val.replaceAll('@ @', '@@')
  val =  val.replaceAll(' < ', '<')
  val =  val.replaceAll(' > ', '> ')
  return val
}
