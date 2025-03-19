import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Product } from '../../types/product';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const getProductImage = () => {
    if (!product.imagenes || product.imagenes.length === 0) {
      return 'https://images.unsplash.com/photo-1544829885-87ac47101088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
    }
    
    const ambienteImage = product.imagenes.find(img => img.tipo_imagen === 'ambiente');
    if (ambienteImage) {
      return ambienteImage.url_imagen;
    }
    
    return product.imagenes[0].url_imagen;
  };
  
  const imageUrl = getProductImage();
  
  const getStockColor = () => {
    if (product.stock_texto.toLowerCase().includes('disponible')) {
      return 'text-green-600';
    } else if (product.stock_texto.toLowerCase().includes('agotado')) {
      return 'text-red-600';
    } else {
      return 'text-orange-500';
    }
  };
  
  const handleViewProduct = () => {
    navigate(`/producto/${product.sku}`);
  };
  
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link to={`/producto/${product.sku}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.nombre} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/producto/${product.sku}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-3">{product.nombre}</h3>
          
          <div className="flex items-baseline justify-between mt-2 mb-3">
            <span className="text-sm font-bold text-[#999]">{product.referencia}</span>
            <span className={`text-sm ${getStockColor()}`}>{product.stock_texto}</span>
          </div>
        </Link>
        
        <div className="mt-2">
          <Button 
            onClick={handleViewProduct} 
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            <span>Ver producto</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
