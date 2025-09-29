import React, { useState, useCallback } from 'react';
import { X, Plus, ShoppingCart } from 'lucide-react';
import { MenuItem, PizzaSize } from '../types';
import { 
  wunschPizzaIngredients, pizzaExtras, pastaTypes, 
  sauceTypes, saladSauceTypes, beerTypes, meatTypes 
} from '../data/menuItems';

interface ItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (
    menuItem: MenuItem, 
    selectedSize?: PizzaSize, 
    selectedIngredients?: string[], 
    selectedExtras?: string[],
    selectedPastaType?: string,
    selectedSauce?: string
  ) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onAddToOrder }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize | undefined>(
    item.sizes ? item.sizes[0] : undefined
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedPastaType, setSelectedPastaType] = useState<string>(
    item.isPasta ? pastaTypes[0] : ''
  );
  const [selectedSauce, setSelectedSauce] = useState<string>('');
  const [selectedMeatType, setSelectedMeatType] = useState<string>(
    item.isMeatSelection ? meatTypes[0] : ''
  );
  const [currentStep, setCurrentStep] = useState<'meat' | 'sauce' | 'complete'>('meat');

  const handleIngredientToggle = useCallback((ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else if (prev.length < 4) {
        return [...prev, ingredient];
      }
      return prev;
    });
  }, []);

  const handleExtraToggle = useCallback((extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  }, []);

  const calculatePrice = useCallback(() => {
    let basePrice = selectedSize ? selectedSize.price : item.price;
    const extrasPrice = selectedExtras.length * 1.00;
    return basePrice + extrasPrice;
  }, [item.price, selectedSize, selectedExtras]);

  const handleAddToCart = useCallback(() => {
    // For meat selection items, check if we need to go to sauce selection step
    if (item.isMeatSelection && currentStep === 'meat') {
      setCurrentStep('sauce');
      return;
    }
    
    onAddToOrder(
      item,
      selectedSize,
      selectedIngredients,
      selectedExtras,
      selectedPastaType || undefined,
      selectedSauce || selectedMeatType || undefined
    );
    onClose();
  }, [item, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedMeatType, onAddToOrder, onClose, currentStep]);

  const getSauceOptions = useCallback(() => {
    if (item.id >= 568 && item.id <= 573 && item.isSpezialitaet) {
      return saladSauceTypes;
    }
    return sauceTypes;
  }, [item.id, item.isSpezialitaet]);

  const handleBackToMeat = useCallback(() => {
    setCurrentStep('meat');
    setSelectedSauce(''); // Reset sauce selection when going back
  }, []);

  const getModalTitle = useCallback(() => {
    if (item.isMeatSelection) {
      if (currentStep === 'meat') {
        return 'Schritt 1: Fleischauswahl';
      } else if (currentStep === 'sauce') {
        return 'Schritt 2: Soße wählen';
      }
    }
    return `Nr. ${item.number} ${item.name}`;
  }, [item, currentStep]);

  const getButtonText = useCallback(() => {
    if (item.isMeatSelection && currentStep === 'meat') {
      return 'Weiter zur Soßenauswahl';
    }
    return `Hinzufügen - ${calculatePrice().toFixed(2).replace('.', ',')} €`;
  }, [item.isMeatSelection, currentStep, calculatePrice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-orange-500 text-white p-4 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{getModalTitle()}</h2>
            {currentStep === 'meat' && item.description && (
              <p className="text-sm opacity-90 mt-1">{item.description}</p>
            )}
            )}
            {currentStep === 'meat' && item.description && (
            )}
            {currentStep === 'sauce' && (
              <p className="text-sm opacity-90 mt-1">
                {selectedMeatType} - Nr. {item.number} {item.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {item.isMeatSelection && currentStep === 'sauce' && (
              <button
                onClick={handleBackToMeat}
                className="p-2 hover:bg-orange-600 rounded-full transition-colors"
                title="Zurück zur Fleischauswahl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
            onClick={onClose}
            className="p-2 hover:bg-orange-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Step indicator for meat selection items */}
          {item.isMeatSelection && (
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className={`flex items-center space-x-2 ${currentStep === 'meat' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'meat' ? 'bg-orange-500 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Fleisch</span>
              </div>
              <div className={`w-8 h-px ${currentStep === 'sauce' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'sauce' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'sauce' ? 'bg-orange-500 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Soße</span>
              </div>
            </div>
          )}

          {/* Size Selection */}
          {item.sizes && (!item.isMeatSelection || currentStep !== 'sauce') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Größe wählen *</h3>
              <div className="space-y-2">
                {item.sizes.map((size) => (
                  <label
                    key={size.name}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSize?.name === size.name
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="size"
                        value={size.name}
                        checked={selectedSize?.name === size.name}
                        onChange={() => setSelectedSize(size)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-medium">{size.name}</div>
                        {size.description && (
                          <div className="text-sm text-gray-600">{size.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-orange-600">
                      {size.price.toFixed(2).replace('.', ',')} €
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Wunsch Pizza Ingredients */}
          {item.isWunschPizza && (!item.isMeatSelection || currentStep !== 'sauce') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Zutaten wählen ({selectedIngredients.length}/4) *
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto ingredients-scroll">
                {wunschPizzaIngredients.map((ingredient) => (
                  <label
                    key={ingredient}
                    className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                      selectedIngredients.includes(ingredient)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    } ${
                      !selectedIngredients.includes(ingredient) && selectedIngredients.length >= 4
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                      disabled={!selectedIngredients.includes(ingredient) && selectedIngredients.length >= 4}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span>{ingredient}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pizza Extras */}
          {(item.isPizza || item.isWunschPizza) && (!item.isMeatSelection || currentStep !== 'sauce') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Extras (+1,00€ pro Extra)
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {pizzaExtras.map((extra) => (
                  <label
                    key={extra}
                    className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                      selectedExtras.includes(extra)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra)}
                      onChange={() => handleExtraToggle(extra)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span>{extra}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pasta Type Selection */}
          {item.isPasta && (!item.isMeatSelection || currentStep !== 'sauce') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Nudelsorte wählen *</h3>
              <div className="space-y-2">
                {pastaTypes.map((pastaType) => (
                  <label
                    key={pastaType}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPastaType === pastaType
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pastaType"
                      value={pastaType}
                      checked={selectedPastaType === pastaType}
                      onChange={(e) => setSelectedPastaType(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="font-medium">{pastaType}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Meat Selection - Only show in step 1 */}
          {item.isMeatSelection && currentStep === 'meat' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Fleischauswahl *</h3>
              <div className="space-y-2">
                {meatTypes.map((meatType) => (
                  <label
                    key={meatType}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMeatType === meatType
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="meatType"
                      value={meatType}
                      checked={selectedMeatType === meatType}
                      onChange={(e) => setSelectedMeatType(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="font-medium">{meatType}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sauce Selection */}
          {((item.isSpezialitaet && ![81, 82].includes(item.id) && !item.isMeatSelection) || 
            (item.id >= 568 && item.id <= 573 && item.isSpezialitaet) ||
            (item.isMeatSelection && currentStep === 'sauce')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                {item.id >= 568 && item.id <= 573 ? 'Dressing wählen' : 'Soße wählen'} 
                {(item.isMeatSelection && currentStep === 'sauce') || 
                 (item.isSpezialitaet && ![81, 82].includes(item.id)) ? ' *' : ''}
              </h3>
              <div className="space-y-2">
                {getSauceOptions().map((sauce) => (
                  <label
                    key={sauce}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSauce === sauce
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sauce"
                      value={sauce}
                      checked={selectedSauce === sauce}
                      onChange={(e) => setSelectedSauce(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="font-medium">{sauce}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {/* Beer Selection */}
          {item.isBeerSelection && (!item.isMeatSelection || currentStep !== 'sauce') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Bier wählen *</h3>
              <div className="space-y-2">
                {beerTypes.map((beer) => (
                  <label
                    key={beer}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSauce === beer
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="beer"
                      value={beer}
                      checked={selectedSauce === beer}
                      onChange={(e) => setSelectedSauce(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="font-medium">{beer}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="sticky bottom-0 bg-white pt-4 border-t">
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {item.isMeatSelection && currentStep === 'meat' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {getButtonText()}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {getButtonText()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;