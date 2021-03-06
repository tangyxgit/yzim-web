

### 目录结构

```
├───sdk/
│   ├───tim-js.js - tim sdk 文件，demo 中未使用，仅供自行集成使用
├───dist/  - 打包编译后的目录
├───public/ - 公共入口
│   ├───debug/ - 用于配置SDKAppID 和 SECRETKEY
│   └───index.html
├───src/ - 源码目录
│   ├───assets/ - 静态资源目录
│   ├───components/ - 组件目录
│   ├───store/ - Vuex Store 目录
│   ├───utils/ - 工具函数目录
│   ├───index.vue - 入口文件
│   ├───main.js - Vue 全局配置
│   └───tim.js - TIM SDK相关
├───_doc/ - 文档相关
├───.eslintignore - eslint 忽略配置
├───babel.config.js - babel 配置
├───package.json
├───README.md
└───vue.config.js - vue-cli@3 配置文件
```

### 启动流程
1. 启动项目

   ```shell
   # 同步依赖
   npm install
   # 启动项目
   npm start
   ```

   > 若同步依赖过程中出现问题，尝试切换 npm 源后重试。
   >
   > ```shell
   > # 切换 cnpm 源
   > npm config set registry http://r.cnpmjs.org/
   > ```
