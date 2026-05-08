import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-brand-orange/30 transition-all duration-300"
    >
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-brand-gray">
        <img
          src={product.imageBase64 || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.newArrival && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-brand-orange to-brand-orange-light text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            New
          </span>
        )}
        <button 
          className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-brand-orange transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Add to favorites logic
          }}
        >
          <Heart size={18} />
        </button>
      </Link>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} className="fill-brand-orange text-brand-orange" />
          <span className="text-[10px] text-gray-500 font-medium">New Selection</span>
        </div>
        
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-1 group-hover:text-brand-orange transition-colors uppercase">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[10px] text-gray-400 line-clamp-2 mb-3 uppercase tracking-tighter">
          Exclusive Luxury Edition
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-black text-brand-orange">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="p-3 bg-white/5 hover:bg-brand-orange text-brand-orange hover:text-black rounded-xl transition-all active:scale-90"
            disabled={product.stock === 0}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
          <span className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 font-bold uppercase tracking-widest text-white/60">
            Out of Stock
          </span>
        </div>
      )}
    </motion.div>
  );
};
