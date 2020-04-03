//
// Utilities
//

const fs = require('fs')
const path = require('path')
const deepmerge = require('merge-deep')
const wrap = require('word-wrap')

exports.capitalize = str => {
  if (typeof str !== 'string') return ''

  return str.charAt(0).toUpperCase() + str.slice(1)
}

exports.singleToDoubleQts = str => {
  str.replace(/"/g, '\'')
}

exports.formatJSON = obj => {
  return JSON.stringify(obj, null, 4)
}

exports.wrapText = (text, pre = '// ', ln = 60) => {
  const width = ln - pre.length

  return wrap(text, {width: width, indent: pre})
}

exports.listFiles = dirPath => {
  return fs.readdirSync(dirPath)
}

exports.getFileModule= (filename, dirPath =__dirname) => {
  const filePath = path.resolve(dirPath, filename)

  return require(filePath)
}

exports.mergeInputObjects = dirPath => {
  const files = exports.listFiles(dirPath)

  const objects = files.map(f => {
    return f.slice(-5) == '.json' || f.slice(-3) == '.js'
      ? require(path.resolve(dirPath, f))
      : {}
  })

  return deepmerge(...objects)
}

exports.getCommonKeys = (o1, o2) => {
  const k1 = Object.keys(o1)
  const k2 = Object.keys(o2)

  const isAscending = k1.length < k2.length
  const [keys, obj] = isAscending ? [k2, o1] : [k1, o2]

  return keys.filter( key => key in obj )
}

exports.getUncommonKeys = (o1, o2) => {
  const k1 = Object.keys(o1)
  const k2 = Object.keys(o2)

  const uc1 = k1.filter( k => !(k in o2))
  const uc2 = k2.filter( k => !(k in o1))

  return [...uc1, ...uc2]
}

exports.buildHeader = str => `//\n//${str}\n//\n\n`

const a = {cock: 2, balls: 3, pussy: 1, cup: 4}
const b = {balls: 4, cup: 2, plant: 3}
