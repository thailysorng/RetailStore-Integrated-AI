import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

function Products() {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
  });

  if (isLoading) {
    return <p className="p-6">Loading products...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-red-600">
        Failed to load products: {error.message}
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>

              <p className="mt-2 text-gray-600">
                {product.description}
              </p>

              <p className="mt-4 font-bold">
                ${product.price}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Stock: {product.stock}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default Products;