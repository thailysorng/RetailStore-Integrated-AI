import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Our Store
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm hover:underline">
            Home
          </Link>

          <Link to="/products" className="text-sm hover:underline">
            Products
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <ShoppingCart size={18} />
            Cart
          </Link>

          <Link
            to="/login"
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;