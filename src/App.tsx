import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { CartPage } from './components/CartPage';
import { OrdersPage } from './components/OrdersPage';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  canteen: string;
  canteenId: string;
  available: boolean;
  sellerId: string;
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending_payment' | 'payment_uploaded' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentProof?: string;
  pickupTime?: string;
  createdAt: Date;
  sellerId: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'home' | 'chat' | 'cart' | 'orders'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    setCurrentPage('login');
  };

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.menuItem.id === item.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { menuItem: item, quantity }];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.menuItem.id !== itemId));
    } else {
      setCart(prev => prev.map(i => 
        i.menuItem.id === itemId ? { ...i, quantity } : i
      ));
    }
  };

  const createOrder = (paymentProof: string, pickupTime: string) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0),
      status: 'payment_uploaded',
      paymentProof,
      pickupTime,
      createdAt: new Date(),
      sellerId: cart[0]?.menuItem.sellerId || '',
    };
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setCurrentPage('orders');
  };

  const openChat = (sellerId: string) => {
    setSelectedSeller(sellerId);
    setCurrentPage('chat');
  };

  if (!user) {
    return currentPage === 'login' 
      ? <LoginPage 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentPage('register')} 
        />
      : <RegisterPage 
          onRegister={handleRegister} 
          onSwitchToLogin={() => setCurrentPage('login')} 
        />;
  }

  return (
    <>
      {currentPage === 'home' && (
        <HomePage 
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          onAddToCart={addToCart}
          onOpenChat={openChat}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        />
      )}
      {currentPage === 'chat' && selectedSeller && (
        <ChatPage 
          user={user}
          sellerId={selectedSeller}
          onBack={() => setCurrentPage('home')}
          onAddToCart={addToCart}
        />
      )}
      {currentPage === 'cart' && (
        <CartPage 
          user={user}
          cart={cart}
          onBack={() => setCurrentPage('home')}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={createOrder}
        />
      )}
      {currentPage === 'orders' && (
        <OrdersPage 
          user={user}
          orders={orders}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </>
  );
}
