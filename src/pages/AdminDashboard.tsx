import React, { useState, useEffect } from 'react';
import { 
  Plus, Package, ShoppingCart, Users, TrendingUp, Search, 
  Edit2, Trash2, Image as ImageIcon, Upload, X, Check,
  AlertTriangle, Filter, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { Product, Order, UserProfile, Category } from '../types';
import { formatPrice, fileToBase64, cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const CATEGORIES: Category[] = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Groceries'];

export const AdminDashboard: React.FC = () => {
  const { isAdmin, loading: authLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Stats
  const revenue = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0);
  const lowStock = products.filter(p => p.stock <= 5).length;

  useEffect(() => {
    if (!isAdmin) return;

    const prodsRef = ref(db, 'products');
    const ordsRef = ref(db, 'orders');
    const usersRef = ref(db, 'users');

    onValue(prodsRef, (s) => {
      const data = s.val();
      setProducts(data ? Object.entries(data).map(([id, v]: [string, any]) => ({ id, ...v })) : []);
    });

    onValue(ordsRef, (s) => {
      const data = s.val();
      setOrders(data ? Object.entries(data).map(([id, v]: [string, any]) => ({ id, ...v })) : []);
    });

    onValue(usersRef, (s) => {
      const data = s.val();
      setUsers(data ? Object.entries(data).map(([id, v]: [string, any]) => ({ id, ...v })) : []);
    });
  }, [isAdmin]);

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-dark pt-16 md:pt-0">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-gray border-r border-white/10 p-6 md:sticky md:top-0 md:h-screen flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-orange to-brand-orange-light rounded-xl flex items-center justify-center font-bold text-xl text-black">GM</div>
          <div>
            <h2 className="font-bold text-sm tracking-tighter uppercase">ADMIN <span className="text-brand-orange">HUB</span></h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">Golden Mother Global</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-grow">
          {[
            { id: 'overview', icon: TrendingUp, label: 'Marketplace' },
            { id: 'products', icon: Package, label: 'Inventory' },
            { id: 'orders', icon: ShoppingCart, label: 'Operations', badge: orders.filter(o => o.status === 'pending').length },
            { id: 'users', icon: Users, label: 'Member List' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-xl transition-all uppercase tracking-widest text-[10px] font-bold",
                activeTab === item.id ? "bg-brand-orange text-black shadow-lg shadow-brand-orange/20" : "text-gray-500 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className={cn(
                  "text-[9px] font-black px-2 py-0.5 rounded-md",
                  activeTab === item.id ? "bg-black text-white" : "bg-brand-orange/20 text-brand-orange"
                )}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10 mt-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <Users size={18} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-bold text-white truncate">{user?.email}</p>
                 <p className="text-[9px] text-gray-500 uppercase">Super Admin Access</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto pb-24">
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
               <h2 className="text-3xl font-display font-bold">System Analytics</h2>
               <div className="flex items-center gap-2 text-[10px] font-mono text-green-500 uppercase tracking-widest">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Real-time Database Active
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: formatPrice(revenue), icon: TrendingUp, color: 'text-brand-orange', trend: '+12.4% from last month' },
                { label: 'Active Orders', value: orders.length, icon: ShoppingCart, color: 'text-white', trend: `${orders.filter(o => o.status === 'pending').length} Pending fulfillment` },
                { label: 'Database Flux', value: '84.2 MB', icon: Package, color: 'text-white', trend: 'RTDB Utilization' },
              ].map((stat, i) => (
                <div key={i} className="bg-surface border border-white/5 p-6 rounded-2xl">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-gray-500 mt-2 font-medium italic">{stat.trend}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="glass p-6 rounded-2xl">
                 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <ShoppingCart size={18} className="text-brand-orange" /> Recent Orders
                 </h3>
                 <div className="space-y-4">
                   {orders.slice(0, 5).map(order => (
                     <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs">#{(order.id || '').substring(0, 4)}</div>
                           <div>
                              <p className="font-bold text-sm">{order.customerInfo.name}</p>
                              <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-brand-orange">{formatPrice(order.total)}</p>
                           <span className={cn(
                             "text-[10px] uppercase tracking-widest font-bold",
                             order.status === 'pending' ? 'text-amber-400' : 'text-green-400'
                           )}>{order.status}</span>
                        </div>
                     </div>
                   ))}
                   {orders.length === 0 && <p className="text-center py-8 text-gray-500 text-sm">No orders yet</p>}
                 </div>
               </div>

               <div className="glass p-6 rounded-2xl">
                 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <AlertTriangle size={18} className="text-red-400" /> Low Stock Alerts
                 </h3>
                 <div className="space-y-4">
                    {products.filter(p => p.stock <= 5).slice(0, 5).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-4">
                           <img src={product.imageBase64} alt="" className="w-10 h-10 rounded-lg object-cover" />
                           <p className="text-sm font-bold truncate max-w-[150px]">{product.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-md">{product.stock} left</span>
                           <button onClick={() => { setActiveTab('products'); setEditingProduct(product); setIsAddModalOpen(true); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                              <Edit2 size={14} />
                           </button>
                        </div>
                      </div>
                    ))}
                    {lowStock === 0 && <p className="text-center py-8 text-gray-500 text-sm">All products in good stock</p>}
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Products Management</h2>
                <p className="text-gray-500 text-sm">Manage your inventory and showcase</p>
              </div>
              <button 
                onClick={() => { setEditingProduct(null); setIsAddModalOpen(true); }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} /> Add New Product
              </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                   <tr>
                     <th className="px-6 py-4">Product</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Price</th>
                     <th className="px-6 py-4">Stock</th>
                     <th className="px-6 py-4">Flags</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 text-sm">
                   {products.map(product => (
                     <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <img src={product.imageBase64} className="w-10 h-10 rounded-lg object-cover" alt="" />
                              <div>
                                <p className="font-bold">{product.name}</p>
                                <p className="text-[10px] text-gray-500 font-mono">#{product.id.substring(0, 6).toUpperCase()}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-md bg-white/10 text-xs">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-brand-orange">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4 font-medium">{product.stock}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                             {product.featured && <span className="w-2 h-2 rounded-full bg-amber-400" title="Featured" />}
                             {product.newArrival && <span className="w-2 h-2 rounded-full bg-blue-400" title="New Arrival" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => { setEditingProduct(product); setIsAddModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                               <Edit2 size={16} />
                             </button>
                             <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-500 transition-all rounded-lg text-gray-400 hover:text-white">
                               <Trash2 size={16} />
                             </button>
                          </div>
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {products.length === 0 && <p className="text-center py-12 text-gray-500">No products found</p>}
            </div>
          </div>
        )}

        {/* Similar detailed lists for Orders and Users would go here */}
        
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <ProductModal 
            onClose={() => setIsAddModalOpen(false)} 
            editingProduct={editingProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Modals & Helpers ---

const ProductModal: React.FC<{ onClose: () => void; editingProduct: Product | null }> = ({ onClose, editingProduct }) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    description: editingProduct?.description || '',
    price: editingProduct?.price || 0,
    stock: editingProduct?.stock || 0,
    category: editingProduct?.category || CATEGORIES[0],
    featured: editingProduct?.featured || false,
    newArrival: editingProduct?.newArrival || false,
    imageBase64: editingProduct?.imageBase64 || '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const base64 = await fileToBase64(file);
        setFormData(prev => ({ ...prev, imageBase64: base64 }));
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProduct) {
        await update(ref(db, `products/${editingProduct.id}`), {
          ...formData,
          createdAt: editingProduct.createdAt,
        });
      } else {
        const newProductRef = push(ref(db, 'products'));
        await set(newProductRef, {
          ...formData,
          createdAt: Date.now(),
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-brand-gray w-full max-w-2xl rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] border border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Image</label>
              <div 
                className={cn(
                  "relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden",
                  formData.imageBase64 ? "border-brand-orange/50" : "border-white/10 hover:border-brand-orange/30"
                )}
                onClick={() => document.getElementById('image-input')?.click()}
              >
                {formData.imageBase64 ? (
                  <>
                    <img src={formData.imageBase64} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="text-gray-600 mb-2" size={48} />
                    <p className="text-xs text-gray-500">Tap to upload image</p>
                  </>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <input 
                  id="image-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-orange" 
                  placeholder="E.g. Premium Silk Scarf"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-brand-gray">{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (₦)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock</label>
                  <input 
                    required
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData(p => ({ ...p, stock: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Description</label>
             <textarea 
               value={formData.description}
               onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
               className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none" 
               placeholder="Tell more about this product..."
             />
          </div>

          <div className="flex flex-wrap gap-6 p-4 bg-white/5 rounded-2xl">
             <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.featured}
                  onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))}
                  className="w-5 h-5 accent-brand-orange" 
                />
                <span className="text-sm font-medium">Featured Product</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.newArrival}
                  onChange={e => setFormData(p => ({ ...p, newArrival: e.target.checked }))}
                  className="w-5 h-5 accent-brand-orange" 
                />
                <span className="text-sm font-medium">New Arrival</span>
             </label>
          </div>

          <button 
            type="submit" 
            disabled={isSaving || !formData.imageBase64}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <div className="flex items-center gap-2"><Check /> Save Product</div>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const handleDeleteProduct = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await remove(ref(db, `products/${id}`));
  }
};
