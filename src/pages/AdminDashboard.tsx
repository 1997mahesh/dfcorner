import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Utensils, ShoppingBag, Users, TrendingUp, DollarSign, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { formatPrice, cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { token } = useAuthStore();

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setStats(data));
  }, [token]);

  const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  if (!stats) return <div className="p-12 text-center">Loading Admin Panel...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:block">
        <div className="mb-10">
          <h2 className="text-xl font-serif font-bold text-emerald-900">GUSTO ADMIN</h2>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
            { id: 'menu', icon: <Utensils size={18} />, label: 'Menu Management' },
            { id: 'orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
            { id: 'users', icon: <Users size={18} />, label: 'Customers' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-orange-900 text-white" 
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold">
              A
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: formatPrice(stats.totalSales), icon: <DollarSign className="text-orange-600" />, trend: '+12.5%' },
                { label: 'Total Orders', value: stats.totalOrders, icon: <Package className="text-blue-600" />, trend: '+8.2%' },
                { label: 'Active Customers', value: stats.totalUsers, icon: <Users className="text-purple-600" />, trend: '+5.1%' },
                { label: 'Avg Order Value', value: formatPrice(stats.totalSales / (stats.totalOrders || 1)), icon: <TrendingUp className="text-amber-600" />, trend: '+2.4%' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">{stat.trend}</span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#ea580c" strokeWidth={3} dot={{ r: 4, fill: '#ea580c' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  {[
                    { id: '#ORD-1234', user: 'John Doe', amount: '$45.00', status: 'Delivered', icon: <CheckCircle className="text-emerald-500" /> },
                    { id: '#ORD-1235', user: 'Jane Smith', amount: '$32.50', status: 'Preparing', icon: <Clock className="text-amber-500" /> },
                    { id: '#ORD-1236', user: 'Mike Ross', amount: '$18.00', status: 'Cancelled', icon: <XCircle className="text-red-500" /> },
                    { id: '#ORD-1237', user: 'Sarah Connor', amount: '$64.20', status: 'Delivered', icon: <CheckCircle className="text-emerald-500" /> }
                  ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          {order.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{order.id}</p>
                          <p className="text-xs text-slate-500">{order.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{order.amount}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
