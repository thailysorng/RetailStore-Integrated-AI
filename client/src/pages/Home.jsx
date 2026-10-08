import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Our Store
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Discover products you'll love, all in one place.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;