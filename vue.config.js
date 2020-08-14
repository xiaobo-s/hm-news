const path = require('path')// 引入path模块
function resolve(dir) {
  return path.join(__dirname, dir)// path.join(__dirname)设置绝对路径
}

module.exports = {
  devServer: {
    open: true
  },
  // 别名的配置
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('pages', resolve('./src/pages'))
      .set('assets', resolve('./src/assets'))
    // set第一个参数：设置的别名，第二个参数：设置的路径
  },
  // rem 的配置
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            // 适配 360 屏幕, 设计图720中量出来的尺寸要 / 2
            // 适配 375 屏幕, 设计图750中量出来的尺寸要 / 2
            remUnit: 36
          })
        ]
      }
    }
  }
}
