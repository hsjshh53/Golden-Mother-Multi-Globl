import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { User, LogOut, Package, Heart, MapPin, Bell, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Profile: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <User size={40} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
        <p className="text-gray-400 mb-8 max-w-xs">Log in to view your profile, orders and saved items.</p>
        <Link to="/login" className="btn-primary w-full max-w-xs">Sign In Now</Link>
      </div>
    );
  }

  const menuItems = [
    { icon: Package, label: 'My Orders', color: 'text-blue-400' },
    { icon: Heart, label: 'Wishlist', color: 'text-red-400' },
    { icon: MapPin, label: 'Addresses', color: 'text-green-400' },
    { icon: Bell, label: 'Notifications', color: 'text-amber-400' },
    { icon: Shield, label: 'Account Security', color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-32 sm:pb-12">
      {/* Header Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-[2.5rem] border border-white/10 text-center mb-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent" />
        
        <div className="w-24 h-24 bg-brand-orange/20 border-2 border-brand-orange rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange relative group">
          <User size={48} />
          <div className="absolute inset-0 rounded-full bg-brand-orange/10 animate-ping" />
        </div>
        
        <h1 className="text-2xl font-bold mb-1 truncate px-4">{user.displayName || 'Golden Member'}</h1>
        <p className="text-sm text-gray-500 mb-4">{user.email}</p>
        
        <div className="flex justify-center gap-4">
           {isAdmin && (
              <Link to="/admin" className="px-4 py-2 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all">
                 Admin Panel
              </Link>
           )}
           <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Logout
           </button>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-10">
         <div className="glass p-6 rounded-2xl text-center border border-white/5">
            <p className="text-2xl font-bold text-brand-orange">0</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Total Orders</p>
         </div>
         <div className="glass p-6 rounded-2xl text-center border border-white/5">
            <p className="text-2xl font-bold text-amber-500">0</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Pending items</p>
         </div>
      </div>

      {/* Menu List */}
      <div className="space-y-3">
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 ml-2 mb-4">Account Overview</p>
         {menuItems.map((item, i) => (
           <motion.button
             key={i}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1 }}
             className="w-full glass p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-brand-orange/30 transition-all group"
           >
             <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-xl bg-white/5", item.color)}>
                   <item.icon size={20} />
                </div>
                <span className="font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</span>
             </div>
             <ChevronRight size={18} className="text-gray-600 group-hover:text-brand-orange transition-colors" />
           </motion.button>
         ))}
      </div>
      
      <div className="mt-12 p-6 glass rounded-2xl border border-dashed border-white/10 text-center">
         <p className="text-xs text-gray-500 mb-1 italic">Memeber since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</p>
         <p className="text-[10px] text-gray-700 uppercase tracking-tighter">Golden Mother Multi Global ID: {user.uid.substring(0, 12)}</p>
      </div>
    </div>
  );
};
