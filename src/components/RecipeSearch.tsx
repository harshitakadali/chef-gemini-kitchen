import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getRecipeResponse } from "@/lib/gemini";
import { Search, ChefHat, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const RecipeSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipeResult, setRecipeResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a recipe to search");
      return;
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      toast.error("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.");
      return;
    }

    setIsLoading(true);
    setRecipeResult("");

    try {
      const result = await getRecipeResponse(searchQuery);
      
      if (result.trim() === "NOT_FOOD_QUERY") {
        toast.error("Please ask about food-related topics only!");
        setRecipeResult("");
      } else {
        setRecipeResult(result);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to get recipe");
      setRecipeResult("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setRecipeResult("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[calc(100vh-8rem)] items-center">
      {/* Left Side: Search & Control */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-primary">Chef Gemini</h1>
          <p className="text-muted-foreground text-xl">Your AI-powered culinary assistant. Discover any recipe in seconds.</p>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="e.g., 'Vegan pasta with pesto'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="h-16 text-lg px-6 pr-14 rounded-2xl shadow-lg border-2 border-primary/20 focus:border-primary transition-all bg-card"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            size="lg"
            className="w-full h-14 text-lg rounded-2xl gradient-accent shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-5 w-5" />
                Find Recipe
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Right Side: Results */}
      <div className="h-full">
        <AnimatePresence mode="wait">
          {recipeResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Card className="p-8 rounded-3xl shadow-2xl glass-card h-full overflow-y-auto">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-foreground">
                    {recipeResult.split('\n').map((line, index) => {
                      if (line.match(/^[🍽️🔥⚖️💡]/)) {
                        return (
                          <h2 key={index} className="text-2xl font-bold mt-6 mb-4 text-primary flex items-center gap-3">
                            {line}
                          </h2>
                        );
                      }
                      return line ? <p key={index} className="mb-2 leading-relaxed">{line}</p> : <br key={index} />;
                    })}
                  </div>
                </div>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="mt-8 w-full h-12 rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Search Another Recipe
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Card className="p-8 rounded-3xl shadow-2xl glass-card h-full flex flex-col items-center justify-center text-center bg-cover bg-center" style={{backgroundImage: "url('/src/assets/hero-food-bg.jpg')"}}>
                <div className="bg-black/50 p-8 rounded-2xl">
                  <ChefHat className="w-24 h-24 text-primary-foreground mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-primary-foreground">Your recipe awaits!</h2>
                  <p className="text-primary-foreground/80 mt-2 text-lg">Use the search on the left to find your next delicious meal.</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
