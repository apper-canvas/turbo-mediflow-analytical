import { useState } from 'react';
import Input from '../atoms/Input';
import ApperIcon from '../ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearch = (value) => {
    setQuery(value);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);
    
    setDebounceTimer(timer);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        icon="Search"
        className="pr-10"
      />
      
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;