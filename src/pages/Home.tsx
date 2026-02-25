import { motion } from 'motion/react';
import { ChevronRight, Star, Clock, ShieldCheck, Truck, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589187151003-0dd55769239b?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Hero background"
          />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
              Flavours From Prayagraj
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-[0.9] mb-8">
              Dubey ji <br /> Food <span className="italic text-orange-400">Corner.</span>
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed font-light">
              Authentic Veg Keema, Kabab Parathas, and Rolls. Experience the true taste of North India in the heart of Kharadi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu" className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center justify-center space-x-2">
                <span>Order Online</span>
                <ChevronRight size={18} />
              </Link>
              <Link to="/menu" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center justify-center">
                Explore Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Utensils className="text-orange-600" />, title: "Pure Veg", desc: "We serve 100% vegetarian dishes prepared with the highest hygiene standards." },
              { icon: <ShieldCheck className="text-orange-600" />, title: "Authentic Taste", desc: "Our recipes bring the traditional flavours of Prayagraj straight to your plate." },
              { icon: <Truck className="text-orange-600" />, title: "Quick Service", desc: "Fast preparation and delivery for your busy workdays in EON IT Park." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif font-bold">{feature.title}</h3>
                <p className="text-orange-900/60 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-24 px-6 bg-[#FDFCF9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Our Best Sellers</h2>
              <p className="text-orange-900/60 max-w-lg">The dishes that made us a favorite in Kharadi.</p>
            </div>
            <Link to="/menu" className="text-orange-600 font-medium flex items-center space-x-2 hover:underline">
              <span>View Full Menu</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Veg Keema Kabab Paratha", price: "₹120", img: "https://images.unsplash.com/photo-1626132646529-5003375a9b12?auto=format&fit=crop&q=80&w=800" },
              { name: "Veg Kathi Roll", price: "₹80", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800" },
              { name: "Paneer Paratha", price: "₹90", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800" }
            ].map((dish, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6">
                  <img 
                    src={dish.img} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={dish.name}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-900">
                    {dish.price}
                  </div>
                </div>
                <h4 className="text-xl font-serif font-bold mb-2 group-hover:text-orange-600 transition-colors">{dish.name}</h4>
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  <span className="text-xs text-orange-900/40 ml-2">(4.6 Rating)</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
