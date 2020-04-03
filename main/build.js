//
//  Build
//

// const path = require('path')
const u = require('./utilities.js')

function getRuleFiles(ruleDir) {
  return u.listFiles(ruleDir).filter(filename => {
    return filename !== 'utils' && filename !== 'index.js'
  })

}

function buildRuleData(ruleDir) {
  return getRuleFiles(ruleDir)
    .map( fileName => {
      const ruleModule = u.getFileModule(fileName, ruleDir)
      const {type, docs} = ruleModule.meta

      return {
        filename: fileName,
        type: type,
        name: fileName.replace(/.js/g, ''),
        category: docs.category,
        description: u.capitalize(docs.description),
      }
    })
}

function getBaseConfig(baseDir) {
  return u.mergeInputObjects(baseDir)
}

function buildBlankRuleConfig(ruleData) {
  const ruleNames = ruleData.map( rule => rule.name )
  return ruleNames.reduce( (config, rule) => {
    const obj = {}
    obj[rule] = 0

    return Object.assign(config, obj)
  }, {})
}

function buildRuleConfig(blankRuleConfig, baseConfig) {
  const commonRules = u.getCommonKeys(
    blankRuleConfig, baseConfig.rules
  )

  return commonRules.reduce( (config, rule) => {
    const obj = {}
    obj[rule] = baseConfig.rules[rule]

    return Object.assign(config, obj)
  }, blankRuleConfig)
}

function buildOtherConfig(blankRuleConfig, baseConfig) {
  const otherRules = u.getUncommonKeys(
    blankRuleConfig, baseConfig.rules
  )
  const config = { rules: otherRules }
  const newConfig = Object.assign(baseConfig, config )
  const header = u.buildHeader('Other')

  return header + u.formatJSON(newConfig)
}

function buildData(ruleData, ruleConfig) {

  return ruleData.reduce( (newData, data) => {
    const value = ruleConfig[data.name]
    const obj= {}

    obj[data.type] = {}
    obj[data.type][data.name] =
      u.wrapText(data.description, '    //  ') + '\n' +
      u.wrapText(data.name + ' = ' + value, '    ') + '\n\n'

    if (newData[data.type]) {
      obj[data.type] = {
        ...newData[data.type],
        ...obj[data.type]
      }
    }

    return {
      ...newData,
      ...obj
    }

  }, {})
}

function build(ruleDir, baseDir) {
  const ruleData = buildRuleData(ruleDir)
  const baseConfig = getBaseConfig(baseDir)
  const blankRuleConfig = buildBlankRuleConfig(ruleData)
  const ruleConfig = buildRuleConfig(
    blankRuleConfig, baseConfig
  )
  const otherConfig = buildOtherConfig(
    blankRuleConfig, baseConfig
  )
  const data = buildData(ruleData, ruleConfig)

  console.log(data.layout.semi)
}


build('./vendor/lib/rules/', './input')
