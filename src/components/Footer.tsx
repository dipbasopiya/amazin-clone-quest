import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
                <span className="text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-bold text-xl">ShopSphere</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for everything you need. Quality products, fast shipping, and exceptional service.
            </p>
            <div className="flex gap-2">
              <a href="#" className="rounded-lg p-2 hover:bg-muted transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 hover:bg-muted transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 hover:bg-muted transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 hover:bg-muted transition-smooth">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Blog</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Track Order</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Returns</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Shipping Info</a></li>
            </ul>
          </div>

          {/* Policy */}
          <div className="space-y-4">
            <h3 className="font-semibold">Policy</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Refund Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
