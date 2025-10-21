import { collection, onSnapshot, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, ensureFirebaseInitialized } from '../lib/firebase';
import { Order } from '../types';

export type OrderStatus = 'new' | 'accepted' | 'closed';

export interface MonitorOrder extends Order {
  monitorStatus: OrderStatus;
}

type OrderCallback = (orders: MonitorOrder[]) => void;
type NewOrderCallback = (order: MonitorOrder) => void;

class OrderMonitorService {
  private unsubscribe: (() => void) | null = null;
  private seenOrderIds = new Set<string>();

  startListening(
    onOrdersUpdate: OrderCallback,
    onNewOrder: NewOrderCallback
  ): void {
    ensureFirebaseInitialized();

    if (!db) {
      throw new Error('Firebase database is not initialized');
    }

    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    this.unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orders: MonitorOrder[] = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();

          const items = data.items.map((item: any) => ({
            menuItem: {
              id: item.menuItemId,
              number: item.menuItemNumber,
              name: item.menuItemName,
              price: item.menuItemPrice,
            },
            quantity: item.quantity,
            selectedSize: item.selectedSize || undefined,
            selectedIngredients: item.selectedIngredients || undefined,
            selectedExtras: item.selectedExtras || undefined,
            selectedPastaType: item.selectedPastaType || undefined,
            selectedSauce: item.selectedSauce || undefined,
            selectedSideDish: item.selectedSideDish || undefined,
            selectedExclusions: item.selectedExclusions || undefined,
          }));

          const order: MonitorOrder = {
            id: doc.id,
            customerName: data.customerName,
            customerAddress: data.customerAddress,
            customerPhone: data.customerPhone,
            note: data.note,
            items,
            totalAmount: data.totalAmount,
            createdAt: data.createdAt?.toDate() || new Date(),
            deviceInfo: data.deviceInfo,
            ipAddress: data.ipAddress,
            status: data.status,
            deliveryType: data.deliveryType,
            deliveryZone: data.deliveryZone,
            monitorStatus: data.monitorStatus || 'new'
          };

          orders.push(order);

          if (!this.seenOrderIds.has(order.id) && order.monitorStatus === 'new') {
            this.seenOrderIds.add(order.id);
            if (this.seenOrderIds.size > 1) {
              onNewOrder(order);
            }
          } else {
            this.seenOrderIds.add(order.id);
          }
        });

        orders.sort((a, b) => {
          const statusOrder = { new: 0, accepted: 1, closed: 2 };
          if (a.monitorStatus !== b.monitorStatus) {
            return statusOrder[a.monitorStatus] - statusOrder[b.monitorStatus];
          }
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        onOrdersUpdate(orders);
      },
      (error) => {
        console.error('Error listening to orders:', error);
      }
    );
  }

  stopListening(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.seenOrderIds.clear();
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      ensureFirebaseInitialized();

      if (!db) {
        throw new Error('Firebase database is not initialized');
      }

      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        monitorStatus: status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async acceptOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'accepted');
  }

  async closeOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'closed');
  }
}

export const orderMonitorService = new OrderMonitorService();
