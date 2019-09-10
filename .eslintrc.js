module.exports={
    root:true, //是否是 跟配置
    parserOptions:{
        sourceType:"module",
        ecmaVersion:"es2015"
    },
    env: {
        browser: true,
        node:true
    },
    // 启用的规则及其各自的错误级别
    rules: {
        "indent": ["error", 4],//缩进风格
        "quotes": ["error", "double"],//引号类型 
        "semi": ["error", "always"],//关闭语句强制分号结尾
        "no-console": "error",//禁止使用console
        "arrow-parens": 0 //箭头函数用小括号括起来
    }
}