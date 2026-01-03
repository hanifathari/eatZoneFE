import { useState } from 'react';
import { User, MenuItem } from '../App';
import { Search, ShoppingCart, LogOut, MessageCircle, UtensilsCrossed } from 'lucide-react';

type HomePageProps = {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'cart' | 'orders') => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onOpenChat: (sellerId: string) => void;
  cartCount: number;
};

// Mock data menu
const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1680674814945-7945d913319c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZm9vZCUyMG5hc2klMjBnb3Jlbmd8ZW58MXx8fHwxNzY1MjY2MDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    canteen: 'Kantin Pusat',
    canteenId: 'canteen-1',
    available: true,
    sellerId: 'seller-1',
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWUlMjBheWFtJTIwbm9vZGxlc3xlbnwxfHx8fDE3NjUyMDcyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    canteen: 'Kantin Pusat',
    canteenId: 'canteen-1',
    available: true,
    sellerId: 'seller-1',
  },
  {
    id: '3',
    name: 'Bakso Sapi',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1722239312531-486bbfd50f18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtzbyUyMG1lYXRiYWxsJTIwc291cHxlbnwxfHx8fDE3NjUyNjYwNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    canteen: 'Kantin Teknik',
    canteenId: 'canteen-2',
    available: true,
    sellerId: 'seller-2',
  },
  {
    id: '4',
    name: 'Ayam Goreng Crispy',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW58ZW58MXx8fHwxNzY1MjIzMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    canteen: 'Kantin Teknik',
    canteenId: 'canteen-2',
    available: true,
    sellerId: 'seller-2',
  },
  {
    id: '5',
    name: 'Sate Ayam',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1703946908870-200ef3067952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlJTIwc2F0YXl8ZW58MXx8fHwxNzY1MjY2MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    canteen: 'Kantin FEB',
    canteenId: 'canteen-3',
    available: true,
    sellerId: 'seller-3',
  },
  {
    id: '6',
    name: 'Gado-Gado',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1707269561481-a4a0370a980a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWRvJTIwZ2FkbyUyMHNhbGFkfGVufDF8fHx8MTc2NTE2MzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    canteen: 'Kantin FEB',
    canteenId: 'canteen-3',
    available: true,
    sellerId: 'seller-3',
  },
];

export function HomePage({ user, onLogout, onNavigate, onAddToCart, onOpenChat, cartCount }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCanteen, setSelectedCanteen] = useState<string>('all');

  const canteens = Array.from(new Set(MOCK_MENU.map(item => item.canteen)));

  const filteredMenu = MOCK_MENU.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.canteen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCanteen = selectedCanteen === 'all' || item.canteenId === selectedCanteen;
    return matchesSearch && matchesCanteen;
  });

  const handleChatWithSeller = (sellerId: string) => {
    onOpenChat(sellerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-white">eatZone</h1>
                <p className="text-white/90">Halo, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('orders')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
              >
                Pesanan
              </button>
              <button
                onClick={() => onNavigate('cart')}
                className="relative bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu atau kantin..."
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Canteen Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCanteen('all')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                selectedCanteen === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Kantin
            </button>
            {canteens.map((canteen) => {
              const canteenId = MOCK_MENU.find(m => m.canteen === canteen)?.canteenId || '';
              return (
                <button
                  key={canteenId}
                  onClick={() => setSelectedCanteen(canteenId)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                    selectedCanteen === canteenId
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {canteen}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredMenu.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada menu yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full">
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-gray-500 mb-4">{item.canteen}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChatWithSeller(item.sellerId)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                    <button
                      onClick={() => onAddToCart(item, 1)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      + Keranjang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
