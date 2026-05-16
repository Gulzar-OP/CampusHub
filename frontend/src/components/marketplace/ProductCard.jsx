import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/item/${product._id}`}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300">

        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-cover"
        />

        <div className="p-4">

          <h2 className="text-lg font-semibold line-clamp-1">
            {product.name}
          </h2>

          <p className="text-indigo-600 font-bold text-xl mt-2">
            ₹{product.price}
          </p>

          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">

            <span>{product.category}</span>

            <span>{product.location}</span>

          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;