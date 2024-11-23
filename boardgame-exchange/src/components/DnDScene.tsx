import React from 'react';

const DnDScene: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 overflow-hidden">
      {/* Tło sceny */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0f] via-[#2c1810] to-transparent">
        {/* Smok */}
        <div className="absolute bottom-0 w-full h-48 flex justify-center items-end">
          <div className="relative w-96 h-48 animate-float" style={{ animationDuration: '6s' }}>
            {/* Ciało smoka */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32 
                          bg-[#8B0000] rounded-t-full rotate-180 shadow-2xl
                          before:content-[''] before:absolute before:top-0 before:left-0 
                          before:w-full before:h-full before:bg-gradient-to-b 
                          before:from-[#FF0000] before:to-transparent before:opacity-30">
            </div>
            
            {/* Skrzydła */}
            <div className="absolute bottom-16 left-0 w-32 h-24 animate-wing-left">
              <div className="w-full h-full bg-[#8B0000] rounded-l-full transform -skew-x-12"></div>
            </div>
            <div className="absolute bottom-16 right-0 w-32 h-24 animate-wing-right">
              <div className="w-full h-full bg-[#8B0000] rounded-r-full transform skew-x-12"></div>
            </div>

            {/* Głowa */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-16 h-24 
                          bg-[#8B0000] rounded-t-full">
              {/* Oczy */}
              <div className="absolute top-4 left-2 w-3 h-3 bg-yellow-500 rounded-full 
                            animate-pulse shadow-lg shadow-yellow-500/50"></div>
              <div className="absolute top-4 right-2 w-3 h-3 bg-yellow-500 rounded-full 
                            animate-pulse shadow-lg shadow-yellow-500/50"></div>
              
              {/* Smocze płomienie */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="dragon-fire"></div>
                  <div className="dragon-fire-particles"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Magiczne kości */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 animate-float-dice"
            style={{
              left: `${20 + i * 20}%`,
              bottom: `${20 + Math.random() * 40}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            <div className="w-full h-full relative transform rotate-45 bg-[#f9d71c] 
                          border-2 border-[#FFD700] shadow-lg">
              <span className="absolute inset-0 flex items-center justify-center 
                             text-[#8B0000] font-bold transform -rotate-45">
                {Math.floor(Math.random() * 20) + 1}
              </span>
            </div>
          </div>
        ))}

        {/* Magiczne cząsteczki */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-magic-particle"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DnDScene;