import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { ProductImage } from '../../types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  
  // If no images, use a placeholder
  const displayImages = images.length > 0 
    ? images 
    : [{ 
        sku: 'placeholder', 
        url_imagen: 'https://images.unsplash.com/photo-1544829885-87ac47101088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 
        orden: 0 
      }];

  // Number of thumbnails to display at once
  const thumbnailsToShow = 4;
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleZoom = () => {
    setShowZoom(!showZoom);
  };

  const goToPreviousThumbnails = () => {
    setThumbnailStartIndex(prev => Math.max(0, prev - thumbnailsToShow));
  };

  const goToNextThumbnails = () => {
    setThumbnailStartIndex(prev => 
      Math.min(displayImages.length - thumbnailsToShow, prev + thumbnailsToShow)
    );
  };
  
  // Visible thumbnails based on current start index
  const visibleThumbnails = displayImages.slice(
    thumbnailStartIndex, 
    thumbnailStartIndex + thumbnailsToShow
  );

  // Check if there are more thumbnails to navigate to
  const hasMorePrevious = thumbnailStartIndex > 0;
  const hasMoreNext = thumbnailStartIndex + thumbnailsToShow < displayImages.length;
  
  return (
    <div className="relative">
      {/* Main Image - with white background */}
      <div className="h-[500px] md:h-[600px] overflow-hidden bg-white rounded-lg mb-4 relative">
        <img 
          src={displayImages[currentIndex].url_imagen} 
          alt={`${productName} - Imagen ${currentIndex + 1}`} 
          className="w-full h-full object-contain"
        />
        
        {/* Zoom Button */}
        <button
          onClick={toggleZoom}
          className="absolute bottom-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Ampliar imagen"
        >
          <ZoomIn size={20} />
        </button>
      </div>
      
      {/* Navigation Arrows for Main Image */}
      {displayImages.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      
      {/* Thumbnails with lateral navigation */}
      {displayImages.length > 1 && (
        <div className="relative mt-4">
          <div className="flex justify-center space-x-4 relative">
            {/* Thumbnails container */}
            <div className="flex space-x-4">
              {visibleThumbnails.map((image, index) => {
                const actualIndex = thumbnailStartIndex + index;
                return (
                  <button
                    key={`${image.sku}-${actualIndex}`}
                    onClick={() => setCurrentIndex(actualIndex)}
                    className={`flex-shrink-0 w-32 h-32 rounded-md overflow-hidden border-2 bg-white ${
                      actualIndex === currentIndex ? 'border-amber-500' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image.url_imagen} 
                      alt={`${productName} - Miniatura ${actualIndex + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
            
            {/* Left arrow for thumbnails */}
            {hasMorePrevious && (
              <button
                onClick={goToPreviousThumbnails}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md"
                aria-label="Miniaturas anteriores"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            
            {/* Right arrow for thumbnails */}
            {hasMoreNext && (
              <button
                onClick={goToNextThumbnails}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md"
                aria-label="Miniaturas siguientes"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4">
          <div className="relative w-full h-full flex justify-center items-center">
            <img 
              src={displayImages[currentIndex].url_imagen} 
              alt={`${productName} - Ampliada`} 
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={toggleZoom}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2"
              aria-label="Cerrar vista ampliada"
            >
              <X size={24} />
            </button>

            {/* Fullscreen Navigation */}
            {displayImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={30} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={30} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
