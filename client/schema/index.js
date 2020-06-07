const schema_list = {
  user: {
    name: '用户信息',
    icon: 'user-outlined',
    attriutes: [
      {
        name: 'id',
        alias: 'ID',
        type: 'hidden'
      },
      {
        name: 'username',
        alias: '账号',
        type: 'string',
        placeholder: '请输入用户名'
      },
      {
        name: 'password',
        alias: '密码',
        type: 'password',
        placeholder: '请输入密码'
      },
      {
        name: 'phone_number',
        alias: '手机号',
        type: 'string',
        max_length: 11,
        placeholder: '请输入手机号'
      },
      {
        name: 'status',
        alias: '状态',
        type: 'indexof',
        alternatives: [
          {
            name: '全部',
            is_default: true,
            value: null
          },
          {
            name: '启用',
            value: 1
          },
          {
            name: '禁用',
            value: 0
          }
        ],
        placeholder: '账号状态0/1'
      },
      {
        name: 'login_log_count',
        alias: '登录次数',
        type: 'string'
      },
      {
        name: 'push_config',
        alias: '推送配置',
        type: 'object'
      },
      {
        name: 'time',
        alias: '注册时间',
        type: 'datetime'
      }
    ],
    action: ['create', 'update'],
    // 在不同场景下展示哪些属性
    show_rule: {
      index: [
        {
          name: 'username',
          render: (data, record) => (
            <Link to={`/index/follow-company?created_by=${record.id}`}>
              {data}
            </Link>
          )
        },
        'phone_number',
        'status',
        'time',
        {
          name: 'push_config',
          render: (data, record) => {
            if (data) {
              return (
                <div>
                  <p key="1">{data.open ? '开启推送' : '未开启推送'}</p>
                  <p key="2">推送周期: {data.time_type || '空'}</p>
                  <p key="3">风险等级: {data.news_risk || '空'}</p>
                </div>
              )
            }
            return ''
          }
        },
        'login_log_count'
      ],
      search: ['username', 'phone_number', 'status'],
      create: ['id', 'username', 'password', 'phone_number', 'status'],
      update: ['username']
    },
    // 请求创建、更新、读取（列表和单个详情）、删除api
    // 如果不设定参数，则按照restful的规范
    // 例如：create = /user/create
    curd_api: {
      create: '/user/create',
      update: '/user/update',
      index: '/user/index',
      delete: '/user/delete',
      view: '/user/view'
    }
  }
}

Object.keys(schema_list).forEach((key) => {
  schema_list[key]['router'] = key
})

export default schema_list
