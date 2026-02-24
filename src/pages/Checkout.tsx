import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';
import type { FormEvent } from 'react';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          totalAmount: total() + 5,
          address
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        clearCart();
        setTimeout(() => navigate('/profile'), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="text-emerald-600" size={48} />
        </motion.div>
        <h1 className="text-4xl font-serif font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-emerald-900/60 mb-8">Thank you for choosing Gusto. Your food is being prepared.</p>
        <p className="text-sm text-emerald-900/40">Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-serif font-bold mb-12">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-emerald-600" size={24} />
              <h2 className="text-2xl font-serif font-bold">Delivery Address</h2>
            </div>
            <textarea 
              required
              placeholder="Enter your full delivery address..."
              className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-900/5 rounded-2xl focus:outline-none focus:border-emerald-600 transition-colors h-32"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="text-emerald-600" size={24} />
              <h2 className="text-2xl font-serif font-bold">Payment Method</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-emerald-900 rounded-2xl bg-emerald-50/50 flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full border-4 border-emerald-900" />
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <div className="p-4 border border-emerald-900/10 rounded-2xl flex items-center space-x-4 opacity-50 cursor-not-allowed">
                <div className="w-4 h-4 rounded-full border border-emerald-900/20" />
                <span className="font-medium">Online Payment (Coming Soon)</span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 sticky top-32">
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-emerald-900/60">{item.name} x {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-emerald-900/5 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(total() + 5.00)}</span>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading || items.length === 0}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-4"
            >
              <Truck size={18} />
              <span>{loading ? 'Placing Order...' : 'Place Order'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
