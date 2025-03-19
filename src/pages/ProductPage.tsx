import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductDetails from '../components/product/ProductDetails';
import RelatedProducts from '../components/product/RelatedProducts';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [brotherProducts, setBrotherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get product details
        const { data: productData, error: productError } = await supabase
          .from('productos')
          .select('*')
          .eq('sku', id)
          .single();
        
        if (productError) throw productError;
        
        if (!productData) {
          setError('Producto no encontrado');
          setLoading(false);
          return;
        }
        
        // Get product images
        const { data: imagesData, error: imagesError } = await supabase
          .from('productos_imagenes')
          .select('*')
          .eq('sku', id)
          .order('orden', { ascending: true });
        
        if (imagesError) throw imagesError;
        
        // Get product attributes with their types
        const { data: attributesData, error: attributesError } = await supabase
          .from('productos_atributos')
          .select(`
            sku,
            id_atributo,
            valor,
            variante_padre,
            productos_atributos_tipos!inner (
              nombre_atributo,
              firma_atributo
            )
          `)
          .eq('sku', id);
        
        if (attributesError) throw attributesError;
        
        // Format attributes with their names and signatures
        const formattedAttributes = attributesData?.map(attr => ({
          ...attr,
          nombre_atributo: attr.productos_atributos_tipos?.nombre_atributo,
          firma_atributo: attr.productos_atributos_tipos?.firma_atributo
        }));
        
        // Combine all data
        const fullProduct: Product = {
          ...productData,
          imagenes: imagesData || [],
          atributos: formattedAttributes || []
        };
        
        setProduct(fullProduct);
        
        // Fetch brother products (variants of the same product)
        await fetchBrotherProducts(fullProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error al cargar el producto. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchBrotherProducts = async (currentProduct: Product) => {
      try {
        let query = supabase.from('productos').select('*');
        
        // If the product has a parent SKU, fetch all products with the same parent
        if (currentProduct.sku_padre) {
          query = query.eq('sku_padre', currentProduct.sku_padre);
        } else {
          // If the product doesn't have a parent, it might be a parent itself
          // Fetch all products that have this product's SKU as their parent
          query = query.eq('sku_padre', currentProduct.sku);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // For each brother product, fetch its images
          const brothersWithImages = await Promise.all(
            data.map(async (brother) => {
              const { data: brotherImages } = await supabase
                .from('productos_imagenes')
                .select('*')
                .eq('sku', brother.sku)
                .order('orden', { ascending: true });
              
              return {
                ...brother,
                imagenes: brotherImages || []
              };
            })
          );
          
          setBrotherProducts(brothersWithImages);
        } else {
          // If no products are found with the parent SKU relationship,
          // check if there are products with similar attributes
          // This is a fallback for products that might be related but not properly linked
          if (currentProduct.tipo_variante === 'variante_simple_select') {
            const { data: similarProducts } = await supabase
              .from('productos')
              .select('*')
              .eq('tipo_variante', 'variante_simple_select')
              .neq('sku', currentProduct.sku)
              .limit(5);
            
            if (similarProducts && similarProducts.length > 0) {
              const similarWithImages = await Promise.all(
                similarProducts.map(async (similar) => {
                  const { data: similarImages } = await supabase
                    .from('productos_imagenes')
                    .select('*')
                    .eq('sku', similar.sku)
                    .order('orden', { ascending: true });
                  
                  return {
                    ...similar,
                    imagenes: similarImages || []
                  };
                })
              );
              
              setBrotherProducts(similarWithImages);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching brother products:', error);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Producto no encontrado'}
          </h1>
          <p className="text-gray-600 mb-6">
            Lo sentimos, no hemos podido encontrar el producto que buscas.
          </p>
          <Link 
            to="/catalogo" 
            className="text-amber-600 font-medium hover:text-amber-700"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-amber-600">Inicio</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/catalogo" className="hover:text-amber-600">Catálogo</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium truncate">{product.nombre}</span>
        </nav>
        
        {/* Product Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <ProductGallery 
            images={product.imagenes || []} 
            productName={product.nombre} 
          />
          
          {/* Product Info - Now passing brotherProducts */}
          <ProductInfo 
            product={product} 
            brotherProducts={brotherProducts.length > 0 ? brotherProducts : undefined} 
          />
        </div>
        
        {/* Product Details */}
        <ProductDetails product={product} />
        
        {/* Related Products */}
        <RelatedProducts 
          currentProductSku={product.sku} 
          categoryId={product.id_categoria} 
        />
      </div>
    </div>
  );
};

export default ProductPage;
