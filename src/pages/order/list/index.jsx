import { Component } from 'react'
import { View, Text } from '@tarojs/components'

import './index.scss'

export default class OrderList extends Component {
  render() {
    return (
      <View className='order-list-page'>
        <View className='header'>
          <Text>我的订单</Text>
        </View>
        <View className='content'>
          <Text>这里是订单列表页面，后续将添加订单管理功能</Text>
        </View>
      </View>
    )
  }
}