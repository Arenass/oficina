import React from 'react';
import { Product } from '../../types/product';
import Button from '../ui/Button';
import ProductVarianteSimpleFotos from './ProductVarianteSimpleFotos';
import ProductVarianteSimpleSelect from './ProductVarianteSimpleSelect';
import ProductVarianteDobleTexto from './ProductVarianteDobleTexto';
import ProductVarianteDobleSelect from './ProductVarianteDobleSelect';

interface ProductInfoProps {
  product: Product;
  brotherProducts: Product[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, brotherProducts }) => {
  // Determinar el tipo de variante basado en la cantidad de productos hermanos y atributos
  const determineVariantType = () => {
    if (brotherProducts.length <= 1) {
      return 'none'; // No hay variantes
    }
    
    // Verificar si hay atributos de variante
    const variantAttributes = product.atributos?.filter(attr => attr.variante_padre) || [];
    
    if (variantAttributes.length === 0) {
      return 'none';
    }
    
    if (variantAttributes.length === 1) {
      // Variante simple
      return brotherProducts.length <= 4 ? 'simple-fotos' : 'simple-select';
    } else {
      // Variante doble
      return brotherProducts.length <= 6 ? 'doble-texto' : 'doble-select';
    }
  };
  
  const renderVariantSelector = () => {
    const variantType = determineVariantType();
    
    switch (variantType) {
      case 'simple-fotos':
        return <ProductVarianteSimpleFotos currentProduct={product} brotherProducts={brotherProducts} />;
      case 'simple-select':
        return <ProductVarianteSimpleSelect currentProduct={product} brotherProducts={brotherProducts} />;
      case 'doble-texto':
        return <ProductVarianteDobleTexto currentProduct={product} brotherProducts={brotherProducts} />;
      case 'doble-select':
        return <ProductVarianteDobleSelect currentProduct={product} brotherProducts={brotherProducts} />;
      default:
        return null;
    }
  };
  
  // Formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  return (
    <div className="space-y-6">
      {/* Nombre del producto */}
      <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
      
      {/* Precio */}
      <div className="flex items-center">
        <p className="text-3xl font-bold custom-orange">
          {formatPrice(product.precio)}
        </p>
        
        {product.precio_anterior && product.precio_anterior > product.precio && (
          <p className="ml-3 text-lg text-gray-500 line-through">
            {formatPrice(product.precio_anterior)}
          </p>
        )}
      </div>
      
      {/* Descripción corta */}
      {product.descripcion_corta && (
        <div className="text-gray-700">
          <p>{product.descripcion_corta}</p>
        </div>
      )}
      
      {/* Selector de variantes */}
      {renderVariantSelector()}
      
      {/* Botón de añadir al carrito */}
      <div className="pt-4">
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth
          onClick={() => {
            // Lógica para añadir al carrito
            console.log('Añadir al carrito:', product);
          }}
        >
          Añadir al carrito
        </Button>
      </div>
      
      {/* Información adicional */}
      {product.disponibilidad && (
        <div className="flex items-center text-sm text-gray-700">
          <svg className="w-5 h-5 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>En stock</span>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
