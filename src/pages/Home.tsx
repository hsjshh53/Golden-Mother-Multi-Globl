import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Truck, ShieldCheck, Zap } from 'lucide-react';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList: Product[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        }));
        
        setFeaturedProducts(productList.filter(p => p.featured).slice(0, 4));
        setNewArrivals(productList.sort((a, b) => b.createdAt - a.createdAt).slice(0, 8));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { name: 'Fashion', icon: '👕', color: 'bg-blue-500/20' },
    { name: 'Electronics', icon: '📱', color: 'bg-purple-500/20' },
    { name: 'Home', icon: '🏠', color: 'bg-amber-500/20' },
    { name: 'Beauty', icon: '💄', color: 'bg-pink-500/20' },
  ];

  return (
    <div className="pb-24 sm:pb-12">
      {/* Hero Section */}
      <section className="relative h-[85vh] sm:h-[70vh] overflow-hidden bg-brand-dark">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-brand-orange" />
              <span className="text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]">
                Exclusive 2026 Release
              </span>
            </div>
            
            <h1 className="text-6xl sm:text-8xl font-display font-bold leading-[0.9] mb-8 tracking-tighter uppercase">
              Golden <br />
              <span className="text-brand-orange italic">Mother</span> <br />
              <span className="text-3xl sm:text-5xl font-light text-gray-500 lowercase tracking-tight">Global Marketplace</span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 max-w-md font-medium leading-relaxed">
              Experience modern African luxury. Hand-curated essentials delivered with global standards.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary flex items-center gap-3 px-10 py-4 text-sm uppercase tracking-widest">
                Explore Shop <ArrowRight size={18} />
              </Link>
              <Link to="/products?category=Fashion" className="btn-outline flex items-center gap-3 px-10 py-4 text-sm uppercase tracking-widest bg-white/[0.02]">
                New Trends
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Rail */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 mb-24 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-4 p-1 sm:p-2 glass-dark rounded-[2.5rem]">
          {[
            { icon: Truck, title: 'Express Delivery', desc: 'Secure Shipping' },
            { icon: ShieldCheck, title: 'Authentic', desc: '100% Guaranteed' },
            { icon: Star, title: 'Premium', desc: 'Handpicked Luxury' },
            { icon: Zap, title: 'Fast Pay', desc: 'Instant Checkout' },
          ].map((feature, i) => (
            <div key={i} className="p-4 sm:p-8 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:bg-white/[0.02] transition-all cursor-default group">
              <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform shadow-lg shadow-black/40">
                <feature.icon size={22} />
              </div>
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-widest">{feature.title}</h3>
              <p className="text-[9px] text-gray-500 uppercase tracking-tighter">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display tracking-tightest">Browse by Category</h2>
            <p className="text-gray-500 text-sm">Find exactly what you need</p>
          </div>
          <Link to="/products" className="text-brand-orange text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            See All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group cursor-pointer relative aspect-[4/3] rounded-3xl overflow-hidden glass p-6 flex flex-col items-center justify-center gap-4 hover:border-brand-orange transition-colors"
            >
              <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center text-3xl transition-transform group-hover:scale-110`}>
                {cat.icon}
              </div>
              <span className="font-bold tracking-wide">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
             <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-brand-orange/10 mb-2 inline-block">Trending</span>
            <h2 className="text-3xl font-bold font-display">Featured Products</h2>
          </div>
          <Link to="/featured" className="text-brand-orange text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="relative rounded-[2.5rem] overflow-hidden glass p-8 sm:p-12 h-64 sm:h-80 flex items-center">
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" alt="Promo" className="w-full h-full object-cover opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/40 to-transparent" />
            </div>
            <div className="relative z-10 max-w-md">
               <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 italic">The Big Move.</h2>
               <p className="text-lg text-white font-medium mb-6">Upgrade your wardrobe with our latest fashion week arrivals. Limited time offer.</p>
               <button className="btn-primary">Shop 50% Off</button>
            </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display">New Arrivals</h2>
            <p className="text-gray-500 text-sm">Fresh from the factory</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Footer / Business Details */}
      <footer className="glass-dark pt-16 pb-32 sm:pb-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center font-display font-bold text-lg">G</div>
                <span className="font-bold text-xl tracking-tighter">GOLDEN MOTHER</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Golden Mother Multi Global is a premium provider of luxury lifestyle goods, founded with a vision to bring global excellence to the local market.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-orange transition-colors cursor-pointer">IG</div>
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-orange transition-colors cursor-pointer">FB</div>
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-orange transition-colors cursor-pointer">TW</div>
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-6">Contact Us</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>G35 Ita Ajia Gambari Road, Ilorin, Kwara State, Nigeria</li>
                <li>09130664287</li>
                <li>08051156682</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-6">Policies</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-brand-orange cursor-pointer">Shipping Policy</li>
                <li className="hover:text-brand-orange cursor-pointer">Return & Refund</li>
                <li className="hover:text-brand-orange cursor-pointer">Privacy Policy</li>
                <li className="hover:text-brand-orange cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-[0.3em]">
             © 2026 Golden Mother Multi Global. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
