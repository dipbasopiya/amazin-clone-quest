import ProductCard from "./ProductCard";
import headphonesImg from "@/assets/products/headphones.jpg";
import smartwatchImg from "@/assets/products/smartwatch.jpg";
import backpackImg from "@/assets/products/backpack.jpg";
import shoesImg from "@/assets/products/shoes.jpg";
import cameraImg from "@/assets/products/camera.jpg";
import coffeeMakerImg from "@/assets/products/coffee-maker.jpg";
import keyboardImg from "@/assets/products/keyboard.jpg";
import sunglassesImg from "@/assets/products/sunglasses.jpg";

const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: headphonesImg,
    category: "Electronics",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    image: smartwatchImg,
    category: "Wearables",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Leather Travel Backpack",
    price: 89.99,
    image: backpackImg,
    category: "Accessories",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Professional Running Shoes",
    price: 129.99,
    image: shoesImg,
    category: "Sports",
    rating: 4.5,
  },
  {
    id: "5",
    name: "DSLR Camera Kit",
    price: 899.99,
    image: cameraImg,
    category: "Photography",
    rating: 4.9,
  },
  {
    id: "6",
    name: "Smart Coffee Maker",
    price: 149.99,
    image: coffeeMakerImg,
    category: "Home",
    rating: 4.4,
  },
  {
    id: "7",
    name: "RGB Gaming Keyboard",
    price: 179.99,
    image: keyboardImg,
    category: "Gaming",
    rating: 4.7,
  },
  {
    id: "8",
    name: "Designer Sunglasses",
    price: 159.99,
    image: sunglassesImg,
    category: "Fashion",
    rating: 4.6,
  },
];

const ProductGrid = () => {
  return (
    <section className="container py-12 md:py-16">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Products</h2>
        <p className="text-muted-foreground">
          Discover our handpicked selection of premium products
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
