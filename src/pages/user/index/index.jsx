import { Component } from 'react'
import { View, Text } from '@tarojs/components'

import './index.scss'

export default class UserCenter extends Component {
  render() {
    return (
      <View className='user-center-page'>
        <View className='header'>
          <Text>我的</Text>
        </View>
        <View className='content'>
          <Text>这里是个人中心页面，后续将添加用户信息和设置功能</Text>
        </View>
      </View>
    )
  }
}