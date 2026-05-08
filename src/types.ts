export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'admin' | 'user';
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageBase64: string;
  featured: boolean;
  newArrival: boolean;
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  createdAt: number;
}

export type Category = 'All' | 'Electronics' | 'Fashion' | 'Home' | 'Beauty' | 'Groceries';
