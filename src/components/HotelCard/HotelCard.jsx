import { View, Text, Image } from '@tarojs/components'

const HotelCard = ({ hotel }) => {
  return (
    <View className='hotel-card'>
      {/* 酒店图片 */}
      <View className='hotel-image'>
        <Image 
          src={hotel.image || 'https://via.placeholder.com/200x150?text=酒店图片'} 
          mode='aspectFill'
          className='hotel-image-inner'
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

export default HotelCard