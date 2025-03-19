import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';

interface ProductVarianteDobleSelectProps {
  currentProduct: Product;
  brotherProducts: Product[];
}

const ProductVarianteDobleSelect: React.FC<ProductVarianteDobleSelectProps> = ({ 
  currentProduct, 
  brotherProducts 
}) => {
  // Find the two variant attributes
  const variantAttributes = currentProduct.atributos?.filter(attr => attr.variante_padre) || [];
  
  if (variantAttributes.length !== 2) {
    return null;
  }
  
  const [firstAttributeId, secondAttributeId] = variantAttributes.map(attr => attr.id_atributo);
  
  // Get unique values for each attribute
  const firstAttributeValues = [...new Set(
    brotherProducts.map(product => 
      product.atributos?.find(attr => attr.id_atributo === firstAttributeId)?.valor
    ).filter(Boolean)
  )];
  
  const secondAttributeValues = [...new Set(
    brotherProducts.map(product => 
      product.atributos?.find(attr => attr.id_atributo === secondAttributeId)?.valor
    ).filter(Boolean)
  )];
  
  // Get attribute names
  const firstAttributeName = variantAttributes[0].nombre_atributo || 'Atributo 1';
  const secondAttributeName = variantAttributes[1].nombre_atributo || 'Atributo 2';
  
  // Current product attribute values
  const currentFirstValue = currentProduct.atributos?.find(
    attr => attr.id_atributo === firstAttributeId
  )?.valor;
  
  const currentSecondValue = currentProduct.atributos?.find(
    attr => attr.id_atributo === secondAttributeId
  )?.valor;
  
  const [selectedFirstValue, setSelectedFirstValue] = useState(currentFirstValue);
  const [selectedSecondValue, setSelectedSecondValue] = useState(currentSecondValue);
  
  // Find available second attribute values based on first selection
  const availableSecondValues = brotherProducts
    .filter(product => 
      product.atributos?.find(attr => 
        attr.id_atributo === firstAttributeId && attr.valor === selectedFirstValue
      )
    )
    .map(product => 
      product.atributos?.find(attr => attr.id_atributo === secondAttributeId)?.valor
    )
    .filter(Boolean);
  
  // Find the product that matches both selected attributes
  const findMatchingProduct = () => {
    return brotherProducts.find(product => {
      const firstAttr = product.atributos?.find(attr => 
        attr.id_atributo === firstAttributeId
      );
      
      const secondAttr = product.atributos?.find(attr => 
        attr.id_atributo === secondAttributeId
      );
      
      return firstAttr?.valor === selectedFirstValue && 
             secondAttr?.valor === selectedSecondValue;
    });
  };
  
  // Update URL when both attributes are selected
  useEffect(() => {
    if (selectedFirstValue && selectedSecondValue) {
      const matchingProduct = findMatchingProduct();
      
      if (matchingProduct && matchingProduct.sku !== currentProduct.sku) {
        window.location.href = `/producto/${matchingProduct.sku}`;
      }
    }
  }, [selectedFirstValue, selectedSecondValue]);
  
  return (
    <div className="mb-6 space-y-4">
      <h2 className="text-sm font-medium text-gray-700 mb-1">Opciones:</h2>
      
      {/* First Attribute */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {firstAttributeName}:
        </label>
        <div className="flex flex-wrap gap-2">
          {firstAttributeValues.map((value) => (
            <button
              key={`first-${value}`}
              className={`px-3 py-2 border rounded-md text-sm ${
                selectedFirstValue === value 
                  ? 'border-pink-500 bg-pink-50 text-pink-700 font-medium' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              onClick={() => {
                setSelectedFirstValue(value);
                // Reset second attribute if the new selection doesn't support current second value
                if (!availableSecondValues.includes(selectedSecondValue)) {
                  setSelectedSecondValue(undefined);
                }
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      
      {/* Second Attribute */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {secondAttributeName}:
        </label>
        <div className="flex flex-wrap gap-2">
          {secondAttributeValues.map((value) => {
            const isAvailable = availableSecondValues.includes(value);
            
            return (
              <button
                key={`second-${value}`}
                className={`px-3 py-2 border rounded-md text-sm ${
                  selectedSecondValue === value 
                    ? 'border-pink-500 bg-pink-50 text-pink-700 font-medium' 
                    : isAvailable 
                      ? 'border-gray-200 hover:border-gray-300 text-gray-700' 
                      : 'border-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!isAvailable}
                onClick={() => setSelectedSecondValue(value)}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductVarianteDobleSelect;
