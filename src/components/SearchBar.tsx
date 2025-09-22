import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Suche nach Gerichten, Zutaten oder Nummern..."
          className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-full focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all bg-gray-50 hover:bg-white"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Suche löschen"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {searchQuery && (
        <div className="absolute top-full left-0 mt-1 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm border whitespace-nowrap">
          Suche nach: "<span className="font-medium text-orange-600">{searchQuery}</span>"
        </div>
      )}
    </div>
  );
};

export default SearchBar;