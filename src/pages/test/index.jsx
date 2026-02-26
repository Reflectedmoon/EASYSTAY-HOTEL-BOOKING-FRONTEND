import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default class TestPage extends Component {
  state = {
    error: null,
    info: null
  }

  componentDidCatch(error, info) {
    console.error('页面错误:', error, info)
    this.setState({ error, info })
  }

  handleTestNavigation = () => {
    Taro.navigateTo({
      url: '/pages/index/index'
    }).catch(err => {
      console.error('导航失败:', err)
    })
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ padding: '20px', backgroundColor: '#ffebee' }}>
          <Text style={{ color: 'red', fontSize: '18px' }}>❌ 页面出错</Text>
          <Text style={{ marginTop: '10px' }}>错误信息: {this.state.error.message}</Text>
          <Text style={{ marginTop: '10px' }}>组件堆栈: {this.state.info.componentStack}</Text>
        </View>
      )
    }

    return (
      <View style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          🧪 EasyStay 测试页面
        </Text>
        
        <View style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>✅ 基础功能测试</Text>
          <Text style={{ color: '#666' }}>如果能看到这个页面，说明：</Text>
          <Text style={{ color: '#666' }}>• Taro 框架正常工作</Text>
          <Text style={{ color: '#666' }}>• React 组件渲染正常</Text>
          <Text style={{ color: '#666' }}>• 页面路由配置正确</Text>
        </View>

        <View style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>🔧 导航测试</Text>
          <Button 
            onClick={this.handleTestNavigation}
            style={{ backgroundColor: '#1890ff', color: 'white', padding: '10px' }}
          >
            跳转到首页
          </Button>
        </View>

        <View style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>📋 环境信息</Text>
          <Text style={{ color: '#666' }}>Taro 版本: 3.6.16</Text>
          <Text style={{ color: '#666' }}>React 版本: 18.2.0</Text>
          <Text style={{ color: '#666' }}>当前路径: {this.$router?.path || '未知'}</Text>
        </View>
      </View>
    )
  }
}