import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('fleischgerichte');
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    ['fleischgerichte', 'Fleischgerichte'],
    ['snacks', 'Snacks'],
    ['vegetarische-gerichte', 'Vegetarische Gerichte'],
    ['pizza', 'Pizza'],
    ['croques', 'Croques'],
    ['salate', 'Salate'],
    ['dips', 'Dips & Soßen'],
    ['getraenke', 'Getränke']
  ];

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check scroll position and update arrow visibility
  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    // Add a small buffer (5px) to account for rounding errors and ensure we only show arrows when actually needed
    const isScrollable = scrollWidth > clientWidth + 5;
    
    // Only show arrows if content actually overflows and scrolling is needed
    if (!isScrollable) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }
    
    // Show left arrow only if we can scroll left (not at the beginning)
    setShowLeftArrow(scrollLeft > 10);
    // Show right arrow only if we can scroll right (not at the end)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Update arrow visibility on scroll and resize
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => updateArrowVisibility();
    const handleResize = () => {
      setTimeout(updateArrowVisibility, 100);
    };
    
    // Also listen for content changes that might affect scrollability
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateArrowVisibility, 50);
    });
    
    resizeObserver.observe(container);

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial check
    setTimeout(updateArrowVisibility, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0.1 }
    );

    const sections = document.querySelectorAll('div[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.6;
    const currentScroll = container.scrollLeft;
    const targetScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, currentScroll + scrollAmount);
    
    container.scrollTo({ 
      left: targetScroll, 
      behavior: 'smooth' 
    });
  };

  const handleItemClick = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 lg:pr-80">
      <div className="max-w-7xl mx-auto px-4 lg:pr-0 lg:max-w-none">
        <div className="flex items-center h-16">
          
          {/* Left Arrow */}
          {isMobile && showLeftArrow && (
            <div className="flex-shrink-0 pr-2">
              <button
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Nach links scrollen"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide flex-1 lg:justify-center px-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory'
            }}
          >
            {navigationItems.map(([id, label], index) => {
              const isActive = activeSection === id;
              
              return (
                <button
                  key={id}
                  onClick={() => handleItemClick(id)}
                  className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          {isMobile && showRightArrow && (
            <div className="flex-shrink-0 pl-2">
              <button
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Nach rechts scrollen"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Navigation;