import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: '北京',
      keyword: '',
      checkInDate: this.getDefaultDate(0),
      checkOutDate: this.getDefaultDate(1),
      stars: '',
      priceRange: '',
      selectedTags: []
    }
  }

  getDefaultDate(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  handleLocationSelect = () => {
    Taro.showActionSheet({
      itemList: ['北京', '上海', '广州', '深圳', '杭州'],
      success: (res) => {
        if (res.tapIndex !== -1) {
          this.setState({ location: res.itemList[res.tapIndex] })
        }
      }
    })
  }

  handleKeywordChange = (e) => {
    this.setState({ keyword: e.detail.value })
  }

  handleDateChange = (type, value) => {
    this.setState({ [type]: value })
  }

  handleTagToggle = (tag) => {
    const { selectedTags } = this.state
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    this.setState({ selectedTags: newTags })
  }

  handleSearch = () => {
    const { location, keyword, checkInDate, checkOutDate, selectedTags } = this.state
    
    // 构建查询参数
    const params = {
      location,
      keyword,
      checkInDate,
      checkOutDate,
      tags: selectedTags.join(',')
    }

    // 跳转到酒店列表页
    Taro.navigateTo({
      url: `/pages/hotel/list/index?${new URLSearchParams(params).toString()}`
    })
  }

  render() {
    const { location, keyword, checkInDate, checkOutDate, selectedTags } = this.state
    const quickTags = ['亲子', '豪华', '免费停车场', '泳池', '健身房', '商务']

    return (
      <View className='search-bar'>
        {/* 当前地点选择 */}
        <View className='location-select' onClick={this.handleLocationSelect}>
          <Text className='location-icon'>📍</Text>
          <Text className='location-text'>{location}</Text>
          <Text className='location-arrow'>▼</Text>
        </View>

        {/* 关键字搜索 */}
        <View className='search-input'>
          <Input
            type='text'
            placeholder='搜索酒店、景点、地标...'
            value={keyword}
            onInput={this.handleKeywordChange}
            className='search-input-field'
          />
        </View>

        {/* 日期选择 */}
        <View className='date-select'>
          <View className='date-item'>
            <Text>入住</Text>
            <Picker mode='date' value={checkInDate} onChange={(e) => this.handleDateChange('checkInDate', e.detail.value)}>
              <Text className='date-value'>{checkInDate}</Text>
            </Picker>
          </View>
          <View className='date-item'>
            <Text>离店</Text>
            <Picker mode='date' value={checkOutDate} onChange={(e) => this.handleDateChange('checkOutDate', e.detail.value)}>
              <Text className='date-value'>{checkOutDate}</Text>
            </Picker>
          </View>
        </View>

        {/* 快捷标签 */}
        <View className='quick-tags'>
          {quickTags.map(tag => (
            <Text
              key={tag}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => this.handleTagToggle(tag)}
            >
              {tag}
            </Text>
          ))}
        </View>

        {/* 查询按钮 */}
        <View className='search-button-container'>
          <Button
            className='search-button'
            onClick={this.handleSearch}
          >
            搜索酒店
          </Button>
        </View>
      </View>
    )
  }
}