import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Save, Plus, Trash2, Building2, LayoutDashboard, LogOut, Info, BedDouble } from "lucide-react";

export default function AdminHotelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name_cn: "",
    name_en: "",
    address: "",
    stars: 3,
    price: 0,
    opening_time: "",
    facilities: "",
    nearby: "",
    roomTypes: [{ name: "", price: 0, capacity: 2, description: "" }]
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/admin/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    if (isEdit) {
      fetchHotel();
    }
  }, [id, navigate]);

  const fetchHotel = async () => {
    try {
      const res = await fetch(`/api/hotels/${id}`);
      const data = await res.json();
      setFormData({
        name_cn: data.name_cn,
        name_en: data.name_en || "",
        address: data.address,
        stars: data.stars,
        price: data.price,
        opening_time: data.opening_time,
        facilities: data.facilities || "",
        nearby: data.nearby || "",
        roomTypes: data.roomTypes && data.roomTypes.length > 0 ? data.roomTypes : [{ name: "", price: 0, capacity: 2, description: "" }]
      });
    } catch (error) {
      console.error("Failed to fetch hotel", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (index: number, field: string, value: any) => {
    const newRooms = [...formData.roomTypes];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setFormData(prev => ({ ...prev, roomTypes: newRooms }));
  };

  const addRoom = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { name: "", price: 0, capacity: 2, description: "" }]
    }));
  };

  const removeRoom = (index: number) => {
    const newRooms = formData.roomTypes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, roomTypes: newRooms }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEdit ? `/api/merchant/hotels/${id}` : "/api/merchant/hotels";
      const method = isEdit ? "PUT" : "POST";
      const body = { ...formData, merchant_id: user.id };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        navigate("/admin/dashboard");
      } else {
        alert("保存失败");
      }
    } catch (error) {
      console.error("Failed to save hotel", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans pb-20">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 bg-slate-950 text-white font-bold text-lg tracking-wide border-b border-slate-800">
          <Building2 className="w-6 h-6 mr-2 text-blue-500" />
          易宿管理系统
        </div>
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2 px-2">菜单</div>
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            工作台
          </Link>
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3 shadow-inner">
              {user.username[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{user.username}</div>
              <div className="text-xs text-slate-400 mt-0.5">{user.role === 'admin' ? '平台管理员' : '入驻商户'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <LogOut className="w-4 h-4 mr-3" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? "编辑酒店信息" : "录入新酒店"}
          </h1>
        </header>

        {/* Form Area */}
        <div className="p-8 max-w-5xl mx-auto w-full">
          <form id="hotel-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info Card */}
            <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
                <Info className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-bold text-slate-800">基础信息</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">酒店名称 (中文) <span className="text-red-500">*</span></label>
                  <input required type="text" name="name_cn" value={formData.name_cn} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white" placeholder="请输入酒店中文名称" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">酒店名称 (英文)</label>
                  <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white" placeholder="请输入酒店英文名称" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">详细地址 <span className="text-red-500">*</span></label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white" placeholder="请输入酒店详细地址" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">酒店星级 <span className="text-red-500">*</span></label>
                  <select name="stars" value={formData.stars} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white">
                    {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} 星级</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">起步价格 (¥) <span className="text-red-500">*</span></label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">开业时间 <span className="text-red-500">*</span></label>
                  <input required type="date" name="opening_time" value={formData.opening_time} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">酒店设施 (用逗号分隔)</label>
                  <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white" placeholder="如：免费WiFi, 健身房, 游泳池, 餐厅" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">周边景点/交通</label>
                  <input type="text" name="nearby" value={formData.nearby} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white" placeholder="如：距离地铁站500米，靠近天安门广场" />
                </div>
              </div>
            </div>

            {/* Room Types Card */}
            <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center">
                  <BedDouble className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-bold text-slate-800">房型管理</h2>
                </div>
                <button type="button" onClick={addRoom} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-4 h-4 mr-1" /> 添加房型
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {formData.roomTypes.map((room, index) => (
                  <div key={index} className="flex flex-wrap gap-4 items-start bg-slate-50 p-5 rounded-xl border border-slate-200 relative group">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">房型名称</label>
                      <input required type="text" value={room.name} onChange={e => handleRoomChange(index, "name", e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" placeholder="如：豪华大床房" />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">价格 (¥)</label>
                      <input required type="number" value={room.price} onChange={e => handleRoomChange(index, "price", Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">容纳人数</label>
                      <input required type="number" value={room.capacity} onChange={e => handleRoomChange(index, "capacity", Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">房型描述</label>
                      <input type="text" value={room.description} onChange={e => handleRoomChange(index, "description", e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" placeholder="如：含双早，免费取消" />
                    </div>
                    {formData.roomTypes.length > 1 && (
                      <div className="pt-7">
                        <button type="button" onClick={() => removeRoom(index)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="删除房型">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-slate-200 p-4 px-8 flex justify-end gap-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
          取消返回
        </button>
        <button type="submit" form="hotel-form" className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center shadow-md transition-all active:scale-[0.98]">
          <Save className="w-5 h-5 mr-2" /> 
          {isEdit ? "保存修改" : "保存并提交审核"}
        </button>
      </div>
    </div>
  );
}
