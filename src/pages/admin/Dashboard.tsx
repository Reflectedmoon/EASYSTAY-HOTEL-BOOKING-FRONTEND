import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Edit, CheckCircle, XCircle, LogOut, Building2, LayoutDashboard, Search, Filter, AlertCircle, Hotel } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/admin/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchHotels(parsedUser);
  }, [navigate]);

  const fetchHotels = async (currentUser: any) => {
    setLoading(true);
    try {
      const url = currentUser.role === "merchant" 
        ? `/api/admin/hotels?merchant_id=${currentUser.id}` 
        : `/api/admin/hotels`;
      const res = await fetch(url);
      const data = await res.json();
      setHotels(data);
    } catch (error) {
      console.error("Failed to fetch hotels", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const handleStatusChange = async (hotelId: number, status: string, reject_reason?: string) => {
    try {
      await fetch(`/api/admin/hotels/${hotelId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reject_reason }),
      });
      fetchHotels(user);
      if (status === "rejected") {
        setRejectModalOpen(false);
        setRejectReason("");
        setCurrentRejectId(null);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const openRejectModal = (hotelId: number) => {
    setCurrentRejectId(hotelId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  if (!user) return null;

  const filteredHotels = hotels.filter(h => activeTab === "all" || h.status === activeTab);

  const tabs = [
    { id: "all", label: "全部酒店" },
    { id: "pending", label: "待审核" },
    { id: "published", label: "已发布" },
    { id: "rejected", label: "已驳回" },
    { id: "offline", label: "已下线" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 bg-slate-950 text-white font-bold text-lg tracking-wide border-b border-slate-800">
          <Building2 className="w-6 h-6 mr-2 text-blue-500" />
          易宿管理系统
        </div>
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2 px-2">菜单</div>
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl shadow-sm">
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
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">
            {user.role === 'admin' ? '酒店审核与管理' : '我的酒店管理'}
          </h1>
          <div className="flex items-center gap-4">
            {user.role === "merchant" && (
              <button 
                onClick={() => navigate("/admin/hotel/new")}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                录入新酒店
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1">
          {/* Stats / Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex border-b border-slate-200 px-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.id === 'all' ? hotels.length : hotels.filter(h => h.status === tab.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">酒店信息</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">位置</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">星级/价格</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                          加载数据中...
                        </div>
                      </td>
                    </tr>
                  ) : filteredHotels.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <Building2 className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="text-lg font-medium text-slate-600">暂无相关酒店数据</p>
                          <p className="text-sm text-slate-400 mt-1">请尝试切换状态标签或录入新酒店</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredHotels.map((hotel) => (
                      <tr key={hotel.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                              <Hotel className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-slate-900">{hotel.name_cn}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{hotel.name_en || '无英文名'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-700 truncate max-w-[200px]" title={hotel.address}>
                            {hotel.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900 font-medium">{hotel.stars} 星级</div>
                          <div className="text-xs text-red-500 mt-0.5 font-semibold">¥{hotel.price} 起</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border
                            ${hotel.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              hotel.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                              hotel.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-slate-100 text-slate-700 border-slate-200'}`}
                          >
                            {hotel.status === 'published' ? '已发布' : 
                             hotel.status === 'pending' ? '审核中' : 
                             hotel.status === 'rejected' ? '已驳回' : '已下线'}
                          </span>
                          {hotel.status === 'rejected' && hotel.reject_reason && (
                            <div className="text-xs text-red-500 mt-2 flex items-center max-w-[200px] truncate" title={hotel.reject_reason}>
                              <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                              {hotel.reject_reason}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            {user.role === "merchant" && (
                              <button 
                                onClick={() => navigate(`/admin/hotel/${hotel.id}/edit`)}
                                className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-1.5" /> 编辑
                              </button>
                            )}
                            {user.role === "admin" && hotel.status === "pending" && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(hotel.id, "published")}
                                  className="text-emerald-600 hover:text-emerald-900 flex items-center bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1.5" /> 通过
                                </button>
                                <button 
                                  onClick={() => openRejectModal(hotel.id)}
                                  className="text-red-600 hover:text-red-900 flex items-center bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                                >
                                  <XCircle className="w-4 h-4 mr-1.5" /> 驳回
                                </button>
                              </>
                            )}
                            {user.role === "admin" && hotel.status === "published" && (
                              <button 
                                onClick={() => handleStatusChange(hotel.id, "offline")}
                                className="text-slate-600 hover:text-slate-900 flex items-center bg-slate-100 px-3 py-1.5 rounded-md transition-colors"
                              >
                                <XCircle className="w-4 h-4 mr-1.5" /> 下线
                              </button>
                            )}
                            {user.role === "admin" && hotel.status === "offline" && (
                              <button 
                                onClick={() => handleStatusChange(hotel.id, "published")}
                                className="text-emerald-600 hover:text-emerald-900 flex items-center bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
                              >
                                <CheckCircle className="w-4 h-4 mr-1.5" /> 恢复上线
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold">驳回酒店申请</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">请填写驳回原因，该原因将展示给商户，以便其修改后重新提交。</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none h-32"
              placeholder="请输入驳回原因..."
              required
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => currentRejectId && handleStatusChange(currentRejectId, "rejected", rejectReason)}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
