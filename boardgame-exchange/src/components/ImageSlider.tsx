import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  className?: string;
}

const ImageSlider = ({ images, className = '' }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`${className} bg-gradient-to-b from-amber-900/20 to-amber-950/20 
                     border border-amber-900/30 rounded-t-lg
                     flex items-center justify-center overflow-hidden`}>
        <img
          src="/placeholder-game.jpg"
          alt="Placeholder"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (slideIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(slideIndex);
  };

  return (
    <div className={`${className} relative group h-full 
                   bg-gradient-to-b from-amber-900/20 to-amber-950/20 
                   border border-amber-900/30 rounded-t-lg overflow-hidden
                   before:absolute before:inset-0 before:z-10 
                   before:shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]`}>
      {/* Current Image */}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500
                 group-hover:scale-105"
      />

      {/* Navigation Arrows - pokazują się tylko gdy jest więcej niż 1 zdjęcie */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                     bg-gradient-to-r from-amber-700/80 to-amber-800/80 
                     hover:from-amber-600/80 hover:to-amber-700/80
                     p-2 rounded-full text-amber-100
                     opacity-0 group-hover:opacity-100
                     transition-all duration-300 transform 
                     hover:scale-110 shadow-lg border border-amber-500/30"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                     bg-gradient-to-r from-amber-700/80 to-amber-800/80 
                     hover:from-amber-600/80 hover:to-amber-700/80
                     p-2 rounded-full text-amber-100
                     opacity-0 group-hover:opacity-100
                     transition-all duration-300 transform 
                     hover:scale-110 shadow-lg border border-amber-500/30"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20
                       flex space-x-2 bg-gradient-to-r from-amber-900/90 to-amber-800/90
                       rounded-full px-3 py-2 border border-amber-500/30
                       opacity-0 group-hover:opacity-100 transition-all duration-300
                       shadow-lg backdrop-blur-sm">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(index, e)}
                className={`transition-all duration-300 
                         ${currentIndex === index 
                           ? 'w-6 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                           : 'w-2 h-2 bg-amber-500/50 hover:bg-amber-400/75 rounded-full'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t 
                   from-[#1a0f0f] via-[#1a0f0f]/60 to-transparent" />
    </div>
  );
};

export default ImageSlider;