/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import MobileHome from "./pages/mobile/Home";
import MobileList from "./pages/mobile/List";
import MobileDetail from "./pages/mobile/Detail";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminHotelForm from "./pages/admin/HotelForm";

function ViewSwitcher() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        to={isAdmin ? "/" : "/admin/login"}
        className="bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        {isAdmin ? "📱 切换到用户端 (移动端)" : "💻 切换到管理端 (PC端)"}
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ViewSwitcher />
      <Routes>
        {/* Mobile Routes */}
        <Route path="/" element={<MobileHome />} />
        <Route path="/list" element={<MobileList />} />
        <Route path="/hotel/:id" element={<MobileDetail />} />

        {/* Admin/Merchant Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/hotel/new" element={<AdminHotelForm />} />
        <Route path="/admin/hotel/:id/edit" element={<AdminHotelForm />} />
      </Routes>
    </Router>
  );
}
