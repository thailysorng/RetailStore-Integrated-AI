import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

function Cart() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      {items.length === 0 ? (
        <div>
          <p className="text-gray-600">Your cart is empty.</p>

          <Link
            to="/products"
            className="mt-4 inline-block rounded-md bg-black px-5 py-3 text-white hover:bg-gray-800"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between gap-4 rounded-lg border p-5 sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>

                <p className="mt-1 text-gray-600">
                  ${item.price} each
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item._id, item.quantity - 1)
                  }
                  className="rounded border px-3 py-1 hover:bg-gray-100"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item._id, item.quantity + 1)
                  }
                  className="rounded border px-3 py-1 hover:bg-gray-100"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => removeFromCart(item._id)}
                  className="ml-2 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="border-t pt-5 text-right">
            <p className="text-xl font-bold">
              Total: ${total.toFixed(2)}
            </p>

            <button
              type="button"
              disabled
              className="mt-4 cursor-not-allowed rounded-md bg-gray-400 px-6 py-3 text-white"
            >
              Checkout (Coming Soon)
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;