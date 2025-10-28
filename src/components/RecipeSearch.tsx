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
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Search Section */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for any recipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="h-16 text-lg px-6 pr-14 rounded-2xl shadow-lg border-2 border-primary/20 focus:border-primary transition-all"
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
                Searching Recipes...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-5 w-5" />
                Search Recipe
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {recipeResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 rounded-2xl shadow-2xl glass-card">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-foreground">
                    {recipeResult.split('\n').map((line, index) => {
                      // Check if line is a section header (starts with emoji)
                      if (line.match(/^[🍽️🔥⚖️💡]/)) {
                        return (
                          <h2 key={index} className="text-2xl font-bold mt-6 mb-4 text-primary flex items-center gap-2">
                            {line}
                          </h2>
                        );
                      }
                      return line ? <p key={index} className="mb-2">{line}</p> : <br key={index} />;
                    })}
                  </div>
                </div>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="mt-8 w-full h-12 rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Try Another Recipe
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
