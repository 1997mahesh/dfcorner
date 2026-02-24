import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin, Clock, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { formatPrice, cn } from '../lib/utils';

export default function Profile() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/orders/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [token]);

  if (!user) return <div className="p-20 text-center">Please log in to view your profile.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-1">{user.name}</h2>
            <p className="text-emerald-900/40 text-sm mb-6">{user.email}</p>
            <div className="pt-6 border-t border-emerald-900/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-emerald-900/40">Member Since</span>
                <span className="font-medium">Feb 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-900/40">Total Orders</span>
                <span className="font-medium">{orders.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <h1 className="text-4xl font-serif font-bold">Order History</h1>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border border-emerald-900/5 text-center">
              <Package className="mx-auto text-emerald-900/20 mb-4" size={48} />
              <p className="text-emerald-900/40 italic">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order.id}
                  className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      <Package className="text-emerald-600" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-bold text-lg">Order #{order.id}</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-emerald-900/40">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span className="truncate max-w-[150px]">{order.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end md:space-x-12">
                    <div className="text-right">
                      <p className="text-xs text-emerald-900/40 uppercase tracking-widest font-bold mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-emerald-900">{formatPrice(order.total_amount)}</p>
                    </div>
                    <button className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
