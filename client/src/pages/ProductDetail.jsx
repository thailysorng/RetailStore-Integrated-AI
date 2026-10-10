import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import useCartStore from "../store/cartStore";

function ProductDetail() {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <p className="p-6">Loading product...</p>;
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Failed to load product: {error.message}
        </p>

        <Link to="/products" className="mt-4 inline-block underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <Link
        to="/products"
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back to Products
      </Link>

      <div className="mt-8">
        <h1 className="text-4xl font-bold">{product.name}</h1>

        <p className="mt-4 text-lg text-gray-600">
          {product.description}
        </p>

        <p className="mt-6 text-2xl font-bold">
          ${product.price}
        </p>

        <p className="mt-2 text-gray-500">
          Stock: {product.stock}
        </p>

        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
          className="mt-6 rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </main>
  );
}

export default ProductDetail;