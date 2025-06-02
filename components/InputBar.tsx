import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Search } from 'lucide-react'; // Or any other relevant icon

interface InputBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  buttonText?: string;
  showButton?: boolean;
  initialValue?: string;
}

const InputBar: React.FC<InputBarProps> = ({
  onSearch,
  placeholder = "Enter search term...",
  buttonText = "Search",
  showButton = true,
  initialValue = ""
}) => {
  const [inputValue, setInputValue] = useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full bg-white rounded-lg shadow p-1">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-grow p-2 text-gray-700 focus:outline-none rounded-l-md"
      />
      {showButton && (
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 px-4 rounded-r-md hover:bg-blue-600 focus:outline-none flex items-center"
        >
          <Search size={18} className="mr-1" />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default InputBar;
