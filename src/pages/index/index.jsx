import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'

import './index.scss'

export default class Index extends Component {
  render() {
    return (
      <View className='index-page'>
        <View className='welcome-section'>
          <Text className='title'>欢迎使用 EasyStay</Text>
          <Text className='subtitle'>酒店预订平台</Text>
        </View>
        
        {/* 测试跳转按钮 */}
        <View className='test-buttons'>
          <Button 
            type='primary' 
            onClick={() => this.navigateTo('/pages/hotel/list/index')}
          >
            🏨 跳转到酒店列表页
          </Button>
          
          <Button 
            type='default' 
            onClick={() => this.navigateTo('/pages/hotel/detail/index')}
            style={{ marginTop: '10px' }}
          >
            📋 跳转到酒店详情页
          </Button>
          
          <Button 
            type='default' 
            onClick={() => this.navigateTo('/pages/order/list/index')}
            style={{ marginTop: '10px' }}
          >
            📋 跳转到订单列表页
          </Button>
          
          <Button 
            type='default' 
            onClick={() => this.navigateTo('/pages/user/index/index')}
            style={{ marginTop: '10px' }}
          >
            👤 跳转到个人中心
          </Button>
        </View>
      </View>
    )
  }
  
  navigateTo(url) {
    // 在 H5 环境下使用原生跳转
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }
}