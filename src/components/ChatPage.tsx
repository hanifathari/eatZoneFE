import { useState, useEffect, useRef } from 'react';
import { User } from '../App';
import { ArrowLeft, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

type ChatPageProps = {
  user: User;
  sellerId: string;
  onBack: () => void;
  onAddToCart: (item: any, quantity: number) => void;
};

type Message = {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: Date;
  type?: 'text' | 'confirmation' | 'timeout';
};

const SELLER_NAMES: Record<string, string> = {
  'seller-1': 'Kantin Pusat',
  'seller-2': 'Kantin Teknik',
  'seller-3': 'Kantin FEB',
};

export function ChatPage({ user, sellerId, onBack }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'seller',
      text: 'Halo! Ada yang bisa saya bantu?',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sellerName = SELLER_NAMES[sellerId] || 'Penjual';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (waitingForResponse) {
      // Simulasi timeout 1 menit - untuk demo kita pakai 5 detik
      const timeout = setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          sender: 'seller',
          text: 'Maaf, makanan sedang tidak tersedia saat ini.',
          timestamp: new Date(),
          type: 'timeout',
        }]);
        setWaitingForResponse(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [waitingForResponse]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulasi pertanyaan tentang ketersediaan
    if (inputText.toLowerCase().includes('tersedia') || 
        inputText.toLowerCase().includes('ready') ||
        inputText.toLowerCase().includes('ada')) {
      setWaitingForResponse(true);
      
      // Simulasi respons penjual (70% kemungkinan tersedia)
      const isAvailable = Math.random() > 0.3;
      
      setTimeout(() => {
        if (isAvailable) {
          setMessages(prev => [...prev, {
            id: `msg-${Date.now()}`,
            sender: 'seller',
            text: 'Ya, makanan tersedia. Anda bisa memesan sekarang!',
            timestamp: new Date(),
            type: 'confirmation',
          }]);
          setWaitingForResponse(false);
        }
      }, 2000);
    } else {
      // Auto-reply untuk pesan lain
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          sender: 'seller',
          text: 'Silakan tanyakan ketersediaan menu yang ingin Anda pesan.',
          timestamp: new Date(),
        }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-white">{sellerName}</h2>
          <p className="text-white/90">Online</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-blue-800">
            Penjual akan merespons dalam 1 menit. Jika tidak ada respons, sistem akan otomatis memberi notifikasi bahwa makanan tidak tersedia.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'buyer'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : message.type === 'confirmation'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : message.type === 'timeout'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                {message.type === 'confirmation' && (
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Tersedia</span>
                  </div>
                )}
                {message.type === 'timeout' && (
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-4 h-4" />
                    <span>Tidak Tersedia</span>
                  </div>
                )}
                <p>{message.text}</p>
                <p className={`mt-1 ${
                  message.sender === 'buyer' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {waitingForResponse && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan... (contoh: 'Apakah nasi goreng tersedia jam 12?')"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
