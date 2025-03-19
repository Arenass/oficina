import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductAttribute } from '../../types/product';
import { supabase } from '../../lib/supabase';

interface ProductVarianteSimpleFotosProps {
  currentProduct: Product;
  brotherProducts: Product[];
}

const ProductVarianteSimpleFotos: React.FC<ProductVarianteSimpleFotosProps> = ({ 
  currentProduct, 
  brotherProducts 
}) => {
  const [productAttributes, setProductAttributes] = useState<Record<string, ProductAttribute | null>>({});

  // Cargar los atributos de todos los productos hermanos
  useEffect(() => {
    const fetchAttributes = async () => {
      const skus = brotherProducts.map(product => product.sku);
      
      try {
        const { data, error } = await supabase
          .from('productos_atributos')
          .select('*')
          .in('sku', skus)
          .eq('variante_padre', true);
        
        if (error) {
          console.error('Error fetching attributes:', error);
          return;
        }
        
        // Crear un objeto con los atributos indexados por SKU
        const attributesBySku: Record<string, ProductAttribute | null> = {};
        data.forEach(attr => {
          attributesBySku[attr.sku] = attr;
        });
        
        setProductAttributes(attributesBySku);
      } catch (error) {
        console.error('Error in fetchAttributes:', error);
      }
    };
    
    if (brotherProducts.length > 0) {
      fetchAttributes();
    }
  }, [brotherProducts]);

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Opciones:</h2>
      <div className="flex flex-wrap gap-4">
        {brotherProducts.map((brotherProduct) => {
          // Get the first image or use a placeholder
          const imageUrl = brotherProduct.imagenes && brotherProduct.imagenes.length > 0
            ? brotherProduct.imagenes[0].url_imagen
            : 'https://images.unsplash.com/photo-1544829885-87ac47101088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
          
          const isCurrentProduct = brotherProduct.sku === currentProduct.sku;
          
          // Obtener el atributo variante_padre de nuestro estado
          const parentAttribute = productAttributes[brotherProduct.sku];
          
          return (
            <div key={brotherProduct.sku} className="flex flex-col items-center w-28">
              <div className="relative">
                {isCurrentProduct && (
                  <div className="absolute -top-2 -right-2 z-10 custom-orange-bg text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <Link 
                  to={`/producto/${brotherProduct.sku}`}
                  className={`block w-28 h-28 rounded-md overflow-hidden border-2 transition-all ${
                    isCurrentProduct ? 'custom-orange-border ring-2 custom-orange-ring' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={brotherProduct.nombre}
                >
                  <img 
                    src={imageUrl} 
                    alt={brotherProduct.nombre} 
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              
              {/* Valor del atributo debajo de la imagen */}
              {parentAttribute && parentAttribute.valor && (
                <div className={`mt-2 px-2 py-1 rounded-md text-center w-full ${isCurrentProduct ? 'custom-orange-light-bg' : ''}`}>
                  <span className={`text-sm font-medium ${isCurrentProduct ? 'custom-orange-dark' : 'text-gray-700'}`}>
                    {parentAttribute.valor}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVarianteSimpleFotos;
