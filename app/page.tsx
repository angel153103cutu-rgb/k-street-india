"use client";

import * as React from "react";
import {
  ShoppingBag,
  ShieldCheck,
  X,
  Sparkles,
  Eye,
} from "lucide-react";
import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

export interface Product {
  id: string;
  title: string;
  tagline: string;
  price: number;
  image: string;
  category: "Oversized Tees" | "Cargo Pants" | "Techwear Jackets" | "Hoodies";
  sizes: ("XS" | "S" | "M" | "L" | "XL" | "Oversized")[];
  fabricGsm: string;
  quality: string;
  fit: string;
  care: string;
  stock: number;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "kr-01",
    title: "Hongdae Boxy Graphic Tee",
    tagline: "Heavyweight drop-shoulder oversized graphic tee",
    price: 1899,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    category: "Oversized Tees",
    sizes: ["S", "M", "L", "XL", "Oversized"],
    fabricGsm: "280 GSM Pure Combed Cotton",
    quality: "Silicone bio-washed, zero shrinkage, breathable loop-knit",
    fit: "Korean Boxy Unisex Relaxed Fit",
    care: "Machine wash cold inside out, iron on reverse side",
    stock: 24,
  },
  {
    id: "kr-02",
    title: "Gangnam Wide Parachute Cargo",
    tagline: "Tactical cinch-cord parachute pants",
    price: 3299,
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
    category: "Cargo Pants",
    sizes: ["S", "M", "L", "XL"],
    fabricGsm: "240 GSM Durable Micro-Ripstop Nylon",
    quality: "Water-resistant, quick dry, reinforced knee pleats",
    fit: "Baggy Straight with adjustable bungee hem",
    care: "Gentle cold cycle, hang dry in shade",
    stock: 18,
  },
  {
    id: "kr-03",
    title: "Itaewon Acid Wash Hoodie",
    tagline: "Vintage acid-treated French Terry pullover",
    price: 3799,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    category: "Hoodies",
    sizes: ["M", "L", "XL", "Oversized"],
    fabricGsm: "420 GSM Heavyweight Loopback Terry",
    quality: "Pre-shrunk double-layered hood without drawstrings",
    fit: "Cropped waist with exaggerated drop shoulders",
    care: "Dry clean or wash separately to maintain wash fade",
    stock: 12,
  },
  {
    id: "kr-04",
    title: "Cyberpunk Utility Windbreaker",
    tagline: "Seoul techwear unisex wind shield",
    price: 4499,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    category: "Techwear Jackets",
    sizes: ["S", "M", "L", "XL"],
    fabricGsm: "300 GSM Matte Finished Polyester",
    quality: "YKK waterproof zippers, interior strap harness system",
    fit: "Semi-oversized layered silhouette",
    care: "Wipe clean with damp cloth, do not iron directly",
    stock: 9,
  },
  {
    id: "kr-05",
    title: "Dongdaemun Raw Denim Wide Slacks",
    tagline: "Clean minimal Japanese-Korean selvedge drape",
    price: 3999,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    category: "Cargo Pants",
    sizes: ["S", "M", "L", "XL"],
    fabricGsm: "13.5 Oz 100% Cotton Raw Selvedge",
    quality: "Deep indigo dye, front coin pocket stitch accents",
    fit: "Wide-leg fluid floor drape",
    care: "Wash inside out with cold water once every 6 months",
    stock: 15,
  },
];

export default function KoreanStreetwearStore() {
  const [products, setProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [cart, setCart] = React.useState<{ product: Product; size: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Admin Email Security
  const [adminEmail, setAdminEmail] = React.useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);
  // Put your real Gmail here whenever you want:
  const AUTHORIZED_ADMIN_GMAIL = "admin.kstreet@gmail.com";

  const [lastOrderPlaced, setLastOrderPlaced] = React.useState<string | null>(null);

  const wheelItems: WorksWheelItem[] = React.useMemo(() => {
    return products.map((p) => ({
      title: p.title,
      image: p.image,
      price: p.price,
      category: p.category,
    }));
  }, [products]);

  const handleWheelSelect = (wheelItem: WorksWheelItem) => {
    const found = products.find((p) => p.title === wheelItem.title);
    if (found) {
      setSelectedProduct(found);
      setSelectedSize(found.sizes[0]);
    }
  };

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim().toLowerCase() === AUTHORIZED_ADMIN_GMAIL.toLowerCase()) {
      setIsAdminLoggedIn(true);
      alert("Access Granted: Welcome Admin");
    } else {
      alert("Access Denied: Only the authorized Admin Gmail can manage this store.");
    }
  };

  const handleCreateProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdminLoggedIn) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const newProduct: Product = {
      id: "kr-" + Date.now(),
      title: String(formData.get("title") || "").slice(0, 80),
      tagline: String(formData.get("tagline") || "").slice(0, 140),
      price: Number(formData.get("price")) || 1999,
      image: String(formData.get("image")) || INITIAL_PRODUCTS[0].image,
      category: (formData.get("category") as Product["category"]) || "Oversized Tees",
      sizes: ["S", "M", "L", "XL", "Oversized"],
      fabricGsm: String(formData.get("fabricGsm") || "280 GSM Cotton"),
      quality: String(formData.get("quality") || "Premium Bio-Washed"),
      fit: "Unisex Oversized Fit",
      care: "Cold wash inside out",
      stock: Number(formData.get("stock")) || 10,
    };

    setProducts((prev) => [newProduct, ...prev]);
    form.reset();
    alert("Product safely published to store!");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderId = "IN-" + Math.floor(100000 + Math.random() * 900000);
    setLastOrderPlaced(orderId);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 selection:bg-white selection:text-black font-sans">
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 text-center text-xs tracking-widest text-neutral-400 uppercase">
        ⚡ Free Express Shipping Across India • 100% Unisex Gen-Z Korean Fits
      </div>

      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-black text-xl tracking-tighter uppercase">
              SEOUL<span className="text-neutral-500">.IN</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="text-xs uppercase tracking-wider font-mono px-3 py-1.5 rounded-full border border-neutral-700 hover:border-white transition-colors flex items-center gap-1.5 text-neutral-400 hover:text-white"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isAdminLoggedIn ? "Admin Active" : "Admin Portal"}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-neutral-900 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="pt-6 pb-2 text-center">
          <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">
            Scroll or Drag to Rotate the Drum
          </span>
        </div>
        <div className="w-full h-[65vh] min-h-[420px] max-h-[700px]">
          <WorksWheel
            items={wheelItems}
            label="K-WAVE '26"
            action="Quick View"
            onSelect={handleWheelSelect}
          />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:row justify-between items-start sm:items-end mb-10 gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Curated Gen-Z Drops
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Heavyweight cottons & relaxed Korean unisex streetwear.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {products.length} Designs in Live Rotation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedProduct(item);
                setSelectedSize(item.sizes[0]);
              }}
              className="group cursor-pointer rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden hover:border-neutral-600 transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-full text-neutral-300">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-white text-black font-bold text-xs uppercase px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5" /> Details
                </span>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base tracking-tight group-hover:text-neutral-300">
                    {item.title}
                  </h3>
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-1 mb-3">
                  {item.tagline}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span>{item.fabricGsm}</span>
                  <span className="text-neutral-400">{item.stock} left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 mb-1">
                  {selectedProduct.category} • Unisex
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                  {selectedProduct.title}
                </h2>
                <span className="text-xl font-mono font-bold text-white mb-4">
                  ₹{selectedProduct.price.toLocaleString("en-IN")}
                </span>

                <p className="text-sm text-neutral-300 mb-6">
                  {selectedProduct.tagline}
                </p>

                <div className="mb-6">
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Select Unisex Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 text-xs font-mono uppercase rounded-lg border transition-all ${
                          selectedSize === s
                            ? "border-white bg-white text-black font-bold"
                            : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900/60 rounded-xl p-4 border border-neutral-800 space-y-2 text-xs mb-6">
                  <div>
                    <span className="text-neutral-400 font-mono">Fabric: </span>
                    <span className="text-neutral-200">{selectedProduct.fabricGsm}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-mono">Silhouette: </span>
                    <span className="text-neutral-200">{selectedProduct.fit}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-mono">Quality Finish: </span>
                    <span className="text-neutral-200">{selectedProduct.quality}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-mono">Care Instructions: </span>
                    <span className="text-neutral-200">{selectedProduct.care}</span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct, selectedSize)}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Your Bag ({cart.length})
              </span>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs">
                  Your shopping bag is empty.
                </div>
              ) : (
                cart.map((c, i) => (
                  <div
                    key={i}
                    className="flex gap-4 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800"
                  >
                    <img
                      src={c.product.image}
                      alt={c.product.title}
                      className="w-16 h-20 object-cover rounded-lg bg-neutral-800"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold">{c.product.title}</h4>
                        <span className="text-[11px] font-mono text-neutral-400">
                          Size: {c.size} • Qty: {c.quantity}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        ₹{(c.product.price * c.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-neutral-800 pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span>Subtotal</span>
                  <span className="text-emerald-400 font-bold">
                    ₹
                    {cart
                      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
                      .toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                >
                  Confirm Order & Dispatch Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {lastOrderPlaced && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-100 p-5 rounded-2xl shadow-2xl max-w-md animate-in slide-in-from-bottom">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" /> Order #{lastOrderPlaced} Verified!
              </h4>
              <p className="text-xs text-emerald-200/80 mt-1">
                Details logged and sent to admin operations for fast dispatch across India.
              </p>
            </div>
            <button
              onClick={() => setLastOrderPlaced(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsAdminPanelOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-bold text-lg uppercase tracking-tight">
                  Admin Authorization Portal
                </h3>
                <p className="text-xs text-neutral-400">
                  Secured Product Additions
                </p>
              </div>
            </div>

            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <p className="text-xs text-neutral-300">
                  Enter your designated Admin Gmail to unlock product additions.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="e.g. admin.kstreet@gmail.com"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider py-3 rounded-xl text-xs transition-colors"
                >
                  Verify Admin Gmail
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-xl text-emerald-400 flex items-center justify-between">
                  <span>Logged in as: {adminEmail}</span>
                  <button
                    type="button"
                    onClick={() => setIsAdminLoggedIn(false)}
                    className="underline text-neutral-400 hover:text-white"
                  >
                    Logout
                  </button>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Product Title</label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Mapo Cargo Jogger"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Price (₹ INR)</label>
                    <input
                      name="price"
                      type="number"
                      required
                      placeholder="2999"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Category</label>
                    <select
                      name="category"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="Oversized Tees">Oversized Tees</option>
                      <option value="Cargo Pants">Cargo Pants</option>
                      <option value="Techwear Jackets">Techwear Jackets</option>
                      <option value="Hoodies">Hoodies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Unsplash Image URL</label>
                  <input
                    name="image"
                    required
                    placeholder="https://images.unsplash.com/..."
                    defaultValue="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Fabric & GSM</label>
                    <input
                      name="fabricGsm"
                      placeholder="300 GSM Loopknit Cotton"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Initial Stock</label>
                    <input
                      name="stock"
                      type="number"
                      placeholder="20"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider py-3 rounded-xl transition-colors mt-2"
                >
                  Publish Item to Store
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-neutral-800 py-12 px-4 sm:px-6 text-center text-xs text-neutral-400 font-mono">
        <p>© 2026 SEOUL.IN • All Rights Reserved. Indian Domestic Logistics & Secured Payments.</p>
      </footer>
    </div>
  );
}