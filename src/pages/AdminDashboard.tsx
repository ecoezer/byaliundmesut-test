import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Monitor,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { logoutAdmin } from '../lib/adminAuth';
import type { Order } from '../types';

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  topCustomers: { phone: string; name: string; orders: number; revenue: number }[];
  recentOrders: Order[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
      calculateAnalytics(fetchedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (ordersList: Order[]) => {
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = ordersList.filter(o => o.status === 'pending').length;
    const completedOrders = ordersList.filter(o => o.status === 'completed').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const customerMap = new Map<string, { name: string; orders: number; revenue: number }>();
    ordersList.forEach(order => {
      const existing = customerMap.get(order.customerPhone);
      if (existing) {
        existing.orders++;
        existing.revenue += order.totalAmount;
      } else {
        customerMap.set(order.customerPhone, {
          name: order.customerName,
          orders: 1,
          revenue: order.totalAmount
        });
      }
    });

    const topCustomers = Array.from(customerMap.entries())
      .map(([phone, data]) => ({ phone, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recentOrders = ordersList.slice(0, 10);

    setAnalytics({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue,
      topCustomers,
      recentOrders
    });
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'pending' || order.status === 'processing';
    if (filter === 'completed') return order.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-500" />
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gesamtbestellungen</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gesamtumsatz</p>
                    <p className="text-3xl font-bold text-gray-900">€{analytics.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ausstehend</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.pendingOrders}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Durchschnitt</p>
                    <p className="text-3xl font-bold text-gray-900">€{analytics.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {analytics.topCustomers.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Top Kunden
                </h2>
                <div className="space-y-3">
                  {analytics.topCustomers.map((customer, index) => (
                    <div key={customer.phone} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 text-orange-600 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">€{customer.revenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{customer.orders} Bestellungen</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Bestellungen
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Alle ({orders.length})
                    </button>
                    <button
                      onClick={() => setFilter('pending')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Ausstehend ({analytics.pendingOrders})
                    </button>
                    <button
                      onClick={() => setFilter('completed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'completed' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Abgeschlossen ({analytics.completedOrders})
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Keine Bestellungen gefunden
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {order.customerPhone}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {order.customerAddress}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleString('de-DE')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</p>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="mt-2 text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                          >
                            {expandedOrder === order.id ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                Weniger
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                Details
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Bestellte Artikel</h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                  <div className="font-medium">{item.quantity}x {item.menuItem.name}</div>
                                  {item.selectedSize && (
                                    <div className="text-gray-600">Größe: {item.selectedSize.name}</div>
                                  )}
                                  {item.selectedExtras && item.selectedExtras.length > 0 && (
                                    <div className="text-gray-600">Extras: {item.selectedExtras.join(', ')}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.note && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Anmerkung</h4>
                              <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">{order.note}</p>
                            </div>
                          )}

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Geräteinformationen</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                  <Globe className="w-4 h-4" />
                                  IP-Adresse
                                </div>
                                <div className="font-mono text-gray-900">{order.ipAddress || 'N/A'}</div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                  <Monitor className="w-4 h-4" />
                                  Auflösung
                                </div>
                                <div className="font-mono text-gray-900">{order.deviceInfo.screenResolution}</div>
                              </div>
                              <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                                <div className="text-gray-600 mb-1">User Agent</div>
                                <div className="font-mono text-xs text-gray-900 break-all">{order.deviceInfo.userAgent}</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Status ändern</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(order.id, 'pending')}
                                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                              >
                                Ausstehend
                              </button>
                              <button
                                onClick={() => handleStatusChange(order.id, 'processing')}
                                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                              >
                                In Bearbeitung
                              </button>
                              <button
                                onClick={() => handleStatusChange(order.id, 'completed')}
                                className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                              >
                                Abgeschlossen
                              </button>
                              <button
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                              >
                                Storniert
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
