# 项目搭建依赖脚手架：[meikeyun-create-app](https://gitee.com/shuzipai/meikeyun-create-app)
一个我自己造的轮子，当初是以学习为主创造的，但是用着还可以，就用了一两年  

# 基础配置：./client/worker/define.js  
里面有注释，可以直接去注释里查看  
配置好这个文件，就可以实现登录功能  

# 数据表配置：./client/schema/index.js
此文件回返回一个schema对象，对象的属性代表一张表  
attriutes：表字段属性，标记表内字段的名称、属性、以及在设置值的时候显示成什么(placeholder)  
action：操作行文，包括：create、update、view、delete  
show_rule：展示规则，在不同的操作里展示出来的字段或者可操作的字段  
curd_api：操作数据使用的api，这里遵从restfulapi的规范：GET index、GET view、POST create、GET delete（也没有完全照搬method）  

当你设置好以上内容，这个后台管理系统就会正常运转了，虽然目前提供的功能并不完善，但是随着开发，这种通用的后台管理系统会极大程度的较少前端开发的成本，代码书写的不好、存在的BUG、规范不优秀、配置文件零散、运行效率低、各种问题都是可以优化，但是相比于强调的功能，这些是可以滞后的，也欢迎有人提意见，如果有人来看的话...  