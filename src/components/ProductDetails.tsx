import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Image as ImageIcon,
  Heart,
  ShoppingCart,
} from "lucide-react";
import NoProductData from "./NoProductData";
import AnimatedHealthScore from "./AnimatedHealthScore";
import EnhancedIngredientsDisplay from "./EnhancedIngredientsDisplay";
import NutritionComparison from "./NutritionComparison";
import ProductImageCarousel from "./ProductImageCarousel";
import { AddToShoppingListModal } from "@/components/AddToShoppingListModal";
import { useFavorites } from "@/hooks/useFavorites";
import { ProductData } from "@/types/ProductData";
import { NutritionScoreGrade } from "./NutritionScoreGrade";
import { AllergenAnalysisCard } from "./AllergenAnalysisCard";
import { AdditiveAnalysisCard } from "./AdditiveAnalysisCard";
import { IngredientAnalysisCard } from "./IngredientAnalysisCard";
import { NutritionDataCard } from "./NutritionDataCard";
import { fetchAlternatives, AlternativeProduct } from "@/lib/api/alternatives";
import AlternativesModal from "@/components/AlternativesModal";
import HealthInsights from "./HealthInsights";
import { HealthierAlternatives } from "./HealthierAlternatives";

interface ProductDetailsProps {
  product: ProductData | null;
  isLoading: boolean;
  showNoDataState?: boolean;
  scannedBarcode?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  isLoading,
  showNoDataState = false,
  scannedBarcode,
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  /* -------------------- Alternatives State -------------------- */
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([]);
  const [alternativesError, setAlternativesError] = useState<string | null>(
    null,
  );
  const [alternativesOpen, setAlternativesOpen] = useState(false);

  const handleAlternativesClick = async () => {
    if (!product) return;

    setAlternativesOpen(true);
    setLoadingAlternatives(true);
    console.log("📦 Product barcode:", product.barcode);

    try {
      const data = await fetchAlternatives(product.barcode);
      console.log("✅ API response received:", data);
      setAlternatives(data.alternatives || []);
      console.log("🧠 Alternatives count:", data.alternatives?.length || 0);
    } catch {
      setAlternatives([]);
    } finally {
      setLoadingAlternatives(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden border-0 shadow-xl">
        <CardContent className="p-0">
          <div className="relative bg-primary/5">
            <div className="max-w-7xl mx-auto px-8 py-16">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full animate-pulse opacity-30"></div>
                <div
                  className="absolute top-20 -right-5 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full animate-pulse opacity-20"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-10 left-1/4 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full animate-pulse opacity-25"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-20 right-1/3 w-8 h-8 bg-indigo-200 dark:bg-indigo-800 rounded-full animate-pulse opacity-30"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Product Image Skeleton */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                      <div className="w-full h-full bg-muted animate-pulse relative">
                        {/* Scanning line effect */}
                        <div
                          className="absolute inset-0 bg-primary/20 opacity-50 animate-pulse"
                          style={{
                            animation: "slide-scan 2s ease-in-out infinite",
                          }}
                        ></div>
                      </div>
                    </div>
                    {/* Floating dots */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="lg:col-span-5 text-center lg:text-left space-y-6">
                  <div className="space-y-4">
                    {/* Title skeleton with shimmer */}
                    <div className="space-y-3">
                      <div className="h-8 bg-muted rounded-lg animate-pulse w-4/5"></div>
                      <div className="h-6 bg-muted rounded-lg animate-pulse w-3/5"></div>
                    </div>

                    {/* Stats skeleton */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Score Skeleton */}
                <div className="lg:col-span-3 flex justify-center">
                  <div className="text-center space-y-4">
                    {/* Circular progress skeleton */}
                    <div className="relative w-40 h-40">
                      <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      </div>
                      {/* Rotating ring */}
                      <div
                        className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"
                        style={{ animationDuration: "3s" }}
                      ></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading text with typing effect */}
              <div className="text-center mt-12">
                <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-lg font-medium">
                    Analyzing product...
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Getting nutritional information and health insights
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showNoDataState) {
    return <NoProductData barcode={scannedBarcode} />;
  }

  if (!product) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center space-y-2">
            <ImageIcon size={48} className="mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Scan a barcode to view product details
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Product Card - Completely Redesigned */}
      <Card className="w-full animate-fade-in overflow-hidden border-0 shadow-2xl bg-card">
        <CardContent className="p-0">
          {/* Hero Section with Enhanced Visual Design */}
          <div className="relative bg-primary/5">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
                {/* Product Image - Enhanced with Better Styling */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-border/50">
                      <ProductImageCarousel
                        images={product.images}
                        productName={product.name}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Info - Center with Better Typography */}
                <div className="text-center lg:text-left space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="mb-4">
                        Product Analysis
                      </Badge>
                      <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                        {product.name}
                      </h1>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          Barcode
                        </span>
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded-md border">
                          {product.barcode}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div
                      className="
    flex flex-col 
    sm:flex-row 
    sm:flex-wrap
    items-stretch 
    sm:items-center 
    justify-center 
    lg:justify-start 
    gap-3 
    pt-4
  "
                    >
                      {/* Alternatives – primary CTA */}
                      <Button
                        onClick={handleAlternativesClick}
                        className="
      flex items-center justify-center gap-2
      w-full sm:w-auto
      hover:scale-105 transition-transform
    "
                      >
                        Alternatives
                      </Button>

                      {/* Favorite */}
                      <Button
                        variant={
                          isFavorite(product.barcode) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          if (isFavorite(product.barcode)) {
                            removeFromFavorites(product.barcode);
                          } else {
                            addToFavorites(
                              product.barcode,
                              product.name,
                              product.health_score,
                            );
                          }
                        }}
                        className="
      flex items-center justify-center gap-2
      w-full sm:w-auto
      hover:scale-105 transition-transform
    "
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorite(product.barcode) ? "fill-current" : ""
                          }`}
                        />
                        {isFavorite(product.barcode) ? "Favorited" : "Favorite"}
                      </Button>

                      {/* Add to List */}
                      <AddToShoppingListModal
                        barcode={product.barcode}
                        productName={product.name}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="
        flex items-center justify-center gap-2
        w-full sm:w-auto
        hover:scale-105 transition-transform
      "
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to List
                        </Button>
                      </AddToShoppingListModal>
                    </div>
                  </div>

                  {/* Enhanced Quick Stats */}
                  {product.is_health_related_product && (
                    <div className="grid grid-cols-2 gap-4 pt-6">
                      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                            Benefits
                          </span>
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {product.positives?.length || 0}
                        </div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                            Concerns
                          </span>
                        </div>
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {product.concerns?.length || 0}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Health Score - Enhanced Design */}
                {product.is_health_related_product && (
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-8 bg-primary/10 rounded-full blur-2xl"></div>
                      <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                        <AnimatedHealthScore
                          score={product.health_score}
                          size={140}
                          categoryRank={12}
                          categoryTotal={47}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlternativesModal
        open={alternativesOpen}
        onOpenChange={setAlternativesOpen}
        alternatives={alternatives}
        loading={loadingAlternatives}
      />

      {/* Nutrition Score Grade */}
      {product.nutrition_score_grade && (
        <Card className="w-full animate-fade-in border-0 shadow-lg bg-card">
          <CardContent className="p-6">
            <NutritionScoreGrade grade={product.nutrition_score_grade} />
          </CardContent>
        </Card>
      )}

      {/* Health Insights */}
      <HealthInsights
        positives={product.positives}
        concerns={product.concerns}
      />

      {/* Allergen Analysis */}
      {product.allergens_analysis && product.allergens_analysis.length > 0 && (
        <AllergenAnalysisCard allergens={product.allergens_analysis} />
      )}

      {/* Nutrition Data Analysis */}
      {product.nutrition_data && product.nutrition_data.length > 0 && (
        <NutritionDataCard nutritionData={product.nutrition_data} />
      )}

      {/* Additive Analysis */}
      {product.additive_analysis && product.additive_analysis.length > 0 && (
        <AdditiveAnalysisCard additives={product.additive_analysis} />
      )}

      {/* Ingredient Analysis */}
      {product.ingredient_analysis &&
        product.ingredient_analysis.length > 0 && (
          <IngredientAnalysisCard ingredients={product.ingredient_analysis} />
        )}

      {/* Enhanced Components */}
      {/* <ScanStreak productName={product.name} /> */}

      {/* <AchievementSystem productData={product} /> */}

      <NutritionComparison
        nutrition={product.nutrition_per_100g}
        productName={product.name}
      />

      <EnhancedIngredientsDisplay
        ingredients={product.ingredients || ""}
        allergens={product.nutrition_per_100g.allergens}
        additives={product.nutrition_per_100g.additives}
      />

      {/* <SocialProof barcode={product.barcode} productName={product.name} /> */}

      {/* Recommendations - Enhanced Design */}
      {product.recommendations && product.recommendations.length > 0 && (
        <Card className="w-full animate-fade-in border-0 shadow-lg bg-card">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                <Lightbulb
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                  Smart Recommendations
                </h4>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered suggestions to optimize your nutrition
              </p>
            </div>
            <div className="grid gap-4">
              {product.recommendations.map((recommendation, index) => (
                <div key={index} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent/10"></div>
                  <div className="relative flex items-start gap-4 p-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Healthier Alternatives - Classification-based */}
      <HealthierAlternatives
        barcode={product.barcode}
        currentHealthScore={product.health_score}
      />
      {/* Product Categories */}
      {/* <ProductCategories barcode={product.barcode} /> */}

      {/* User Feedback Section */}
      {/* <ProductFeedback barcode={product.barcode} /> */}
    </div>
  );
};

export default ProductDetails;
