import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Star, Tag } from "lucide-react";
import { format, addDays } from "date-fns";

export default function MobileHome() {
  const navigate = useNavigate();
  const [city, setCity] = useState("北京");
  const [keyword, setKeyword] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 1));
  const [stars, setStars] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (keyword) params.append("keyword", keyword);
    if (stars) params.append("stars", stars);
    params.append("checkIn", format(checkIn, "yyyy-MM-dd"));
    params.append("checkOut", format(checkOut, "yyyy-MM-dd"));
    navigate(`/list?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl">
      {/* Banner */}
      <div 
        className="h-48 bg-cover bg-center relative cursor-pointer"
        style={{ backgroundImage: "url('https://picsum.photos/seed/hotel/800/400')" }}
        onClick={() => navigate("/hotel/1")}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold">易宿精选</h1>
          <p className="text-sm opacity-90">发现更多美好旅程</p>
        </div>
      </div>

      {/* Search Card */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-5">
          {/* Location & Keyword */}
          <div className="flex items-center border-b pb-3">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 outline-none font-medium text-lg"
              placeholder="目的地/城市"
            />
            <div className="h-6 w-px bg-gray-200 mx-3" />
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="酒店名/地标"
            />
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">入住</p>
              <input 
                type="date" 
                value={format(checkIn, "yyyy-MM-dd")}
                onChange={(e) => setCheckIn(new Date(e.target.value))}
                className="outline-none font-medium text-lg w-full bg-transparent"
              />
            </div>
            <div className="px-4 text-xs text-gray-400 border border-gray-200 rounded-full py-1">
              1晚
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs text-gray-500 mb-1">离店</p>
              <input 
                type="date" 
                value={format(checkOut, "yyyy-MM-dd")}
                onChange={(e) => setCheckOut(new Date(e.target.value))}
                className="outline-none font-medium text-lg w-full bg-transparent text-right"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center border-b pb-3">
            <Star className="w-5 h-5 text-gray-400 mr-2" />
            <select 
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            >
              <option value="">星级不限</option>
              <option value="5">五星级/豪华</option>
              <option value="4">四星级/高档</option>
              <option value="3">三星级/舒适</option>
            </select>
          </div>

          {/* Quick Tags */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["亲子", "豪华", "免费停车", "近地铁", "含早"].map(tag => (
              <button 
                key={tag}
                onClick={() => setKeyword(tag)}
                className="whitespace-nowrap px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            查找酒店
          </button>
        </div>
      </div>
    </div>
  );
}
