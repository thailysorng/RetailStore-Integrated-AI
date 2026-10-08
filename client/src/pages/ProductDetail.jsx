import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Product Detail</h1>
        <p className="mt-4 text-xl">Product ID: {id}</p>
      </div>
    </main>
  );
}

export default ProductDetail;