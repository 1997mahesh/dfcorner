import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, LogOut, ChevronRight, MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore, useCartStore } from './store/useStore';
import { cn } from './lib/utils';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-orange-900">
          DUBEY JI <span className="text-orange-600">FOOD CORNER</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-orange-900/70">
          <Link to="/" className="hover:text-orange-600 transition-colors text-orange-900">Home</Link>
          <Link to="/menu" className="hover:text-orange-600 transition-colors text-orange-900">Menu</Link>
          <Link to="/about" className="hover:text-orange-600 transition-colors text-orange-900">About</Link>
          <Link to="/contact" className="hover:text-orange-600 transition-colors text-orange-900">Contact</Link>
        </div>

        <div className="flex items-center space-x-5">
          <Link to="/cart" className="relative p-2 text-orange-900 hover:bg-orange-50 rounded-full transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center space-x-2 text-sm font-medium text-orange-900">
                <User size={18} />
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button onClick={logout} className="p-2 text-orange-900 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-orange-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-800 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-orange-950 text-orange-50 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-bold">DUBEY JI <span className="text-orange-400">FOOD CORNER</span></h3>
          <p className="text-orange-200/60 text-sm leading-relaxed">
            Flavours From Prayagraj. Authentic Veg Keema, Kabab Parathas, and Rolls served with love in Kharadi, Pune.
          </p>
          <div className="flex space-x-4">
            <Instagram size={20} className="text-orange-200/40 hover:text-orange-200 cursor-pointer transition-colors" />
            <Facebook size={20} className="text-orange-200/40 hover:text-orange-200 cursor-pointer transition-colors" />
            <Twitter size={20} className="text-orange-200/40 hover:text-orange-200 cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Quick Links</h4>
          <ul className="space-y-4 text-sm text-orange-200/60">
            <li><Link to="/menu" className="hover:text-orange-200 transition-colors">Our Menu</Link></li>
            <li><Link to="/about" className="hover:text-orange-200 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-orange-200 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Contact Us</h4>
          <ul className="space-y-4 text-sm text-orange-200/60">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="mt-0.5" />
              <span>Shop No. 2, Gera's Park View, Kharadi, Pune 411014</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} />
              <span>+91 98500 78977</span>
            </li>
            <li className="flex items-center space-x-3">
              <Clock size={18} />
              <span>Mon - Sun: 08:00 AM - 11:30 PM</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Newsletter</h4>
          <p className="text-sm text-emerald-200/60 mb-4">Subscribe for exclusive offers and news.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-emerald-900/50 border border-emerald-800 rounded-l-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-emerald-600"
            />
            <button className="bg-emerald-600 px-4 py-2 rounded-r-lg hover:bg-emerald-500 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-orange-900 text-center text-xs text-orange-200/30">
        © {new Date().getFullYear()} Dubey ji Food Corner. All rights reserved.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FDFCF9] font-sans text-orange-950 selection:bg-orange-100 selection:text-orange-900">
        <Navbar />
        <main className="pt-20">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
