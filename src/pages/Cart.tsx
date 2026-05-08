import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Info, CreditCard } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!address || !phone) {
        alert('Please provide your delivery address and phone number.');
        return;
    }

    setIsProcessing(true);
    try {
      const orderId = push(ref(db, 'orders')).key;
      const orderData = {
        userId: user.uid,
        items: cart,
        total: cartTotal,
        status: 'pending',
        customerInfo: {
            name: user.displayName || 'Customer',
            phone,
            address
        },
        createdAt: Date.now(),
      };
      
      await set(ref(db, `orders/${orderId}`), orderData);
      clearCart();
      alert('Order placed successfully! We will contact you soon.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet. Time to shop!</p>
        <Link to="/" className="btn-primary flex items-center gap-2">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 pb-32">
      <h1 className="text-4xl font-display font-bold mb-10 flex items-center gap-4">
        Shopping Bag <span className="text-xl font-sans text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">{cart.length}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-4 sm:p-6 rounded-3xl border border-white/5 flex gap-4 sm:gap-6"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.imageBase64} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base sm:text-lg">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">{item.category}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-brand-orange">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <button 
            onClick={clearCart}
            className="text-sm font-medium text-gray-500 hover:text-red-400 transition-colors flex items-center gap-2 mt-4 ml-auto"
          >
            <Trash2 size={16} /> Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 sm:p-8 rounded-[2.5rem] border border-white/10 sticky top-28">
            <h2 className="text-xl font-bold mb-6 italic">Checkout Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping</span>
                <span className="text-brand-orange font-bold uppercase text-[10px] tracking-wider bg-brand-orange/10 px-2 py-0.5 rounded">Calculated at Step 2</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-orange">{formatPrice(cartTotal)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Inclusive of VAT</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
               {isCheckingOut ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4 border-t border-white/10 mb-6"
                  >
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Delivery Address</label>
                        <textarea 
                           required
                           value={address}
                           onChange={e => setAddress(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-orange h-20 text-sm"
                           placeholder="Enter full address for delivery..."
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                        <input 
                           required
                           type="tel"
                           value={phone}
                           onChange={e => setPhone(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-orange text-sm"
                           placeholder="0913..."
                        />
                     </div>
                     <button 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? 'Processing...' : <>Place Order <CreditCard size={18} /></>}
                      </button>
                      <button onClick={() => setIsCheckingOut(false)} className="text-xs text-center w-full text-gray-500 hover:text-white">Edit Cart</button>
                  </motion.div>
               ) : (
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                  >
                    Proceed to Delivery <ArrowRight size={18} />
                  </button>
               )}
            </AnimatePresence>

            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 grayscale opacity-40">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 mx-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 mx-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 mx-auto" />
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border border-white/5 flex items-start gap-3">
             <Info className="text-brand-orange flex-shrink-0 mt-0.5" size={16} />
             <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">
                Our delivery partner will reach out to you within 24 hours of placing the order to confirm shipping details and timing.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
