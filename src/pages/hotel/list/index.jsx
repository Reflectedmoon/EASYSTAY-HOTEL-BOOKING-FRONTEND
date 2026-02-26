import { Component } from 'react'
import { View, Text } from '@tarojs/components'

import './index.scss'

export default class HotelList extends Component {
  render() {
    return (
      <View className='hotel-list-page'>
        <View className='header'>
          <Text>酒店列表</Text>
        </View>
        <View className='content'>
          <Text>这里是酒店列表页面，后续将添加筛选和搜索功能</Text>
        </View>
      </View>
    )
  }
}