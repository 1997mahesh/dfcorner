import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="text-emerald-600" size={40} />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4">Your cart is empty</h1>
        <p className="text-emerald-900/60 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu" className="btn-primary inline-flex items-center space-x-2">
          <span>Browse Menu</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-serif font-bold mb-12">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="flex items-center space-x-6 bg-white p-6 rounded-[2rem] border border-emerald-900/5"
            >
              <img 
                src={item.image || `https://picsum.photos/seed/${item.id}/200/200`} 
                className="w-24 h-24 rounded-2xl object-cover"
                alt={item.name}
              />
              <div className="flex-1">
                <h3 className="font-serif font-bold text-xl">{item.name}</h3>
                <p className="text-emerald-600 font-bold">{formatPrice(item.price)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-emerald-50 rounded-xl p-1">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 sticky top-32">
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-emerald-900/60">
                <span>Subtotal</span>
                <span>{formatPrice(total())}</span>
              </div>
              <div className="flex justify-between text-emerald-900/60">
                <span>Delivery Fee</span>
                <span>{formatPrice(5.00)}</span>
              </div>
              <div className="pt-4 border-t border-emerald-900/5 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(total() + 5.00)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center space-x-2 py-4">
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
