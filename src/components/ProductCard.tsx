import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
}

const ProductCard = ({ name, price, image, category, rating = 4.5 }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border transition-smooth hover:shadow-product-card-hover">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
              {category}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full space-y-2">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-smooth">
            {name}
          </h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${price.toFixed(2)}</span>
          </div>
        </div>
        <Button className="w-full gap-2 transition-smooth hover:scale-105" size="sm">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
