import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: string[];
  itemName: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, itemName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-no-image">
          <span>No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-main">
        <img 
          src={images[currentIndex]} 
          alt={`${itemName} - Image ${currentIndex + 1}`}
          className="carousel-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found';
          }}
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="carousel-button carousel-button-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="carousel-button carousel-button-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            >
              <img 
                src={image} 
                alt={`${itemName} - Thumbnail ${index + 1}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
