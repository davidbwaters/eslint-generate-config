//
//  Build
//

import path from 'path'
import * as util from './utilities.mjs'

const isRule = filename => {
  return filename !== 'utils' && filename !== 'index.js'
}

const getRuleData = (ruleDir) => {
  const ruleFiles = util.listFiles(ruleDir)
    .filter(filename => isRule(filename))

  const data = ruleFiles.map( filename => {

    const modulePromise = util.getModule(filename, ruleDir)

    modulePromise.then( r => {
      const docs = r.default.meta.docs
      const ruleData = {
        filename: filename,
        name: filename.replace('.js', ''),
        category: docs.description.category,
        description: util.capitalize(docs.description),
      }

      console.log(ruleData)

      return r
    })


  })
  //console.log(data)
}

getRuleData('./vendor/lib/rules/')

//console.log(
//  util.getModule('camelcase.js', './vendor/lib/rules')
//)
