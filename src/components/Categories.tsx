import { Button } from "@/components/ui/button";
import { Laptop, Watch, Shirt, Home, Camera, Dumbbell, Gamepad2, Sparkles } from "lucide-react";

const categories = [
  { name: "Electronics", icon: Laptop, color: "text-blue-500" },
  { name: "Wearables", icon: Watch, color: "text-purple-500" },
  { name: "Fashion", icon: Shirt, color: "text-pink-500" },
  { name: "Home & Living", icon: Home, color: "text-green-500" },
  { name: "Photography", icon: Camera, color: "text-orange-500" },
  { name: "Sports & Fitness", icon: Dumbbell, color: "text-red-500" },
  { name: "Gaming", icon: Gamepad2, color: "text-indigo-500" },
  { name: "New Arrivals", icon: Sparkles, color: "text-yellow-500" },
];

const Categories = () => {
  return (
    <section className="border-y bg-muted/30 py-8">
      <div className="container">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant="ghost"
                className="flex h-auto flex-col gap-2 p-4 transition-smooth hover:scale-105 hover:bg-background"
              >
                <div className={`rounded-lg bg-background p-3 ${category.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
