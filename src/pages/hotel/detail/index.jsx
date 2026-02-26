import { Component } from 'react'
import { View, Text } from '@tarojs/components'

import './index.scss'

export default class HotelDetail extends Component {
  render() {
    return (
      <View className='hotel-detail-page'>
        <View className='header'>
          <Text>酒店详情</Text>
        </View>
        <View className='content'>
          <Text>这里是酒店详情页面，后续将添加酒店信息展示和预订功能</Text>
        </View>
      </View>
    )
  }
}