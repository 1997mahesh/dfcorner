import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Plus, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/useStore';
import { formatPrice, cn } from '../lib/utils';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  image?: string;
}

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setItems(data.items);
        setCategories([{ id: 0, name: 'All' }, ...data.categories]);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category_name === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="text-emerald-900/60">Explore our curated selection of fine dining delicacies.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/30" size={18} />
            <input 
              type="text" 
              placeholder="Search dishes..."
              className="pl-10 pr-4 py-2.5 bg-white border border-emerald-900/10 rounded-full text-sm w-full sm:w-64 focus:outline-none focus:border-emerald-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === cat.name 
                    ? "bg-emerald-900 text-white shadow-lg" 
                    : "bg-white text-emerald-900 border border-emerald-900/10 hover:bg-emerald-50"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-square bg-emerald-100 rounded-3xl" />
              <div className="h-4 bg-emerald-100 rounded w-3/4" />
              <div className="h-4 bg-emerald-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-[2rem] p-4 border border-emerald-900/5 hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                <img 
                  src={item.image || `https://picsum.photos/seed/${item.id}/400/400`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={item.name}
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                  {item.category_name}
                </div>
              </div>
              
              <div className="px-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                  <span className="text-emerald-600 font-bold">{formatPrice(item.price)}</span>
                </div>
                <p className="text-emerald-900/50 text-xs line-clamp-2 mb-4 h-8">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold text-emerald-900/40">4.9</span>
                  </div>
                  <button 
                    onClick={() => addItem({ ...item, quantity: 1 })}
                    className="p-2 bg-emerald-900 text-white rounded-xl hover:bg-emerald-800 transition-all active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-emerald-900/40 italic">No dishes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
