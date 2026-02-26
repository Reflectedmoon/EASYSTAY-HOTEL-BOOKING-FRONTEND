import { Component } from 'react'
import { View, Text } from '@tarojs/components'

import './index.scss'

export default class Index extends Component {
  render() {
    return (
      <View className='index-page'>
        <View className='welcome-section'>
          <Text className='title'>欢迎使用 EasyStay</Text>
          <Text className='subtitle'>酒店预订平台</Text>
        </View>
        
        <View className='features'>
          <Text className='feature-item'>🏨 酒店搜索</Text>
          <Text className='feature-item'>📅 在线预订</Text>
          <Text className='feature-item'>💳 安全支付</Text>
          <Text className='feature-item'>📱 多端支持</Text>
        </View>
      </View>
    )
  }
}