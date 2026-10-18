import { useState } from "react";
import useCartStore from "../../store/cartStore";

function CheckoutForm({ onClose }) {
  const items = useCartStore((state) => state.items);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Please enter your delivery address.";
    }

    if (items.length === 0) {
      newErrors.cart = "Your cart is empty.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    alert(
      "Checkout information validated! We will connect order submission next."
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Checkout</h2>
        <p className="mt-1 text-sm text-gray-500">
          Guest checkout — no account required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="checkout-name" className="mb-1 block font-medium">
            Full Name
          </label>
          <input
            id="checkout-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="checkout-phone" className="mb-1 block font-medium">
            Phone Number
          </label>
          <input
            id="checkout-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="checkout-address" className="mb-1 block font-medium">
            Delivery Address
          </label>
          <textarea
            id="checkout-address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            autoComplete="street-address"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your delivery address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="checkout-notes" className="mb-1 block font-medium">
            Order Notes (Optional)
          </label>
          <textarea
            id="checkout-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            placeholder="Delivery instructions"
          />
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold">Order Summary</h3>

          {items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between gap-4 py-1 text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="mt-3 flex justify-between border-t pt-3 font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {errors.cart && (
          <p className="text-sm text-red-600">{errors.cart}</p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
            >
              Back to Cart
            </button>
          )}

          <button
            type="submit"
            className="flex-1 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;