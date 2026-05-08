import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CATEGORIES: Category[] = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Groceries'];

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'All';

  useEffect(() => {
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.entries(data).map(([id, v]: [string, any]) => ({ id, ...v })) : [];
      setProducts(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = products;
    
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-2 hover:text-brand-orange transition-colors">
                <ArrowLeft size={16} /> Back
             </button>
             <h1 className="text-4xl font-display font-bold">Discover Collection</h1>
          </div>

          <div className="flex w-full md:w-auto gap-3">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchParams({ q: e.target.value, category: categoryFilter })}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-brand-orange"
                   placeholder="Search..."
                />
             </div>
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <SlidersHorizontal size={20} />
             </button>
          </div>
       </div>

       {/* Categories Rail */}
       <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
          {CATEGORIES.map(cat => (
             <button
                key={cat}
                onClick={() => setSearchParams({ q: searchQuery, category: cat })}
                className={`whitespace-nowrap px-6 py-2 rounded-full border text-sm font-semibold transition-all ${
                   categoryFilter === cat 
                   ? "bg-brand-orange border-brand-orange text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]" 
                   : "border-white/10 text-gray-400 hover:border-brand-orange/50"
                }`}
             >
                {cat}
             </button>
          ))}
       </div>

       {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
       ) : (
          <div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredProducts.map(product => (
                   <ProductCard key={product.id} product={product} />
                ))}
             </div>
             {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                   <p className="text-gray-500 font-medium">No products found matching your criteria</p>
                </div>
             )}
          </div>
       )}
    </div>
  );
};
