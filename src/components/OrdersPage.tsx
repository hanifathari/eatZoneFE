import { User, Order } from '../App';
import { ArrowLeft, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

type OrdersPageProps = {
  user: User;
  orders: Order[];
  onBack: () => void;
};

const STATUS_CONFIG = {
  pending_payment: { label: 'Menunggu Pembayaran', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
  payment_uploaded: { label: 'Pembayaran Diupload', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
  confirmed: { label: 'Dikonfirmasi', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  ready: { label: 'Siap Diambil', color: 'text-green-600', bg: 'bg-green-50', icon: Package },
  completed: { label: 'Selesai', color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle },
  cancelled: { label: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
};

export function OrdersPage({ user, orders, onBack }: OrdersPageProps) {
  const sortedOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Pesanan Saya</h2>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Belum ada pesanan</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-500">Pesanan #{order.id}</p>
                      <p className="text-gray-500">
                        {order.createdAt.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${statusConfig.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                      <span className={statusConfig.color}>{statusConfig.label}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-gray-600">
                          <span>
                            {item.menuItem.name} x{item.quantity}
                          </span>
                          <span>
                            Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>Rp {order.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {order.pickupTime && (
                    <div className="bg-blue-50 px-4 py-3 rounded-xl flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800">
                        Waktu Pengambilan: {order.pickupTime}
                      </span>
                    </div>
                  )}

                  {order.paymentProof && (
                    <div className="mt-4">
                      <p className="text-gray-600 mb-2">Bukti Pembayaran:</p>
                      <img
                        src={order.paymentProof}
                        alt="Payment proof"
                        className="max-w-xs rounded-xl border"
                      />
                    </div>
                  )}

                  {order.status === 'confirmed' && (
                    <div className="mt-4 bg-green-50 px-4 py-3 rounded-xl">
                      <p className="text-green-800">
                        Pesanan Anda sedang disiapkan. Anda bisa mengambil makanan pada jam yang telah ditentukan.
                      </p>
                    </div>
                  )}

                  {order.status === 'ready' && (
                    <div className="mt-4 bg-green-50 px-4 py-3 rounded-xl">
                      <p className="text-green-800">
                        Pesanan Anda sudah siap! Silakan ambil di kantin.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
