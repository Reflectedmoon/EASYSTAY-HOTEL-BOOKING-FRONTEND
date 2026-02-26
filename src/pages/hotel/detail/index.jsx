import { Component } from 'react'
import { View, Text, ScrollView, Picker, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

// 内联房型卡片组件
const RoomCard = ({ room }) => {
  return (
    <View className='room-card'>
      <View className='room-header'>
        <Text className='room-name'>{room.name || '标准大床房'}</Text>
        <Text className='room-price'>¥{room.price || '388'}</Text>
      </View>
      <View className='room-info'>
        <Text className='room-detail'>床型: {room.bedType || '1.8m大床'}</Text>
        <Text className='room-detail'>面积: {room.area || '25㎡'}</Text>
        <Text className='room-detail'>可住: {room.guests || '2人'}</Text>
      </View>
      <View className='room-facilities'>
        {room.facilities && room.facilities.split(',').map((facility, index) => (
          <Text key={index} className='facility-tag'>{facility}</Text>
        ))}
      </View>
      <View className='room-actions'>
        <Text className='book-btn'>立即预订</Text>
      </View>
    </View>
  )
}

export default class HotelDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 从URL参数获取酒店信息
      hotel: {
        id: props.$router?.params?.id || 1,
        name: props.$router?.params?.name || '北京国贸洲际酒店',
        images: [
          'https://via.placeholder.com/750x400?text=酒店外观',
          'https://via.placeholder.com/750x400?text=豪华客房',
          'https://via.placeholder.com/750x400?text=游泳池',
          'https://via.placeholder.com/750x400?text=餐厅'
        ],
        rating: 4.8,
        reviewCount: 2345,
        address: '北京市朝阳区建国门外大街1号',
        facilities: '免费WiFi, 停车场, 游泳池, 健身房, 餐厅',
        stars: 5,
        distance: '1.2km'
      },
      
      // 日期选择
      checkInDate: this.getDefaultDate(0),
      checkOutDate: this.getDefaultDate(1),
      nights: 1,
      
      // 房型数据
      rooms: [
        {
          id: 1,
          name: '标准大床房',
          price: 388,
          bedType: '1.8m大床',
          area: '25㎡',
          guests: '2人',
          facilities: '免费WiFi, 空调, 电视'
        },
        {
          id: 2,
          name: '豪华双床房',
          price: 588,
          bedType: '1.5m双床',
          area: '30㎡',
          guests: '2人',
          facilities: '免费WiFi, 空调, 电视, 迷你吧'
        },
        {
          id: 3,
          name: '行政套房',
          price: 888,
          bedType: '2.0m大床',
          area: '45㎡',
          guests: '3人',
          facilities: '免费WiFi, 空调, 电视, 迷你吧, 行政酒廊'
        }
      ].sort((a, b) => a.price - b.price), // 按价格从低到高排序
      
      // 当前轮播索引
      currentSwiperIndex: 0
    }
  }

  getDefaultDate(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  handleDateChange = (type, value) => {
    this.setState({ [type]: value }, () => {
      // 计算入住间夜
      const checkIn = new Date(this.state.checkInDate)
      const checkOut = new Date(this.state.checkOutDate)
      const diffDays = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      this.setState({ nights: diffDays > 0 ? diffDays : 1 })
    })
  }

  handleSwiperChange = (e) => {
    this.setState({ currentSwiperIndex: e.detail.current })
  }

  handleBookRoom = (roomId) => {
    Taro.showToast({
      title: '预订成功',
      icon: 'success'
    })
  }

  render() {
    const { hotel, checkInDate, checkOutDate, nights, rooms, currentSwiperIndex } = this.state

    return (
      <View className='hotel-detail-page'>
        {/* 顶部导航栏 */}
        <View className='detail-header'>
          <View className='back-button' onClick={() => Taro.navigateBack()}>
            <Text>←</Text>
          </View>
          <Text className='hotel-title'>{hotel.name}</Text>
          <View className='empty-space'></View>
        </View>

        {/* 大图 Banner - 使用 CSS 背景图片避免 Image 构造函数错误 */}
        <View className='banner-section'>
          {hotel.images.length > 0 && (
            <Swiper 
              className='banner-swiper'
              indicatorDots
              indicatorColor='rgba(255,255,255,0.5)'
              indicatorActiveColor='#ffffff'
              autoplay
              interval={3000}
              circular
              onChange={this.handleSwiperChange}
            >
              {hotel.images.map((image, index) => (
                <SwiperItem key={index} className='swiper-item'>
                  <View 
                    className='banner-image'
                    style={{ 
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '280px'
                    }}
                  />
                </SwiperItem>
              ))}
            </Swiper>
          )}
          <View className='swipe-indicator'>
            <Text>{currentSwiperIndex + 1}/{hotel.images.length}</Text>
          </View>
        </View>

        {/* 酒店基础信息 */}
        <View className='hotel-info-section'>
          <View className='hotel-basic-info'>
            <View className='hotel-name'>
              <Text className='name'>{hotel.name}</Text>
              <View className='rating'>
                <Text className='star'>★</Text>
                <Text className='score'>{hotel.rating}</Text>
                <Text className='reviews'>({hotel.reviewCount})</Text>
              </View>
            </View>
            
            <View className='hotel-address'>
              <Text className='location-icon'>📍</Text>
              <Text className='address'>{hotel.address}</Text>
            </View>
            
            <View className='hotel-facilities'>
              <Text className='facilities-label'>设施:</Text>
              <Text className='facilities-list'>{hotel.facilities}</Text>
            </View>
          </View>
        </View>

        {/* 日历 + 入住间夜选择区域 */}
        <View className='date-section'>
          <View className='date-picker'>
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
          
          <View className='nights-info'>
            <Text>入住 {nights} 晚</Text>
          </View>
        </View>

        {/* 房型价格列表 */}
        <View className='room-list-section'>
          <View className='section-title'>
            <Text>房型价格</Text>
            <Text className='sort-tip'>价格从低到高</Text>
          </View>
          
          <View className='room-list'>
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </View>
        </View>

        {/* 底部固定按钮 */}
        <View className='fixed-bottom'>
          <View className='price-summary'>
            <Text>总价: ¥{rooms.length > 0 ? rooms[0].price : 388} × {nights}晚</Text>
            <Text className='total-price'>¥{rooms.length > 0 ? rooms[0].price * nights : 388}</Text>
          </View>
          <View className='book-button' onClick={() => this.handleBookRoom(1)}>
            <Text>立即预订</Text>
          </View>
        </View>
      </View>
    )
  }
}