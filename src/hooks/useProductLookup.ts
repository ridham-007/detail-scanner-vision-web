
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProductData {
  barcode: string;
  name: string;
  health_score: number;
  unit: string;
  nutrition_per_100g: {
    calories_kcal: number | null;
    total_fat_g: number | null;
    saturated_fat_g: number | null;
    trans_fat_g: number | null;
    cholesterol_mg: number | null;
    carbohydrates_g: number | null;
    sugar_g: number | null;
    fiber_g: number | null;
    protein_g: number | null;
    salt_mg: number | null;
    vitamin_a_iu: number | null;
    vitamin_c_mg: number | null;
    calcium_mg: number | null;
    iron_mg: number | null;
    potassium_mg: number | null;
    magnesium_mg: number | null;
    zinc_mg: number | null;
    allergens: string[];
    additives: string[];
  };
  positives: string[];
  concerns: string[];
  recommendations: string[];
  images: string[];
}

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);
    console.log('Looking up product with barcode:', barcode);

    try {
      const response = await fetch(`https://barcode-scanner-webn.onrender.com/api/product/${barcode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.success && data.data) {
          const productData = data.data;
          
          const product: ProductData = {
            barcode: productData.barcode,
            name: productData.product,
            health_score: productData.health_score,
            unit: productData.unit,
            nutrition_per_100g: productData.nutrition_per_100g,
            positives: productData.positives || [],
            concerns: productData.concerns || [],
            recommendations: productData.recommendations || [],
            images: productData.images || []
          };

          toast({
            title: "Product Found!",
            description: `Found ${product.name}`,
          });
          
          return product;
        }
      }

      toast({
        title: "Product Not Found",
        description: "This product is not available in our database.",
        variant: "destructive",
      });
      
      return null;

    } catch (error) {
      console.error('Product lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "Unable to fetch product details. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { lookupProduct, isLoading };
};
