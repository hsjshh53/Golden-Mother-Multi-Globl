import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { 
    Star, ShoppingBag, Heart, Share2, ArrowLeft, 
    Truck, ShieldCheck, RefreshCw, ChevronRight, Info
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const productRef = ref(db, `products/${id}`);
    const unsubscribe = onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProduct({ id, ...data });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Product not found</h2>
      <Link to="/" className="btn-primary">Return Home</Link>
    </div>
  );

  return (
    <div className="pb-32 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
        {/* Back Button */}
        <button 
           onClick={() => navigate(-1)} 
           className="mb-8 flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} /> Back to shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Visuals Column */}
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-square glass-dark rounded-[2.5rem] overflow-hidden border border-white/5 relative group"
            >
              <img 
                src={product.imageBase64} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={product.name} 
              />
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                 <button className="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white hover:text-brand-orange transition-colors">
                    <Heart size={20} />
                 </button>
                 <button className="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white hover:text-brand-orange transition-colors">
                    <Share2 size={20} />
                 </button>
              </div>
            </motion.div>
            
            {/* Gallery placeholder */}
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square glass rounded-2xl border border-white/5 overflow-hidden opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                     <img src={product.imageBase64} className="w-full h-full object-cover" />
                  </div>
               ))}
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <div className="mb-8">
               <div className="flex items-center gap-2 mb-4">
                  <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-brand-orange/20">
                    {product.category}
                  </span>
                  {product.newArrival && (
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-500/20">
                      New Arrival
                    </span>
                  )}
               </div>

               <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 leading-tight">{product.name}</h1>
               
               <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-1">
                     {[1,2,3,4,5].map(star => <Star key={star} size={14} className={cn("fill-current", star <= 4 ? "text-yellow-500" : "text-gray-600")} />)}
                     <span className="text-xs text-gray-500 font-medium ml-2">4.8 (124 ratings)</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                     <span className="text-xs text-gray-500 font-medium">In Stock ({product.stock} units)</span>
                  </div>
               </div>

               <p className="text-3xl font-bold text-brand-orange mb-8 tabular-nums tracking-tight">
                  {formatPrice(product.price)}
               </p>

               <div className="glass p-6 rounded-2xl border border-white/5 mb-8">
                  <p className="text-gray-400 text-sm leading-relaxed">
                     {product.description || "No detailed description provided for this luxury item. Golden Mother guarantees authentic quality and premium craftsmanship in every piece delivered."}
                  </p>
               </div>

               {/* Specs / Options Example */}
               {product.category === 'Fashion' && (
                  <div className="space-y-4 mb-8">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pick Your Size</p>
                     <div className="flex flex-wrap gap-3">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                           <button 
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                "w-12 h-12 flex items-center justify-center rounded-xl border font-bold text-sm transition-all",
                                selectedSize === size ? "bg-brand-orange border-brand-orange text-white" : "border-white/10 text-gray-400 hover:border-brand-orange/50"
                              )}
                           >
                              {size}
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            <div className="space-y-4 mt-auto">
               <div className="flex gap-4">
                  <button 
                     onClick={() => addToCart(product)}
                     className="flex-1 btn-primary py-5 flex items-center justify-center gap-3 text-lg"
                  >
                     <ShoppingBag size={22} /> Add to Cart
                  </button>
               </div>
               <button className="w-full py-4 text-sm font-bold text-brand-orange bg-brand-orange/5 rounded-2xl border border-brand-orange/10 hover:bg-brand-orange/20 transition-all uppercase tracking-widest">
                  Buy Now Instantly
               </button>
            </div>

            {/* Support Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
               {[
                  { icon: Truck, title: 'Express', sub: '2-4 Days' },
                  { icon: ShieldCheck, title: 'Secure', sub: 'Verified' },
                  { icon: RefreshCw, title: 'Easy', sub: 'Refunds' },
               ].map((item, i) => (
                  <div key={i} className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                     <item.icon className="text-brand-orange" size={20} />
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-white/90 leading-none">{item.title}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-medium mt-1 leading-none">{item.sub}</p>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
