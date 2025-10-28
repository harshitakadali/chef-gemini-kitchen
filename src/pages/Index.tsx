import { RecipeSearch } from "@/components/RecipeSearch";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-food-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 px-4"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-4 gradient-accent bg-clip-text text-transparent">
            Recipe Finder AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Discover delicious recipes with AI-powered recommendations
          </p>
        </motion.div>

        <RecipeSearch />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-center px-4"
        >
          <p className="text-sm text-muted-foreground">
            Powered by Google Gemini AI
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
