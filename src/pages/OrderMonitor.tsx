import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { monitorAuth } from '../lib/monitorAuth';
import { orderMonitorService, MonitorOrder } from '../services/orderMonitorService';
import { audioNotificationService } from '../services/audioNotificationService';
import { LogOut, Volume2, VolumeX, TestTube, Bell, BellOff, CheckCircle, Package, Search, Filter } from 'lucide-react';
import { formatPrice } from '../utils/menuPriceHelper';

export default function OrderMonitor() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<MonitorOrder[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClosed, setShowClosed] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!monitorAuth.isAuthenticated()) {
      navigate('/monitor-login');
      return;
    }

    audioNotificationService.initialize();

    const enableAudio = () => {
      audioNotificationService.test();
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio, { once: true });

    orderMonitorService.startListening(
      (updatedOrders) => {
        setOrders(updatedOrders);
        setIsConnected(true);
      },
      (newOrder) => {
        if (!isMuted) {
          audioNotificationService.play();
        }
      }
    );

    return () => {
      orderMonitorService.stopListening();
      audioNotificationService.stop();
      document.removeEventListener('click', enableAudio);
    };
  }, [navigate, isMuted]);

  const handleLogout = () => {
    monitorAuth.logout();
    navigate('/monitor-login');
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await orderMonitorService.acceptOrder(orderId);
      audioNotificationService.stop();
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleCloseOrder = async (orderId: string) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await orderMonitorService.closeOrder(orderId);
      } catch (error) {
        console.error('Error closing order:', error);
      }
    }
  };

  const handleToggleMute = () => {
    const newMutedState = audioNotificationService.toggleMute();
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioNotificationService.setVolume(newVolume);
  };

  const handleTestAudio = () => {
    audioNotificationService.test();
  };

  const filteredOrders = orders.filter(order => {
    if (!showClosed && order.monitorStatus === 'closed') return false;
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(search) ||
      order.customerPhone.includes(search) ||
      order.id.toLowerCase().includes(search)
    );
  });

  const newOrdersCount = orders.filter(o => o.monitorStatus === 'new').length;

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Order Monitor</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-slate-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {newOrdersCount > 0 && (
                <div className="flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full animate-pulse">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">
                    {newOrdersCount} New
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-700 rounded-lg px-3 py-2">
                <button
                  onClick={handleToggleMute}
                  className="text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20"
                />
                <button
                  onClick={handleTestAudio}
                  className="text-slate-300 hover:text-white transition-colors"
                  title="Test Audio"
                >
                  <TestTube className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowClosed(!showClosed)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showClosed
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>{showClosed ? 'Hide' : 'Show'} Closed</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No orders to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAcceptOrder}
                onClose={handleCloseOrder}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface OrderCardProps {
  order: MonitorOrder;
  onAccept: (orderId: string) => void;
  onClose: (orderId: string) => void;
}

function OrderCard({ order, onAccept, onClose }: OrderCardProps) {
  const statusColors = {
    new: 'border-red-500 bg-red-500/10',
    accepted: 'border-blue-500 bg-blue-500/10',
    closed: 'border-slate-600 bg-slate-800/50'
  };

  const statusLabels = {
    new: 'NEW ORDER',
    accepted: 'ACCEPTED',
    closed: 'CLOSED'
  };

  return (
    <div
      className={`border-2 rounded-lg p-6 transition-all ${statusColors[order.monitorStatus]} ${
        order.monitorStatus === 'new' ? 'animate-pulse' : ''
      }`}
      onClick={() => order.monitorStatus === 'new' && onAccept(order.id)}
      style={{ cursor: order.monitorStatus === 'new' ? 'pointer' : 'default' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              order.monitorStatus === 'new' ? 'bg-red-500 text-white' :
              order.monitorStatus === 'accepted' ? 'bg-blue-500 text-white' :
              'bg-slate-600 text-slate-300'
            }`}>
              {statusLabels[order.monitorStatus]}
            </span>
            <span className="text-slate-400 text-sm">
              {order.createdAt.toLocaleString()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{order.customerName}</h3>
          <p className="text-slate-300">{order.customerPhone}</p>
          <p className="text-slate-300">{order.customerAddress}</p>
          {order.note && (
            <p className="text-yellow-400 mt-2 text-sm">Note: {order.note}</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-white">{formatPrice(order.totalAmount)}</p>
          <p className="text-slate-400 text-sm">Order #{order.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 mb-4">
        <h4 className="text-sm font-semibold text-slate-400 mb-3">ORDER ITEMS</h4>
        <div className="space-y-3">
          {order.items.map((item, index) => {
            const basePrice = item.selectedSize?.price || item.menuItem?.price || 0;
            const extrasPrice = (item.selectedExtras?.length || 0) * 1.00;
            const itemPrice = basePrice + extrasPrice;
            const totalItemPrice = itemPrice * item.quantity;

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="text-slate-200 font-medium">
                      {item.quantity}x {item.menuItem?.name || 'Unknown Item'}
                      {item.selectedSize && ` (${item.selectedSize.name})`}
                    </div>

                    {item.selectedPastaType && (
                      <div className="text-slate-400 text-xs mt-1 ml-4">
                        → {item.selectedPastaType}
                      </div>
                    )}

                    {item.selectedSauce && (
                      <div className="text-slate-400 text-xs mt-1 ml-4">
                        → Sauce: {item.selectedSauce}
                      </div>
                    )}

                    {item.selectedSideDish && (
                      <div className="text-slate-400 text-xs mt-1 ml-4">
                        → Beilage: {item.selectedSideDish}
                      </div>
                    )}

                    {item.menuItem?.isMeatSelection && item.selectedIngredients && item.selectedIngredients.length > 0 && (
                      <div className="text-slate-400 text-xs mt-1 ml-4">
                        → {item.selectedIngredients.join(', ')}
                      </div>
                    )}

                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="text-orange-400 text-xs mt-1 ml-4">
                        → Extras (+{formatPrice(extrasPrice)}): {item.selectedExtras.join(', ')}
                      </div>
                    )}

                    {item.selectedExclusions && item.selectedExclusions.length > 0 && (
                      <div className="text-red-400 text-xs mt-1 ml-4">
                        → Without: {item.selectedExclusions.join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="text-white font-medium ml-4">{formatPrice(totalItemPrice)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {order.monitorStatus === 'accepted' && (
        <div className="flex justify-end">
          <button
            onClick={() => onClose(order.id)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Mark as Delivered</span>
          </button>
        </div>
      )}

      {order.monitorStatus === 'new' && (
        <div className="flex justify-end">
          <button
            onClick={() => onAccept(order.id)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg font-semibold"
          >
            <BellOff className="w-6 h-6" />
            <span>Accept Order</span>
          </button>
        </div>
      )}
    </div>
  );
}
