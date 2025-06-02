import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Bookmark, Settings, Search } from 'lucide-react';

interface BrowserControlsProps {
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
  initialUrl?: string;
}

const BrowserControls: React.FC<BrowserControlsProps> = ({
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  onHome,
  initialUrl = 'https://www.google.com'
}) => {
  const [url, setUrl] = useState<string>(initialUrl);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleGo = () => {
    if (url.trim()) {
      // Basic URL validation: ensure it starts with http:// or https://
      if (!/^https?:\/\//i.test(url.trim())) {
        onNavigate('http://' + url.trim());
      } else {
        onNavigate(url.trim());
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGo();
    }
  };

  return (
    <div className="bg-gray-200 p-2 flex items-center space-x-2 shadow-md">
      <button onClick={onGoBack} className="p-2 rounded hover:bg-gray-300" title="Back">
        <ArrowLeft size={20} />
      </button>
      <button onClick={onGoForward} className="p-2 rounded hover:bg-gray-300" title="Forward">
        <ArrowRight size={20} />
      </button>
      <button onClick={onRefresh} className="p-2 rounded hover:bg-gray-300" title="Refresh">
        <RotateCw size={20} />
      </button>
      <button onClick={onHome} className="p-2 rounded hover:bg-gray-300" title="Home">
        <Home size={20} />
      </button>

      <div className="flex-grow flex items-center bg-white rounded border border-gray-300">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter URL (e.g., google.com)"
          className="p-2 w-full rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleGo} className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 focus:outline-none" title="Go">
          <Search size={20} />
        </button>
      </div>

      <button className="p-2 rounded hover:bg-gray-300" title="Bookmark (Not Implemented)">
        <Bookmark size={20} />
      </button>
      <button className="p-2 rounded hover:bg-gray-300" title="Settings (Not Implemented)">
        <Settings size={20} />
      </button>
    </div>
  );
};

export default BrowserControls;
