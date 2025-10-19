import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-shopping.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
      <div className="container relative z-10 flex flex-col items-center gap-8 py-20 text-center md:py-32">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Amazing Products
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
            Shop the latest trends and best deals on thousands of products. Fast shipping, easy returns, and unbeatable prices.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button 
            size="lg" 
            variant="secondary"
            className="gap-2 transition-smooth hover:scale-105"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-smooth"
          >
            Browse Categories
          </Button>
        </div>
      </div>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Shopping experience" 
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;
