import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="bg-gray-700 text-white p-3 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} AI Browser Automation Platform. All rights reserved.</p>
      <p className="text-xs text-gray-400">Powered by Gemini & React</p>
    </div>
  );
};

export default Footer;
