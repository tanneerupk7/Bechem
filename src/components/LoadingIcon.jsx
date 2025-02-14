import React from 'react';

const BlinkBlur = ({ color = "#ffd407", size = "medium", text ="", textColor = "" }) => {
  const sizeMap = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16"
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`${spinnerSize} relative`}>
        <div 
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: color, opacity: 0.2 }}
        ></div>
        <div 
          className="relative rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        ></div>
      </div>
      {text && (
        <p 
          className="mt-4 text-lg font-medium"
          style={{ color: textColor || color }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default BlinkBlur;