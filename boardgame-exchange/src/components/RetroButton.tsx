import React from 'react';

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const RetroButton: React.FC<RetroButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="font-retro px-8 py-4 bg-fantasy-secondary text-fantasy-text
                 border-4 border-fantasy-accent 
                 relative overflow-hidden
                 hover:bg-fantasy-primary active:transform active:translate-y-1
                 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
                 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]
                 transition-all duration-150 ease-in-out"
    >
      {children}
    </button>
  );
};

export default RetroButton;