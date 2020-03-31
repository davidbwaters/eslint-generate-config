//
// Utilities
//

import fs from 'fs'
import path from 'path'
import wrap from 'word-wrap'

export const capitalize = str => {
  if (typeof str !== 'string') return ''

  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const singleToDoubleQuotes = str => {
  str.replace(/"/g, '\'')
}

export const wrapComment = (text, ln = 60, pre = '// ') => {
  const width = ln - pre.length

  return wrap(text, {width: width, indent: pre})
}

export const formatJSON = obj => {
  return JSON.stringify(obj, null, 4)
}

export const listFiles = dirPath => {
  return fs.readdirSync(dirPath)
}

export const getModule = (filename, dirPath = './') => {
  const filePath = path.resolve(dirPath, filename)

  return import(filePath)
}

export const getSharedKeys = (o1, o2) => {
  const k1 = Object.keys(o1)
  const k2 = Object.keys(o2)

  const isAscending = k1.length < k2.length
  const [k, o] = isAscending ? [k1, o2] : [k2, o1]

  return k.reduce( (r, c) => {
     c in o
      ? r.common = [ ...r.common, c ]
      : r.uncommon = [ ...r.uncommon, c]
  }, {common: [], uncommon: []})

}


