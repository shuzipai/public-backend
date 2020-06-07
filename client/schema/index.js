const schema_list = {
}

Object.keys(schema_list).forEach((key) => {
  schema_list[key]['router'] = key
})

export default schema_list
