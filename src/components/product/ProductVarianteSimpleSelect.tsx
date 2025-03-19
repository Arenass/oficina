import React from 'react';
import { Product } from '../../types/product';

interface ProductVarianteSimpleSelectProps {
  currentProduct: Product;
  brotherProducts: Product[];
}

const ProductVarianteSimpleSelect: React.FC<ProductVarianteSimpleSelectProps> = ({ 
  currentProduct, 
  brotherProducts 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Opciones:</h2>
      <div className="relative">
        <select 
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 appearance-none bg-white"
          defaultValue={currentProduct.sku}
          onChange={(e) => {
            const selectedSku = e.target.value;
            if (selectedSku !== currentProduct.sku) {
              window.location.href = `/producto/${selectedSku}`;
            }
          }}
        >
          {brotherProducts.map((product) => (
            <option key={product.sku} value={product.sku}>
              {product.nombre}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProductVarianteSimpleSelect;
