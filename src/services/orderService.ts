import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Order, OrderItem, CustomerInfo } from '../types';

const ORDERS_COLLECTION = 'orders';

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
      quantity: item.quantity,
      selectedSize: item.selectedSize || null,
      selectedIngredients: item.selectedIngredients || [],
      selectedExtras: item.selectedExtras || [],
      selectedPastaType: item.selectedPastaType || null,
      selectedSauce: item.selectedSauce || null,
      selectedSideDish: item.selectedSideDish || null,
    })),
    totalAmount,
    createdAt: Timestamp.now(),
    deviceInfo,
    ipAddress: ipAddress || 'unknown',
    status: 'pending',
  };

  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
  return docRef.id;
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();

    const items = data.items.map((item: any) => ({
      menuItem: {
        id: item.menuItemId,
        number: item.menuItemNumber,
        name: item.menuItemName,
        price: 0,
      },
      quantity: item.quantity,
      selectedSize: item.selectedSize || undefined,
      selectedIngredients: item.selectedIngredients || undefined,
      selectedExtras: item.selectedExtras || undefined,
      selectedPastaType: item.selectedPastaType || undefined,
      selectedSauce: item.selectedSauce || undefined,
      selectedSideDish: item.selectedSideDish || undefined,
    }));

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
    } as Order;
  });
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, { status });
}
