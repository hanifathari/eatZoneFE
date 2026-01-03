import { useState, useEffect } from 'react';
import { User, CartItem } from '../App';
import { ArrowLeft, Minus, Plus, Trash2, Upload, Clock } from 'lucide-react';

type CartPageProps = {
  user: User;
  cart: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: (paymentProof: string, pickupTime: string) => void;
};

export function CartPage({ user, cart, onBack, onUpdateQuantity, onCheckout }: CartPageProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [pickupTime, setPickupTime] = useState('');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);

  const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  useEffect(() => {
    if (showCheckout && countdown === null) {
      setCountdown(60); // 1 menit = 60 detik
    }
  }, [showCheckout, countdown]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto-cancel order
      alert('Waktu pembayaran habis. Pesanan dibatalkan.');
      setShowCheckout(false);
      setCountdown(null);
      onBack();
    }
  }, [countdown, onBack]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulasi upload - dalam aplikasi nyata akan upload ke server
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = () => {
    if (!paymentProof) {
      alert('Silakan upload bukti pembayaran');
      return;
    }
    if (!pickupTime) {
      alert('Silakan pilih waktu pengambilan');
      return;
    }
    onCheckout(paymentProof, pickupTime);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white">Keranjang</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">Keranjang Anda kosong</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => setShowCheckout(false)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white">Pembayaran</h2>
        </div>

        {/* Countdown Timer */}
        {countdown !== null && (
          <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            <span>
              Selesaikan pembayaran dalam: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
            </span>
          </div>
        )}

        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h3 className="text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.menuItem.name} x{item.quantity}
                  </span>
                  <span className="text-gray-800">
                    Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6">
            <h3 className="text-gray-800 mb-4">Informasi Transfer</h3>
            <div className="bg-blue-50 p-4 rounded-xl mb-4">
              <p className="text-blue-800">Bank BCA</p>
              <p className="text-blue-800">1234567890</p>
              <p className="text-blue-800">a.n. eatZone</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6">
            <h3 className="text-gray-800 mb-4">Waktu Pengambilan</h3>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6">
            <h3 className="text-gray-800 mb-4">Upload Bukti Pembayaran</h3>
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                {paymentProof ? (
                  <div>
                    <p className="text-green-600 mb-2">Bukti pembayaran berhasil diupload</p>
                    <img
                      src={paymentProof}
                      alt="Payment proof"
                      className="max-w-xs mx-auto rounded-xl"
                    />
                  </div>
                ) : (
                  <p className="text-gray-600">Klik untuk upload bukti pembayaran</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          <button
            onClick={handleSubmitPayment}
            disabled={!paymentProof || !pickupTime}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Keranjang ({cart.length})</h2>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.menuItem.id} className="bg-white rounded-2xl p-4 flex gap-4">
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">{item.menuItem.name}</h3>
                <p className="text-gray-500 mb-3">{item.menuItem.canteen}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-gray-800 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800">
                      Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onUpdateQuantity(item.menuItem.id, 0)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg h-fit"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
        >
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  );
}
