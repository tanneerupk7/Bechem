import React from 'react';

const FourSquare = ({ color = "#FBB900", size = "medium", text = "#FBB900", textColor = "#FBB900" }) => {
  const sizeMap = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16"
  };

  const squareSize = sizeMap[size] || sizeMap.medium;
  const containerSize = size === "small" ? "h-16 w-16" : size === "large" ? "h-32 w-32" : "h-24 w-24";

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`${containerSize} relative`}>
        <div className="grid grid-cols-2 gap-2">
          <div 
            className={`${squareSize} animate-pulse`}
            style={{ backgroundColor: color, animationDelay: '0s' }}
          />
          <div 
            className={`${squareSize} animate-pulse`}
            style={{ backgroundColor: color, animationDelay: '0.2s' }}
          />
          <div 
            className={`${squareSize} animate-pulse`}
            style={{ backgroundColor: color, animationDelay: '0.3s' }}
          />
          <div 
            className={`${squareSize} animate-pulse`}
            style={{ backgroundColor: color, animationDelay: '0.1s' }}
          />
        </div>
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

export default FourSquare;