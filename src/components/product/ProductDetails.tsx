import React from 'react';
import { Product } from '../../types/product';
import { Award, CheckCircle } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Find measurement image if available
  const measurementImage = product.imagenes?.find(img => img.tipo_imagen === "medidas");
  
  // IDs for dimension-related attributes
  const dimensionAttributeIds = [137, 138, 139, 3]; // ancho, alto, profundo, medidas
  
  // IDs for product advantages
  const advantageAttributeIds = [197, 198, 199]; // ventajas del producto
  
  // Extract product advantages
  const advantageAttributes = product.atributos?.filter(attr => 
    advantageAttributeIds.includes(attr.id_atributo)
  );
  
  // Filter out dimension-related attributes and advantages for the technical specifications
  const filteredAttributes = product.atributos?.filter(attr => 
    !dimensionAttributeIds.includes(attr.id_atributo) && 
    !advantageAttributeIds.includes(attr.id_atributo)
  );
  
  // Check if we have advantages to display
  const hasAdvantages = advantageAttributes && advantageAttributes.length > 0;
  
  return (
    <div className="mt-12 bg-gradient-to-b from-white to-pink-50">
      {/* Product Advantages Section - Only show if advantages exist */}
      {hasAdvantages && (
        <div className="py-6 border-b">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ventajas del producto</h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {advantageAttributes?.map((advantage, index) => (
              <li 
                key={`advantage-${advantage.id_atributo}-${index}`}
                className="flex items-start gap-2 p-3 rounded-lg bg-pink-50"
              >
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-amber-600" />
                <span className="text-gray-900 font-bold text-lg">{advantage.valor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Description */}
      <div className="py-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
        <div className="prose max-w-none">
          {product.descripcion_larga ? (
            <div dangerouslySetInnerHTML={{ __html: product.descripcion_larga }} />
          ) : (
            <p className="text-gray-500">
              {product.descripcion_corta || 'No hay descripción detallada disponible para este producto.'}
            </p>
          )}
        </div>
      </div>

      {/* Specifications and Dimensions - Grid layout with 1 column on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
        {/* Specifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Especificaciones técnicas</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {product.marca && (
                  <tr>
                    <th scope="row" className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Marca</th>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.marca}</td>
                  </tr>
                )}
                {/* Display filtered product attributes if available */}
                {filteredAttributes?.map((attr, index) => (
                  <tr key={`${attr.sku}-${attr.id_atributo}-${index}`}>
                    <th scope="row" className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      {attr.nombre_atributo || `Atributo ${attr.id_atributo}`}
                    </th>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {attr.valor}
                      {attr.firma_atributo && (
                        <span className="text-xs text-gray-500 ml-1">{attr.firma_atributo}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensiones del producto</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {product.alto && (
                  <tr>
                    <th scope="row" className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Alto</th>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.alto} cm</td>
                  </tr>
                )}
                {product.ancho && (
                  <tr>
                    <th scope="row" className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Ancho</th>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.ancho} cm</td>
                  </tr>
                )}
                {product.profundo && (
                  <tr>
                    <th scope="row" className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Profundo</th>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.profundo} cm</td>
                  </tr>
                )}
                {product.peso && (
                  <tr>
                    <th scope="row" className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Peso</th>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.peso} kg</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Measurement Image */}
          {measurementImage && (
            <div className="mt-4">
              <img 
                src={measurementImage.url_imagen} 
                alt="Dimensiones del producto" 
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
