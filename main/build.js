//
//  Build
//

// const path = require('path')
const u = require('./utilities.js')

function getRuleFiles(ruleDir) {
  return u.listFiles(ruleDir).filter(filename => {
    filename !== 'utils' && filename !== 'index.js'
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
        name: fileName.replace('.js'/g, ''),
        category: ruleMeta.docs.category,
        description: u.capitalize(docs.description),
      }
    })
}

function getRuleNames(ruleData) {
  return ruleData.map( rule => rule.name )
}

function getBaseConfig(baseDir) {
  return u.mergeJSONFiles(baseDir)
}

function buildRuleValues(ruleNames, baseConfig) {

  const baseRuleConfig = baseConfig.rules
  const baseRules = Object.keys(baseRuleConfig)
  const commonRules = u.getCommonKeys(ruleNames, mainRules)

  const blankConfig = ruleNames.reduce( (cfg, rule) => {
    const obj = {}
    obj[rule] = 0

    return Object.assign(cfg, obj)
  }, {})

  return commonRules.reduce( (cfg, rule) => {
    const obj = {}
    obj[rule] = baseRuleConfig[rule]

    return Object.assign(cfg, obj)
  }, blankConfig)
}

function buildOtherConfig(ruleNames, baseConfig) {
  const otherRules = u.getUncommonKeys(baseRules, mainRules)
  const config = { rules: otherRules }
  const newConfig = Object.assign(baseConfig, config )
  const header = u.buildHeader('Other')

  return header + u.formatJSON(newConfig)
}

function formatRuleValue(value) {
  return u.singleToDoubleQuotes(JSON.stringify(value))
}

function buildRuleConfigData(ruleData, ruleValues) {
  const ruleConfig = ruleData.reduce( (data, newData) => {
    const value = formatRuleValue(ruleValues[name])

    const ruleConfig = {}

    ruleConfig[data.name] =
      `${u.wrapText(data.description), '    //  '} \n` +
      u.wrapText(`${data.name} = ${value}`, '    ') + '\n\n'

    return newData[data.type]
      ? newData[data.type] = {
          ...newData[data.type],
          ...ruleConfig
        }
      : newData[data.type = ruleConfig]

  }, {})
}

function build(ruleDir, baseDir) {
  const ruleData = buildRuleData(ruleDir)
  const ruleNames = getRuleNames(ruleData)
  const baseCfg = getBaseConfig(baseDir)
  console.log(' * ' + baseCfg)
  const ruleValues = buildRuleValues(ruleNames, baseCfg)
  console.log(' * ' + ruleValues)
  const otherCfg = buildOtherConfig(ruleNames, baseCfg)



  console.log(' * ' + otherCfg)
}

build('./vendor/lib/rules/', './input')
