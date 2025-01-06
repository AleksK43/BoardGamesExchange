import { Search, MapPin } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface SearchComponentProps {
  onSearch: (searchTerm: string, searchType: 'title' | 'city') => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'city'>('title');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      onSearch(value, searchType);
    }, 300);

    setTypingTimeout(timeout);
  };

  const getPlaceholder = () => {
    if (searchType === 'title') {
      return 'Search for legendary games...';
    }
    return 'Search by realm (city)...';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-amber-900/20 rounded-lg py-3 px-4 pl-11
                   text-amber-100 placeholder-amber-100/50 border border-amber-900/30
                   focus:border-amber-500 focus:outline-none transition-colors
                   font-crimson text-lg"
        />
        {searchType === 'title' ? (
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-amber-500" />
        ) : (
          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-amber-500" />
        )}
      </div>
      
      <div className="flex gap-2">
        {['title', 'city'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSearchType(type as 'title' | 'city');
              onSearch(searchTerm, type as 'title' | 'city');
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none
                     font-medieval whitespace-nowrap
                     ${searchType === type
                       ? 'bg-amber-800/50 text-amber-100 border-2 border-amber-500/50'
                       : 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300'
                     }`}
          >
            {type === 'title' ? 'By Quest Name' : 'By Realm'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;