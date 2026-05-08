import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-[60] glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-orange to-brand-orange-light rounded-xl flex items-center justify-center font-display font-bold text-xl text-black group-hover:rotate-6 transition-transform shadow-lg shadow-brand-orange/20">
              G
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-bold tracking-tighter leading-none">GOLDEN</span>
              <span className="block text-xs font-medium tracking-[0.2em] text-brand-orange leading-none uppercase italic">Mother</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form 
            onSubmit={(e) => { e.preventDefault(); navigate(`/products?q=${(e.target as any).search.value}`); }} 
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                name="search"
                type="text"
                placeholder="Search premium inventory..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-brand-orange transition-all placeholder:text-gray-600 outline-none"
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin" className="p-2 text-gray-400 hover:text-brand-orange transition-colors" title="Admin Dashboard">
                <LayoutDashboard size={20} />
              </Link>
            )}
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-brand-orange transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-black text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-brand-dark">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2 pl-2 ml-2 border-l border-white/10">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center overflow-hidden border border-white/10">
                    <User size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-white transition-colors max-w-[80px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-brand-orange transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-6 text-xs uppercase tracking-widest">
                Access
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-4">
             <Link to="/cart" className="relative p-2 text-gray-400">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-brand-dark">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-brand-orange"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-white/5 bg-brand-dark/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); navigate(`/products?q=${(e.target as any).search.value}`); setIsMenuOpen(false); }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="search"
                  type="text"
                  placeholder="Search brands, items..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none"
                />
              </form>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/category/fashion" className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2">
                  <span className="text-sm font-medium">Fashion</span>
                </Link>
                <Link to="/category/electronics" className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2">
                  <span className="text-sm font-medium">Electronics</span>
                </Link>
                <Link to="/category/beauty" className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2">
                  <span className="text-sm font-medium">Beauty</span>
                </Link>
                <Link to="/category/home" className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2">
                  <span className="text-sm font-medium">Home Decor</span>
                </Link>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate">{user.email}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{isAdmin ? 'Admin' : 'Member'}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors">
                        <LayoutDashboard size={20} className="text-brand-orange" />
                        <span className="text-sm font-medium">Admin Dashboard</span>
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                      <LogOut size={20} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                    <User size={20} />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
