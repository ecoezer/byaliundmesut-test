import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import OrderForm from './components/OrderForm';
import SearchBar from './components/SearchBar';
import {
  salads,
  dips,
  drinks,
  fleischgerichte,
  pizzas,
  snacks,
  vegetarischeGerichte,
  croques,
} from './data/menuItems';
import { useCartStore } from './store/cart.store';
import { ShoppingCart, ChevronUp, ChevronDown, X } from 'lucide-react';
import { MenuItem, PizzaSize } from './types';

// Constants (cleaned, no duplicates)
const SCROLL_CONFIG = {
  DELAY: 100,
  NAVBAR_HEIGHT: 140,
  MOBILE_OFFSET: 120,
  DESKTOP_OFFSET: 50,
  ANIMATION_DURATION: 1500,
  MOBILE_BREAKPOINT: 1024
};

const BUTTON_CLASSES = {
  whatsapp: 'bg-gradient-to-r from-green-400 to-teal-400 text-white py-2 px-2 group shadow-lg',
  cart: 'fixed top-2 right-2 hover:scale-105 transition-transform duration-200 drop-shadow-lg border-2 border-white/80 rounded-xl p-1 bg-white/10 backdrop-blur-sm cursor-pointer z-50',
  scrollButton: 'fixed right-2 bottom-20 w-10 h-10 bg-orange-500 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-40 border-2 border-white/50 hover:scale-110'
};

const MENU_SECTIONS = [
  { id: 'fleischgerichte', title: 'Drehspieß', description: 'Döner, Dürüm, Lahmacun und mehr', items: fleischgerichte },
  { id: 'snacks', title: 'Snacks', description: 'Kleine Gerichte und Menüs', items: snacks },
  { id: 'vegetarische-gerichte', title: 'Vegetarische Gerichte', description: 'Fleischlose Alternativen', items: vegetarischeGerichte },
  { id: 'pizza', title: 'Pizza', description: 'Frisch gebackene Pizzen', items: pizzas },
  { id: 'croques', title: 'Croques', description: 'Knusprig überbacken', items: croques },
  { id: 'salate', title: 'Salate', description: 'Frische Salate', items: salads },
  { id: 'dips', title: 'Dips & Soßen', description: 'Leckere Dips und Soßen', items: dips },
  { id: 'getraenke', title: 'Getränke', description: 'Erfrischende Getränke', items: drinks }
];

function App() {
  // Cart store logic
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  // Local state
  const [isMobile, setIsMobile] = useState(window.innerWidth < SCROLL_CONFIG.MOBILE_BREAKPOINT);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Responsive updates
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < SCROLL_CONFIG.MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollButtons(window.pageYOffset > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart badge calculation
  const totalItemsCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  // Animation logic
  const triggerCartAnimation = useCallback(() => {
    setCartAnimation(true);
    setTimeout(() => setCartAnimation(false), 1000);
  }, []);

  // Add/remove/update item callbacks
  const memoizedAddItem = useCallback((menuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish) => {
    addItem(menuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish);
    triggerCartAnimation();
  }, [addItem, triggerCartAnimation]);
  const memoizedRemoveItem = useCallback((id, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish) =>
    removeItem(id, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish), [removeItem]);
  const memoizedUpdateQuantity = useCallback((id, quantity, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish) =>
    updateQuantity(id, quantity, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish), [updateQuantity]);
  const memoizedClearCart = useCallback(() => clearCart(), [clearCart]);

  // Mobile cart toggling
  const toggleMobileCart = useCallback(() => setShowMobileCart(prev => !prev), []);
  const closeMobileCart = useCallback(() => setShowMobileCart(false), []);

  // Mobile cart close on outside click
  useEffect(() => {
    const handleClickOutside = event => {
      if (showMobileCart && isMobile) {
        const cartElement = document.getElementById('mobile-cart-sidebar');
        const buttonElement = document.getElementById('mobile-cart-button');
        if (
          cartElement &&
          buttonElement &&
          !cartElement.contains(event.target) &&
          !buttonElement.contains(event.target)
        ) setShowMobileCart(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileCart, isMobile]);

  // Search-based filtering
  const filterItems = useCallback((itemsArr) => {
    if (!searchQuery.trim()) return itemsArr;
    const query = searchQuery.toLowerCase();
    return itemsArr.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.number?.toString().includes(query)
    );
  }, [searchQuery]);

  // Search results memo
  const hasSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return true;
    const allItems = [
      ...fleischgerichte,
      ...snacks,
      ...vegetarischeGerichte,
      ...pizzas,
      ...croques,
      ...salads,
      ...dips,
      ...drinks
    ];
    return filterItems(allItems).length > 0;
  }, [searchQuery, filterItems]);

  // Render helpers are inlined for brevity
  return (
    <div className='min-h-dvh bg-gray-50'>
      <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'>
        <div className="bg-white py-3">
          <div className="container mx-auto px-4 max-w-7xl lg:pr-80 flex items-center gap-4">
            <h1 className='text-sm font-bold text-gray-900'>
              <span>by Ali und Mesut</span>
              <div className='text-red-600 text-xs font-medium mt-0.5'>Lieferservice</div>
            </h1>
            <div className="flex-1">
              <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>
            <img src="/Untitled-1.png" alt="Logo" className="h-10 w-10 rounded-full shadow-lg object-cover border-4 border-orange-200"/>
          </div>
        </div>
        <Navigation />
      </div>

      {/* Desktop Cart */}
      <div className='hidden lg:block fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 overflow-y-auto'>
        <OrderForm
          orderItems={items}
          onRemoveItem={memoizedRemoveItem}
          onUpdateQuantity={memoizedUpdateQuantity}
          onClearCart={memoizedClearCart}
        />
      </div>

      <div className='pt-32 lg:pr-80'>
        <Header />
        <main className='container mx-auto px-6 py-6 max-w-5xl'>
          {searchQuery.trim() && !hasSearchResults && (
            <div className="text-center py-12 text-gray-500">
              Keine Ergebnisse für "<span className="font-medium text-orange-600">{searchQuery}</span>"
              <button onClick={() => setSearchQuery('')} className="text-orange-500 hover:text-orange-600 underline ml-2">Suche zurücksetzen</button>
            </div>
          )}
          {hasSearchResults && MENU_SECTIONS.map(section => {
            const filtered = filterItems(section.items);
            if (searchQuery.trim() && filtered.length === 0) return null;
            return (
              <div key={section.id} id={section.id} className='scroll-mt-32'>
                <MenuSection
                  title={section.title}
                  description={section.description}
                  items={filtered}
                  bgColor='bg-orange-500'
                  onAddToOrder={memoizedAddItem}
                />
              </div>
            );
          })}
        </main>
        <Footer />
      </div>

      {/* Scroll Buttons */}
      {showScrollButtons && (
        <div className="fixed right-2 bottom-20 flex flex-col gap-2 z-40">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className={BUTTON_CLASSES.scrollButton}>
            <ChevronUp className="w-5 h-5" />
          </button>
          <button onClick={() => window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'})} className={BUTTON_CLASSES.scrollButton}>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile Cart Button */}
      {isMobile && totalItemsCount > 0 && (
        <button id="mobile-cart-button" onClick={toggleMobileCart}
          className={`fixed bottom-4 left-4 right-4 bg-orange-500 text-white py-2 px-4 rounded-full shadow-xl flex items-center justify-center z-50`}>
          <div className="relative flex-shrink-0">
            <div className={`w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center ${cartAnimation ? 'animate-cart-mobile-pulse' : ''}`}>
              <ShoppingCart className={`w-4 h-4 ${cartAnimation ? 'animate-cart-shake' : ''}`} />
            </div>
            {totalItemsCount > 0 && (
              <span className={`absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold`}>
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="font-medium text-lg ml-2">
            Warenkorb ansehen ({items.reduce((sum, item) => {
              const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
              const extrasPrice = (item.selectedExtras?.length || 0) * 1.00;
              return sum + ((basePrice + extrasPrice) * item.quantity);
            }, 0).toFixed(2).replace('.', ',')} €)
          </span>
        </button>
      )}

      {/* Mobile Cart Sidebar */}
      {isMobile && showMobileCart && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMobileCart}/>
          <div id="mobile-cart-sidebar"
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50 max-h-[85vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b bg-orange-500 text-white rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Warenkorb ({totalItemsCount})
              </h2>
              <button onClick={closeMobileCart}
                className="p-2 hover:bg-orange-600 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              <OrderForm
                orderItems={items}
                onRemoveItem={memoizedRemoveItem}
                onUpdateQuantity={memoizedUpdateQuantity}
                onClearCart={memoizedClearCart}
                onCloseMobileCart={closeMobileCart}
                hideTitle={true}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
