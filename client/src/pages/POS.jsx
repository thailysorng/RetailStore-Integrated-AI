import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import api from "@/lib/api";

function POS() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pos-products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
  });

  const categories = useMemo(() => {
    const names = products
      .map((product) =>
        typeof product.category === "object"
          ? product.category?.name
          : ""
      )
      .filter(Boolean);

    return ["All", ...new Set(names)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryName =
        typeof product.category === "object"
          ? product.category?.name
          : "";

      const matchesCategory =
        selectedCategory === "All" ||
        categoryName === selectedCategory;

      const matchesSearch =
        !term ||
        [product.name, product.sku, product.barcode]
          .some((value) =>
            String(value ?? "").toLowerCase().includes(term)
          );

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const addToCart = (product) => {
    if (product.stock < 1) return;

    setCart((current) => {
      const existing = current.find(
        (item) => item._id === product._id
      );

      if (existing) {
        if (existing.quantity >= product.stock) return current;

        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId, amount) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item._id !== productId) return item;

          const product = products.find(
            (entry) => entry._id === productId
          );

          const quantity = Math.min(
            product?.stock ?? 0,
            item.quantity + amount
          );

          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) =>
      current.filter((item) => item._id !== productId)
    );
  };

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return <div className="p-8">Loading products...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-red-600">
        Failed to load products. Check that your backend is running.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Point of Sale
          </h1>
          <p className="mt-1 text-slate-500">
            Select products to start a sale.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
              <Search size={20} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, SKU, or barcode..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selectedCategory === category
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-slate-500">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock < 1}
                    className="rounded-xl border border-transparent bg-white p-4 text-left shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingCart
                          size={32}
                          className="text-slate-300"
                        />
                      )}
                    </div>

                    <h2 className="line-clamp-2 font-semibold text-slate-800">
                      {product.name}
                    </h2>

                    <p className="mt-2 font-bold text-slate-900">
                      ${Number(product.price).toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Stock: {product.stock}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-xl bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Current Sale</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {totalItems} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ShoppingCart
                  size={40}
                  className="mx-auto mb-3"
                />
                <p>Your cart is empty.</p>
                <p className="mt-1 text-sm">
                  Select a product to begin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="border-b border-slate-100 pb-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.name}`}
                        className="h-fit text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            changeQuantity(item._id, -1)
                          }
                          aria-label="Decrease quantity"
                          className="rounded-md bg-slate-100 p-2"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-5 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            changeQuantity(item._id, 1)
                          }
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                          className="rounded-md bg-slate-100 p-2 disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={() =>
                  alert(
                    "POS cart is ready. Payment and sales recording are our next step."
                  )
                }
                className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Proceed to Payment
              </button>

              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Clear Sale
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default POS;