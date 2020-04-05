//
//  Build
//


const u = require('./utilities.js')
// const deepmerge = require('merge-deep')

function getRuleFiles(ruleDir) {
  return u.listFiles(ruleDir).filter(filename => {
    return filename !== 'utils' && filename !== 'index.js'
  })
}

function getBaseConfig(baseDir) {
  return u.mergeInputObjects(baseDir)
}

function buildRuleData(ruleDir, baseConfig) {
  return getRuleFiles(ruleDir)
    .reduce( (data, fileName) => {
      const meta = u.getFileModule(fileName, ruleDir).meta
      const obj = Object.assign({}, data)
      const name = fileName.replace(/.js/g, '')
      const description = u.capitalize(docs.description)

      if (!obj[meta.docs.category]) {
        obj[meta.docs.category] = {}
      }

      obj[meta.docs.category][name] = concat(
        u.wrapText(data.description, '    //  ') + '\n',
        u.wrapText(data.name + ' = ' + value, '    '),
        '\n\n'
      )

      return obj
    }, {})
}

function buildConfig(blankConfig, baseConfig) {
  return u
    .getCommonKeys(blankConfig, baseConfig.rules)
    .reduce( (config, rule) => {

      const obj = { rules: {} }
      obj.rules[rule] = baseConfig.rules[rule]

      return { rules: { ...config.rules, ...obj.rules } }
    }, { rules: blankConfig })
}

function buildOtherConfig(blankConfig, baseConfig) {
  const config = u
    .getUncommonKeys(blankConfig, baseConfig.rules)
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
    const obj= {

    }



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

  }, [])

  return allData
}

function build(ruleDir, baseDir) {
  const ruleData = buildRuleData(ruleDir)
  const baseConfig = getBaseConfig(baseDir)
  const blankConfig = buildblankConfig(ruleData)
  const config = buildConfig(
    blankConfig, baseConfig
  )
  const otherConfig = buildOtherConfig(
    blankConfig, baseConfig
  )
  const data = buildData(ruleData, config)


}

build('./vendor/lib/rules/', './input')
