//
//  Build
//


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
  return ruleData
    .map( rule => rule.name )
    .reduce( (config, rule) => {
      const obj = {}
      obj[rule] = 0

      return Object.assign(config, obj)
    }, {})
}

function buildConfig(blankRuleConfig, baseConfig) {
  return u
    .getCommonKeys(blankRuleConfig, baseConfig.rules)
    .reduce( (config, rule) => {
      const obj = { rules: {} }
      obj.rules[rule] = baseConfig.rules[rule]

      return { rules: { ...config.rules, ...obj.rules } }
    }, { rules: blankRuleConfig })
}

function buildOtherConfig(blankRuleConfig, baseConfig) {
  const config = u
    .getUncommonKeys(blankRuleConfig, baseConfig.rules)
    .reduce( (config, rule) => {
      const obj = { rules: {} }
      obj.rules[rule] = baseConfig.rules[rule]

      return { rules: { ...config.rules, ...obj.rules } }
    }, { rules: {} })

  const module = 'module.exports = ' + u.formatJSON(config)

  return u.buildHeader('Other') + module
}

function buildData(ruleData, ruleConfig) {

  const allData = ruleData.reduce( (newData, data) => {
    const value = ruleConfig.rules[data.name]
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

  return allData
}

function build(ruleDir, baseDir) {
  const ruleData = buildRuleData(ruleDir)
  const baseConfig = getBaseConfig(baseDir)
  const blankRuleConfig = buildBlankRuleConfig(ruleData)
  const config = buildConfig(
    blankRuleConfig, baseConfig
  )
  const otherConfig = buildOtherConfig(
    blankRuleConfig, baseConfig
  )
  const data = buildData(ruleData, config)

  console.log(data)
}

build('./vendor/lib/rules/', './input')
