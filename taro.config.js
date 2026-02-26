const path = require('path')

module.exports = {
  projectName: 'EasyStay-Hotel-Booking',
  date: '2026-02-26',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
    // 添加环境变量定义
    API_BASE_URL: JSON.stringify(process.env.API_BASE_URL || 'http://localhost:3000/api')
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['weui', 'van']
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false
        config: {
          namingPattern: 'global',
          generateScopedName: '[name]_[local]_[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'global',
          generateScopedName: '[name]_[local]_[hash:base64:5]'
        }
      }
    }
  }
}