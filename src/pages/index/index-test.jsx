import { Component } from 'react'
import { View, Text } from '@tarojs/components'

export default class TestPage extends Component {
  render() {
    return (
      <View style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Text style={{ fontSize: '24px', color: 'red', fontWeight: 'bold' }}>TEST PAGE - 基础功能正常！</Text>
        <Text style={{ marginTop: '20px', fontSize: '16px' }}>如果看到这个页面，说明Taro基础环境正常</Text>
        <Text style={{ marginTop: '20px', fontSize: '16px' }}>请检查您的首页文件是否有语法错误</Text>
      </View>
    )
  }
}