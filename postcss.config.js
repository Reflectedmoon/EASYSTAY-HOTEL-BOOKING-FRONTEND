module.exports = {
  plugins: {
    'postcss-pxtransform': {
      enable: true,
      config: {
        platform: 'weapp'
      }
    },
    autoprefixer: {
      enable: true
    }
  }
}