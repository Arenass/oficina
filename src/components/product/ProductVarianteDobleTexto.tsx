import React from 'react';
import { Product } from '../../types/product';

interface ProductVarianteDobleTextoProps {
  currentProduct: Product;
  brotherProducts: Product[];
}

const ProductVarianteDobleTexto: React.FC<ProductVarianteDobleTextoProps> = ({ 
  currentProduct, 
  brotherProducts 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Opciones:</h2>
      <div className="grid grid-cols-2 gap-3">
        {brotherProducts.map((product) => (
          <a
            key={product.sku}
            href={`/producto/${product.sku}`}
            className={`block p-3 border rounded-md text-center transition-all ${
              product.sku === currentProduct.sku 
                ? 'border-pink-500 bg-pink-50 text-pink-700 font-medium' 
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {product.nombre}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProductVarianteDobleTexto;
