import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Filter, Star, MapPin } from "lucide-react";

export default function MobileList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const city = searchParams.get("city") || "北京";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hotels?${searchParams.toString()}`);
        const data = await res.json();
        setHotels(data);
      } catch (error) {
        console.error("Failed to fetch hotels", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [searchParams]);

  const handleSort = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSort);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center px-4 h-12 border-b">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center font-medium truncate px-4">
            {city} {keyword ? `- ${keyword}` : ""}
          </div>
          <div className="w-8" />
        </div>
        
        {/* Core Filters */}
        <div className="flex text-sm border-b">
          <div className="flex-1 py-3 text-center border-r">
            <span className="text-gray-500 text-xs block">入住 / 离店</span>
            <span className="font-medium">{checkIn.slice(5)} - {checkOut.slice(5)}</span>
          </div>
          <div className="flex-1 py-3 text-center flex items-center justify-center gap-1">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>筛选</span>
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="flex text-xs text-gray-600 bg-gray-50 py-2 px-4 gap-4 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => handleSort("")}
            className={`whitespace-nowrap ${sort === "" ? "text-blue-600 font-medium" : ""}`}
          >
            推荐排序
          </button>
          <button 
            onClick={() => handleSort("price_asc")}
            className={`whitespace-nowrap ${sort === "price_asc" ? "text-blue-600 font-medium" : ""}`}
          >
            价格低到高
          </button>
          <button 
            onClick={() => handleSort("price_desc")}
            className={`whitespace-nowrap ${sort === "price_desc" ? "text-blue-600 font-medium" : ""}`}
          >
            价格高到低
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">加载中...</div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-10 text-gray-400">暂无符合条件的酒店</div>
        ) : (
          hotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex cursor-pointer active:scale-[0.98] transition-all"
              onClick={() => navigate(`/hotel/${hotel.id}`)}
            >
              <img 
                src={`https://picsum.photos/seed/${hotel.id}/200/200`} 
                alt={hotel.name_cn} 
                className="w-28 h-32 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{hotel.name_cn}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span>{hotel.stars}星级</span>
                    <span className="mx-1">·</span>
                    <span className="truncate">{hotel.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {["免费取消", "含双早"].map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 border border-blue-200 text-blue-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right mt-2">
                  <span className="text-xs text-gray-400">起</span>
                  <span className="text-lg font-bold text-red-500 ml-1">¥{hotel.price}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
