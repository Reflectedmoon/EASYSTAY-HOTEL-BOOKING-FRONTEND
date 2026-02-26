import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import SearchBar from '../../components/SearchBar/SearchBar'
import './index.scss'

export default class Index extends Component {
  render() {
    return (
      <View className='index-page'>
        {/* 顶部 Banner 区域 */}
        <View className='banner'>
          <View className='banner-image'>
            <Text className='banner-text'>发现好酒店</Text>
          </View>
        </View>

        {/* 核心查询区域 */}
        <View className='search-area'>
          <SearchBar />
        </View>

        {/* 功能介绍区域 */}
        <View className='features'>
          <Text className='section-title'>快速预订</Text>
          <View className='feature-grid'>
            <View className='feature-card'>
              <Text className='feature-icon'>🏨</Text>
              <Text className='feature-text'>酒店搜索</Text>
            </View>
            <View className='feature-card'>
              <Text className='feature-icon'>📅</Text>
              <Text className='feature-text'>在线预订</Text>
            </View>
            <View className='feature-card'>
              <Text className='feature-icon'>💳</Text>
              <Text className='feature-text'>安全支付</Text>
            </View>
            <View className='feature-card'>
              <Text className='feature-icon'>📱</Text>
              <Text className='feature-text'>多端支持</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}