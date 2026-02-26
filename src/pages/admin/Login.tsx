import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Building2, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("merchant");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister ? { username, password, role } : { username, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "操作失败");
      }
    } catch (err) {
      setError("网络错误");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Branding (PC Only) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center px-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/hoteladmin/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <Building2 className="w-12 h-12 text-blue-500 mr-4" />
            <span className="text-3xl font-bold tracking-tight">易宿 YISU</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            智慧出行<br/>酒店预订管理平台
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-lg mb-12">
            为酒店商家提供专业化的信息录入、审核流程及发布管理能力。打造高效、便捷的信息交互桥梁。
          </p>
          <div className="flex items-center space-x-6 text-sm font-medium text-slate-400">
            <div className="flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-400"/> 安全可靠</div>
            <div className="flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-400"/> 实时同步</div>
            <div className="flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-400"/> 高效管理</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white shadow-2xl z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isRegister ? "注册新账号" : "欢迎回来"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {isRegister ? "注册成为商户或管理员以管理酒店信息" : "请登录您的账号以进入管理后台"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">用户名</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all bg-slate-50 focus:bg-white"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all bg-slate-50 focus:bg-white"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">选择角色</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border rounded-xl p-4 flex flex-col items-center cursor-pointer transition-all ${role === 'merchant' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" value="merchant" checked={role === "merchant"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <Building2 className={`w-6 h-6 mb-2 ${role === 'merchant' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium">酒店商户</span>
                  </label>
                  <label className={`border rounded-xl p-4 flex flex-col items-center cursor-pointer transition-all ${role === 'admin' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" value="admin" checked={role === "admin"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <ShieldCheck className={`w-6 h-6 mb-2 ${role === 'admin' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium">平台管理员</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              {isRegister ? "立即注册" : "登录系统"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-sm text-slate-600">
              {isRegister ? "已有账号？" : "还没有账号？"}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="font-medium text-blue-600 hover:text-blue-500 ml-1"
              >
                {isRegister ? "返回登录" : "立即注册"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
