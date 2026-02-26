import { Component } from 'react'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

// 内联 HotelCard 组件（添加点击事件，修正 Image 使用）
const HotelCard = ({ hotel, onClick }) => {
  return (
    <View className='hotel-card' onClick={() => onClick(hotel)}>
      {/* 酒店图片 - 使用 CSS 背景图片避免 Image 构造函数错误 */}
      <View className='hotel-image'>
        <View 
          className='hotel-image-inner'
          style={{ 
            backgroundImage: `url(${hotel.image || 'https://via.placeholder.com/200x150?text=酒店图片'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '150px'
          }}
        />
      </View>
      
      {/* 酒店信息 */}
      <View className='hotel-info'>
        <View className='hotel-header'>
          <Text className='hotel-name'>{hotel.name || '酒店名称'}</Text>
          <View className='hotel-rating'>
            <Text className='rating-star'>★</Text>
            <Text className='rating-value'>{hotel.rating || '4.5'}</Text>
            <Text className='rating-count'>({hotel.reviewCount || '128'})</Text>
          </View>
        </View>
        
        <Text className='hotel-location'>{hotel.address || '北京市朝阳区XX路123号'}</Text>
        
        <View className='hotel-footer'>
          <Text className='hotel-price'>¥{hotel.price || '388'}</Text>
          <Text className='hotel-stars'>⭐{hotel.stars || '4'}</Text>
          <Text className='hotel-facilities'>{hotel.facilities || '免费WiFi, 停车场'}</Text>
        </View>
      </View>
    </View>
  )
}

export default class HotelList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 从URL参数获取筛选条件
      location: props.$router?.params?.location || '北京',
      keyword: props.$router?.params?.keyword || '',
      checkInDate: props.$router?.params?.checkInDate || this.getDefaultDate(0),
      checkOutDate: props.$router?.params?.checkOutDate || this.getDefaultDate(1),
      tags: (props.$router?.params?.tags || '').split(',').filter(t => t),
      
      // 筛选条件
      priceRange: '',
      stars: '',
      facilities: [],
      
      // 列表数据
      hotels: [],
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      
      // 排序
      sortBy: 'price',
      sortOrder: 'asc'
    }
  }

  getDefaultDate(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  componentDidMount() {
    this.loadHotels()
  }

  loadHotels = () => {
    if (this.state.loading || !this.state.hasMore) return
    
    this.setState({ loading: true })
    
    // 模拟API调用
    setTimeout(() => {
      const mockHotels = [
        {
          id: 1,
          name: '北京国贸洲际酒店',
          image: 'https://via.placeholder.com/200x150?text=国贸洲际',
          rating: 4.8,
          reviewCount: 2345,
          address: '北京市朝阳区建国门外大街1号',
          price: 888,
          stars: 5,
          facilities: '免费WiFi, 停车场, 游泳池, 健身房',
          distance: '1.2km'
        },
        {
          id: 2,
          name: '北京王府井希尔顿酒店',
          image: 'https://via.placeholder.com/200x150?text=王府井希尔顿',
          rating: 4.6,
          reviewCount: 1876,
          address: '北京市东城区王府井大街98号',
          price: 658,
          stars: 5,
          facilities: '免费WiFi, 停车场, 餐厅',
          distance: '0.8km'
        },
        {
          id: 3,
          name: '北京如家快捷酒店',
          image: 'https://via.placeholder.com/200x150?text=如家快捷',
          rating: 4.2,
          reviewCount: 3421,
          address: '北京市海淀区中关村大街123号',
          price: 288,
          stars: 3,
          facilities: '免费WiFi, 空调',
          distance: '2.5km'
        },
        {
          id: 4,
          name: '北京汉庭酒店',
          image: 'https://via.placeholder.com/200x150?text=汉庭酒店',
          rating: 4.0,
          reviewCount: 2156,
          address: '北京市朝阳区三里屯路45号',
          price: 228,
          stars: 2,
          facilities: '免费WiFi',
          distance: '1.5km'
        },
        {
          id: 5,
          name: '北京全季酒店',
          image: 'https://via.placeholder.com/200x150?text=全季酒店',
          rating: 4.5,
          reviewCount: 1543,
          address: '北京市西城区金融街123号',
          price: 388,
          stars: 4,
          facilities: '免费WiFi, 停车场',
          distance: '0.5km'
        }
      ]

      // 根据排序条件处理数据
      let sortedHotels = [...mockHotels]
      if (this.state.sortBy === 'price') {
        sortedHotels.sort((a, b) => 
          this.state.sortOrder === 'asc' ? a.price - b.price : b.price - a.price
        )
      } else if (this.state.sortBy === 'rating') {
        sortedHotels.sort((a, b) => 
          this.state.sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
        )
      }

      // 分页处理
      const startIndex = (this.state.currentPage - 1) * this.state.pageSize
      const endIndex = startIndex + this.state.pageSize
      const pageHotels = sortedHotels.slice(startIndex, endIndex)

      this.setState({
        hotels: this.state.currentPage === 1 ? pageHotels : [...this.state.hotels, ...pageHotels],
        currentPage: this.state.currentPage + 1,
        hasMore: endIndex < sortedHotels.length,
        loading: false
      })
    }, 800)
  }

  handleSortChange = (sortField) => {
    const { sortBy, sortOrder } = this.state
    this.setState({
      sortBy: sortField,
      sortOrder: sortBy === sortField && sortOrder === 'asc' ? 'desc' : 'asc'
    }, this.loadHotels)
  }

  handleFilterChange = (type, value) => {
    this.setState({ [type]: value }, this.loadHotels)
  }

  handleFacilityToggle = (facility) => {
    const { facilities } = this.state
    const newFacilities = facilities.includes(facility) 
      ? facilities.filter(f => f !== facility)
      : [...facilities, facility]
    this.setState({ facilities: newFacilities }, this.loadHotels)
  }

  handleScrollToLower = () => {
    if (!this.state.loading && this.state.hasMore) {
      this.loadHotels()
    }
  }

  // 修正跳转路径：使用最可靠的相对路径格式
  handleHotelClick = (hotel) => {
    // 使用标准的跳转格式
    Taro.navigateTo({
      url: `/pages/hotel/detail/index?id=${hotel.id}&name=${encodeURIComponent(hotel.name)}&checkInDate=${this.state.checkInDate}&checkOutDate=${this.state.checkOutDate}`
    }).catch(err => {
      console.error('跳转失败:', err);
      // 如果跳转失败，尝试简单跳转
      Taro.redirectTo({
        url: '/pages/hotel/detail/index'
      })
    });
  }

  render() {
    const { 
      location, keyword, checkInDate, checkOutDate, tags,
      hotels, loading, hasMore,
      sortBy, sortOrder
    } = this.state

    // 筛选条件选项
    const priceRanges = ['¥0-200', '¥200-500', '¥500-1000', '¥1000+']
    const starsOptions = ['全部', '2星', '3星', '4星', '5星']
    const facilitiesOptions = ['免费WiFi', '停车场', '游泳池', '健身房', '餐厅', '早餐']

    return (
      <View className='hotel-list-page'>
        {/* 顶部筛选条件区域 */}
        <View className='filter-header'>
          <Text className='filter-title'>筛选条件</Text>
          <View className='filter-options'>
            <View className='filter-item'>
              <Text className='filter-label'>城市</Text>
              <Text className='filter-value'>{location}</Text>
            </View>
            <View className='filter-item'>
              <Text className='filter-label'>入住日期</Text>
              <Text className='filter-value'>{checkInDate}</Text>
            </View>
            <View className='filter-item'>
              <Text className='filter-label'>离店日期</Text>
              <Text className='filter-value'>{checkOutDate}</Text>
            </View>
            <View className='filter-item'>
              <Text className='filter-label'>入住间夜</Text>
              <Text className='filter-value'>1晚</Text>
            </View>
            <View className='filter-item'>
              <Text className='filter-label'>搜索设置</Text>
              <Text className='filter-value'>{keyword || '无'}</Text>
            </View>
          </View>
        </View>

        {/* 详细筛选区域 */}
        <View className='filter-panel'>
          <View className='filter-section'>
            <Text className='section-title'>价格区间</Text>
            <View className='filter-items'>
              {priceRanges.map(range => (
                <Text
                  key={range}
                  className={`filter-item ${this.state.priceRange === range ? 'active' : ''}`}
                  onClick={() => this.handleFilterChange('priceRange', range)}
                >
                  {range}
                </Text>
              ))}
            </View>
          </View>

          <View className='filter-section'>
            <Text className='section-title'>星级</Text>
            <View className='filter-items'>
              {starsOptions.map(star => (
                <Text
                  key={star}
                  className={`filter-item ${this.state.stars === star ? 'active' : ''}`}
                  onClick={() => this.handleFilterChange('stars', star)}
                >
                  {star}
                </Text>
              ))}
            </View>
          </View>

          <View className='filter-section'>
            <Text className='section-title'>设施</Text>
            <View className='filter-items'>
              {facilitiesOptions.map(facility => (
                <Text
                  key={facility}
                  className={`filter-item ${this.state.facilities.includes(facility) ? 'active' : ''}`}
                  onClick={() => this.handleFacilityToggle(facility)}
                >
                  {facility}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* 酒店列表 */}
        <View className='hotel-list'>
          <View className='hotel-list-header'>
            <Text className='hotel-count'>{hotels.length}家酒店</Text>
            <View className='sort-controls'>
              <Text
                className={`sort-item ${sortBy === 'price' ? 'active' : ''}`}
                onClick={() => this.handleSortChange('price')}
              >
                价格{sortBy === 'price' && sortOrder === 'asc' ? '↑' : sortBy === 'price' && sortOrder === 'desc' ? '↓' : ''}
              </Text>
              <Text
                className={`sort-item ${sortBy === 'rating' ? 'active' : ''}`}
                onClick={() => this.handleSortChange('rating')}
              >
                评分{sortBy === 'rating' && sortOrder === 'asc' ? '↑' : sortBy === 'rating' && sortOrder === 'desc' ? '↓' : ''}
              </Text>
            </View>
          </View>

          {/* 酒店列表项 */}
          <ScrollView
            className='hotel-items'
            scrollY
            onScrollToLower={this.handleScrollToLower}
          >
            {hotels.length > 0 ? (
              hotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onClick={this.handleHotelClick}
                />
              ))
            ) : (
              <View className='empty-state'>
                <Text className='empty-icon'>🏨</Text>
                <Text className='empty-text'>暂无符合条件的酒店</Text>
              </View>
            )}
          </ScrollView>

          {/* 加载更多 */}
          {loading && (
            <View className='load-more'>
              <Text>加载中...</Text>
            </View>
          )}
          {!loading && hasMore && (
            <View className='load-more'>
              <Text>上滑加载更多</Text>
            </View>
          )}
        </View>
      </View>
    )
  }
}