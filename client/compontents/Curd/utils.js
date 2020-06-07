function initData(props) {
  const {
    schema,
    utils,
    history: {
      location: { search }
    }
  } = props
  const { attriutes, show_rule } = schema
  const url_params = utils.getQuery(search)

  if (attriutes) {
    let attr = attriutes
    // 如果有search的规则
    if (show_rule && 'create' in show_rule) {
      attr = attriutes.filter(
        (attr) => show_rule.create.indexOf(attr.name) !== -1
      )
      const attr_obj = new Map()
      attr.forEach((atr) => {
        if (url_params && url_params[atr.name]) {
          atr.value = url_params[atr.name]
        }
        attr_obj.set(atr.name, atr)
      })
      return attr_obj
    }
  } else {
    console.warn('schema.attriutes is undefined')
    return new Map()
  }
}

export default {
  initData
}
