import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Order, OrderItem, CustomerInfo } from '../types';
import { getMenuItemPrice } from '../utils/menuPriceHelper';

const ORDERS_COLLECTION = 'orders';

const detectDeviceType = (): 'mobile' | 'desktop' => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ? 'mobile' : 'desktop';
};

const detectBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung Internet';
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
  if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  return 'Unknown';
};

const detectOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.indexOf('Windows') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'macOS';
  if (ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
  return 'Unknown';
};

const extractDeliveryZone = (address: string): string => {
  const match = address.match(/\d{5}/);
  if (match) {
    return match[0];
  }
  const parts = address.split(',');
  return parts[parts.length - 1]?.trim() || 'Unknown';
};

export async function createOrder(
  items: OrderItem[],
  customerInfo: CustomerInfo,
  totalAmount: number
): Promise<string> {
  const deviceInfo = {
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    platform: navigator.platform,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOS(),
  };

  let ipAddress: string | undefined;
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    ipAddress = ipData.ip;
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
  }

  const orderData = {
    customerName: customerInfo.name,
    customerAddress: customerInfo.address,
    customerPhone: customerInfo.phone,
    note: customerInfo.note || '',
    items: items.map(item => ({
      menuItemId: item.menuItem.id,
      menuItemName: item.menuItem.name,
      menuItemNumber: item.menuItem.number,
      menuItemPrice: item.menuItem.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize || null,
      selectedIngredients: item.selectedIngredients || [],
      selectedExtras: item.selectedExtras || [],
      selectedPastaType: item.selectedPastaType || null,
      selectedSauce: item.selectedSauce || null,
      selectedSideDish: item.selectedSideDish || null,
      selectedExclusions: item.selectedExclusions || [],
    })),
    totalAmount,
    createdAt: Timestamp.now(),
    deviceInfo,
    ipAddress: ipAddress || 'unknown',
    status: 'pending',
    deliveryType: 'delivery',
    deliveryZone: extractDeliveryZone(customerInfo.address),
  };

  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
  return docRef.id;
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();

    const items = data.items.map((item: any) => {
      const price = item.menuItemPrice || getMenuItemPrice(item.menuItemId, item.menuItemName);

      return {
        menuItem: {
          id: item.menuItemId,
          number: item.menuItemNumber,
          name: item.menuItemName,
          price: price,
        },
        quantity: item.quantity,
        selectedSize: item.selectedSize || undefined,
        selectedIngredients: item.selectedIngredients || undefined,
        selectedExtras: item.selectedExtras || undefined,
        selectedPastaType: item.selectedPastaType || undefined,
        selectedSauce: item.selectedSauce || undefined,
        selectedSideDish: item.selectedSideDish || undefined,
        selectedExclusions: item.selectedExclusions || undefined,
      };
    });

    return {
      id: doc.id,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      customerPhone: data.customerPhone,
      note: data.note,
      items,
      totalAmount: data.totalAmount,
      createdAt: data.createdAt.toDate(),
      deviceInfo: data.deviceInfo,
      ipAddress: data.ipAddress,
      status: data.status,
      deliveryType: data.deliveryType || 'delivery',
      deliveryZone: data.deliveryZone || 'Unknown',
    } as Order;
  });
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, { status });
}

export async function deleteOrder(orderId: string): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await deleteDoc(orderRef);
}
