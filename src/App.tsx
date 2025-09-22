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
import { ShoppingCart, ChevronUp, ChevronDown, X, Phone } from 'lucide-react';
import { MenuItem, PizzaSize } from './types';

// =================== CONSTANTS ===================
const SCROLL_CONFIG = {
  DELAY: 100,
  NAVBAR_HEIGHT: 140,
  MOBILE_OFFSET: 120,
  DESKTOP_OFFSET: 50,
  ANIMATION_DURATION: 1500,
  MOBILE_BREAKPOINT: 1024
};

const CONTACT_INFO = {
  PHONE: '01577 1459166',
  WHATSAPP_URL: 'https://wa.me/+4915771459166'
};

const CART_SELECTORS = [
  '[data-cart-section="true"]',
  'div[class*="Ihre Bestellung"]',
  '.lg\\:sticky',
  '#cart'
];

const BUTTON_CLASSES = {
  whatsapp: 'bg-gradient-to-r from-green-400 via-emerald-500 via-green-500 to-teal-400 text-white py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 relative overflow-hidden group shadow-lg',
  cart: 'fixed top-2 sm:top-3 md:top-4 right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 hover:scale-110 active:scale-95 transition-all duration-300 ease-out drop-shadow-lg border-2 border-white/80 rounded-xl p-1.5 sm:p-2 md:p-2.5 bg-white/10 backdrop-blur-sm group/cart cursor-pointer z-50',
  cart: 'fixed top-2 sm:top-3 md:top-4 right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 hover:scale-105 transition-transform duration-200 ease-out drop-shadow-lg border-2 border-white/80 rounded-xl p-1 sm:p-1.5 md:p-1.5 bg-white/10 backdrop-blur-sm group/cart cursor-pointer z-50',
  scrollButton: 'fixed right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 border-2 border-white/50 hover:scale-110 active:scale-95'
};

const MENU_SECTIONS = {
  PIZZA: 'pizza',
  FLEISCHGERICHTE: 'fleischgerichte',
  SNACKS: 'snacks',
  VEGETARISCHE_GERICHTE: 'vegetarische-gerichte',
  CROQUES: 'croques',
  SALATE: 'salate',
  DIPS: 'dips',
  GETRAENKE: 'getraenke'
};

// =================== UTILITY FUNCTIONS ===================
const isDevelopment = process.env.NODE_ENV === 'development';

const debugLog = (message, data) => {
  if (isDevelopment) {
    console.log(message, data);
  }
};

function App() {
  // =================== STORE STATE ===================
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  // =================== LOCAL STATE ===================
  const [isMobile, setIsMobile] = useState(window.innerWidth < SCROLL_CONFIG.MOBILE_BREAKPOINT);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // =================== EFFECTS ===================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < SCROLL_CONFIG.MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll detection for showing/hiding scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButtons(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug logging for menu items
  useEffect(() => {
    console.log('App: Menu items loaded:', {
      pizzas: pizzas.length,
      fleischgerichte: fleischgerichte.length,
      snacks: snacks.length,
      salads: salads.length,
      dips: dips.length,
      drinks: drinks.length
    });
  }, []);

  // =================== MEMOIZED VALUES ===================
  const totalItemsCount = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );

  // =================== CART ANIMATION FUNCTIONS ===================
  const triggerCartAnimation = useCallback(() => {
    setCartAnimation(true);
    setTimeout(() => setCartAnimation(false), 1000);
  }, []);
  // =================== HELPER FUNCTIONS ===================
  const findCartElement = useCallback(() => {
    for (const selector of CART_SELECTORS) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          debugLog('Cart element found with selector:', selector);
          return element;
        }
      } catch (error) {
        console.warn(`Selector failed: ${selector}`, error);
      }
    }

    // Fallback: Search by text content
    try {
      const allElements = document.querySelectorAll('*');
      for (let element of allElements) {
        if (element.textContent && element.textContent.includes('Ihre Bestellung')) {
          const container = element.closest('div') || element;
          debugLog('Cart element found by text search:', container);
          return container;
        }
      }
    } catch (error) {
      console.warn('Text search failed:', error);
    }

    // Last resort: Grid container's last column
    try {
      const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
      if (gridContainer && gridContainer.children.length > 0) {
        const lastColumn = gridContainer.children[gridContainer.children.length - 1];
        debugLog('Cart element found as grid last column:', lastColumn);
        return lastColumn;
      }
    } catch (error) {
      console.warn('Grid search failed:', error);
    }

    return null;
  }, []);

  const calculateScrollPosition = useCallback((element) => {
    try {
      const navbar = document.querySelector('.fixed.top-0');
      const navbarHeight = navbar ? navbar.offsetHeight : SCROLL_CONFIG.NAVBAR_HEIGHT;
      const extraOffset = isMobile ? SCROLL_CONFIG.MOBILE_OFFSET : SCROLL_CONFIG.DESKTOP_OFFSET;
      
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const finalPosition = rect.top + scrollTop - navbarHeight - extraOffset;
      
      debugLog('Scroll calculation:', {
        navbarHeight,
        extraOffset,
        isMobile,
        finalPosition
      });
      
      return Math.max(0, finalPosition);
    } catch (error) {
      console.error('Scroll position calculation failed:', error);
      return 0;
    }
  }, [isMobile]);

  const animateCartHighlight = useCallback((element) => {
    try {
      if (!element) return;

      const animations = {
        transition: 'all 0.8s ease-in-out',
        transform: 'scale(1.05)',
        boxShadow: '0 25px 50px rgba(239, 68, 68, 0.3)',
        border: '4px solid #ef4444',
        borderRadius: '20px',
        backgroundColor: 'rgba(239, 68, 68, 0.08)'
      };

      // Apply animations
      Object.assign(element.style, animations);

      // Reset animations
      setTimeout(() => {
        try {
          Object.assign(element.style, {
            transform: 'scale(1)',
            boxShadow: 'none',
            border: '4px solid transparent',
            backgroundColor: 'transparent'
          });
        } catch (resetError) {
          console.warn('Animation reset failed:', resetError);
        }
      }, SCROLL_CONFIG.ANIMATION_DURATION);

      debugLog('✅ Cart highlight animation applied');
    } catch (error) {
      console.error('Animation failed:', error);
    }
  }, []);

  const performFallbackScroll = useCallback(() => {
    try {
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = Math.max(0, pageHeight - windowHeight - 200);
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
      
      debugLog('Fallback scroll executed:', scrollPosition);
    } catch (error) {
      console.error('Fallback scroll failed:', error);
    }
  }, []);

  // =================== SCROLL FUNCTIONS ===================
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  // =================== MAIN SCROLL FUNCTION ===================
  const scrollToCart = useCallback((e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      debugLog('Cart scroll initiated...');
      
      setTimeout(() => {
        try {
          const cartElement = findCartElement();
          
          if (cartElement) {
            const scrollPosition = calculateScrollPosition(cartElement);
            
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
            
            animateCartHighlight(cartElement);
            debugLog('✅ Scroll completed successfully!');
          } else {
            console.error('❌ Cart element not found!');
            performFallbackScroll();
          }
        } catch (scrollError) {
          console.error('Scroll execution failed:', scrollError);
          performFallbackScroll();
        }
      }, SCROLL_CONFIG.DELAY);
    } catch (error) {
      console.error('ScrollToCart failed:', error);
    }
  }, [findCartElement, calculateScrollPosition, animateCartHighlight, performFallbackScroll]);

  // =================== MEMOIZED CALLBACKS ===================
  const memoizedAddItem = useCallback((menuItem: MenuItem, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => {
    addItem(menuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce);
    triggerCartAnimation();
  }, [addItem]);

  const memoizedRemoveItem = useCallback((id: number, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => {
    removeItem(id, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce);
  }, [removeItem]);

  const memoizedUpdateQuantity = useCallback((id: number, quantity: number, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => {
    updateQuantity(id, quantity, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce);
  }, [updateQuantity]);

  const memoizedClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  // =================== MOBILE CART FUNCTIONS ===================
  const toggleMobileCart = useCallback(() => {
    setShowMobileCart(prev => !prev);
  }, []);

  const closeMobileCart = useCallback(() => {
    setShowMobileCart(false);
  }, []);

  // Close mobile cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileCart && isMobile) {
        const cartElement = document.getElementById('mobile-cart-sidebar');
        const buttonElement = document.getElementById('mobile-cart-button');
        
        if (cartElement && buttonElement && 
            !cartElement.contains(event.target as Node) && 
            !buttonElement.contains(event.target as Node)) {
          setShowMobileCart(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileCart, isMobile]);

  // =================== RENDER HELPER FUNCTIONS ===================
  // Filter menu items based on search query
  const filterItems = useCallback((items: MenuItem[]) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.number.toString().includes(query)
    );
  }, [searchQuery]);

  // Check if search has results
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
  const renderCartButton = () => (
    <button
      onClick={scrollToCart}
      type="button"
      aria-label={`Warenkorb anzeigen. ${totalItemsCount} Artikel`}
      aria-describedby="cart-count"
      className={`${BUTTON_CLASSES.cart} ${cartAnimation ? 'animate-cart-added' : ''}`}
    >
      <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover/cart:animate-bounce ${cartAnimation ? 'animate-cart-shake' : ''}`} aria-hidden="true" />
      <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${cartAnimation ? 'animate-cart-shake' : ''}`} aria-hidden="true" />
      
      <span id="cart-count" className="sr-only">
        {totalItemsCount} Artikel im Warenkorb
      </span>
      
      {totalItemsCount > 0 ? (
        <span 
          className={`absolute -bottom-0.5 -right-0.5 px-0.5 sm:px-1 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold min-w-[1rem] sm:min-w-[1.25rem] h-4 sm:h-5 flex justify-center items-center animate-bounce border-2 border-white shadow-lg ${cartAnimation ? 'animate-cart-badge-pulse' : ''}`}
          aria-hidden="true"
        >
          {totalItemsCount}
        </span>
      ) : (
        <div 
          className='absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full animate-ping opacity-75'
          aria-hidden="true"
        ></div>
      )}
    </button>
  );

  const renderScrollButtons = () => (
    showScrollButtons && (
      <div className="fixed right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 bottom-20 sm:bottom-24 flex flex-col gap-2 z-40">
        <button
          onClick={scrollToTop}
          className={BUTTON_CLASSES.scrollButton}
          aria-label="Nach oben scrollen"
          title="Nach oben scrollen"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={scrollToBottom}
          className={BUTTON_CLASSES.scrollButton}
          aria-label="Nach unten scrollen"
          title="Nach unten scrollen"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    )
  );

  const renderMobileCartButton = () => (
    isMobile && totalItemsCount > 0 && (
      <button
        id="mobile-cart-button"
        onClick={toggleMobileCart}
        className={`fixed bottom-4 left-4 right-4 bg-orange-500 text-white py-2 px-4 rounded-full shadow-xl flex items-center justify-center z-50 transition-all duration-300 transform hover:scale-101`}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="relative flex-shrink-0">
          <div className={`w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center ${cartAnimation ? 'animate-cart-mobile-pulse' : ''}`}>
            <ShoppingCart className={`w-4 h-4 ${cartAnimation ? 'animate-cart-shake' : ''}`} />
          </div>
          {totalItemsCount > 0 && (
            <span className={`absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold ${cartAnimation ? 'animate-cart-badge-pulse' : ''}`}>
              {totalItemsCount}
            </span>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <span className="font-medium text-lg">
            Warenkorb ansehen ({items.reduce((sum, item) => {
              const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
              const extrasPrice = (item.selectedExtras?.length || 0) * 1.00;
              return sum + ((basePrice + extrasPrice) * item.quantity);
            }, 0).toFixed(2).replace('.', ',')} €)
          </span>
        </div>
      </button>
    )
  );

  const renderMobileCartSidebar = () => (
    isMobile && showMobileCart && (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileCart}
        />
        
        {/* Mobile Cart Sidebar */}
        <div 
          id="mobile-cart-sidebar"
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50 max-h-[85vh] flex flex-col animate-slide-up"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-orange-500 text-white rounded-t-xl flex-shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Warenkorb ({totalItemsCount})
            </h2>
            <button
              onClick={closeMobileCart}
              className="p-2 hover:bg-orange-600 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Cart Content */}
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
    )
  );

  const renderMenuSection = useCallback((id, title, description, items, subTitle) => {
    const filteredItems = filterItems(items || []);
    
    // Don't render section if no items match search
    if (searchQuery.trim() && filteredItems.length === 0) {
      return null;
    }
    
    return (
      <div key={id} id={id} className='scroll-mt-[6.5rem]'>
        <MenuSection
          title={title}
          description={description}
          subTitle={subTitle}
          items={filteredItems}
          bgColor='bg-orange-500'
          onAddToOrder={memoizedAddItem}
        />
      </div>
    );
  }, [memoizedAddItem, filterItems]);

  // =================== MAIN RENDER ===================
  return (
    <div className='min-h-dvh bg-gray-50'>
      <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'>
        <div className="bg-white py-3">
          <div className="container mx-auto px-4 max-w-7xl lg:pr-80">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <h1 className='text-sm sm:text-base font-bold tracking-tighter text-gray-900 relative animate-fade-in'>
                  <span className='relative'>
                    by Ali und Mesut
                  </span>
                  <div className='text-red-600 text-xs font-medium mt-0.5 tracking-normal'>
                    Lieferservice
                  </div>
                </h1>
              </div>
              <div className="flex-1">
                <SearchBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
              <div className="flex-shrink-0">
                <img 
                  src="/Untitled-1.png" 
                  alt="by Ali und Mesut Logo" 
                  className="h-10 w-10 rounded-full shadow-lg object-cover border-4 border-orange-200"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200"></div>
        <Navigation />
      </div>

      {/* Desktop Cart Sidebar */}
      <div className='hidden lg:block fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-[60] overflow-y-auto'>
        <OrderForm
          orderItems={items}
          onRemoveItem={memoizedRemoveItem}
          onUpdateQuantity={memoizedUpdateQuantity}
          onClearCart={memoizedClearCart}
        />
      </div>

      <div className='pt-24 lg:pr-80'>
        <div className="lg:pr-80">
          <Header />
        </div>

        <main className='container mx-auto px-6 py-6 max-w-5xl lg:max-w-none'>
          {/* Search Results Message */}
          {searchQuery.trim() && !hasSearchResults && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                Keine Ergebnisse für "<span className="font-medium text-orange-600">{searchQuery}</span>"
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-orange-500 hover:text-orange-600 underline"
              >
                Suche zurücksetzen
              </button>
            </div>
          )}

          {/* Menu Sections */}
          {hasSearchResults && (
            <>
              {renderMenuSection(
                MENU_SECTIONS.FLEISCHGERICHTE,
                'Fleischgerichte',
                'Döner, Dürüm, Lahmacun und mehr - frisch zubereitet mit bestem Fleisch',
                fleischgerichte
              )}

              {renderMenuSection(
                MENU_SECTIONS.SNACKS,
                'Snacks',
                'Kleine Gerichte und Menüs für zwischendurch',
                snacks
              )}

              {renderMenuSection(
                MENU_SECTIONS.VEGETARISCHE_GERICHTE,
                'Vegetarische Gerichte',
                'Leckere fleischlose Alternativen - Halloumi, Falafel und mehr',
                vegetarischeGerichte
              )}

              {renderMenuSection(
                MENU_SECTIONS.PIZZA,
                'Pizza',
                'Frisch gebackene Pizzen in verschiedenen Größen - von klassisch bis kreativ',
                pizzas
              )}

              {renderMenuSection(
                MENU_SECTIONS.CROQUES,
                'Croques',
                'Knusprig überbackene Croques mit verschiedenen Füllungen',
                croques
              )}

              {renderMenuSection(
                MENU_SECTIONS.SALATE,
                'Salate',
                'Frische Salate mit verschiedenen Dressings',
                salads
              )}

              {renderMenuSection(
                MENU_SECTIONS.DIPS,
                'Dips & Soßen',
                'Leckere Dips und Soßen zu Ihren Gerichten',
                dips
              )}

              {renderMenuSection(
                MENU_SECTIONS.GETRAENKE,
                'Getränke',
                'Erfrischende Getränke für jeden Geschmack',
                drinks
              )}
            </>
          )}
        </main>

        <Footer />
      </div>

      {renderScrollButtons()}
      {renderMobileCartButton()}
      {renderMobileCartSidebar()}
    </div>
  );
}

export default App;