import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API}/api/items/marketplace`,
        {
          withCredentials: true,
        }
      );

      setProducts(response.data.items);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}

    </div>
  );
};

export default ProductGrid;