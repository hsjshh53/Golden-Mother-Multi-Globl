import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export const BottomNav: React.FC = () => {
  const { cartCount } = useCart();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Wishlist' },
    { to: '/cart', icon: ShoppingBag, label: 'Cart', badge: cartCount },
    { to: '/profile', icon: User, label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-gray/80 backdrop-blur-3xl border-t border-white/5 pb-safe sm:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center w-full h-full transition-all duration-300",
                isActive ? "text-brand-orange scale-110" : "text-gray-500 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] mt-1 font-black uppercase tracking-widest leading-none">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-2 right-1/2 translate-x-4 bg-brand-orange text-black text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-brand-gray/80">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
