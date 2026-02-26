import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Star, MapPin, Calendar, Info } from "lucide-react";
import { format, addDays } from "date-fns";

export default function MobileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 1));

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`);
        const data = await res.json();
        setHotel(data);
      } catch (error) {
        console.error("Failed to fetch hotel", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center">加载中...</div>;
  if (!hotel) return <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center">酒店不存在</div>;

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl pb-20">
      {/* Header */}
      <div className="absolute top-0 w-full z-20 flex justify-between p-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-black/30 rounded-full text-white backdrop-blur-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="p-2 bg-black/30 rounded-full text-white backdrop-blur-sm">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Banner */}
      <div className="relative h-64 overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
          {[1, 2, 3].map((imgId) => (
            <img 
              key={imgId}
              src={`https://picsum.photos/seed/${hotel.id}_${imgId}/800/600`} 
              alt="Hotel" 
              className="w-full h-full object-cover flex-shrink-0 snap-center"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          1/3
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{hotel.name_cn}</h1>
            {hotel.name_en && <p className="text-xs text-gray-500 mt-1">{hotel.name_en}</p>}
          </div>
          <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold flex items-center">
            {hotel.stars} <Star className="w-3 h-3 ml-1 fill-current" />
          </div>
        </div>
        <div className="flex items-center mt-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span className="truncate flex-1">{hotel.address}</span>
          <span className="text-blue-600 font-medium ml-2">地图</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {hotel.facilities ? (
            hotel.facilities.split(',').map((facility: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {facility.trim()}
              </span>
            ))
          ) : (
            ["免费WiFi", "健身房", "游泳池", "餐厅"].map(facility => (
              <span key={facility} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {facility}
              </span>
            ))
          )}
        </div>
        {hotel.nearby && (
          <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <h3 className="text-xs font-bold text-blue-800 mb-1">周边与交通</h3>
            <p className="text-xs text-blue-600/80 leading-relaxed">{hotel.nearby}</p>
          </div>
        )}
      </div>

      {/* Date Picker Banner */}
      <div className="mt-2 bg-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">入住</span>
            <span className="font-bold text-blue-600">{format(checkIn, "MM-dd")}</span>
          </div>
          <div className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
            1晚
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">离店</span>
            <span className="font-bold text-blue-600">{format(checkOut, "MM-dd")}</span>
          </div>
        </div>
        <button className="text-sm font-medium text-gray-900 border-l pl-4 ml-4">修改</button>
      </div>

      {/* Room Types */}
      <div className="mt-2 space-y-2 px-4">
        <h2 className="font-bold text-gray-900 py-2">房型列表</h2>
        {hotel.roomTypes?.map((room: any) => (
          <div key={room.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
            <img 
              src={`https://picsum.photos/seed/room_${room.id}/200/200`} 
              alt={room.name} 
              className="w-20 h-20 rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{room.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{room.description || "大床 | 2人入住 | 免费取消"}</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="text-red-500 font-bold text-lg">
                  <span className="text-xs">¥</span>{room.price}
                </div>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all">
                  预订
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!hotel.roomTypes || hotel.roomTypes.length === 0) && (
          <div className="text-center py-8 text-gray-400 bg-white rounded-xl">暂无房型信息</div>
        )}
      </div>
    </div>
  );
}
